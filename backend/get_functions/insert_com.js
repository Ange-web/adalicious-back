const { getPool } = require('../db');
const pool = getPool();

const insertCommande = async (req, res) => {
  const { prenom, menu_id } = req.body;

  if (!prenom || !menu_id) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "adalicious"."commandes" (prenom, menu_id, statut, archivee, annulee)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [prenom, menu_id, 'en attente', false, false]
    );

    const commande = result.rows[0];

    if (!commande) {
      console.error('[insertCommande] INSERT returned no rows');
      return res.status(500).json({ message: 'Erreur insertion commande' });
    }

    console.log(`[insertCommande] Commande créée id=${commande.id}`);

    res.status(201).json({
      message: 'Commande enregistrée avec succès',
      commande: commande,
    });
  } catch (error) {
    console.error('[insertCommande] ERREUR:', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { insertCommande };
