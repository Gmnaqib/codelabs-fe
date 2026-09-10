export const getDayName = (date: Date) => {
  const namaHari = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return namaHari[date.getDay()];
};

export const formatTanggal = (date: Date) =>
  date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

export const formatJam = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });