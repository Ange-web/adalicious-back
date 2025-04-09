const { getPool } = require('../db');
const pool = getPool();

const archiverCommande = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "id requis" });
  }

  try {
    // 1. Mettre à jour la commande : archivee = true
    const updateResult = await pool.query(`
      UPDATE "adalicious"."commandes"
      SET archivee = true
      WHERE id = $1 AND archivee = false
      RETURNING id, prenom, menu_id, statut, archivee, annulée
    `, [id]);

    // 2. Si aucune ligne modifiée → déjà archivée ou inexistante
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Commande déjà archivée ou introuvable" });
    }

    // 3. Retourner les infos complètes
    const commande = updateResult.rows[0];

    res.json({
      message: `Commande ${id} archivée avec succès.`,
      commande
    });
  } catch (err) {
    console.error("Erreur archivage :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { archiverCommande };
