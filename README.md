# Simple Telegram WebApp

A simple click counter web application built as a learning project to practice developing WebApps for Telegram. This project demonstrates the basics of creating interactive Telegram mini-applications with real-time user statistics.

## 🎯 About

This is a test project created to learn and practice Telegram WebApp development. The application features a global click counter where users can compete by clicking a button, with real-time statistics showing each user's contribution percentage.

## ✨ Features

- 🎮 **Global Click Counter** - Shared counter across all users
- 📊 **User Statistics** - Real-time percentage of user contribution  
- 📱 **Mobile Responsive** - Optimized for mobile devices
- 🔄 **Real-time Updates** - Statistics update automatically every 5 seconds
- 🚀 **Auto Deployment** - GitHub Actions CI/CD pipeline

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Telegram WebApp API
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Deployment**: GitHub Actions, PM2, Nginx
- **SSL**: Let's Encrypt (Certbot)

## 🏗️ Architecture

```
Frontend (WebApp) ↔ Express Server ↔ SQLite Database
       ↓
  Telegram Bot API
```

## 📱 How it Works

1. User opens the WebApp through Telegram bot
2. Telegram provides user authentication automatically
3. User clicks the button to increment the global counter
4. Real-time statistics show user's contribution percentage
5. Data persists across sessions in SQLite database

## 🚀 Deployment

The application uses automated deployment via GitHub Actions:

1. **Automatic Setup**: Installs Node.js, npm, and PM2 on the server
2. **Code Deployment**: Clones/updates repository automatically
3. **Process Management**: Uses PM2 for process management and auto-restart
4. **SSL Configuration**: Automatic HTTPS setup with Let's Encrypt

### Deployment Structure
```
/opt/webapps/simple-tg-webapp/
├── server.js              # Node.js server
├── index.html             # WebApp frontend
├── package.json           # Dependencies
├── ecosystem.config.js    # PM2 configuration
├── public/               # Static files
└── clicks.db             # SQLite database
```

## 🔧 API Endpoints

- `GET /` - Main WebApp page
- `GET /api/stats?userId=<id>` - Get click statistics for user
- `POST /api/click` - Register a click from user

## 🎮 Setup for Telegram

1. Create a bot via @BotFather
2. Configure WebApp URL in bot settings
3. Set up menu button or inline keyboards
4. Deploy the application with HTTPS

**WebApp URL**: `https://your-domain.com`

## 📊 Database Schema

```sql
CREATE TABLE clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔍 Monitoring

Application logs are available via PM2:
```bash
pm2 logs simple-tg-webapp
pm2 monit
```

Log files location:
- `/var/log/pm2/simple-tg-webapp.log` - General logs
- `/var/log/pm2/simple-tg-webapp-error.log` - Error logs

## 🏃‍♂️ Local Development

```bash
# Install dependencies
npm install

# Create public directory
mkdir -p public
cp index.html public/

# Start development server
npm run dev
```

## 📝 Learning Outcomes

This project helped practice:
- Telegram WebApp API integration
- Real-time web applications
- SQLite database operations
- Express.js server development
- GitHub Actions CI/CD
- PM2 process management
- Nginx reverse proxy setup
- SSL certificate automation

## ⚠️ Note

This is a learning/test project and should not be used in production without proper security reviews and optimizations.

## 📄 License

MIT License - Feel free to use this project for learning purposes.