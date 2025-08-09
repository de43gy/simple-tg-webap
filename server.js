const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('./clicks.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        click_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_id ON clicks(user_id)`);
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/stats', (req, res) => {
    const userId = req.query.userId;
    const totalQuery = 'SELECT SUM(click_count) as total FROM clicks';
    const uniqueUsersQuery = 'SELECT COUNT(DISTINCT user_id) as unique_users FROM clicks WHERE user_id NOT LIKE "demo_%"';
    
    db.get(totalQuery, (err, totalRow) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        const total = totalRow ? totalRow.total || 0 : 0;
        
        db.get(uniqueUsersQuery, (err, uniqueRow) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            const uniqueUsers = uniqueRow ? uniqueRow.unique_users || 0 : 0;
            
            if (!userId || userId.startsWith('demo_')) {
                return res.json({
                    total: total,
                    userClicks: 0,
                    uniqueUsers: uniqueUsers,
                    userRank: null
                });
            }
            
            const userQuery = 'SELECT click_count FROM clicks WHERE user_id = ?';
            db.get(userQuery, [userId], (err, userRow) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                
                const userClicks = userRow ? userRow.click_count || 0 : 0;
                
                // Calculate user rank among non-demo users
                const rankQuery = `SELECT COUNT(*) + 1 as rank FROM clicks 
                                  WHERE click_count > ? AND user_id NOT LIKE "demo_%"`;
                
                db.get(rankQuery, [userClicks], (err, rankRow) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error' });
                    }
                    
                    const userRank = rankRow ? rankRow.rank : null;
                    
                    res.json({
                        total: total,
                        userClicks: userClicks,
                        uniqueUsers: uniqueUsers,
                        userRank: userRank
                    });
                });
            });
        });
    });
});

app.post('/api/click', (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run(`INSERT OR REPLACE INTO clicks (user_id, click_count, updated_at)
                VALUES (?, COALESCE((SELECT click_count FROM clicks WHERE user_id = ?), 0) + 1, CURRENT_TIMESTAMP)`,
                [userId, userId], function(err) {
            
            if (err) {
                console.error('Database error:', err);
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Database error' });
            }
            
            const totalQuery = 'SELECT SUM(click_count) as total FROM clicks';
            const userQuery = 'SELECT click_count FROM clicks WHERE user_id = ?';
            const uniqueUsersQuery = 'SELECT COUNT(DISTINCT user_id) as unique_users FROM clicks WHERE user_id NOT LIKE "demo_%"';
            
            db.get(totalQuery, (err, totalRow) => {
                if (err) {
                    console.error('Database error:', err);
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Database error' });
                }
                
                db.get(userQuery, [userId], (err, userRow) => {
                    if (err) {
                        console.error('Database error:', err);
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Database error' });
                    }
                    
                    db.get(uniqueUsersQuery, (err, uniqueRow) => {
                        if (err) {
                            console.error('Database error:', err);
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Database error' });
                        }
                        
                        const userClicksCount = userRow ? userRow.click_count || 0 : 0;
                        
                        // Calculate user rank among non-demo users
                        const rankQuery = `SELECT COUNT(*) + 1 as rank FROM clicks 
                                          WHERE click_count > ? AND user_id NOT LIKE "demo_%"`;
                        
                        db.get(rankQuery, [userClicksCount], (err, rankRow) => {
                            if (err) {
                                console.error('Database error:', err);
                                db.run('ROLLBACK');
                                return res.status(500).json({ error: 'Database error' });
                            }
                            
                            db.run('COMMIT');
                            
                            const userRank = userId.startsWith('demo_') ? null : (rankRow ? rankRow.rank : null);
                            
                            res.json({
                                total: totalRow ? totalRow.total || 0 : 0,
                                userClicks: userClicksCount,
                                uniqueUsers: uniqueRow ? uniqueRow.unique_users || 0 : 0,
                                userRank: userRank
                            });
                        });
                    });
                });
            });
        });
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});