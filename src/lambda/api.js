// On va récupérer la config qui se trouve dans les variables
// d'environnement. Celles-ci sont passées par Netlify lors
// de l'exécution, mais en local on va devoir utiliser le fichier .env
require("dotenv").config();

const { getClient } = require("./utils/googleapis");
const { collection } = require("./utils/firebase");

// Axios est le client HTTP que nous utiliserons pour faire les
// appels à l'API de Firebase Dynamic Link.
// Il est possible de passer par des functions plus natives (request ou fetch)
// mais par habitude et par goût je préfère passer par Axios.
const axios = require("axios").default;

// Express est notre serveur http
const express = require("express");
// Cors un middleware pour nous permettre de l'appeler en ajax
const cors = require("cors");
// Et enfin serverless est le wrapper qui va encapsuler express
// et lui permettre de traiter les requêtes en provenance de
// l'environnement AWS Lambda sur lequel on va s'exécuter
const serverless = require("serverless-http");

// Initialisation de l'app
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const firebaseClient = axios.create({
  baseURL: "https://firebasedynamiclinks.googleapis.com/v1/",
  timeout: 1000,
});

// Add a request interceptor
firebaseClient.interceptors.request.use(function (config) {
  return Object.assign({}, config, {
    url: `${config.url}?key=${process.env.FIREBASE_API_KEY}`,
  });
});

const router = express.Router();

router.get("/links", (req, res) => {
  collection
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      let docs = [];
      // On ne peut pas utiliser .map() parce que ce n'est pas un array
      snapshot.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));
      res.json(docs);
    });
});

router.get("/links/:linkId", (req, res) => {
  getClient()
    .then((client) => {
      res.json({
        token: true,
      });
    })
    .catch((reason) => {
      res.status(400).json({ token: false });
    });
});

router.delete("/links/:linkId", (req, res) => {});

router.post("/links", (req, res) => {
  firebaseClient
    .post(`shortLinks`, {
      dynamicLinkInfo: {
        domainUriPrefix: process.env.DYNAMIC_LINK_PREFIX,
        link: req.body.url,
      },
    })
    .then((response) => {
      collection
        .add({
          url: req.body.url,
          client: req.body.client,
          shortLink: response ? response.data.shortLink : null,
          createdAt: new Date(),
        })
        .then((r) => {
          console.log("successfully saved link", r);
          res.json(response.data);
        });
    })
    .catch((reason) => {
      res.status(400).json(reason);
    });
});
app.use(process.env.API_BASE_PATH, router);
module.exports.handler = serverless(app);
