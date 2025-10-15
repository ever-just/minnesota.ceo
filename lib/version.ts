// Version and build information for MINNESOTA.CEO
export const VERSION = '2.0.2'
export const BUILD_DATE = '2025-10-15'
export const BUILD_NUMBER = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local'

export const getVersionInfo = () => ({
  version: VERSION,
  buildDate: BUILD_DATE,
  buildNumber: BUILD_NUMBER,
  environment: process.env.NODE_ENV || 'development'
})
