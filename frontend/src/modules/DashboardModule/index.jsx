import { useEffect } from 'react';
import { Row, Col } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';
import RecentTable from './components/RecentTable';
import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({ entity, options: { currency } });
  };

  const { result: invoiceResult, isLoading: invoiceLoading, onFetch: fetchInvoicesStats } =
    useOnFetch();
  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();
  const { result: paymentResult, isLoading: paymentLoading, onFetch: fetchPayemntsStats } =
    useOnFetch();
  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;
    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPayemntsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [money_format_settings.default_currency_code]);

  const dataTableColumns = [
    { title: translate('number'), dataIndex: 'number' },
    { title: translate('Client'), dataIndex: ['client', 'name'] },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({
        style: { textAlign: 'right', whiteSpace: 'nowrap', direction: 'ltr' },
      }),
      render: (total, record) =>
        moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    { title: translate('Status'), dataIndex: 'status' },
  ];

  const entityData = [
    { result: invoiceResult, isLoading: invoiceLoading, entity: 'invoice', title: translate('Invoices') },
    { result: quoteResult, isLoading: quoteLoading, entity: 'quote', title: translate('quote') },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;
    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            value: item?.percentage,
          }))
        }
      />
    );
  });

  if (!money_format_settings) return null;

  return (
    <div className="dashboard-grid animate-fade-up">
      <Row gutter={[24, 24]}>
        <SummaryCard
          variant="invoice"
          title={translate('Invoices')}
          prefix={translate('This month')}
          isLoading={invoiceLoading}
          data={invoiceResult?.total}
        />
        <SummaryCard
          variant="quote"
          title={translate('Quote')}
          prefix={translate('This month')}
          isLoading={quoteLoading}
          data={quoteResult?.total}
        />
        <SummaryCard
          variant="paid"
          title={translate('paid')}
          prefix={translate('This month')}
          isLoading={paymentLoading}
          data={paymentResult?.total}
        />
        <SummaryCard
          variant="unpaid"
          title={translate('Unpaid')}
          prefix={translate('Not Paid')}
          isLoading={invoiceLoading}
          data={invoiceResult?.total_undue}
        />
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <div className="glass-card" style={{ padding: '24px 20px', minHeight: 400 }}>
            <Row gutter={[0, 0]}>{statisticCards}</Row>
          </div>
        </Col>
        <Col xs={24} lg={6}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active}
            newCustomer={clientResult?.new}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="glass-card" style={{ padding: '24px 20px' }}>
            <h3 className="section-title">{translate('Recent Invoices')}</h3>
            <RecentTable entity="invoice" dataTableColumns={dataTableColumns} />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="glass-card" style={{ padding: '24px 20px' }}>
            <h3 className="section-title">{translate('Recent Quotes')}</h3>
            <RecentTable entity="quote" dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </div>
  );
}
