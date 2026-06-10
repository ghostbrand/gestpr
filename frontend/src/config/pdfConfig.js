const PDF_ENTITIES = new Set(['invoice', 'quote', 'payment', 'offer']);

export function entitySupportsPdf(entity) {
  return PDF_ENTITIES.has(String(entity).toLowerCase());
}
