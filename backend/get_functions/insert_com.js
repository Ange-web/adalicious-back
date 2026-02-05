const { getPool } = require('../db');
const pool = getPool();

const insertCommande = async (req, res) => {
  const { prenom, menu_id } = req.body;

  console.log('[insertCommande] Reçu:', { prenom, menu_id, type_menu_id: typeof menu_id });

  if (!prenom || !menu_id) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    // Cast menu_id en integer pour éviter les erreurs de type
    const menuIdInt = parseInt(menu_id, 10);

    if (isNaN(menuIdInt)) {
      console.error('[insertCommande] menu_id invalide:', menu_id);
      return res.status(400).json({ message: "menu_id invalide" });
    }

    console.log('[insertCommande] INSERT avec:', { prenom, menuIdInt });

    const result = await pool.query(
      `INSERT INTO "adalicious"."commandes" (prenom, menu_id, statut, archivee, annulee)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [prenom, menuIdInt, 'en attente', false, false]
    );

    console.log('[insertCommande] Résultat INSERT:', result.rows);

    const commande = result.rows[0];

    if (!commande) {
      console.error('[insertCommande] INSERT returned no rows');
      return res.status(500).json({ message: 'Erreur insertion commande' });
    }

    console.log(`[insertCommande] Commande créée id=${commande.id}`);

    res.status(201).json({
      message: 'Commande enregistrée avec succès',
      commande: commande,
    });
  } catch (error) {
    console.error('[insertCommande] ERREUR:', error.message);
    console.error('[insertCommande] Stack:', error.stack);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { insertCommande };
