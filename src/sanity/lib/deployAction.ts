import type {DocumentActionsContext} from 'sanity'
import {VscRocket} from 'react-icons/vsc'
import {deploymentHook} from '@/lib'

const deployAction = (_: DocumentActionsContext) => () =>
  !deploymentHook
    ? null
    : {
        label: 'Deploy',
        icon: VscRocket,
        onHandle: async () => {
          await fetch(deploymentHook!, {mode: 'no-cors'})
        },
      }

export {deployAction}
