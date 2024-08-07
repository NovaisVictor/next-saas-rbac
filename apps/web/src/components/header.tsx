import { Slash } from 'lucide-react'
import Image from 'next/image'

import appIcon from '@/assets/app-logo.svg'
import { ability } from '@/auth/auth'

import { OrganizationSwitcher } from './organization-switcher'
import { PedingInvites } from './peding-invites'
import { ProfileButton } from './profile-button'
import { ProjectSwitcher } from './project-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'
export async function Header() {
  const permissions = await ability()
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={appIcon} alt="" className="size-6 dark:invert" />
        <Slash className="size-3 -rotate-[24] text-border" />
        <OrganizationSwitcher />
        {permissions?.can('get', 'Project') && (
          <>
            <Slash className="size-3 -rotate-[24] text-border" />
            <ProjectSwitcher />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <PedingInvites />
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
