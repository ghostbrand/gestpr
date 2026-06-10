import Profile from './components/Profile';
import ProfileLayout from '@/layout/ProfileLayout';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function ProfileModule({ config }) {
  return (
    <ProfileLayout>
      <Layout className="site-layout">
        <Content className="page-shell glass-card layoutPadding animate-fade-up">
          <Profile config={config} />
        </Content>
      </Layout>
    </ProfileLayout>
  );
}
