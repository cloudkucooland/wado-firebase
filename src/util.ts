// Convert cardinal number to friendly ordinal numbers for display (English)
export function cardToOrd(card: number) {
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

export const locations = Array(
  "COMMENDATION",
  "COMPLINE-CHAPTER",
  "COMPLINE-CONCLUDING",
  "COMPLINE-HYMN",
  "COMPLINE-OPENING",
  "COMPLINE-PRAYER",
  "COMPLINE-PSALTER",
  "COMPLINE-PSALTER-PREFIX",
  "DIURNAL-OPENING",
  "FORGIVEN",
  "GENERAL-DISMISSAL",
  "GENERAL-GLORIA",
  "GENERAL-LORDS",
  "GENERAL-RESPONSE-SCRIPTURE",
  "GENERAL-WITHYOU",
  "GENERAL-ZECHARIAH",
  "KYRIE",
  "LAUDS-BENEDICTION",
  "LAUDS-COLLECT-FINAL",
  "LAUDS-COLLECT1",
  "LAUDS-COLLECT2",
  "LAUDS-DISMISSAL",
  "LAUDS-GLORIA",
  "LAUDS-HYMN1",
  "LAUDS-HYMN2",
  "LAUDS-LECTIONARY",
  "LAUDS-LECTIONARY-HEARWHATSAYING",
  "LAUDS-LECTIONARY2",
  "LAUDS-OPENING",
  "LAUDS-PSALM",
  "LAUDS-PSALTER-ANTIPHON",
  "LAUDS-REMEMBRANCEBAPTISM",
  "LAUDS-SEASONAL",
  "LAUDS-SUPPLICATION",
  "MAGNIFICAT",
  "NONE-CHAPTER",
  "NONE-CONCLUDING",
  "NONE-DISMISSAL",
  "NONE-PRAYER",
  "NONE-PSALTER",
  "OSL",
  "PHOS-HILARON",
  "SEXT-CHAPTER",
  "SEXT-CONCLUDING",
  "SEXT-DISMISSAL",
  "SEXT-PRAYER",
  "SEXT-PSALTER",
  "SIMEON",
  "TERCE-CHAPTER",
  "TERCE-CONCLUDING",
  "TERCE-PRAYER",
  "TERCE-PSALTER",
  "UNSET",
  "VESPER-ANTIPHON",
  "VESPER-BENEDICTION",
  "VESPER-COLLECT1",
  "VESPER-COLLECT2",
  "VESPER-COLLECT3",
  "VESPER-CONFESSION",
  "VESPER-DISMISSAL",
  "VESPER-GLORIA",
  "VESPER-HEARWORD",
  "VESPER-HYMN",
  "VESPER-LECTIONARY",
  "VESPER-PARDON",
  "VESPER-PSALM",
  "VESPER-SUPPLICATION",
  "VESPERS-LIGHT",
  "VIGIL-ASSURANCE",
  "VIGIL-BENEDICTION",
  "VIGIL-BLESSING",
  "VIGIL-CANTICLE",
  "VIGIL-CANTICLE-RESURRECTION",
  "VIGIL-CANTICLE1",
  "VIGIL-CANTICLE2",
  "VIGIL-CANTICLE3",
  "VIGIL-COLLECT1",
  "VIGIL-DISMISSAL",
  "VIGIL-INTERCESSION",
  "VIGIL-LECTIONARY",
  "VIGIL-LIGHT",
  "VIGIL-PARDON"
);

export function currentOffice() {
  const d = new Date();
  const hour = d.getHours();

  if (hour >= 5 && hour < 9) return "Lauds";
  if (hour >= 9 && hour < 12) return "Terce";
  if (hour >= 12 && hour < 15) return "Sext";
  if (hour >= 15 && hour < 17) return "None";
  if (hour >= 17 && hour < 21) return "Vespers"; // if day is Saturday, do Vigil
  return "Compline";
}
