import calculate from '@/utils/calculate';

/** Quantidade em falta no objeto do form = 1 (valor por defeito na linha). */
export function effectiveLineQuantity(item) {
  if (!item) return 1;
  const raw = item.quantity;
  if (raw === undefined || raw === null || raw === '') return 1;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 1;
}

export function effectiveLinePrice(item) {
  if (!item) return NaN;
  const raw = item.price;
  if (raw === undefined || raw === null || raw === '') return NaN;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

/** Soma subtotal das linhas de fatura/orçamento (preço × quantidade; qtd omissa = 1). */
export function sumInvoiceLinesSubtotal(items) {
  if (!items?.length) return 0;
  let subTotal = 0;
  for (const item of items) {
    if (!item) continue;
    const price = effectiveLinePrice(item);
    if (!Number.isFinite(price)) continue;
    const qty = effectiveLineQuantity(item);
    subTotal = calculate.add(subTotal, calculate.multiply(price, qty));
  }
  return subTotal;
}
