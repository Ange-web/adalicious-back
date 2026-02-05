const { getPool } = require('../db');
const pool = getPool();

const updateStatutCommande = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  console.log(`[updateStatut] id=${id}, statut=${statut}`);

  try {
    // Si statut = 'servie' ou 'annulée', déplacer vers commandes_archive
    const shouldArchive = statut === 'servie' || statut === 'annulée';

    if (shouldArchive) {
      // 1. Récupérer la commande actuelle
      const commandeResult = await pool.query(
        `SELECT * FROM "adalicious"."commandes" WHERE id = $1`,
        [id]
      );

      if (commandeResult.rows.length === 0) {
        console.log(`[updateStatut] Commande ${id} non trouvée`);
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      const commande = commandeResult.rows[0];
      const isAnnulee = statut === 'annulée';
      console.log(`[updateStatut] Archivage commande:`, commande);

      // 2. Insérer dans commandes_archive avec served_at
      await pool.query(
        `INSERT INTO "adalicious"."commandes_archive" 
         (id, prenom, menu_id, statut, archivee, annulée, served_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [commande.id, commande.prenom, commande.menu_id, statut, 'true', isAnnulee ? 'true' : 'false']
      );
      console.log(`[updateStatut] INSERT commandes_archive OK`);

      // 3. Supprimer de commandes
      await pool.query(
        `DELETE FROM "adalicious"."commandes" WHERE id = $1`,
        [id]
      );
      console.log(`[updateStatut] DELETE commandes OK`);

      return res.json({
        message: `Commande ${id} archivée avec succès`,
        commande: { ...commande, statut, archived: true }
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
    console.error('[updateStatut] Stack:', error.stack);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { updateStatutCommande };