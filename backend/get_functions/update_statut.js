const { getPool } = require('../db');
const pool = getPool();

const updateStatutCommande = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  try {
    const result = await pool.query(
      `UPDATE "adalicious"."commandes"
       SET statut = $1
       WHERE id = $2
       RETURNING *`,
      [statut, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({
      message: 'Statut mis à jour avec succès',
      commande: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur update statut :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { updateStatutCommande };