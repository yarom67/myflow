import { useMemo } from 'react';
import { useSettings } from '../db/hooks';

export function useCurrency() {
  const settings = useSettings();
  const currency = settings?.currency ?? 'ILS';

  const formatter = useMemo(() => {
    const locale = currency === 'ILS' ? 'he-IL' : currency === 'EUR' ? 'de-DE' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, [currency]);

  return {
    format: (amount: number) => formatter.format(amount),
    currency,
    symbol: currency === 'ILS' ? '₪' : currency === 'EUR' ? '€' : '$',
  };
}
