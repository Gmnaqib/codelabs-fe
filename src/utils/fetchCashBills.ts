import Papa from "papaparse";

export interface CashBill {
  [key: string]: string;
}

export async function fetchCashBillsData(): Promise<CashBill[]> {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRk2Uf9PCohnVcHGeGa7JZsWUaKbL6gAjXYvNHz6im51YUqJ_V7Qc0KUzClKOi2eKdfY6iuyOW1XBFV/pub?gid=1470408104&output=csv";
  const response = await fetch(url);
  const csvText = await response.text();

  return new Promise<CashBill[]>((resolve) => {
    Papa.parse<CashBill>(csvText, {
      header: true,
      complete: (results: Papa.ParseResult<CashBill>) => {
        resolve(results.data as CashBill[]);
      },
    });
  });
}