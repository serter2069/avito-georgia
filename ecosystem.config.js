module.exports = {
  apps: [
    {
      name: "avito-georgia-api",
      script: "api/dist/index.js",
      cwd: "/var/www/avito-georgia",
      env: {
        NODE_ENV: "production",
        PORT: 3813,
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      watch: false,
      max_memory_restart: "500M",
      error_file: "/var/log/pm2/avito-georgia-api-error.log",
      out_file: "/var/log/pm2/avito-georgia-api-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
