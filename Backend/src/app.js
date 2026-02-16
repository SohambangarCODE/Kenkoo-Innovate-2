const express = require('express')
const cors = require('cors')
const path = require("path");

const uploadRoutes = require("./assistant/routes/upload.route");
const chatRoutes = require("./assistant/routes/chat.route");
const userRoutes = require("./routes/user.route");

const app = express()

// app.use(cors())
app.use(cors({
  origin: "https://kenkoo-frontend.onrender.com",
  credentials: true
}));

app.use(express.json())

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Kenkoo Backend is Live 🚀");
});

// Serve static files from the Frontend app
// app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

app.use("/api", uploadRoutes);
app.use("/api/assistant", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/contact", require("./routes/contact.route"));

// Handle undefined API routes explicitly to avoid returning HTML
app.use("/api/*splat", (req, res) => {
    res.status(404).json({ message: "API route not found" });
});


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get("/*splat", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
// });

module.exports = app