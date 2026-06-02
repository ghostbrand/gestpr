import React from 'react';
import { Layout, Row, Col } from 'antd';

export default function AuthLayout({ sideContent, children }) {
  return (
    <Layout className="auth-page-layout">
      <Row wrap={false} style={{ minHeight: '100vh' }}>
        <Col
          className="auth-page-layout__hero"
          xs={{ span: 0, order: 2 }}
          sm={{ span: 0, order: 2 }}
          md={{ span: 11, order: 1 }}
          lg={{ span: 12, order: 1 }}
          style={{
            minHeight: '100vh',
          }}
        >
          {sideContent}
        </Col>
        <Col
          className="auth-page-layout__form"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 13, order: 2 }}
          lg={{ span: 12, order: 2 }}
          style={{ minHeight: '100vh' }}
        >
          {children}
        </Col>
      </Row>
    </Layout>
  );
}
