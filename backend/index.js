const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getPlats } = require('./get_functions/get_menu');
const { getMenuByCategory } = require('./get_functions/get_menu_by_category');
const { insertMenu } = require('./get_functions/insert_menu');
const { updateMenu } = require('./get_functions/update_menu');
const { disableMenu } = require('./get_functions/disable_menu');
const { insertCommandeMulti } = require('./get_functions/insert_commande_multi');
const { archiverCommande } = require('./get_functions/update_archive');
const { getCommandesArchivees } = require('./get_functions/get_archives');
const { getCommandesMulti, getCommandeByIdMulti } = require('./get_functions/get_commandes_multi');
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

// Routes Commandes - ORDRE IMPORTANT: routes statiques AVANT routes avec :id
app.get('/commande', getCommandesMulti);
app.get('/commandes/archives', getCommandesArchivees);
app.post('/commandes/archiver', archiverCommande);
app.post('/commandes', insertCommandeMulti);
app.get('/commandes/:id', getCommandeByIdMulti);
app.put('/commandes/:id/statut', updateStatutCommande);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
