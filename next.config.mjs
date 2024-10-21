/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "static.atlasacademy.io",
                port: "",
                pathname: "**",
            },
        ],
        unoptimized: true,
    },
    output: "export",
    reactStrictMode: true,
};

export default nextConfig;
