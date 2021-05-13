// fichier qui gere toutes les requete
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//package qui est utilisé pour la gestion et la transformation des chemins de ‎‎fichiers‎
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const app = express();

mongoose.connect('mongodb+srv://asid:Animasso117@cluster0.nosif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app; 