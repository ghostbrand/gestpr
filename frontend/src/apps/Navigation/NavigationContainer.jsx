import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';
import BrandLogo from '@/components/BrandLogo/BrandLogo';
import { useSelector } from 'react-redux';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';

import useResponsive from '@/hooks/useResponsive';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  MenuOutlined,
  ShopOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  AppstoreOutlined,
  LineChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  const location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [currentPath, setCurrentPath] = useState(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length === 0 ? 'dashboard' : parts[0];
  });

  const translate = useLanguage();
  const navigate = useNavigate();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const role = currentAdmin?.role;
  const canConfigureApp = role === 'owner' || role === 'manager';
  const canManageTeam = canConfigureApp;

  const menuItems = useMemo(() => {
    const settingsChildren = canConfigureApp
      ? [
          {
            key: 'paymentmode',
            icon: <WalletOutlined className="erp-nav-icon" />,
            label: <Link to="/paymentmode">{translate('payments_mode')}</Link>,
          },
          {
            key: 'taxes',
            icon: <ShopOutlined className="erp-nav-icon" />,
            label: <Link to="/taxes">{translate('taxes')}</Link>,
          },
          {
            key: 'settings',
            icon: <SettingOutlined className="erp-nav-icon" />,
            label: <Link to="/settings">{translate('settings')}</Link>,
          },
          {
            key: 'about',
            icon: <ReconciliationOutlined className="erp-nav-icon" />,
            label: <Link to="/about">{translate('about')}</Link>,
          },
        ]
      : [
          {
            key: 'about',
            icon: <ReconciliationOutlined className="erp-nav-icon" />,
            label: <Link to="/about">{translate('about')}</Link>,
          },
        ];

    const groups = [
      {
        type: 'group',
        key: 'grp-main',
        label: translate('menu_group_main'),
        children: [
          {
            key: 'dashboard',
            icon: <DashboardOutlined className="erp-nav-icon" />,
            label: <Link to="/">{translate('dashboard')}</Link>,
          },
          {
            key: 'customer',
            icon: <CustomerServiceOutlined className="erp-nav-icon" />,
            label: <Link to="/customer">{translate('customers')}</Link>,
          },
          {
            key: 'serviceitem',
            icon: <AppstoreOutlined className="erp-nav-icon" />,
            label: <Link to="/serviceitem">{translate('service_catalog')}</Link>,
          },
        ],
      },
      {
        type: 'group',
        key: 'grp-billing',
        label: translate('menu_group_billing'),
        children: [
          {
            key: 'invoice',
            icon: <ContainerOutlined className="erp-nav-icon" />,
            label: <Link to="/invoice">{translate('invoices')}</Link>,
          },
          {
            key: 'quote',
            icon: <FileSyncOutlined className="erp-nav-icon" />,
            label: <Link to="/quote">{translate('quote')}</Link>,
          },
          {
            key: 'payment',
            icon: <CreditCardOutlined className="erp-nav-icon" />,
            label: <Link to="/payment">{translate('payments')}</Link>,
          },
        ],
      },
      {
        type: 'group',
        key: 'grp-reports',
        label: translate('menu_group_reports'),
        children: [
          {
            key: 'reports',
            icon: <LineChartOutlined className="erp-nav-icon" />,
            label: <Link to="/reports/movements">{translate('movements_report')}</Link>,
          },
        ],
      },
    ];

    if (canManageTeam) {
      groups.push({
        type: 'group',
        key: 'grp-team',
        label: translate('menu_group_team'),
        children: [
          {
            key: 'admin-users',
            icon: <TeamOutlined className="erp-nav-icon" />,
            label: <Link to="/admin-users">{translate('admin_users_menu')}</Link>,
          },
        ],
      });
    }

    groups.push({
      type: 'group',
      key: 'grp-settings',
      label: translate('menu_group_settings'),
      children: settingsChildren,
    });

    return groups;
  }, [translate, canConfigureApp, canManageTeam]);

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    setCurrentPath(parts.length === 0 ? 'dashboard' : parts[0]);
  }, [location.pathname]);

  const onCollapse = () => {
    navMenu.collapse();
  };

  const siderWidth = isMobile ? '100%' : 256;

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={siderWidth}
      style={
        isMobile
          ? { overflow: 'auto', height: 'auto', minHeight: '100%', position: 'relative' }
          : undefined
      }
      theme={'light'}
    >
      <div className="logo nav-brand">
        <BrandLogo size="md" onClick={() => navigate('/')} />
      </div>
      <Menu
        className="erp-main-menu"
        items={menuItems}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
        style={{
          width: isMobile ? '100%' : 256,
          minWidth: 0,
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        aria-label="Menu"
        style={{ marginLeft: 'clamp(8px, 3vw, 24px)' }}
      >
        <MenuOutlined style={{ fontSize: 20, color: 'var(--app-primary, #6366f1)' }} />
      </Button>
      <Drawer
        rootClassName="erp-mobile-nav-drawer"
        width={300}
        placement="left"
        closable={false}
        onClose={onClose}
        open={visible}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
