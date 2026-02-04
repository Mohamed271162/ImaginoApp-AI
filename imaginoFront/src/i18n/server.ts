import i18next, { TFunction } from "i18next";
import Backend from "i18next-fs-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { languages, defaultLang } from "./settings";
import path from "path";

type UseTranslationResult = {
  t: TFunction;
};

export async function useTranslation(
  lang: string,
  ns: string
): Promise<UseTranslationResult> {
  const safeLang =
    lang && languages.some((l) => l.code === lang) ? lang : defaultLang;

  await i18next
    .use(initReactI18next)
    .use(Backend)
    .init({
      lng: safeLang,
      fallbackLng: defaultLang,
      ns: [ns],
      backend: {
        loadPath: path.resolve("./src/i18n/{{lng}}/{{ns}}.json"),
      },
      returnObjects: true,
    });

  return {
    t: i18next.t.bind(i18next),
  };
}
