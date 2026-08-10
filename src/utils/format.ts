export const fmt = (n: number): string =>
  "Rs " + n.toLocaleString("en-LK", { minimumFractionDigits: 2 });
