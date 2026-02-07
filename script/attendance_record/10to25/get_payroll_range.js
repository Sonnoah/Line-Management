export function getRound1Ranges(year, month) {
  return {
    start: `${year}-${String(month).padStart(2, "0")}-10`,
    end: `${year}-${String(month).padStart(2, "0")}-25`,
  }
}
