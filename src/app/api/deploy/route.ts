import {digitalOceanToken, digitalOceanAppId} from '@/lib'
import {initializeDeployment, checkDeployment} from 'sanity-plugin-nextjs-do-deploy/next'

export const POST = initializeDeployment(digitalOceanToken, digitalOceanAppId)

export const GET = checkDeployment(digitalOceanToken, digitalOceanAppId)
