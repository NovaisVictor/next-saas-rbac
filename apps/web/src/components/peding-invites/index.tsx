'use client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Check, Loader2, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'

import { getPendingInvites } from '@/http/get-pending-invites'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { acceptInviteAction, rejectInviteAction } from './action'

dayjs.extend(relativeTime)

export function PedingInvites() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAccpetInvite(inviteId: string) {
    await acceptInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }
  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <UserPlus2 className="size-4" />
          <span className="sr-only">
            Pending invites ({data?.invites.length ?? 0}){' '}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-2">
        <span className="flex items-center text-xs font-medium">
          Pending invites{' '}
          {isLoading ? (
            <Loader2 className="ml-1 size-3 animate-spin" />
          ) : (
            <>({data?.invites.length})</>
          )}
        </span>

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">No invites found.</p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div className="space-y-2">
              <p className="text-balance leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {invite.author?.name ?? 'Someone'}
                </span>{' '}
                invited you to join{' '}
                <span className="font-medium text-foreground">
                  {invite.organization.name}
                </span>{' '}
                <span className="text-xs">
                  {dayjs(invite.createdAt).fromNow()}
                </span>
              </p>

              <div className="flex gap-1">
                <Button
                  size={'xs'}
                  variant={'outline'}
                  onClick={() => {
                    handleAccpetInvite(invite.id)
                  }}
                >
                  <Check className="mr-1.5 size-3" />
                  Accept
                </Button>

                <Button
                  size={'xs'}
                  variant={'ghost'}
                  className="text-muted-foreground"
                  onClick={() => {
                    handleRejectInvite(invite.id)
                  }}
                >
                  <X className="mr-1.5 size-3" />
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
