const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getPlats } = require('./get_functions/get_menu');
const {insertCommande} = require('./get_functions/insert_com')

const {archiverCommande} = require('./get_functions/update_archive')
const { getCommandeById } = require('./get_functions/get_commandeById');
const { getToutesCommandes } = require('./get_functions/get_commandes');
const { updateStatutCommande } = require('./get_functions/update_statut');


const app = express();
const port = 3000;

app.use(cors()); // ← indispensable pour React
app.use(express.json());

app.put('/commandes/:id/statut', updateStatutCommande);
app.get('/commandes/:id', getCommandeById);
app.get('/commande', getToutesCommandes);
app.get('/plats', getPlats);
app.post('/commandes', insertCommande);
app.post('/commandes/archiver', archiverCommande);



app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
