import { Space, Layout, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: 'clamp(48px, 14vw, 120px) clamp(20px, 5vw, 32px) 32px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="auth-hero-icon-wrap" aria-hidden>
          <ShopOutlined className="auth-hero-icon" />
        </div>
        <Title level={2} style={{ margin: 0, fontWeight: 600, letterSpacing: '-0.02em' }}>
          CRIS & FAMA, Lda.
        </Title>
        <Title level={4} type="secondary" style={{ marginTop: 0, fontWeight: 500 }}>
          {translate('free_open_source_erp')}
        </Title>
        <Text style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(15, 23, 42, 0.75)' }}>
          {translate('accounting_quote_tagline')}
        </Text>
      </Space>
    </Content>
  );
}
