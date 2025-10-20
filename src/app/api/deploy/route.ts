import {digitalOceanToken, digitalOceanAppId} from '@/lib'
import {initializer, checker} from './functions'

export const POST = initializer(digitalOceanToken, digitalOceanAppId)

export const GET = checker(digitalOceanToken, digitalOceanAppId)
