// Convert cardinal number to friendly ordinal numbers for display (English)
export function cardToOrd(card: int) {
  const lut = new Map([
    [0, ""],
    [1, "First"],
    [2, "Second"],
    [3, "Third"],
    [4, "Fourth"],
    [5, "Fifth"],
    [6, "Sixth"],
    [7, "Seventh"],
    [8, "Eighth"],
    [9, "Ninth"],
    [10, "Tenth"],
    [11, "Eleventh"],
    [12, "Twelfth"],
    [21, "21st"],
    [22, "22nd"],
  ]);

  if (!lut.has(card)) {
    return card + "th";
  }
  return lut.get(card);
}
