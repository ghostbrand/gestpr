import { useSearchParams } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import CreateServiceItemModule from '@/modules/ServiceItemModule/CreateServiceItemModule';

export default function ServiceItemCreate() {
  const entity = 'serviceitem';
  const translate = useLanguage();
  const [params] = useSearchParams();
  const kind = params.get('kind') === 'article' ? 'article' : 'service';

  const Labels = {
    PANEL_TITLE: translate('service_catalog'),
    DATATABLE_TITLE: translate('service_catalog_list'),
    ADD_NEW_ENTITY: translate('add_new_service_item'),
    ENTITY_NAME: translate('service_item'),
    RECORD_ENTITY: translate('record_payment'),
    formInitialValues: {
      itemKind: kind,
      enabled: true,
      stockQuantity: 0,
      minStockLevel: 0,
      unit: 'un',
    },
    createPageTitle: kind === 'article' ? translate('new_article') : translate('new_service'),
  };

  return <CreateServiceItemModule config={{ entity, ...Labels }} />;
}
