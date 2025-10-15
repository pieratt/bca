import withLinaria, {LinariaConfig} from 'next-with-linaria'

const nextConfig: LinariaConfig = {
  linaria: {},
  devIndicators: false,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageKitLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default withLinaria(nextConfig)
