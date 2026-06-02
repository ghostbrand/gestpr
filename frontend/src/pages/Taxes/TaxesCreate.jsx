import useLanguage from '@/locale/useLanguage';
import CreateTaxesModule from '@/modules/TaxesModule/CreateTaxesModule';

export default function TaxesCreate() {
  const entity = 'taxes';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
    RECORD_ENTITY: translate('record_payment'),
  };

  return <CreateTaxesModule config={{ entity, ...Labels }} />;
}
