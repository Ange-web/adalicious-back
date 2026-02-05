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
        const commandeRes = await client.query(
            `INSERT INTO "adalicious"."commandes" (prenom, statut, archivee, annulee, served_at)
       VALUES ($1, $2, $3, $4, NULL)
       RETURNING *`,
            [prenom, 'en préparation', false, false]
        );

        const commande = commandeRes.rows[0];
        const commandeId = commande.id;

        console.log(`[insertCommandeMulti] Commande créée ID=${commandeId}`);

        // 4. Insérer les items
        const insertedItems = [];
        for (const item of items) {
            // CORRECTION: Utilisation de la colonne 'price' de la table Menu pour insérer dans 'prix' de commande_items
            const itemRes = await client.query(
                `INSERT INTO "adalicious"."commande_items" (commande_id, menu_id, quantite, prix)
         VALUES ($1, $2, $3, (SELECT price FROM "adalicious"."Menu" WHERE id = $2))
         RETURNING *`,
                [commandeId, item.menu_id, item.quantite]
            );
            insertedItems.push(itemRes.rows[0]);
        }

        // 5. Commit
        await client.query('COMMIT');
        console.log(`[insertCommandeMulti] Transaction validée pour ID=${commandeId}`);

        res.status(201).json({
            message: 'Commande enregistrée avec succès',
            commandeId: commande.id, // Retour explicite de l'ID demandé
            commande: commande,
            items: insertedItems
        });

    } catch (error) {
        // 6. Rollback en cas d'erreur
        await client.query('ROLLBACK');
        console.error('[insertCommandeMulti] ERREUR Transaction:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = { insertCommandeMulti };
