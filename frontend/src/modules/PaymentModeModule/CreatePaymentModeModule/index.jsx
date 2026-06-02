import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import PaymentModeForm from '@/forms/PaymentModeForm';

export default function CreatePaymentModeModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={PaymentModeForm} />
    </ErpLayout>
  );
}
