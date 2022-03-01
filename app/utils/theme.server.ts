import { createCookie } from 'remix';

import { DEFAULT_THEME } from '~/themes';

import type { ThemeNames } from '~/themes';

// Create theme cookie
export const themeCookie = createCookie("theme", {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10), // 10 years,
  secure: process.env.NODE_ENV === "production", // secure if in production
});

/**
 * Returns the current theme from cookie
 */
const getThemeCookie = async (request: Request): Promise<any> => {
  return await themeCookie.parse(request.headers.get("Cookie"));
};

/**
 * Returns the theme from cookie OR system preferred theme OR default theme
 */
export const getUserTheme = async (request: Request): Promise<ThemeNames> => {
  const userPreferredTheme = await getThemeCookie(request);
  // Tells the client to send the user preferred theme: https://web.dev/user-preference-media-features-headers/
  const systemPreferredTheme = request.headers.get(
    "Sec-CH-Prefers-Color-Scheme"
  );
  return userPreferredTheme ?? systemPreferredTheme ?? DEFAULT_THEME;
};
