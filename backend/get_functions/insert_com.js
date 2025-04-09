const { getPool } = require('../db');
const pool = getPool();

const insertCommande = async (req, res) => {
  const { prenom, menu_id } = req.body;

  if (!prenom || !menu_id) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "adalicious"."commandes" (prenom, menu_id, statut, archivee, annulée)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [prenom, menu_id, 'en préparation', false, false]
    );

    res.status(201).json({
      message: 'Commande enregistrée avec succès',
      commande: result.rows[0],
    });
  } catch (error) {
    console.error('Erreur lors de l\'insertion de la commande :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { insertCommande };
