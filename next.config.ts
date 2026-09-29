import withLinaria, {LinariaConfig} from 'next-with-linaria'

const nextConfig: LinariaConfig = {
  linaria: {},
  devIndicators: false,
  serverExternalPackages: ['@prisma/client'],
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
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
  },
}

export default withLinaria(nextConfig)
