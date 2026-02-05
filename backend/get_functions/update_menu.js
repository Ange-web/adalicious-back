const { getPool } = require('../db');
const pool = getPool();

const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { plat, description, image, category, price, sort_order } = req.body;

    try {
        const result = await pool.query(
            `UPDATE "adalicious"."Menu"
       SET plat = COALESCE($1, plat),
           description = COALESCE($2, description),
           image = COALESCE($3, image),
           category = COALESCE($4, category),
           price = COALESCE($5, price),
           sort_order = COALESCE($6, sort_order)
       WHERE id = $7
       RETURNING id, plat, description, image, price, category`,
            [plat, description, image, category, price, sort_order, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu non trouvé' });
        }

        res.json({
            message: 'Menu modifié avec succès',
            menu: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur modification menu:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { updateMenu };
