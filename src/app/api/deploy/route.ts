import {digitalOceanToken, digitalOceanAppId} from '@/lib'
import {initializeDeployment, checkDeployment} from 'sanity-nextjs-do-deploy/routes'

export const POST = initializeDeployment(digitalOceanToken, digitalOceanAppId)

export const GET = checkDeployment(digitalOceanToken, digitalOceanAppId)
