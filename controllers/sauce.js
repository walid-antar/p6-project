/*ici, nous exposons la logique de notre route POST en tant que fonction appelée createThing() .
  Pour réimplémenter cela dans notre route,nous devons importer notre contrôleur puis enregistrer createSauce*/
const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const SauceObject = JSON.parse(req.body.sauce);
  delete SauceObject._id;
  const sauce = new Sauce({
    ...SauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((Sauce) => {
      res.status(200).json(Sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

/*Dans cette version modifiée de la fonction, on crée un objet SauceObject qui regarde si req.file existe ou non.
  S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant.
  On crée ensuite une instance Sauce à partir de SauceObject, puis on effectue la modification.
  Notre application gère correctement les téléchargements de fichiers lorsque nous mettons de
  nouveaux articles en vente et lorsque nous modifions les articles existants.*/
exports.modifySauce = (req, res, next) => {
  const SauceObject = req.file
    ? {
        ...JSON.parse(req.body.Sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...SauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

/*Dans cette fonction,
  nous utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données 
  nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
  nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à 
  supprimer et le callback à exécuter une fois ce fichier supprimé
  dans le callback, nous implémentons la logique d'origine, en supprimant le Thing de la base de données.
  Notre API peut désormais gérer correctement toutes les opérations CRUD contenant des fichiers: lorsqu'un 
  utilisateur crée une Sauce, met à jour une Sauce existant ou supprime une Sauce!*/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((Sauce) => {
      const filename = Sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((Sauces) => {
      res.status(200).json(Sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
