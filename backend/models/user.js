const mongoose = require('mongoose');
//on require mongoose-unique - validator pour que l'utilistaeur puisse utiliser une adresse mail 1 seul fois 
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
//methode plugin appliqué au schema, uniqueValidztor est passé en paramétre 
userSchema.plugin(uniqueValidator);

// exportation du schema sous forme de modele
module.exports = mongoose.model('User', userSchema);