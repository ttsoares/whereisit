export function fixName(name: string): string | null {
  let fixedName = name.trim();

  if (fixedName.length === 0) {
    return null;
  }

  if (!fixedName.includes("DVD")) {
    if (fixedName.length < 2) {
      fixedName = "0" + fixedName;
    }

    if (fixedName.length < 3) {
      fixedName = "0" + fixedName;
    }
    fixedName = "DVD-" + fixedName;
  }

  return fixedName;
}
