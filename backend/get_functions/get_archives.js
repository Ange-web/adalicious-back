const { getPool } = require('../db');
const pool = getPool();

const getCommandesArchivees = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT a.id, a.prenom, a.statut, a.archivee, a.annulée, m.plat, m.image
      FROM "adalicious"."commandes_archive" a
      JOIN "adalicious"."Menu" m ON m.id::text = a.menu_id
      ORDER BY a.id DESC
      LIMIT 50
    `);

        res.json(result.rows);
    } catch (error) {
        console.error("Erreur récupération archives :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { getCommandesArchivees };
