const { getPool } = require('../db');
const pool = getPool();

const updateStatutCommande = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  console.log(`[updateStatut] id=${id}, statut=${statut}`);

  try {
    const shouldArchive = statut === 'servie' || statut === 'annulée';
    const isAnnulee = statut === 'annulée';

    if (shouldArchive) {
      // Récupérer la commande AVANT l'update (car le trigger va la supprimer)
      const selectResult = await pool.query(
        `SELECT * FROM "adalicious"."commandes" WHERE id = $1`,
        [id]
      );

      if (selectResult.rows.length === 0) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      const commande = selectResult.rows[0];

      // UPDATE avec archivee=true → le trigger se déclenche et fait INSERT+DELETE
      await pool.query(
        `UPDATE "adalicious"."commandes"
         SET statut = $1,
             archivee = true,
             annulee = $2,
             served_at = NOW()
         WHERE id = $3`,
        [statut, isAnnulee, id]
      );

      console.log(`[updateStatut] Commande ${id} archivée via trigger`);

      return res.json({
        message: `Commande ${id} archivée avec succès`,
        commande: { ...commande, statut, archivee: true }
      });
    }

    // Sinon, update normal du statut
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

    console.log(`[updateStatut] Statut mis à jour:`, result.rows[0]);
    res.json({
      message: 'Statut mis à jour avec succès',
      commande: result.rows[0]
    });
  } catch (error) {
    console.error('[updateStatut] ERREUR:', error.message);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { updateStatutCommande };