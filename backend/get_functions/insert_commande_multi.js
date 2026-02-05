const { getPool } = require('../db');
const pool = getPool();

const insertCommandeMulti = async (req, res) => {
    const { prenom, items } = req.body;
    const client = await pool.connect();

    console.log('[insertCommandeMulti] Reçu:', { prenom, itemsLength: items?.length });

    // 1. Validations
    if (!prenom || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Prénom et items (non vide) requis" });
    }

    for (const item of items) {
        if (!item.menu_id || !item.quantite || item.quantite < 1) {
            return res.status(400).json({ message: "Chaque item doit avoir menu_id et quantite >= 1" });
        }
    }

    try {
        // 2. Début Transaction
        await client.query('BEGIN');

        // 3. Insérer la commande (entête)
        // SCHEMA: adalicious.commandes (id, prenom, statut, archivee, annulee, served_at)
        // Pas de menu_id ici.
        const commandeRes = await client.query(
            `INSERT INTO "adalicious"."commandes" (prenom, statut, archivee, annulee, served_at)
             VALUES ($1, $2, $3, $4, NULL)
             RETURNING id`,
            [prenom, 'en attente', false, false]
        );

        const commandeId = commandeRes.rows[0].id;
        console.log(`[insertCommandeMulti] Commande créée ID=${commandeId}`);

        // 4. Insérer les items
        // SCHEMA: adalicious.commande_items (commande_id, menu_id, quantite, prix)
        // PRIX: Récupéré depuis adalicious.Menu.price
        for (const item of items) {
            const itemRes = await client.query(
                `INSERT INTO "adalicious"."commande_items" (commande_id, menu_id, quantite, prix)
                 VALUES ($1, $2, $3, (SELECT price FROM "adalicious"."Menu" WHERE id = $2))
                 RETURNING id`,
                [commandeId, item.menu_id, item.quantite]
            );

            // Validation: si le menu n'existe pas, SELECT price renvoie NULL. 
            // Si la colonne prix est NOT NULL, ça plantera (ce qui est bien).
            // Si elle accepte NULL, on continue.
        }

        // 5. Commit
        await client.query('COMMIT');
        console.log(`[insertCommandeMulti] Transaction validée pour ID=${commandeId}`);

        // Retour demandé : { "commandeId": number }
        res.status(201).json({
            message: 'Commande enregistrée avec succès',
            commandeId: commandeId
        });

    } catch (error) {
        // 6. Rollback en cas d'erreur
        await client.query('ROLLBACK');
        console.error('[insertCommandeMulti] ERREUR Transaction:', error.message);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = { insertCommandeMulti };
