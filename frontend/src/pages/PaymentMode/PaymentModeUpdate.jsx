import useLanguage from '@/locale/useLanguage';
import UpdatePaymentModeModule from '@/modules/PaymentModeModule/UpdatePaymentModeModule';

export default function PaymentModeUpdate() {
  const entity = 'paymentmode';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('payments_mode'),
    DATATABLE_TITLE: translate('payment_mode_list'),
    ADD_NEW_ENTITY: translate('add_new_payment_mode'),
    ENTITY_NAME: translate('payment_mode'),
    RECORD_ENTITY: translate('record_payment'),
  };

  return <UpdatePaymentModeModule config={{ entity, ...Labels }} />;
}
