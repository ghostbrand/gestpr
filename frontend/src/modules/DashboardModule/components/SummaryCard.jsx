import { Col, Spin } from 'antd';
import {
  FileTextOutlined,
  FileSyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const ICONS = {
  invoice: { icon: <FileTextOutlined />, cls: 'stat-card__icon--indigo' },
  quote: { icon: <FileSyncOutlined />, cls: 'stat-card__icon--cyan' },
  paid: { icon: <CheckCircleOutlined />, cls: 'stat-card__icon--violet' },
  unpaid: { icon: <ClockCircleOutlined />, cls: 'stat-card__icon--gold' },
};

export default function SummaryCard({ title, data, prefix, isLoading = false, variant = 'invoice' }) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const iconMeta = ICONS[variant] || ICONS.invoice;

  const formatted = moneyFormatter({
    amount: data || 0,
    currency_code: money_format_settings?.default_currency_code,
  });

  return (
    <Col className="gutter-row animate-fade-up" xs={24} sm={12} md={12} lg={6}>
      <div className="glass-card glass-card--stat stat-card">
        <div className="stat-card__header">
          <span className="stat-card__title">{title}</span>
          <div className={`stat-card__icon ${iconMeta.cls}`}>{iconMeta.icon}</div>
        </div>
        <div className="stat-card__prefix">{prefix}</div>
        {isLoading ? (
          <Spin />
        ) : (
          <div className="stat-card__value">{formatted}</div>
        )}
      </div>
    </Col>
  );
}
