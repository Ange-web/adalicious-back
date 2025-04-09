const { getPool } = require('../db');
const pool = getPool();

const getCommandeById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      `SELECT c.id, m.plat, m.image, c.statut 
       FROM "adalicious"."commandes" c 
       JOIN "adalicious"."Menu" m ON m.id = c.menu_id 
       WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Commande introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur récupération commande :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { getCommandeById };
