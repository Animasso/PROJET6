const Sauce = require('../models/Sauce');
//fs package qui donne accès aux fonctions qui nous permettent de modifier le système de fichiers
const fs = require('fs'); 

exports.createSauce = (req, res, next) => {
    //pour extraire l objet json de sauce
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({ 
      ...sauceObject,
    //https + racine server+ filename
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes:0,
      dislikes:0,
      usersLiked:[], 
      usersDisliked:[],
    }); 
    sauce.save()
      .then(() => res.status(201).json({ message: 'sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce =  (req, res, next) => {
    //mettre les 2 points pour etre accesible en tant que parametre
    //findone pour trouver la sauce parmis les sauces
  Sauce.findOne({ _id: req.params.id })
  //le Sauce est retourne en tant que promise  dans le frontend
    .then(sauce=> res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}
exports.modifySauce = (req, res, next) => {
    //updateOne pour mettre a jour par rapport a l'id egal a l id dans les parametre selectionné et la nouvelle version objet    
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
}

    //deleteOne pour supprimer l'objet il prend en parametre id 
exports.deleteSauce = (req, res, next) => {
// nous utilisons l'ID que nous recevons comme paramètre pour accéder au Sauce correspondant dans la base de données 
        Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
//nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
            const filename = sauce.imageUrl.split('/images/')[1];
// nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
            fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'sauce supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            });
          })
          .catch(error => res.status(500).json({ error }));
      };
  

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  }

exports.likesDislikesSauce = (req, res, next) =>{
  let like=req.body.like;
  let userId=req.body.userId;
  let sauceId=req.params.id;


//Gestion des likes,dislikes

/*Quand un utilisateur like une sauce on met à jour grace au id la sauce sélectionnnée
on push id de l'utilisateur dans le tableau usersliked et on incrémente de 1 les likes
*/
  if(like===1){
    Sauce.updateOne({
      _id: sauceId
    },{
      $push: {
        usersLiked: userId
      },
      $inc:{
        likes:+1
      },
    })
    .then(() => res.status(200).json({
      message:'Vous aimez !!'
    }))
    .catch((error) => res.status(400).json({
      message:'Une erreur est survenu'
    }))
  }

/*Quand un utilisateur dislike une sauce on met à jour grace au id la sauce sélectionnnée
on push id de l'utilisateur dans le tableau usersliked et on incrémente de 1 les dislikes
*/
  if(like=== -1){
    Sauce.updateOne({
      _id: sauceId
    },{
      $push: {
        usersDisliked: userId
      },
      $inc:{
        dislikes:+1
      },
    })
    .then(() => res.status(200).json({
      message:'Nos excuse à votre langue'
    }))
    .catch((error) => res.status(400).json({
      message:'Une erreur est survenu'
    }))


//Autre cas lorsqu'on le veut enlever un like ou un dislike présent

//1 cas pour supprimer le dislike 
  }else{
  Sauce.findOne({_id: req.params.id}) 
  .then(
    (sauce)=>{
      if (sauce.usersDisliked.find(userId=>userId===req.body.userId)){
        Sauce.updateOne(
          {_id: sauceId},
          {
            $inc:{dislikes: -1},
            $pull:{usersDisliked:userId}
          }
        )
        .then(() => res.status(200).json({
          message:'Votre choix est prit en compte'
        }))
        .catch((error) => res.status(400).json({
          message:'Une erreur est survenu'
        }))
        //pour supprimer le likes
      }else{
        Sauce.updateOne(
          {_id:sauceId},
          {
            $inc:{likes: -1},
            $pull:{ usersLiked:userId}
          }
          )
          .then(() => res.status(200).json({
            message:'Votre choix est prit en compte'
          }))
          .catch((error) => res.status(400).json({
            message:'Une erreur est survenu'
          }))
        
      }
    }
  )
}

  }
