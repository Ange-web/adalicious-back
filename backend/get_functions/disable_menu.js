const { getPool } = require('../db');
const pool = getPool();

const disableMenu = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE "adalicious"."Menu"
       SET is_active = false
       WHERE id = $1
       RETURNING id, plat, is_active`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Menu non trouvé' });
        }

        res.json({
            message: 'Menu désactivé avec succès',
            menu: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur désactivation menu:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { disableMenu };
