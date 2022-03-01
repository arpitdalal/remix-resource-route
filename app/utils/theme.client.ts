import type { ThemeNames } from '~/themes';

export const getParsedCookie = (cookie: string): string => {
  return JSON.parse(atob(cookie));
};

export const getCookie = (cName: string): ThemeNames | string => {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res: string = "";
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
};
