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

// Case-insensitive match where "*" means any characters. No RegExp, so user
// input can't inject regex syntax or trigger catastrophic backtracking.
export function wildcardMatch(pattern: string, text: string): boolean {
  const parts = pattern.toLowerCase().split("*");
  const s = text.toLowerCase();
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (parts.length === 1) return s === first;
  if (s.length < first.length + last.length || !s.startsWith(first) || !s.endsWith(last)) return false;
  // Middle parts in order; leftmost match is always safe with "*"-only patterns
  const end = s.length - last.length;
  let pos = first.length;
  for (const part of parts.slice(1, -1)) {
    const i = s.indexOf(part, pos);
    if (i === -1 || i + part.length > end) return false;
    pos = i + part.length;
  }
  return true;
}
