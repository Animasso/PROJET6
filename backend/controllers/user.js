const bcrypt =require('bcrypt');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const cryptojs = require("crypto-js");
const mailValidator = require('email-validator');
var passwordValidator = require('password-validator');



var schema = new passwordValidator();
schema
.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 
 
exports.signup = (req, res, next) => {
const emailCrypt = cryptojs.HmacSHA256(req.body.email, 'secret key 123').toString();
if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  
  throw { error: " invalide !" }  
} else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password)))
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailCrypt,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));  

};

exports.login = (req, res, next) => {
const emailCrypt = cryptojs.HmacSHA256(req.body.email, 'secret key 123').toString();
    User.findOne({ email: emailCrypt })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id, 
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              ) 
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}; 