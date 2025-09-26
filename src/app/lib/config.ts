// app/lib/config.ts

/**
 * Configuration constants for the application, including API base URL, API key, and cookie names.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://v2.api.noroff.dev";
export const API_KEY = process.env.NOROFF_API_KEY;
export const COOKIE_TOKEN = process.env.COOKIE_TOKEN_KEY ?? "noroff_token";
export const COOKIE_USER = process.env.COOKIE_USER_KEY ?? "holidaze_user";
