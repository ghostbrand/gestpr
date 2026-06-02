import useLanguage from '@/locale/useLanguage';
import UpdateServiceItemModule from '@/modules/ServiceItemModule/UpdateServiceItemModule';

export default function ServiceItemUpdate() {
  const entity = 'serviceitem';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('service_catalog'),
    DATATABLE_TITLE: translate('service_catalog_list'),
    ADD_NEW_ENTITY: translate('add_new_service_item'),
    ENTITY_NAME: translate('service_item'),
    RECORD_ENTITY: translate('record_payment'),
  };

  return <UpdateServiceItemModule config={{ entity, ...Labels }} />;
}
