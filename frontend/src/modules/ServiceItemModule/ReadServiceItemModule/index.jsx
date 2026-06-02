import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function ReadServiceItemModule({ config }) {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(erp.read({ entity: config.entity, id }));
  }, [id, config.entity, dispatch]);

  const { result, isSuccess, isLoading = true } = useSelector(selectReadItem);

  if (isLoading) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  }

  if (!isSuccess || !result) {
    return (
      <ErpLayout>
        <NotFound entity={config.entity} />
      </ErpLayout>
    );
  }

  return (
    <ErpLayout>
      <PageHeader
        onBack={() => navigate(`/${config.entity}`)}
        backIcon={<ArrowLeftOutlined />}
        title={translate('service_catalog')}
        extra={[
          <Button
            key="edit"
            type="primary"
            onClick={() => navigate(`/${config.entity}/update/${result._id}`)}
          >
            {translate('update')}
          </Button>,
        ]}
      />
      <Descriptions bordered column={1} style={{ marginTop: 16 }}>
        <Descriptions.Item label={translate('item_kind_label')}>
          {result.itemKind === 'article'
            ? translate('item_kind_article')
            : translate('item_kind_service')}
        </Descriptions.Item>
        <Descriptions.Item label={translate('service_item_name')}>{result.name}</Descriptions.Item>
        <Descriptions.Item label={translate('Description')}>
          {result.description || '—'}
        </Descriptions.Item>
        <Descriptions.Item label={translate('Price')}>
          {moneyFormatter({ amount: result.price })}
        </Descriptions.Item>
        {result.itemKind === 'article' ? (
          <>
            <Descriptions.Item label={translate('sku_label')}>{result.sku || '—'}</Descriptions.Item>
            <Descriptions.Item label={translate('stock_quantity')}>
              {result.stockQuantity ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label={translate('min_stock_level')}>
              {result.minStockLevel ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label={translate('unit_label')}>{result.unit || 'un'}</Descriptions.Item>
          </>
        ) : null}
        <Descriptions.Item label={translate('enabled')}>{String(result.enabled)}</Descriptions.Item>
      </Descriptions>
    </ErpLayout>
  );
}
