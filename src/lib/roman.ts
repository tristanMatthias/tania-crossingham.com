const TABLE: [number, string][] = [
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function roman(n: number): string {
  let out = '';
  for (const [value, symbol] of TABLE) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}
