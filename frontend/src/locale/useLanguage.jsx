import en_us from '@/locale/translation/en_us';
import ptOverrides from '@/locale/translation/pt_overrides';

const merged = { ...en_us, ...ptOverrides };

function normalizeKey(key) {
  if (typeof key !== 'string') return '';
  return key
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

const useLanguage = () => {
  const translate = (value) => {
    const k = normalizeKey(value);
    if (merged[k]) return merged[k];
    if (typeof value !== 'string') return '';
    const words = value.replace(/_/g, ' ').split(' ');
    return words.map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')).join(' ');
  };

  return translate;
};

export default useLanguage;
