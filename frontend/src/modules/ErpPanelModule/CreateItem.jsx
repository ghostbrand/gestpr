import { useState, useEffect } from 'react';

import { Button, Tag, Form, Divider } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';

import useLanguage from '@/locale/useLanguage';

import { settingsAction } from '@/redux/settings/actions';
import { erp } from '@/redux/erp/actions';
import { selectCreatedItem } from '@/redux/erp/selectors';

import calculate from '@/utils/calculate';
import { sumInvoiceLinesSubtotal } from '@/utils/invoiceLineTotals';
import { generate as uniqueId } from 'shortid';

import Loading from '@/components/Loading';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

function SaveForm({ form }) {
  const translate = useLanguage();
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate('Save')}
    </Button>
  );
}

export default function CreateItem({ config, CreateForm }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);
  let { entity } = config;

  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [offerSubTotal, setOfferSubTotal] = useState(0);
  const handelValuesChange = (changedValues, values) => {
    const items = values['items'];
    let subOfferTotal = 0;

    if (items) {
      items.forEach((item) => {
        if (item?.offerPrice && item.quantity) {
          subOfferTotal = calculate.add(
            subOfferTotal,
            calculate.multiply(item.quantity, item.offerPrice)
          );
        }
      });
      setSubTotal(sumInvoiceLinesSubtotal(items));
      setOfferSubTotal(subOfferTotal);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(erp.resetAction({ actionType: 'create' }));
      setSubTotal(0);
      setOfferSubTotal(0);
      navigate(`/${entity.toLowerCase()}/read/${result._id}`);
    }
    return () => {};
  }, [isSuccess]);

  const onSubmit = (fieldsValue) => {
    if (entity === 'serviceitem' && fieldsValue?.itemKind === 'service') {
      fieldsValue.stockQuantity = 0;
      fieldsValue.minStockLevel = 0;
    }
    if (fieldsValue) {
      if (fieldsValue.items) {
        let newList = [...fieldsValue.items];
        newList.map((item) => {
          const q =
            item.quantity === undefined || item.quantity === null || item.quantity === ''
              ? 1
              : item.quantity;
          item.total = calculate.multiply(q, item.price);
        });
        fieldsValue = {
          ...fieldsValue,
          items: newList,
        };
      }
    }
    dispatch(erp.create({ entity, jsonData: fieldsValue }));
  };

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`);
        }}
        backIcon={<ArrowLeftOutlined />}
        title={config.createPageTitle || translate('New')}
        ghost={false}
        tags={<Tag>{translate('Draft')}</Tag>}
        // subTitle="This is create page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate('Cancel')}
          </Button>,
          <SaveForm form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={config.formInitialValues || {}}
          onFinish={onSubmit}
          onValuesChange={handelValuesChange}
        >
          <CreateForm subTotal={subTotal} offerTotal={offerSubTotal} />
        </Form>
      </Loading>
    </>
  );
}
