import { ErpLayout } from '@/layout';
import DashboardModule from '@/modules/DashboardModule';
import useLanguage from '@/locale/useLanguage';

export default function Dashboard() {
  const translate = useLanguage();

  return (
    <ErpLayout>
      <div className="pad20" style={{ marginBottom: 8 }}>
        <h1 className="erp-page-title" style={{ marginBottom: 8 }}>
          {translate('dashboard')}
        </h1>
        <p style={{ margin: 0, color: 'rgba(15, 23, 42, 0.55)', fontSize: 15 }}>
          {translate('dashboard_subtitle')}
        </p>
      </div>
      <DashboardModule />
    </ErpLayout>
  );
}
