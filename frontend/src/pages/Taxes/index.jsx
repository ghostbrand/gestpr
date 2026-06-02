import useLanguage from '@/locale/useLanguage';
import TaxesDataTableModule from '@/modules/TaxesModule/TaxesDataTableModule';

export default function Taxes() {
  const translate = useLanguage();
  const entity = 'taxes';

  const searchConfig = {
    entity: 'taxes',
    displayLabels: ['taxName'],
    searchFields: 'taxName',
  };
  const deleteModalLabels = ['taxName'];
  const dataTableColumns = [
    { title: translate('name'), dataIndex: 'taxName' },
    { title: translate('Value'), dataIndex: 'taxValue' },
    { title: translate('enabled'), dataIndex: 'enabled' },
    { title: translate('default'), dataIndex: 'isDefault' },
  ];

  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
    RECORD_ENTITY: translate('record_payment'),
  };

  const config = {
    entity,
    ...Labels,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <TaxesDataTableModule config={config} />;
}
