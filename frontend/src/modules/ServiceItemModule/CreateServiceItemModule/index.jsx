import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import ServiceItemForm from '@/forms/ServiceItemForm';

export default function CreateServiceItemModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={ServiceItemForm} />
    </ErpLayout>
  );
}
