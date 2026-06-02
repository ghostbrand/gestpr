import useLanguage from '@/locale/useLanguage';
import ReadTaxesModule from '@/modules/TaxesModule/ReadTaxesModule';

export default function TaxesRead() {
  const entity = 'taxes';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('taxes'),
    DATATABLE_TITLE: translate('taxes_list'),
    ADD_NEW_ENTITY: translate('add_new_tax'),
    ENTITY_NAME: translate('taxes'),
    RECORD_ENTITY: translate('record_payment'),
  };

  return <ReadTaxesModule config={{ entity, ...Labels }} />;
}
