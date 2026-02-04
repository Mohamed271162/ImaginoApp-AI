import { Metadata } from "next";
import HomePage from "./(website)/home/page";

export const metadata: Metadata = {
  title: "IMAGINO - Home",
};

export default async function LangHomePage() {
  return <HomePage />;
}
