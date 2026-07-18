// Only allow same-site relative paths as a post-auth redirect target,
// so a crafted ?redirect= param can't send a user off to another site.
export const getSafeRedirect = (value: string | null, fallback = '/') =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
