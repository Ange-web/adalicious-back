const { getPool } = require('../db');
const pool = getPool();

const getCommandesArchivees = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT c.id, c.prenom, c.statut, c.served_at, m.plat, m.image
      FROM "adalicious"."commandes" c
      JOIN "adalicious"."Menu" m ON m.id = c.menu_id
      WHERE c.archivee = true
      ORDER BY c.served_at DESC
      LIMIT 50
    `);

        res.json(result.rows);
    } catch (error) {
        console.error("Erreur récupération archives :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { getCommandesArchivees };
