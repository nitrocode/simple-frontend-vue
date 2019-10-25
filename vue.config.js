const fs = require("fs");
const path = require("path");

// read json from tasks.json
const filePath = path.join(__dirname, "tasks.json");
const taskData = JSON.parse(fs.readFileSync(filePath, "utf8"));

module.exports = {
  devServer: {
    before: function(app, server) {
      app.get('/v1/tasks', function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(taskData));
      });
    }
  }
};
