export interface Ranking {
  point: string;
  [key: string]: unknown;
}

export const sortRangkings = (data: Ranking[], filter: string) => {
  const getPoint = (p: string) => parseFloat(p.replace(",", ".").replace("%", ""));
  return [...data].sort((a, b) =>
    filter === "highest" ? getPoint(b.point) - getPoint(a.point) : getPoint(a.point) - getPoint(b.point)
  );
};