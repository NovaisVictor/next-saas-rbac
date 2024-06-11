'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'

// import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { createOrganizationAction } from './actions'

export function OrganizationForm() {
  // const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createOrganizationAction,
  )
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant={'destructive'}>
          <AlertTriangle className="size-4" />
          <AlertTitle>Save organization failed!</AlertTitle>
          <AlertDescription>
            <p> {message} </p>
          </AlertDescription>
        </Alert>
      )}
      {success === true && message && (
        <Alert variant={'success'}>
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p> {message} </p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="name">Organization name</Label>
        <Input name="name" type="text" id="name" />
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="exemple.com"
        />
        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Checkbox
            name="shouldAttachUsersByDomain"
            id="shouldAttachUsersByDomain"
            className="mt-[0.285rem]"
          />
          <div className="flex items-baseline space-x-2">
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
              <span className="text-sm font-medium leading-none">
                Auto-join new members
              </span>
              <p className="text-sm text-muted-foreground">
                This will automatically invite all members with same e-mail
                domain to this organization.
              </p>
            </label>
          </div>
          {errors?.shouldAttachUsersByDomain && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.shouldAttachUsersByDomain[0]}
            </p>
          )}
        </div>
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save organization'
        )}
      </Button>
    </form>
  )
}
