import { useState, useMemo } from 'react';
import { Tabs } from 'antd';
import useLanguage from '@/locale/useLanguage';
import ServiceItemDataTableModule from '@/modules/ServiceItemModule/ServiceItemDataTableModule';

export default function ServiceItem() {
  const translate = useLanguage();
  const entity = 'serviceitem';
  const [tab, setTab] = useState('all');

  const listOptions = useMemo(() => {
    if (tab === 'all') return {};
    return { filter: 'itemKind', equal: tab };
  }, [tab]);

  const searchConfig = {
    entity: 'serviceitem',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];
  const dataTableColumns = [
    {
      title: translate('item_kind_short'),
      dataIndex: 'itemKind',
      render: (v) => (v === 'article' ? translate('item_kind_article') : translate('item_kind_service')),
    },
    { title: translate('service_item_name'), dataIndex: 'name' },
    { title: translate('Description'), dataIndex: 'description', ellipsis: true },
    {
      title: translate('Price'),
      dataIndex: 'price',
      onCell: () => ({
        style: { textAlign: 'right', whiteSpace: 'nowrap' },
      }),
    },
    {
      title: translate('stock_quantity'),
      dataIndex: 'stockQuantity',
      render: (v, row) => (row.itemKind === 'article' ? v ?? 0 : '—'),
    },
    { title: translate('enabled'), dataIndex: 'enabled' },
  ];

  const Labels = {
    PANEL_TITLE: translate('service_catalog'),
    DATATABLE_TITLE: translate('service_catalog_list'),
    ADD_NEW_ENTITY: translate('add_new_service_item'),
    ENTITY_NAME: translate('service_item'),
    RECORD_ENTITY: translate('record_payment'),
    listOptions,
    splitCreate: {
      service: '/serviceitem/create?kind=service',
      article: '/serviceitem/create?kind=article',
      labelService: translate('new_service'),
      labelArticle: translate('new_article'),
    },
  };

  const config = {
    entity,
    ...Labels,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  const tabsEl = (
    <Tabs
      activeKey={tab}
      onChange={setTab}
      style={{ marginBottom: 16 }}
      items={[
        { key: 'all', label: translate('tab_catalog_all') },
        { key: 'service', label: translate('item_kind_service') },
        { key: 'article', label: translate('item_kind_article') },
      ]}
    />
  );

  return <ServiceItemDataTableModule key={tab} config={config} tabs={tabsEl} />;
}
