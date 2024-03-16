import "@/styles/reset.css"
import "@/styles/tailwind.css"
import { GoogleAnalytics } from '@next/third-parties/google'

// fonts
import { Inter } from "next/font/google"
export const inter = Inter({
	subsets: ["latin"],
	display: "swap",
    variable: "--font-inter",
})

// metadata
export const metadata = {
    title: "Vaktija Plus",
    description: "Nova i unaprijeđena verzija Vaktije za mobilne uređaje i web preglednike",
    applicationName: "Vaktija Plus",
    keywords: ['vaktija', 'vaktija.ba', 'vaktija plus', 'iz', 'islamska zajednica', 'takvim', 'vakat'],
    authors: [{ name: 'Bakir', url: 'https://bakir.dev/' }],
    creator: "Bakir",
    publisher: "Bakir",
    // manifest: "https://vaktijaplus.bakir.dev/manifest.json",
    category: "technology",
    type: "website",
    metadataBase: new URL("https://vaktijaplus.bakir.dev/"),
    alternates: {
        canonical: "/",
        // languages: {
        // 	"en-US": "/",
        // },
    },
    openGraph: {
        title: "Vaktija Plus",
        description: "Nova i unaprijeđena verzija Vaktije za mobilne uređaje i web preglednike",
        url: "https://vaktijaplus.bakir.dev/",
        siteName: "Vaktija Plus",
        // images: [
        //     {
        //         url: "https://vaktijaplus.bakir.dev/og.jpg", // Must be an absolute URL
        //         width: 1200,
        //         height: 675,
        //         alt: 'opengraph_image',
        //     },
        // ],
        locale: "en",
        type: "website",
        authors: [{ name: 'Bakir', url: 'https://bakir.dev/' }],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            // { url: "/favicons/favicon-16x16.png" },
            // { url: "/favicons/favicon-32x32.png" },
        ],
        // other: [
        //     {rel: "manifest", url: "/favicons/site.webmanifest",},
        //     {rel: "msapplication-TileColor", url: "#161618",},
        //     {rel: "mask-icon", url: "/favicons/safari-pinned-tab.svg",},
        //     {rel: "apple-touch-icon", url: "/favicons/apple-touch-icon.png",},
        // ],
    },
    // twitter: {
    //     card: "app",
    //     title: "How much I wasted",
    //     description: "Time is currency. How much have you wasted?",
    //     creator: "@gracic_bakir",
    //     images: {
    //         url: "https://howmuchiwasted.bakir.dev/og.png",
    //         alt: "opengraph_image",
    //     },
    //     app: {
    //         name: "twitter_app",
    //         id: {
    //             iphone: "twitter_app://iphone",
    //             ipad: "twitter_app://ipad",
    //             googleplay: "twitter_app://googleplay",
    //         },
    //         url: {
    //             iphone: "https://iphone_url",
    //             ipad: "https://ipad_url",
    //         },
    //     },
    // },
};

// root layout
export default function RootLayout({ children }) {
    return (
        <html lang="en-US">
            <body className={`${inter.variable}`}>
                <div className="h-dvh flex items-center justify-center bg-bg text-white font-body select-none">
                    {children}
                </div>
            </body>
            <GoogleAnalytics gaId={process.env.GA_ID} />
        </html>
    );
}
