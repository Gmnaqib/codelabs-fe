import Papa from "papaparse";

export async function fetchCashBillsData() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRk2Uf9PCohnVcHGeGa7JZsWUaKbL6gAjXYvNHz6im51YUqJ_V7Qc0KUzClKOi2eKdfY6iuyOW1XBFV/pub?gid=1470408104&output=csv";
  const response = await fetch(url);
  const csvText = await response.text();
  console.log('[fetchCashBills] CSV Response:', csvText);

  return new Promise<any[]>((resolve) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results: Papa.ParseResult<any>) => {
        console.log('[fetchCashBills] Parsed Data:', results.data);
        resolve(results.data as any[]);
      },
    });
  });
}