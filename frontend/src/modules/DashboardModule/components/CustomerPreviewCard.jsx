import { Statistic, Progress, Row, Spin } from 'antd';
import { TeamOutlined, ArrowUpOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();

  return (
    <Row className="gutter-row">
      <div className="glass-card" style={{ width: '100%', minHeight: 420, padding: '24px 20px' }}>
        <div className="stat-card__header" style={{ marginBottom: 24 }}>
          <span className="section-title" style={{ margin: 0 }}>
            {translate('Customers')}
          </span>
          <div className="stat-card__icon stat-card__icon--cyan">
            <TeamOutlined />
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <Progress
              type="dashboard"
              percent={newCustomer}
              size={160}
              strokeColor={{ '0%': '#6366f1', '100%': '#06b6d4' }}
              trailColor="rgba(99, 102, 241, 0.1)"
            />
            <p style={{ margin: 0, color: 'var(--app-text-muted)', fontWeight: 500 }}>
              {translate('New Customer this Month')}
            </p>
            <div
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: 14,
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid var(--app-border)',
              }}
            >
              <Statistic
                title={translate('Active Customer')}
                value={activeCustomer}
                precision={0}
                valueStyle={{ color: 'var(--app-primary-dark)', fontFamily: 'Outfit, sans-serif' }}
                prefix={<ArrowUpOutlined style={{ color: 'var(--app-accent-emerald)' }} />}
                suffix="%"
              />
            </div>
          </div>
        )}
      </div>
    </Row>
  );
}
