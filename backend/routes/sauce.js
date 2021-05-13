const express = require('express');
const router = express.Router();

const sauceCtrl=require('../controllers/sauce');
//const pour le token
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//requete get pour afin de renvoyer toutes les sauces dans la base de donnee
router.get('/', auth,sauceCtrl.getAllSauces);

//requete pour poster un nouvel objet avec multer pour les images
router.post('/', auth,multer,sauceCtrl.createSauce);

//requete pour ciblé et afficher un element grace a son id
router.get('/:id', auth,sauceCtrl.getOneSauce);

//requete pour modifier un objet existant
router.put('/:id', auth,multer,sauceCtrl.modifySauce );

//requete pour supprimer un objet existant
router.delete('/:id', auth,sauceCtrl.deleteSauce );

//requete pour les likes
router.post('/:id/like', auth,sauceCtrl.likesDislikesSauce);



module.exports = router;