const { getPool } = require('../db');
const pool = getPool();

const getCommandesArchivees = async (req, res) => {
    try {
        // Requête simplifiée pour éviter les erreurs de colonnes manquantes
        const result = await pool.query(`
      SELECT a.prenom, a.statut, a.archivee, a.annulee, a.served_at, 
             a.menu_id, m.plat, m.image
      FROM "adalicious"."commandes_archive" a
      LEFT JOIN "adalicious"."Menu" m ON m.id::text = a.menu_id::text
      ORDER BY a.served_at DESC NULLS LAST
      LIMIT 50
    `);

        console.log(`[getArchives] Found ${result.rows.length} archives`);
        res.json(result.rows);
    } catch (error) {
        console.error("[getArchives] ERREUR:", error.message);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { getCommandesArchivees };
