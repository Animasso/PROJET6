// fichier qui gere toutes les requete
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//package qui est utilisé pour la gestion et la transformation des chemins de ‎‎fichiers‎
const path = require('path');
 //protege contre l'injection d'opérateur mongoDB
const mongoSanitize =require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");
require("dotenv").config();
//configure de manière appropriée des en-têtes HTTP pour protéger de certaines vulnérabilités
const helmet = require('helmet')

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const { use } = require('./routes/sauce');
 

const app = express();


mongoose.connect(process.env.MANGODB_LOG,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app; 