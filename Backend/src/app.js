const express = require('express')
const cors = require('cors')
const uploadRoutes = require("./assistant/routes/upload.route");
const chatRoutes = require("./assistant/routes/chat.route");
const userRoutes = require("./routes/user.route");


const app = express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"));

app.use("/api", uploadRoutes);
app.use("/api/assistant", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", require("./routes/auth.route"));

module.exports = app