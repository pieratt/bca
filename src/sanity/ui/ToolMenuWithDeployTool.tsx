import {Button, useToast} from '@sanity/ui'
import {VscRocket} from 'react-icons/vsc'
import {useEffect, type PropsWithChildren} from 'react'

const SUCCESS_OR_ERROR_DURATION = 600000 // 1m
const PROGRESS_DURATION = 30000 // 30s
const PAUSE_BEFORE_INTERVAL = 5000 // 5s

export default (props: any) => {
  const toast = useToast()

  let interval: number
  let timeoutId: number
  let deploymentId: string | undefined = undefined

  const deploy = async () => {
    toast.push({
      title: <Label>Deployment: initializing</Label>,
      duration: PAUSE_BEFORE_INTERVAL,
    })

    const {status} = await fetch('/api/deploy', {method: 'POST'})

    if (status !== 200) {
      toast.push({
        title: <Label>Deployment: failed initialization</Label>,
        status: 'error',
        duration: SUCCESS_OR_ERROR_DURATION,
        closable: true,
      })
    }

    // give DO a chance to start, if we check too fast, the check might return previous deployment
    timeoutId = window.setTimeout(() => {
      check()
      interval = window.setInterval(check, PROGRESS_DURATION)
    }, PAUSE_BEFORE_INTERVAL)
  }

  const check = async () => {
    try {
      if (!deploymentId) {
        const response = await fetch('/api/deploy', {method: 'GET'})
        const data = await response.json()
        deploymentId = data.deployments[0].id
      }
      if (deploymentId) {
        const response = await fetch(`/api/deploy?id=${deploymentId}`, {method: 'GET'})
        const data = await response.json()
        toast.push({
          title: <Label>Deployment: {data.deployment.phase.replace('_', ' ').toLowerCase()}</Label>,
          status:
            data.deployment.phase === 'ACTIVE'
              ? 'success'
              : data.deployment.phase === 'CANCELED'
              ? 'error'
              : 'info',
          description: data.deployment.phase === 'BUILDING' ? 'Est. 8 minutes' : undefined,
          duration: ['ACTIVE', 'CANCELED'].includes(data.deployment.phase)
            ? SUCCESS_OR_ERROR_DURATION
            : PROGRESS_DURATION,
          closable: ['ACTIVE', 'CANCELED'].includes(data.deployment.phase) ? true : undefined,
        })
        if (['ACTIVE', 'CANCELED'].includes(data.deployment.phase)) {
          clearInterval(interval)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      {props.renderDefault(props)}
      <Button
        fontSize={1}
        iconRight={VscRocket}
        text="Deploy"
        mode="bleed"
        tone="default"
        style={{cursor: 'pointer'}}
        onClick={() => deploy()}
      />
    </div>
  )
}

const Label = ({children}: PropsWithChildren) => (
  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
    <VscRocket />
    <div>{children}</div>
  </div>
)
