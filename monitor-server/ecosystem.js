var app = {
  name: "home-monitor",
  script: "./index.js",
  ignore_watch: ["node_modules", "*.json", '*.png'],
  watch: ['*.js'],
  env: {
    // "NODE_ENV": "production",
    "DB_HOST": "localhost",
    "PORT": 5000,
  }
}

module.exports = {
  apps: [app]
}