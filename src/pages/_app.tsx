"use client";
import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/global.css";
import "remixicon/fonts/remixicon.css";

/**
 * Base app component
 */
export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Fast Event Video Annotation tool</title>
                <meta
                    property="og:title"
                    content="Fast Even Video Annotation tool"
                    key="title"
                />
                <meta name="googlebot" content="notranslate"></meta>
                <meta
                    name="keywords"
                    content="fast,event,video,annotation,tool,feva"
                />
            </Head>
            <div className="w-screen h-dvh sm:h-screen bg-white flex font-roboto">
                <Component {...pageProps} />
            </div>
        </>
    );
}
