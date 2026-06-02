import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';

export default function ServiceItemDataTableModule({ config, tabs = null }) {
  return (
    <ErpLayout>
      {tabs}
      <ErpPanel config={config} />
    </ErpLayout>
  );
}
