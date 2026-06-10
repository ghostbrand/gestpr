import { useMemo, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
  EditOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  MailOutlined,
  WalletOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectCurrentItem } from '@/redux/erp/selectors';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';
import { entitySupportsPdf } from '@/config/pdfConfig';
import { useMoney, useDate } from '@/settings';
import useMail from '@/hooks/useMail';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

/** Unifica resposta read (documento plano ou com `invoice` aninhado). */
function normalizeReadResult(result) {
  if (!result) return null;
  const inv = result.invoice;
  if (inv && typeof inv === 'object' && Array.isArray(inv.items)) {
    return {
      ...inv,
      ...result,
      items: inv.items,
      client: inv.client || result.client,
    };
  }
  return { ...result, items: Array.isArray(result.items) ? result.items : [] };
}

function statusTagColor(status) {
  const map = {
    draft: 'default',
    pending: 'processing',
    sent: 'blue',
    accepted: 'success',
    declined: 'error',
    paid: 'success',
    unpaid: 'warning',
    partially: 'orange',
  };
  return map[status] || 'default';
}

export default function ReadItem({ config, selectedItem }) {
  const translate = useLanguage();
  const { entity, ENTITY_NAME, RECORD_ENTITY } = config;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();
  const { send, isLoading: mailInProgress } = useMail({ entity });

  const { result: currentFromStore } = useSelector(selectCurrentItem);
  const raw = currentFromStore ?? selectedItem ?? null;
  const doc = useMemo(() => normalizeReadResult(raw), [raw]);

  const [client, setClient] = useState({});
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (doc?.client) {
      setClient(typeof doc.client === 'object' ? doc.client : {});
    } else {
      setClient({});
    }
  }, [doc]);

  const itemsList = doc?.items || [];

  const itemColumns = useMemo(
    () => [
      {
        title: translate('Item'),
        key: 'name',
        render: (_, row) => (
          <div>
            <Text strong>{row.itemName}</Text>
            {row.description ? (
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {row.description}
                </Text>
              </div>
            ) : null}
          </div>
        ),
      },
      {
        title: translate('Price'),
        dataIndex: 'price',
        align: 'right',
        width: 120,
        render: (v) => moneyFormatter({ amount: v ?? 0, currency_code: doc?.currency }),
      },
      {
        title: translate('Quantity'),
        dataIndex: 'quantity',
        align: 'right',
        width: 100,
      },
      {
        title: translate('Total'),
        dataIndex: 'total',
        align: 'right',
        width: 130,
        render: (v) => (
          <Text strong>{moneyFormatter({ amount: v ?? 0, currency_code: doc?.currency })}</Text>
        ),
      },
    ],
    [translate, moneyFormatter, doc?.currency]
  );

  if (!doc) {
    return null;
  }

  const titleNumber = doc.number != null ? `${doc.number}/${doc.year ?? ''}` : '—';
  const showConvert = entity === 'quote';
  const showRecordPayment =
    entity === 'invoice' && (doc.paymentStatus === 'unpaid' || doc.paymentStatus === 'partially');
  const showMail = entity === 'invoice' || entity === 'quote';
  const clientName = client?.name || doc?.client?.name || translate('customer');
  const clientId = client?._id || doc?.client?._id;

  const openPdf = () => {
    const url = `${DOWNLOAD_BASE_URL}${entity}/${entity}-${doc._id}.pdf`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMail = async () => {
    try {
      await send(doc._id);
    } catch {
      message.error(translate('mail_send_failed'));
    }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      await dispatch(erp.convert({ entity, id: doc._id }));
    } catch {
      /* request layer já notifica em falha */
    } finally {
      setConverting(false);
    }
  };

  const summaryCards = (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={12} md={6}>
        <Card size="small" className="erp-detail-stat-card" bordered>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {translate('Sub Total')}
          </Text>
          <Title level={4} style={{ margin: '4px 0 0' }}>
            {moneyFormatter({ amount: doc.subTotal ?? 0, currency_code: doc.currency })}
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card size="small" className="erp-detail-stat-card" bordered>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {translate('Tax Total')} ({doc.taxRate ?? 0}%)
          </Text>
          <Title level={4} style={{ margin: '4px 0 0' }}>
            {moneyFormatter({ amount: doc.taxTotal ?? 0, currency_code: doc.currency })}
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card size="small" className="erp-detail-stat-card erp-detail-stat-card--accent" bordered>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {translate('Total')}
          </Text>
          <Title level={4} style={{ margin: '4px 0 0', color: 'var(--app-primary-dark, #082f47)' }}>
            {moneyFormatter({ amount: doc.total ?? 0, currency_code: doc.currency })}
          </Title>
        </Card>
      </Col>
      {entity === 'invoice' ? (
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="erp-detail-stat-card" bordered>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {translate('Paid')}
            </Text>
            <Title level={4} style={{ margin: '4px 0 0' }}>
              {moneyFormatter({ amount: doc.credit ?? 0, currency_code: doc.currency })}
            </Title>
          </Card>
        </Col>
      ) : null}
    </Row>
  );

  return (
    <div className="erp-read-detail">
      <PageHeader
        className="erp-datatable__header erp-read-detail__header"
        onBack={() => navigate(`/${entity.toLowerCase()}`)}
        title={
          <Space align="center" wrap>
            <span>{`${ENTITY_NAME} # ${titleNumber}`}</span>
            {doc.status ? (
              <Tag color={statusTagColor(doc.status)}>{translate(doc.status)}</Tag>
            ) : null}
            {doc.paymentStatus ? (
              <Tag color={statusTagColor(doc.paymentStatus)}>
                {translate(doc.paymentStatus)}
              </Tag>
            ) : null}
          </Space>
        }
        ghost={false}
        extra={
          <Space wrap size="small">
            <Button
              key="close"
              onClick={() => navigate(`/${entity.toLowerCase()}`)}
              icon={<CloseCircleOutlined />}
            >
              {translate('Close')}
            </Button>
            {entitySupportsPdf(entity) ? (
              <Tooltip title={translate('download_pdf')}>
                <Button key="pdf" onClick={openPdf} icon={<FilePdfOutlined />}>
                  PDF
                </Button>
              </Tooltip>
            ) : null}
            {showMail ? (
              <Tooltip title={translate('Send by Email')}>
                <Button
                  key="mail"
                  loading={mailInProgress}
                  onClick={handleMail}
                  icon={<MailOutlined />}
                >
                  {translate('email')}
                </Button>
              </Tooltip>
            ) : null}
            {showConvert ? (
              <Button
                key="convert"
                loading={converting}
                onClick={handleConvert}
                icon={<RetweetOutlined />}
              >
                {translate('Convert to Invoice')}
              </Button>
            ) : null}
            {showRecordPayment ? (
              <Button
                key="pay"
                type="default"
                icon={<WalletOutlined />}
                onClick={() => navigate(`/invoice/pay/${doc._id}`)}
              >
                {RECORD_ENTITY || translate('record_payment')}
              </Button>
            ) : null}
            <Button
              key="edit"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                dispatch(erp.currentAction({ actionType: 'update', data: doc }));
                navigate(`/${entity.toLowerCase()}/update/${doc._id}`);
              }}
            >
              {translate('Edit')}
            </Button>
          </Space>
        }
      />

      {summaryCards}

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>{translate('customer')}</span>
              </Space>
            }
            className="erp-detail-card"
            variant="borderless"
          >
            <Title level={5} style={{ marginTop: 0 }}>
              {clientId ? (
                <Link to={`/customer/read/${clientId}`}>{clientName}</Link>
              ) : (
                clientName
              )}
            </Title>
            <Descriptions column={1} size="small" colon={false}>
              <Descriptions.Item label={translate('Address')}>
                {client.address || '—'}
              </Descriptions.Item>
              <Descriptions.Item label={translate('email')}>
                {client.email ? (
                  <a href={`mailto:${client.email}`}>{client.email}</a>
                ) : (
                  '—'
                )}
              </Descriptions.Item>
              <Descriptions.Item label={translate('Phone')}>
                {client.phone ? <a href={`tel:${client.phone}`}>{client.phone}</a> : '—'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>{translate('Date')}</span>
              </Space>
            }
            className="erp-detail-card"
            variant="borderless"
          >
            <Descriptions column={{ xs: 1, sm: 2 }} size="small">
              <Descriptions.Item label={translate('Date')}>
                {doc.date ? dayjs(doc.date).format(dateFormat) : '—'}
              </Descriptions.Item>
              <Descriptions.Item label={translate('Expire Date')}>
                {doc.expiredDate ? dayjs(doc.expiredDate).format(dateFormat) : '—'}
              </Descriptions.Item>
              {doc.notes ? (
                <Descriptions.Item label={translate('Note')} span={2}>
                  {doc.notes}
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card
        title={translate('Product')}
        className="erp-detail-lines-card"
        variant="borderless"
        style={{ marginTop: 8 }}
      >
        <Table
          rowKey={(row, index) => row._id || `line-${index}`}
          columns={itemColumns}
          dataSource={itemsList}
          pagination={false}
          size="middle"
          locale={{ emptyText: translate('no_line_items') }}
        />
        <Divider style={{ margin: '16px 0' }} />
        <Row justify="end">
          <Col xs={24} sm={16} md={10} lg={8}>
            <div className="erp-detail-totals-block">
              <Row justify="space-between" gutter={[8, 8]}>
                <Col>
                  <Text type="secondary">{translate('Sub Total')}</Text>
                </Col>
                <Col>
                  <Text strong>
                    {moneyFormatter({ amount: doc.subTotal ?? 0, currency_code: doc.currency })}
                  </Text>
                </Col>
                <Col span={24} />
                <Col>
                  <Text type="secondary">
                    {translate('Tax Total')} ({doc.taxRate ?? 0}%)
                  </Text>
                </Col>
                <Col>
                  <Text strong>
                    {moneyFormatter({ amount: doc.taxTotal ?? 0, currency_code: doc.currency })}
                  </Text>
                </Col>
                <Col span={24} />
                <Col>
                  <Text strong style={{ fontSize: 16 }}>
                    {translate('Total')}
                  </Text>
                </Col>
                <Col>
                  <Text strong className="erp-detail-total-final">
                    {moneyFormatter({ amount: doc.total ?? 0, currency_code: doc.currency })}
                  </Text>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
