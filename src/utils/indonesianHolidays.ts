export const indonesianHolidays2026: string[] = [
  '2026-01-01', // Tahun Baru 
  '2026-01-16', // Isra Miraj
  '2026-02-16', // Cuti Tahun Baru Imlek
  '2026-02-17', // Tahun Baru Imlek
  '2026-03-18', // Cuti Hari Raya Nyepi
  '2026-03-19', // Hari Raya Nyepi
  '2026-03-20', // Cuti Idul Fitri
  '2026-03-21', // Idul Fitri
  '2026-03-22', // Idul Fitri
  '2026-03-23', // Idul Fitri
  '2026-03-24', // Idul Fitri
  '2026-04-03', // Wafat Isa Almasih
  '2026-05-01', // Hari Buruh
  '2026-05-14', // Kenaikan Isa Almasih
  '2026-05-15', // Cuti Kenaikan Isa Almasih
  '2026-05-27', // Idul Adha
  '2026-05-28', // Idul Adha
  '2026-06-01', // Hari Lahir Pancasila
  '2026-06-16', // Satu Muharam
  '2026-08-17', // Hari Kemerdekaan RI
  '2026-08-25', // Maulid Nabi Muhammad SAW
  '2026-12-24', // Cuti Hari Natal
  '2026-12-25', // Hari Natal
];

export function isIndonesianHoliday(date: Date): boolean {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const key = `${y}-${m}-${d}`;
  return indonesianHolidays2026.includes(key);
}
