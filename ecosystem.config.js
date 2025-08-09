module.exports = {
  apps: [{
    name: 'simple-tg-webapp',
    script: 'server.js',
    cwd: '/opt/webapps/simple-tg-webapp',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/simple-tg-webapp-error.log',
    out_file: '/var/log/pm2/simple-tg-webapp-out.log',
    log_file: '/var/log/pm2/simple-tg-webapp.log',
    time: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.db'],
    restart_delay: 1000
  }]
}