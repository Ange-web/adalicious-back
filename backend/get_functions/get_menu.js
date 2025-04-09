const { getPool } = require('../db');
const pool = getPool();

const getPlats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, plat, description, image FROM "adalicious"."Menu"`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des plats :', error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getPlats };
