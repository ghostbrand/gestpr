const ROLES = ['owner', 'manager', 'staff'];

function isOwner(actor) {
  return actor === 'owner';
}

function isManager(actor) {
  return actor === 'manager';
}

/** Gestor só pode criar/editar utilizadores com perfil staff. */
function canAssignRole(actorRole, targetRole) {
  if (!ROLES.includes(targetRole)) return false;
  if (isOwner(actorRole)) return true;
  if (isManager(actorRole)) return targetRole === 'staff';
  return false;
}

/** Gestor só pode alterar contas com perfil staff. */
function canModifyTarget(actorRole, targetAdmin) {
  if (!targetAdmin || targetAdmin.removed) return false;
  if (isOwner(actorRole)) return true;
  if (isManager(actorRole)) return targetAdmin.role === 'staff';
  return false;
}

async function countOwners(Admin) {
  return Admin.countDocuments({ removed: false, role: 'owner', enabled: true });
}

module.exports = {
  ROLES,
  canAssignRole,
  canModifyTarget,
  countOwners,
  isOwner,
  isManager,
};
