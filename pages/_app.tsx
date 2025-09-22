// pages/_app.tsx
// pages/_app.tsx
import "../faust.config";
import React from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { FaustProvider } from "@faustwp/core";
import "../styles/globals.css";

import { DM_Sans, Bebas_Neue, Lexend } from "next/font/google";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-lexend",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ApolloProvider client={client}>
      <FaustProvider pageProps={pageProps}>
        {/* Apply font CSS variables on a top-level wrapper (avoid rendering <body> here) */}
        <div
          className={`${dmSans.variable} ${bebasNeue.variable} ${lexend.variable} min-h-screen h-screen overflow-hidden`}
        >
          <Component {...pageProps} key={router.asPath} />
        </div>
      </FaustProvider>
    </ApolloProvider>
  );
}
