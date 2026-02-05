const { getPool } = require('../db');
const pool = getPool();

const getCommandesMulti = async (req, res) => {
  try {
    // GET /commandes
    // Récupère les commandes actives (non archivées, non annulées)
    // Agrège les items en JSON
    const result = await pool.query(`
            SELECT 
                c.id, 
                c.prenom, 
                c.statut, 
                c.archivee, 
                c.annulee, -- ou annulee selon ton schéma exact (sans accent recommandé)
                c.served_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'menu_id', ci.menu_id,
                            'quantite', ci.quantite,
                            'prix', ci.prix,
                            'plat', m.plat,
                            'image', m.image
                        )
                    ) FILTER (WHERE ci.id IS NOT NULL), 
                    '[]'
                ) AS items
            FROM "adalicious"."commandes" c
            LEFT JOIN "adalicious"."commande_items" ci ON c.id = ci.commande_id
            LEFT JOIN "adalicious"."Menu" m ON ci.menu_id = m.id
            WHERE c.archivee = false 
              AND (c.annulee = false OR c.annulee IS NULL)
            GROUP BY c.id
            ORDER BY c.id ASC
        `);

    res.json(result.rows);
  } catch (error) {
    console.error("[getCommandesMulti] ERREUR:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getCommandeByIdMulti = async (req, res) => {
  const { id } = req.params;
  try {
    // GET /commandes/:id
    const result = await pool.query(`
            SELECT 
                c.id, 
                c.prenom, 
                c.statut, 
                c.archivee,
                c.annulee,
                c.served_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'menu_id', ci.menu_id,
                            'quantite', ci.quantite,
                            'prix', ci.prix,
                            'plat', m.plat,
                            'image', m.image
                        )
                    ) FILTER (WHERE ci.id IS NOT NULL), 
                    '[]'
                ) AS items
            FROM "adalicious"."commandes" c
            LEFT JOIN "adalicious"."commande_items" ci ON c.id = ci.commande_id
            LEFT JOIN "adalicious"."Menu" m ON ci.menu_id = m.id
            WHERE c.id = $1
            GROUP BY c.id
        `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("[getCommandeByIdMulti] ERREUR:", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getCommandesMulti, getCommandeByIdMulti };
