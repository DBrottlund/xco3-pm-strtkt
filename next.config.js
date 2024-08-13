/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
	// Other configurations...
	reactStrictMode: true,
	trailingSlash: true,
	swcMinify: true,
	basePath: "",
	assetPrefix: "",
	images: {
		loader: "imgix",
		path: "/",
	},
	webpack: (config, { isServer }) => {
		config.resolve.alias['@'] = path.resolve(__dirname, 'app');
		return config;
	},
};

module.exports = nextConfig;
