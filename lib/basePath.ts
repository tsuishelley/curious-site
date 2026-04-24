const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => `${base}${path}`;
