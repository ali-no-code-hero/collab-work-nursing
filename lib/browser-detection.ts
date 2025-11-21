export function isFacebookInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  return /FBAN|FBAV|FB_IAB|FB4A/i.test(ua);
}

export function isInstagramInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  return /Instagram/i.test(ua);
}

export function isInAppBrowser(): boolean {
  return isFacebookInAppBrowser() || isInstagramInAppBrowser();
}

