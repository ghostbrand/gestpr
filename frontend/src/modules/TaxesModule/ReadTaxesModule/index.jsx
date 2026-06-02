import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import useLanguage from '@/locale/useLanguage';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function ReadTaxesModule({ config }) {
  const translate = useLanguage();
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
        title={translate('taxes')}
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
        <Descriptions.Item label={translate('name')}>{result.taxName}</Descriptions.Item>
        <Descriptions.Item label={translate('Value')}>{result.taxValue}</Descriptions.Item>
        <Descriptions.Item label={translate('enabled')}>{String(result.enabled)}</Descriptions.Item>
        <Descriptions.Item label={translate('default')}>{String(result.isDefault)}</Descriptions.Item>
      </Descriptions>
    </ErpLayout>
  );
}
