import { Layout, Row, Col } from 'antd';

const { Content } = Layout;

const TopCard = ({ title }) => (
  <div className="settings-nav__header glass-card">
    <h2 className="erp-page-title">{title}</h2>
  </div>
);

export default function SettingsLayout({
  children,
  topCardTitle,
  bottomCardContent,
}) {
  return (
    <Layout className="site-layout">
      <Content className="page-shell page-shell--settings">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={17} lg={18}>
            <div className="settings-tab-panel glass-card">{children}</div>
          </Col>
          <Col xs={24} md={7} lg={6}>
            <TopCard title={topCardTitle} />
            <div className="settings-nav__menu glass-card settings-nav__menu--bottom">
              {bottomCardContent}
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
