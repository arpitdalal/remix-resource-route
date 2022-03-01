import { createContext } from 'react';

import { DEFAULT_THEME } from '~/themes';

import type { ThemeNames } from '~/themes';

export interface ClientStyleContextData {
  reset: () => void;
  themeName: ThemeNames;
  setThemeName: React.Dispatch<React.SetStateAction<ThemeNames>>;
}

export default createContext<ClientStyleContextData>({
  reset: () => {},
  themeName: DEFAULT_THEME,
  setThemeName: () => {},
});
