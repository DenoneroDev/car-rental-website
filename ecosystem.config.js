module.exports = {
  apps: [
    {
      name: "vm-car",
      script: "./src/backend/server.js",
      instances: 1,
      max_memory_restart: "600M",

      // Logging
      out_file: "./out.log",
      error_file: "./error.log",
      merge_logs: true,
      log_date_format: "DD-MM HH:mm:ss Z",
      log_type: "raw",

      // Env Specific Config
      env_production: {
        NODE_ENV: "production",
        PORT: 80,
        exec_mode: "cluster_mode",
      },
    },
  ],
};