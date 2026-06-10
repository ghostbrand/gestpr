import { ConfigProvider, theme } from 'antd';
import ptPT from 'antd/locale/pt_PT';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      locale={ptPT}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          colorInfo: '#06b6d4',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#f43f5e',
          colorLink: '#6366f1',
          borderRadius: 12,
          borderRadiusLG: 18,
          borderRadiusSM: 8,
          fontFamily:
            '"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          colorBgLayout: 'transparent',
          colorText: '#0f172a',
          colorTextSecondary: '#64748b',
          colorBorderSecondary: 'rgba(99, 102, 241, 0.14)',
          wireframe: false,
          motionDurationMid: '0.22s',
          motionEaseInOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
        components: {
          Layout: {
            headerBg: 'transparent',
            bodyBg: 'transparent',
            siderBg: 'transparent',
          },
          Button: {
            primaryShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
            controlHeight: 42,
            borderRadius: 12,
            fontWeight: 600,
          },
          Menu: {
            itemHeight: 44,
            itemBorderRadius: 10,
            itemMarginInline: 8,
            iconSize: 18,
            itemSelectedBg: 'rgba(99, 102, 241, 0.12)',
            itemSelectedColor: '#6366f1',
            itemHoverBg: 'rgba(99, 102, 241, 0.06)',
          },
          Card: {
            borderRadiusLG: 16,
            paddingLG: 20,
          },
          Table: {
            borderRadiusLG: 14,
            headerBg: 'rgba(99, 102, 241, 0.06)',
            rowHoverBg: 'rgba(99, 102, 241, 0.04)',
          },
          Input: {
            controlHeight: 44,
            borderRadius: 10,
          },
          Form: {
            labelFontSize: 14,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
