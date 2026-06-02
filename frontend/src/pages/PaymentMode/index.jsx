import useLanguage from '@/locale/useLanguage';
import PaymentModeDataTableModule from '@/modules/PaymentModeModule/PaymentModeDataTableModule';

export default function PaymentMode() {
  const translate = useLanguage();
  const entity = 'paymentmode';

  const searchConfig = {
    entity: 'paymentmode',
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];
  const dataTableColumns = [
    { title: translate('Payment Mode'), dataIndex: 'name' },
    { title: translate('Description'), dataIndex: 'description' },
    { title: translate('enabled'), dataIndex: 'enabled' },
    { title: translate('default_mode'), dataIndex: 'isDefault' },
  ];

  const Labels = {
    PANEL_TITLE: translate('payments_mode'),
    DATATABLE_TITLE: translate('payment_mode_list'),
    ADD_NEW_ENTITY: translate('add_new_payment_mode'),
    ENTITY_NAME: translate('payment_mode'),
    RECORD_ENTITY: translate('record_payment'),
  };

  const config = {
    entity,
    ...Labels,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <PaymentModeDataTableModule config={config} />;
}
