export interface IGlobal {
  id: string;
  key: string; // "site-settings", "homepage"
  value: Record<string, any>; // { "logo": "url.jpg", "footerText": "..." }
}
