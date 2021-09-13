// Importation des packages

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

require("dotenv").config();

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Lancement de Express

const app = express();

// Configuration CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Activation de Helmet pour sécuriser les headers

app.use(helmet());

// Connexion à la DB

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Body-parser

app.use(express.json());

// Routes

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
