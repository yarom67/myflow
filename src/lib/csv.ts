import Papa from 'papaparse';

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const all = results.data as string[][];
        if (all.length < 2) { reject(new Error('CSV ריק')); return; }
        const headers = all[0]!.map((h) => h.trim());
        const rows = all.slice(1);
        resolve({ headers, rows });
      },
      error: (err) => reject(err),
    });
  });
}

export interface ColumnMapping {
  date: number;
  amount: number;
  description: number;
  type?: number;
}

export function mapRows(rows: string[][], mapping: ColumnMapping, defaultCategoryId: string) {
  return rows.map((row) => {
    const raw = row[mapping.amount] ?? '';
    const amount = Math.abs(parseFloat(raw.replace(/[^0-9.-]/g, '')) || 0);
    const dateRaw = row[mapping.date] ?? '';
    // Try to parse various date formats
    const dateParsed = parseDateString(dateRaw);
    const type = mapping.type !== undefined
      ? (parseFloat((row[mapping.type] ?? '0').replace(/[^0-9.-]/g, '')) < 0 ? 'expense' : 'income')
      : (parseFloat(raw.replace(/[^0-9.-]/g, '')) < 0 ? 'expense' : 'income');

    return {
      date: dateParsed,
      amount,
      type: type as 'income' | 'expense',
      description: (row[mapping.description] ?? '').trim(),
      categoryId: defaultCategoryId,
    };
  }).filter((r) => r.amount > 0 && r.date);
}

function parseDateString(s: string): string {
  s = s.trim();
  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2]!.padStart(2, '0')}-${dmy[1]!.padStart(2, '0')}`;
  // YYYY-MM-DD
  const iso = s.match(/^\d{4}-\d{2}-\d{2}$/);
  if (iso) return s;
  // MM/DD/YYYY
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mdy) return `${mdy[3]}-${mdy[1]!.padStart(2, '0')}-${mdy[2]!.padStart(2, '0')}`;
  return '';
}
