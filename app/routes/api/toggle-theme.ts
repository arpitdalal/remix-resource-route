import type { ActionFunction } from 'remix';
import { redirect } from 'remix';
import type { ThemeNames } from '~/themes';
import {
  getUserTheme,
  themeCookie,
} from '~/utils/theme.server';

/**
 * Toggle theme based on the current theme in the cookie
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  // Get the redirectBack url from the hidden input that was submitted with the form
  const redirectBack = String(form.get("redirectBack"));

  const currentTheme = await getUserTheme(request);
  const newTheme: ThemeNames = currentTheme === "dark" ? "light" : "dark";

  return redirect(redirectBack || "/", {
    headers: {
      "Set-Cookie": await themeCookie.serialize(newTheme),
    },
  });
};
