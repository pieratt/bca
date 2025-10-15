'use client'

import {styled} from '@linaria/react'
import {StringControl, ModuleWrapper} from '@/ui'
import {TitleSmall, Normal} from '../primitives/copyRenderers'
import {useForm, type SubmitHandler} from 'react-hook-form'

type NewsletterInputs = {
  firstName: string
  lastName: string
  email: string
  agreedToTerms: boolean
}

export const Newsletter = ({module: {title, description, rule}}: {module: Sanity.Newsletter}) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: {errors, isValid},
  } = useForm<NewsletterInputs>({
    defaultValues: {
      agreedToTerms: true,
    },
  })

  const onSubmit: SubmitHandler<NewsletterInputs> = async () => {
    await fetch('/api/newsletter', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getValues()),
    })
  }
  // todo: wire to mailchimp or hubspot, pending

  return (
    <ModuleWrapper className="mobile-full-bleed">
      <Wrapper onSubmit={handleSubmit(onSubmit)}>
        <Columns>
          <Column>
            <Copy>
              <Header>
                <Title>{title}</Title>
                <Description>{description}</Description>
              </Header>
            </Copy>
          </Column>
          <Column>
            <Inputs>
              <TextInputs>
                <StringControl
                  placeholder="ex. Johnny"
                  label="First Name"
                  {...register('firstName', {
                    required: {value: true, message: 'First name is required.'},
                    minLength: {value: 2, message: 'Minimum length 2 characters.'},
                  })}
                  message={errors?.firstName?.message}
                  messageType="ERROR"
                  aria-invalid={errors.firstName ? 'true' : 'false'}
                />

                <StringControl
                  placeholder="ex. Appleseed"
                  label="Last Name"
                  {...register('lastName', {
                    required: {value: true, message: 'Last name is required.'},
                    minLength: {value: 2, message: 'Minimum length 2 characters.'},
                  })}
                  message={errors?.lastName?.message}
                  messageType="ERROR"
                  aria-invalid={errors.lastName ? 'true' : 'false'}
                />

                <StringControl
                  type="email"
                  placeholder="ex. johnny@email.com"
                  label="Email Address"
                  {...register('email', {
                    required: {value: true, message: 'Valid email address is required.'},
                    pattern: {value: /^\S+@\S+\.\S+$/, message: 'Valid email address is required.'},
                  })}
                  message={errors?.email?.message}
                  messageType="ERROR"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </TextInputs>
              <Button type="submit" disabled={!isValid}>
                Subscribe
              </Button>
            </Inputs>
          </Column>
        </Columns>
      </Wrapper>
    </ModuleWrapper>
  )
}

/* Scaffolding */

const Wrapper = styled.form``

const Header = styled.header``

const TextInputs = styled.div``

const Columns = styled.div``

const Column = styled.div``

const Inputs = styled.div``

const Copy = styled.div``

const Title = styled.h1`
  @media only screen and (min-width: 744px) {
    max-width: 70%;
  }
`

const Description = styled.div`
  @media only screen and (min-width: 744px) {
    max-width: 85%;
  }
`

const Button = styled.button``
