const express = require('express')
const cors = require('cors')
const uploadRoutes = require("./assistant/routes/upload.route");
const chatRoutes = require("./assistant/routes/chat.route");
const userRoutes = require("./routes/user.route");


const app = express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"));

const path = require("path");

// Serve static files from the Frontend app
app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.use("/api", uploadRoutes);
app.use("/api/assistant", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", require("./routes/auth.route"));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
});

module.exports = app