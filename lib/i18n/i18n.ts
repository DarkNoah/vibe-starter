import i18n, { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import Cookies from "js-cookie";
import { type Language, languages } from "./language";

// 自定义语言检测器
const customLanguageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: (callback: (lng: string) => void) => {
    // 优先级：Cookie > 浏览器语言
    const cookieLang = Cookies.get("language");
    if (cookieLang && languages.includes(cookieLang as Language)) {
      callback(cookieLang);
      return;
    }

    // 从浏览器获取语言
    const browserLang = navigator.language.split("-")[0];
    const lang = languages.includes(browserLang as Language)
      ? browserLang
      : "en";
    callback(lang);
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    Cookies.set("language", lng, { expires: 365 });
  },
};

// 初始化 i18next
i18n
  .use(HttpApi)
  .use(customLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: languages,
    defaultNS: "common",
    ns: ["common"],

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    detection: {
      order: ["cookie", "navigator"],
      caches: ["cookie"],
      lookupCookie: "language",
      cookieMinutes: 525600, // 365 days
    },

    interpolation: {
      escapeValue: false, // React 已经安全处理了
    },

    react: {
      useSuspense: false, // 避免服务端渲染问题
    },
  });

export default i18n;

// 切换语言的函数
export const changeLanguage = (language: Language) => {
  i18n.changeLanguage(language);
  Cookies.set("language", language, { expires: 365 });
};

// 获取当前语言
export const getCurrentLanguage = (): Language => {
  return (i18n.language as Language) || "en";
};
