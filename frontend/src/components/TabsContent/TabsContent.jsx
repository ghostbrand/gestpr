import { Tabs, Row } from 'antd';

const SettingsPanel = ({ children }) => (
  <div className="settings-tab-panel glass-card animate-fade-up">{children}</div>
);

const SettingsNav = ({ pageTitle, children }) => (
  <div className="settings-nav">
    <div className="settings-nav__header glass-card">
      <h2 className="erp-page-title">{pageTitle}</h2>
      <p className="settings-nav__hint">Configuração do sistema</p>
    </div>
    <div className="settings-nav__menu glass-card">{children}</div>
  </div>
);

export default function TabsContent({ content, defaultActiveKey, pageTitle }) {
  const items = content.map((item, index) => ({
    key: item.key ? item.key : `${index}_${item.label.replace(/ /g, '_')}`,
    label: (
      <span className="settings-tab-label">
        {item.icon}
        <span>{item.label}</span>
      </span>
    ),
    children: <SettingsPanel>{item.children}</SettingsPanel>,
  }));

  const renderTabBar = (props, DefaultTabBar) => (
    <SettingsNav pageTitle={pageTitle}>
      <DefaultTabBar {...props} />
    </SettingsNav>
  );

  return (
    <Row gutter={[24, 24]} className="settings-page tabContent animate-fade-up">
      <Tabs
        tabPosition="right"
        defaultActiveKey={defaultActiveKey}
        hideAdd
        items={items}
        renderTabBar={renderTabBar}
        className="settings-tabs"
      />
    </Row>
  );
}
