import useLanguage from '@/locale/useLanguage';
import BrandLogo from '@/components/BrandLogo/BrandLogo';

import { Layout, Col, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

const { Content } = Layout;
const { Title, Text } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        className="auth-form-card animate-fade-up stagger-2"
        style={{
          padding: isForRegistre
            ? 'clamp(24px, 6vw, 40px) clamp(20px, 4vw, 36px) 30px'
            : 'clamp(48px, 12vw, 100px) clamp(20px, 4vw, 36px) 30px',
          maxWidth: 'min(440px, 100%)',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
          <div style={{ margin: '0 auto 24px', display: 'flex', justifyContent: 'center' }}>
            <BrandLogo size="md" />
          </div>
        </Col>
        <Title level={1} style={{ marginBottom: 8 }}>
          {translate(AUTH_TITLE)}
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 28, fontSize: 15 }}>
          CRIS & FAMA, Lda.
        </Text>
        <div className="site-layout-content">{authContent}</div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
