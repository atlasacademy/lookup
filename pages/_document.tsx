import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
                <meta charSet="utf-8" />
                <meta property="og:title" content="FGO Dropsheet Lookup Tool" />
                <meta property="og:description" content="FGO Dropsheet Lookup Tool" />
                <meta property="og:site_name" content="apps.atlasacademy.io" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://apps.atlasacademy.io/lookup" />
                <meta property="og:image" content="https://apps.atlasacademy.io/db/logo192.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="300" />
                <meta property="og:image:height" content="300" />
                <meta property="og:image:alt" content="Atlas Academy Logo" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
