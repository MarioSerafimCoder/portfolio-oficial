// Keep this catalogue in sync between the blog and Studio.
export const avatarIds = /** @type {const} */ ([
  'avatar-01', 'avatar-02', 'avatar-03', 'avatar-04', 'avatar-05',
  'avatar-06', 'avatar-07', 'avatar-08', 'avatar-09', 'avatar-10',
]);

/** @typedef {(typeof avatarIds)[number]} AvatarId */

/** @type {ReadonlySet<string>} */
const allowedIds = new Set(avatarIds);

/**
 * @param {unknown} value
 * @returns {value is AvatarId}
 */
export function isAvatarId(value) {
  return typeof value === 'string' && allowedIds.has(value);
}

/** @param {string} name */
export function isReservedCommentAuthor(name) {
  const normalized = name.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  return ['marioserafim', 'marioserafimautor', 'marioserafimauthor'].includes(normalized);
}
