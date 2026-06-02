/**
 * Perfis proprietário ou gestor: gestão de utilizadores e alterações às definições globais (API).
 */
module.exports = function requireOwnerOrManager(req, res, next) {
  const role = req.admin?.role;
  if (role === 'owner' || role === 'manager') {
    return next();
  }
  return res.status(403).json({
    success: false,
    result: null,
    message: 'Sem permissão para esta operação.',
  });
};
