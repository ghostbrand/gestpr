import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import TaxForm from '@/forms/TaxForm';

export default function CreateTaxesModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={TaxForm} />
    </ErpLayout>
  );
}
