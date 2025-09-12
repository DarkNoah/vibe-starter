import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { languages } from "./language";

async function loadNs(lng: string, ns: string) {
  const mod = await import(`../public/locales/${lng}/${ns}.json`);
  return mod.default;
}

export async function getServerT(lng: string, ns: string | string[]) {
  const i18n = createInstance();
  const namespaces = Array.isArray(ns) ? ns : [ns];

  const resources: Record<string, Record<string, any>> = {
    [lng]: {},
  };
  await Promise.all(
    namespaces.map(async (n) => {
      resources[lng][n] = await loadNs(lng, n);
    })
  );

  await i18n.use(initReactI18next).init({
    lng,
    fallbackLng: "en",
    supportedLngs: languages as unknown as string[],
    defaultNS: "common",
    ns: namespaces,
    resources,
    interpolation: { escapeValue: false },
  });

  return {
    t: i18n.getFixedT(lng),
  };
}
