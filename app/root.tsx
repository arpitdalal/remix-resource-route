import {
  useContext,
  useMemo,
} from 'react';

import type {
  ActionFunction,
  LoaderFunction,
} from 'remix';
import {
  Link as RmxLink,
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix';
import ThemeSwitch from '~/components/ThemeSwitch';
import ClientStyleContext from '~/context/ClientStyleContext';
import type { ThemeNames } from '~/themes';
import {
  DEFAULT_THEME,
  getTheme,
} from '~/themes';
import {
  getUserTheme,
  themeCookie,
} from '~/utils/theme.server';

import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiLink from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export type RootLoaderData = {
  themeName: ThemeNames;
};
/**
 * Returns the theme
 */
export const loader: LoaderFunction = async ({
  request,
}): Promise<RootLoaderData> => {
  return {
    themeName: await getUserTheme(request),
  };
};

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

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
  themeName?: ThemeNames;
};
const Document = withEmotionCache(
  (
    { children, title, themeName: propThemeName }: DocumentProps,
    emotionCache
  ) => {
    const clientStyleData = useContext(ClientStyleContext);
    const loaderData = useLoaderData<RootLoaderData>();

    let themeName: ThemeNames = useMemo(() => {
      return (
        propThemeName ||
        loaderData?.themeName ||
        clientStyleData.themeName ||
        DEFAULT_THEME
      );
    }, [loaderData, clientStyleData]);

    const theme = getTheme(themeName);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Only executed on client
    useEnhancedEffect(() => {
      // change the theme in style context
      clientStyleData.setThemeName(themeName);
    }, [themeName]);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}

          <Meta />
          <Links />
          {/* NOTE: Very important meta tag */}
          {/* because using this, css is re-inserted in entry.server.tsx */}
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
        "& > *": {
          mb: "1rem !important",
        },
      }}
    >
      {children}
      <ThemeSwitch />
    </Box>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 404: {
      message = "This is a custom error message for 404 pages";
      break;
    }
    default: {
      throw new Error(JSON.stringify(caught.data || caught.statusText));
    }
  }

  return (
    <Document title="Catch Boundary" themeName={caught.data?.themeName}>
      <Layout>
        <Typography variant="h4" component="h1">
          Root CatchBoundary
        </Typography>
        <Typography component="code" variant="inherit">
          Status: {caught.status}
        </Typography>
        <Typography>{message}</Typography>
        <MuiLink component={RmxLink} to="/">
          Go to Home
        </MuiLink>
      </Layout>
    </Document>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  const errorMessage = JSON.parse(error.message);

  return (
    <Document title="Error Boundary" themeName={errorMessage.themeName}>
      <Layout>
        <Typography variant="h4" component="h1">
          Root ErrorBoundary
        </Typography>
        <Typography component="pre" variant="inherit">
          {errorMessage.message || error.message}
        </Typography>
        <Typography component="p">The stack trace is:</Typography>
        <Typography component="pre" variant="inherit">
          <Typography component="code" variant="inherit">
            {error.stack}
          </Typography>
        </Typography>
        <MuiLink component={RmxLink} to="/">
          Go to Home
        </MuiLink>
      </Layout>
    </Document>
  );
};

const App = () => {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
};

export default App;
