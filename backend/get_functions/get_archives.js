const { getPool } = require('../db');
const pool = getPool();

const getCommandesArchivees = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ca.id, 
                ca.prenom, 
                ca.statut, 
                ca.archivee, 
                ca.annulee, 
                ca.served_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'menu_id', cia.menu_id,
                            'quantite', cia.quantite,
                            'prix', cia.prix,
                            'plat', m.plat,
                            'image', m.image
                        )
                    ) FILTER (WHERE cia.id IS NOT NULL), 
                    '[]'
                ) AS items
            FROM "adalicious"."commandes_archive" ca
            LEFT JOIN "adalicious"."commande_items_archive" cia ON ca.id = cia.commande_id
            LEFT JOIN "adalicious"."Menu" m ON cia.menu_id = m.id
            GROUP BY ca.id
            ORDER BY ca.served_at DESC NULLS LAST
            LIMIT 50
        `);

        // Log pour debug
        console.log(`[getArchives] Found ${result.rows.length} archives`);
        res.json(result.rows);
    } catch (error) {
        console.error("[getArchives] ERREUR:", error.message);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { getCommandesArchivees };
