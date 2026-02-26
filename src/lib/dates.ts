const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export function getHebrewMonth(monthIndex: number): string {
  return hebrewMonths[monthIndex] ?? '';
}

export function getHebrewDay(dayIndex: number): string {
  return hebrewDays[dayIndex] ?? '';
}

export function formatHebrewDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${hebrewMonths[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  return `${hebrewMonths[parseInt(month!) - 1]} ${year}`;
}

export function getPreviousMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  if (month === 1) return `${year! - 1}-12`;
  return `${year}-${String(month! - 1).padStart(2, '0')}`;
}

export function getNextMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  if (month === 12) return `${year! + 1}-01`;
  return `${year}-${String(month! + 1).padStart(2, '0')}`;
}

export function getMonthDateRange(monthStr: string): { start: string; end: string } {
  const [year, month] = monthStr.split('-').map(Number);
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year!, month!, 0).getDate();
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

export function getDaysLeftInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

export function getDaysInMonth(monthStr: string): number {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year!, month!, 0).getDate();
}

export function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function groupByDate<T extends { date: string }>(items: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.date;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return groups;
}
