import useLanguage from '@/locale/useLanguage';
import CreateQuoteModule from '@/modules/QuoteModule/CreateQuoteModule';

export default function QuoteCreate() {
  const entity = 'quote';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('quote'),
    DATATABLE_TITLE: translate('quote_list'),
    ADD_NEW_ENTITY: translate('add_new_quote'),
    ENTITY_NAME: translate('quote'),
    RECORD_ENTITY: translate('record_payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateQuoteModule config={configPage} />;
}
