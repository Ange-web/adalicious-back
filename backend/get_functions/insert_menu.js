const { getPool } = require('../db');
const pool = getPool();

const insertMenu = async (req, res) => {
    const { plat, description, image, category, price, sort_order = 0 } = req.body;

    if (!plat || !category || !price) {
        return res.status(400).json({ message: "plat, category et price sont requis" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO "adalicious"."Menu" (plat, description, image, category, price, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, true, $6)
       RETURNING id, plat, description, image, price, category`,
            [plat, description, image, category, price, sort_order]
        );

        res.status(201).json({
            message: 'Plat ajouté avec succès',
            menu: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur ajout menu:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { insertMenu };
