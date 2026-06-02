import { ConfigProvider, theme } from 'antd';
import ptPT from 'antd/locale/pt_PT';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      locale={ptPT}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0c4a6e',
          colorInfo: '#0369a1',
          colorSuccess: '#0d9488',
          colorWarning: '#ca8a04',
          colorError: '#dc2626',
          colorLink: '#0369a1',
          borderRadius: 12,
          borderRadiusLG: 18,
          borderRadiusSM: 8,
          fontFamily:
            '"Plus Jakarta Sans", "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          colorBgLayout: 'transparent',
          colorText: '#0f172a',
          colorTextSecondary: '#64748b',
          colorBorderSecondary: '#cbd5e1',
          wireframe: false,
        },
        components: {
          Layout: {
            headerBg: 'transparent',
            bodyBg: 'transparent',
            siderBg: '#f0f4fa',
          },
          Button: {
            primaryShadow: '0 2px 0 rgba(12, 74, 110, 0.12)',
            controlHeight: 40,
            borderRadius: 12,
          },
          Menu: {
            itemHeight: 44,
            itemBorderRadius: 10,
            itemMarginInline: 8,
            iconSize: 18,
            collapsedIconSize: 18,
            itemSelectedBg: 'rgba(12, 74, 110, 0.12)',
            itemSelectedColor: '#0c4a6e',
            itemHoverBg: 'rgba(12, 74, 110, 0.06)',
          },
          Card: {
            borderRadiusLG: 16,
          },
          Table: {
            borderRadiusLG: 14,
            headerBg: '#e8eef5',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
