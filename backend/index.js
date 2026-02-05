const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getPlats } = require('./get_functions/get_menu');
const { getMenuByCategory } = require('./get_functions/get_menu_by_category');
const { insertMenu } = require('./get_functions/insert_menu');
const { updateMenu } = require('./get_functions/update_menu');
const { disableMenu } = require('./get_functions/disable_menu');
const { insertCommande } = require('./get_functions/insert_com');
const { archiverCommande } = require('./get_functions/update_archive');
const { getCommandeById } = require('./get_functions/get_commandeById');
const { getToutesCommandes } = require('./get_functions/get_commandes');
const { updateStatutCommande } = require('./get_functions/update_statut');


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes Menu
app.get('/menu', getPlats);
app.get('/menu/:category', getMenuByCategory);
app.post('/menu', insertMenu);
app.put('/menu/:id', updateMenu);
app.patch('/menu/:id/disable', disableMenu);

// Routes Commandes
app.get('/commandes/:id', getCommandeById);
app.get('/commande', getToutesCommandes);
app.post('/commandes', insertCommande);
app.put('/commandes/:id/statut', updateStatutCommande);
app.post('/commandes/archiver', archiverCommande);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
