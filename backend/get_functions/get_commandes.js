const { getPool } = require('../db');
const pool = getPool();

const getToutesCommandes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.prenom, c.statut, m.plat, m.image
      FROM "adalicious"."commandes" c
      JOIN "adalicious"."Menu" m ON m.id::text = c.menu_id::text
      WHERE c.archivee = false AND c.annulee = false
      ORDER BY c.id ASC
    `);

    console.log(`[getCommandes] Found ${result.rows.length} commandes`);
    res.json(result.rows);
  } catch (error) {
    console.error("[getCommandes] ERREUR:", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { getToutesCommandes };
