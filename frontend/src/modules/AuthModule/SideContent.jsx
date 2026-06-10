import { Space, Layout, Typography } from 'antd';
import BrandLogo from '@/components/BrandLogo/BrandLogo';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  const features = [
    translate('customers'),
    translate('invoices'),
    translate('quote'),
    translate('payments'),
    translate('movements_report'),
  ];

  return (
    <Content
      style={{
        padding: 'clamp(48px, 14vw, 120px) clamp(24px, 5vw, 40px) 32px',
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
      }}
      className="sideContent animate-fade-up"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <BrandLogo size="lg" />
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
          {translate('free_open_source_erp')}
        </Title>
        <Text style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
          {translate('accounting_quote_tagline')}
        </Text>
        <ul className="auth-hero-features">
          {features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Space>
    </Content>
  );
}
