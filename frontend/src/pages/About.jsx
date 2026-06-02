import { Typography, Row, Col, Card, Space, Divider, Tag } from 'antd';
import {
  ShopOutlined,
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  SafetyOutlined,
  LaptopOutlined,
  ApiOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Title, Paragraph, Text } = Typography;

export default function About() {
  const translate = useLanguage();

  const features = [
    {
      icon: <TeamOutlined style={{ fontSize: 22, color: 'var(--app-primary-dark)' }} />,
      title: translate('about_feature_clients'),
      text: translate('about_feature_clients_desc'),
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 22, color: 'var(--app-primary-dark)' }} />,
      title: translate('about_feature_docs'),
      text: translate('about_feature_docs_desc'),
    },
    {
      icon: <BankOutlined style={{ fontSize: 22, color: 'var(--app-primary-dark)' }} />,
      title: translate('about_feature_payments'),
      text: translate('about_feature_payments_desc'),
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 22, color: 'var(--app-primary-dark)' }} />,
      title: translate('about_feature_security'),
      text: translate('about_feature_security_desc'),
    },
  ];

  return (
    <div className="about-page">
      <div className="about-page__hero">
        <Space align="start" size="middle">
          <div className="about-page__hero-icon">
            <ShopOutlined />
          </div>
          <div>
            <Tag color="cyan">{translate('about_tag_internal')}</Tag>
            <Title level={2} style={{ margin: '8px 0 0', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {translate('about_title_company')}
            </Title>
            <Paragraph className="about-page__lead">{translate('about_subtitle_app')}</Paragraph>
          </div>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={14}>
          <Card className="about-page__card" bordered={false} title={translate('about_card_mission_title')}>
            <Paragraph>{translate('about_card_mission_p1')}</Paragraph>
            <Paragraph>{translate('about_card_mission_p2')}</Paragraph>
            <Divider style={{ margin: '16px 0' }} />
            <Text type="secondary">{translate('about_card_mission_footer')}</Text>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="about-page__card" bordered={false} title={translate('about_card_stack_title')}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text>
                <LaptopOutlined style={{ marginRight: 8, color: 'var(--app-primary-dark)' }} />
                {translate('about_stack_frontend')}
              </Text>
              <Text>
                <ApiOutlined style={{ marginRight: 8, color: 'var(--app-primary-dark)' }} />
                {translate('about_stack_backend')}
              </Text>
              <Text>
                <DatabaseOutlined style={{ marginRight: 8, color: 'var(--app-primary-dark)' }} />
                {translate('about_stack_data')}
              </Text>
              <Divider style={{ margin: '12px 0' }} />
              <Text type="secondary">{translate('about_stack_note')}</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 28, marginBottom: 16, fontWeight: 600 }}>
        {translate('about_features_heading')}
      </Title>
      <Row gutter={[16, 16]}>
        {features.map((f) => (
          <Col xs={24} sm={12} key={f.title}>
            <Card className="about-page__feature-card" bordered={false} size="small">
              <Space align="start">
                {f.icon}
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 4 }}>
                    {f.title}
                  </Text>
                  <Text type="secondary">{f.text}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="about-page__card about-page__footer-card" bordered={false} style={{ marginTop: 24 }}>
        <Text type="secondary">{translate('about_disclaimer')}</Text>
      </Card>
    </div>
  );
}
