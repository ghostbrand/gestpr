import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Typography } from 'antd';
import { LogoutOutlined, ToolOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';

const { Header } = Layout;
const { Text, Title } = Typography;

function headerFromPath(pathname, translate) {
  if (!pathname || pathname === '/') {
    return {
      title: translate('dashboard'),
      subtitle: translate('dashboard_subtitle'),
    };
  }
  const parts = pathname.split('/').filter(Boolean);
  const a = parts[0];
  const b = parts[1];

  if (a === 'reports' && b === 'movements') {
    return {
      title: translate('movements_report'),
      subtitle: translate('movements_report_subtitle'),
    };
  }

  if (a === 'admin-users') {
    return {
      title: translate('admin_users_title'),
      subtitle: translate('admin_users_subtitle'),
    };
  }

  const titles = {
    customer: translate('customers'),
    invoice: translate('invoices'),
    quote: translate('quote'),
    payment: translate('payments'),
    paymentmode: translate('payments_mode'),
    taxes: translate('taxes'),
    serviceitem: translate('service_catalog'),
    settings: translate('settings'),
    profile: translate('profile_settings'),
    about: translate('about'),
  };

  let title = titles[a] || translate('dashboard');
  if (b === 'create') title = `${translate('add_new')} — ${titles[a] || a}`;
  else if (b === 'read') title = `${translate('show')} — ${titles[a] || a}`;
  else if (b === 'update') title = `${translate('update')} — ${titles[a] || a}`;
  else if (b === 'pay') title = translate('record_payment');

  return { title, subtitle: null };
}

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const location = useLocation();
  const navigate = useNavigate();
  const translate = useLanguage();

  const { title, subtitle } = useMemo(
    () => headerFromPath(location.pathname, translate),
    [location.pathname, translate]
  );

  const ProfileDropdown = () => (
    <div className="profileDropdown" onClick={() => navigate('/profile')} role="presentation">
      <div className="header-avatar-ring">
        <Avatar
          size={48}
          className="last"
          src={
            currentAdmin?.photo ? `${FILE_BASE_URL || ''}${currentAdmin.photo}` : undefined
          }
          style={{
            color: '#0c4a6e',
            background: currentAdmin?.photo ? 'transparent' : 'linear-gradient(135deg, #e0f2fe 0%, #fef9c3 100%)',
            fontWeight: 700,
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </div>
      <div className="profileDropdownInfo">
        <Text strong style={{ display: 'block', color: '#0f172a' }}>
          {currentAdmin?.name} {currentAdmin?.surname}
        </Text>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {currentAdmin?.email}
        </Text>
      </div>
    </div>
  );

  const DropdownMenu = ({ text }) => <span>{text}</span>;

  const items = [
    {
      label: <ProfileDropdown />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to="/profile">
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to="/settings">{translate('app_settings')}</Link>,
    },
    {
      type: 'divider',
    },
    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to="/logout">{translate('logout')}</Link>,
    },
  ];

  return (
    <Header className="app-header-shell app-header-shell--enhanced">
      <div className="app-header-shell__left">
        <Link to="/" className="app-header-home" aria-label={translate('dashboard')}>
          <HomeOutlined />
        </Link>
        <div className="app-header-shell__titles">
          <Title level={4} className="app-header-shell__title" ellipsis>
            {title}
          </Title>
          {subtitle ? (
            <Text type="secondary" className="app-header-shell__subtitle" ellipsis>
              {subtitle}
            </Text>
          ) : null}
        </div>
      </div>

      <div className="app-header-shell__right">
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
        <button type="button" className="header-avatar-trigger" aria-label={translate('profile_settings')}>
          <Avatar
            size="large"
            src={
            currentAdmin?.photo ? `${FILE_BASE_URL || ''}${currentAdmin.photo}` : undefined
          }
            style={{
              color: '#0c4a6e',
              background: currentAdmin?.photo ? 'transparent' : 'linear-gradient(135deg, #bae6fd 0%, #fde68a 100%)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {currentAdmin?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </button>
        </Dropdown>
      </div>
    </Header>
  );
}
