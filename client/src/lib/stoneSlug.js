/** Normalize a slug or stone name to a comparable form. */
export function normalizeStoneSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Drop a trailing plural "s" so "marbles" and "marble" compare equal. */
function singular(value) {
  return value.replace(/s$/, '');
}

/**
 * Find a stone from a loosely-written URL segment, e.g. "marbles", "Marble",
 * or the canonical "marble-manufacturer-in-india".
 */
export function findStoneBySlug(stones, slug) {
  const wanted = normalizeStoneSlug(slug);
  if (!wanted) return null;
  const wantedSingular = singular(wanted);

  const match = (Array.isArray(stones) ? stones : []).find((stone) =>
    [stone.slug, stone.name].some((candidate) => {
      const value = normalizeStoneSlug(candidate);
      if (!value) return false;
      return value === wanted || value === wantedSingular || singular(value) === wantedSingular;
    })
  );

  return match || null;
}

export default findStoneBySlug;
