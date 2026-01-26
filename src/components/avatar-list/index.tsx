import { memo } from 'react'

export interface AvatarListProps {
  remoteUsers: Map<
    number,
    {
      name: string
      color: string
    }
  >
}

const getIcon = (userName: string) => {
  return `https://robohash.org/${userName}?set=set1&size=100x100`
}

export const AvatarList = memo((props: AvatarListProps) => {
  const { remoteUsers } = props
  return (
    remoteUsers && (
      <div className="flex flex-row gap-2">
        {Array.from(remoteUsers).map(
          ([key, value]) =>
            value && (
              <div key={key} style={{ backgroundColor: value.color }} className="size-8 overflow-hidden rounded-full">
                <img className="size-full" src={getIcon(value.name)} alt={value.name} />
              </div>
            )
        )}
      </div>
    )
  )
})
