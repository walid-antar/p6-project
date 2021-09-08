/*nous créons un routeur Express. Jusqu'à présent, nous avions enregistré nos routes directement dans notre application.
Maintenant, nous allons les enregistrer dans notre routeur Express, puis enregistrer celui - ci dans l'application.*/
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/Sauce");

router.get("/", auth, sauceCtrl.getAllSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.getOneSauce);
/*Structurer le code de manière modulaire comme cela n'est pas absolument nécessaire pour chaque projet,
mais c'est une bonne habitude à prendre car cela simplifie la maintenance.*/
module.exports = router;
/*Désormais, à partir du front-end, vous devriez être capable de vous connecter et d'utiliser normalement l'application. 
Pour vérifier que les requêtes non autorisées ne fonctionnent pas, vous pouvez utiliser une application(telle que Postman) pour passer une demande sans en - tête Authorization.
L'API refusera l'accès et renverra une réponse 401.*/

/*La modification de notre route PUT est sensiblement plus compliquée, car nous devons prendre en compte deux possibilités
l'utilisateur a mis à jour l'image, ou pas.Dans le premier cas, nous recevrons l'élément form-data et le fichier.
Dans le second cas, nous recevrons uniquement les données JSON.
Tout d'abord, ajoutons multer comme middleware à notre route PUT*/
