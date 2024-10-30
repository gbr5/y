export function isUsernameValid(username: string): boolean {
  const usernameRegex = /^(?!.*\.\.)(?!.*__)[a-zA-Z0-9._]{3,20}$/;
  return usernameRegex.test(username);
};

export function sanitizeUsername(username: string): string {
  // Only keep alphanumeric characters, dots, and underscores
  return username.replace(/[^a-zA-Z0-9._]/g, '');
};