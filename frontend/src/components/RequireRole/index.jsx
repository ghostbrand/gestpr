import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

/**
 * Redireciona para o painel se o perfil atual não estiver em `roles`.
 */
export default function RequireRole({ roles = [], children }) {
  const admin = useSelector(selectCurrentAdmin);
  if (!admin?.role) {
    return <Navigate to="/" replace />;
  }
  if (!roles.includes(admin.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
