import { Col, Divider, Row, Typography } from 'antd';

const { Title, Text } = Typography;

export default function SetingsSection({ title, description, children }) {
  return (
    <Row gutter={[24, 24]} className="setting-section">
      <Col span={24}>
        <Title level={4} className="setting-section__title">
          {title}
        </Title>
        <Text type="secondary" className="setting-section__desc">
          {description}
        </Text>
      </Col>

      <Col xl={{ span: 18, offset: 2 }} lg={24} md={24} sm={24} xs={24}>
        <div className="setting-section__form">{children}</div>
      </Col>
      <Divider className="setting-section__divider" />
    </Row>
  );
}
