const { getPool } = require('../db');
const pool = getPool();

const getMenuByCategory = async (req, res) => {
    const { category } = req.params;

    const validCategories = [
        'kebab', 'tacos', 'burger', 'sandwich', 'special',
        'assiette', 'tex_mex', 'accompagnement', 'boisson', 'dessert', 'menu_enfant'
    ];

    if (!validCategories.includes(category)) {
        return res.status(400).json({
            message: `Catégorie invalide. Valides: ${validCategories.join(', ')}`
        });
    }

    try {
        const result = await pool.query(
            `SELECT id, plat, description, image, price, category 
       FROM "adalicious"."Menu"
       WHERE is_active = true AND category = $1
       ORDER BY sort_order`,
            [category]
        );

        return res.json(result.rows);
    } catch (error) {
        console.error('Erreur récupération menu par catégorie:', error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { getMenuByCategory };
