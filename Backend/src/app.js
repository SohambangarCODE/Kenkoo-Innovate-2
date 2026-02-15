const express = require('express')
const cors = require('cors')
const uploadRoutes = require("./assistant/routes/upload.route");
const chatRoutes = require("./assistant/routes/chat.route");


const app = express()
app.use(cors())
app.use(express.json())

app.use("/api", uploadRoutes);
app.use("/api/assistant", chatRoutes);

module.exports = app