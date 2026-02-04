"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

export const initClientI18n = (lang: string) => {
  i18next
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: lang,
      fallbackLng: "en",
      ns: ["common"],
      interpolation: { escapeValue: false },
    });
};
