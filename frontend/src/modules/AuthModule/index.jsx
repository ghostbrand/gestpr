import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Divider, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

const { Content } = Layout;
const { Title, Text } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: isForRegistre
            ? 'clamp(24px, 6vw, 40px) clamp(16px, 4vw, 30px) 30px'
            : 'clamp(48px, 12vw, 100px) clamp(16px, 4vw, 30px) 30px',
          maxWidth: 'min(440px, 100%)',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
          <div className="auth-brand-mark" style={{ margin: '0 auto 20px', textAlign: 'center' }}>
            <Text strong className="nav-brand__title" style={{ display: 'block' }}>
              CRIS & FAMA
            </Text>
            <Text type="secondary" className="nav-brand__subtitle">
              , Lda.
            </Text>
          </div>
          <div className="space10" />
        </Col>
        <Title level={1}>{translate(AUTH_TITLE)}</Title>

        <Divider />
        <div className="site-layout-content">{authContent}</div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
