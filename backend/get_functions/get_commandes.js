const { getPool } = require('../db');
const pool = getPool();

const getToutesCommandes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.prenom, c.statut, m.plat, m.image
      FROM "adalicious"."commandes" c
      JOIN "adalicious"."Menu" m ON m.id = c.menu_id
      WHERE c.archivee = false AND c.annulee = false
      ORDER BY c.id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur récupération commandes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getToutesCommandes };
