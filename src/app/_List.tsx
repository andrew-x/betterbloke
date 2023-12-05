'use client'

import { ModelGroup } from '@/types/data'
import cn from '@/util/classnames'
import { font } from '@/util/constants'
import {
  Button,
  Divider,
  Menu,
  Pagination,
  Pill,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useClipboard, useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconArrowRight, IconClipboard } from '@tabler/icons-react'
import dayjs from 'dayjs'
import mixpanel from 'mixpanel-browser'
import { useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 10

type Sort =
  | 'date-desc'
  | 'date-asc'
  | 'likes-desc'
  | 'likes-asc'
  | 'downloads-desc'
  | 'downloads-asc'
  | 'name-desc'
  | 'name-asc'

export default function List({
  className,
  groups,
}: {
  className?: string
  groups: ModelGroup[]
}) {
  const clipboard = useClipboard({ timeout: 1000 })
  const [searchInput, setSearchInput] = useState<string>('')
  const [search] = useDebouncedValue(searchInput, 500)

  const [page, setPage] = useState<number>(0)
  const [sort, setSort] = useState<Sort>('date-desc')

  useEffect(() => {
    setPage(0)
  }, [sort, search])
  const { rows, totalPages } = useMemo<{
    rows: ModelGroup[]
    totalPages: number
  }>(() => {
    const filtered = groups.filter(
      (group) =>
        group.base.includes(search) ||
        group.tags.some((tag) => tag.includes(search))
    )
    const sorted = filtered.sort((a, b) => {
      if (sort === 'date-desc') {
        return b.createdAt - a.createdAt
      } else if (sort === 'date-asc') {
        return a.createdAt - b.createdAt
      } else if (sort === 'likes-desc') {
        return b.likes - a.likes
      } else if (sort === 'likes-asc') {
        return a.likes - b.likes
      } else if (sort === 'downloads-desc') {
        return b.downloads - a.downloads
      } else if (sort === 'downloads-asc') {
        return a.downloads - b.downloads
      } else if (sort === 'name-desc') {
        return a.base.localeCompare(b.base)
      } else {
        return b.base.localeCompare(a.base)
      }
    })

    const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    return {
      rows,
      totalPages: Math.ceil(filtered.length / PAGE_SIZE),
    }
  }, [groups, search, sort, page])

  return (
    <div className={cn('flex flex-col gap-y-4', className)}>
      <div className="flex items-end gap-x-2">
        <TextInput
          className="grow"
          classNames={{
            input: font.className,
          }}
          label="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          size="xs"
        />
        <Menu position="bottom-end">
          <Menu.Target>
            <Tooltip label="Sort">
              <Button variant="subtle" size="compact-md">
                Sort
              </Button>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            {[
              {
                text: 'Sort by date descending',
                value: 'date-desc',
              },
              {
                text: 'Sort by date ascending',
                value: 'date-asc',
              },
              {
                text: 'Sort by date descending',
                value: 'name-desc',
              },
              {
                text: 'Sort by name ascending',
                value: 'name-asc',
              },
              {
                text: 'Sort by likes descending',
                value: 'likes-desc',
              },
              {
                text: 'Sort by likes ascending',
                value: 'likes-asc',
              },
              {
                text: 'Sort by downloads descending',
                value: 'downloads-desc',
              },
              {
                text: 'Sort by downloads ascending',
                value: 'downloads-asc',
              },
            ].map(({ text, value }, idx) => {
              const isActive = value === sort
              return (
                <Menu.Item
                  key={idx}
                  leftSection={isActive ? <IconArrowRight /> : null}
                  color={isActive ? 'blue' : undefined}
                  onClick={() => {
                    setSort(value as Sort)
                    mixpanel.track('Sort changed', {
                      sort: value,
                    })
                  }}
                >
                  {text}
                </Menu.Item>
              )
            })}
          </Menu.Dropdown>
        </Menu>
      </div>
      <ol className="grid grid-cols-2 gap-2">
        {rows.map((group, idx) => (
          <li
            key={idx}
            className="border border-gray-700 rounded py-2 px-4 col-span-2 md:col-span-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{group.base}</h2>
                <time
                  dateTime={dayjs(group.createdAt).format('YYYY-MM-DD')}
                  className="text-xs"
                >
                  {dayjs(group.createdAt).format('MMM DD, YYYY')}
                </time>
              </div>
              <p className="text-sm text-gray-400 center-row gap-x-2 pt-1">
                <Tooltip label="Likes" aria-label="Number of likes">
                  <span>
                    <span className="text-xs">&#x1F44D;</span> {group.likes}
                  </span>
                </Tooltip>
                <Tooltip label="Downloads" aria-label="Number of downloads">
                  <span>
                    <span className="text-xs">&#128229;</span> {group.downloads}
                  </span>
                </Tooltip>
              </p>
            </div>
            <ul className="center-row flex-wrap gap-x-2 gap-y-0.5">
              {group.tags.map((tag, idx) => (
                <li key={idx}>
                  <Pill
                    size="xs"
                    classNames={{
                      label: 'break-all',
                    }}
                  >
                    {tag}
                  </Pill>
                </li>
              ))}
            </ul>
            <Divider className="w-full my-2" />
            <ul className="">
              {group.models.map((model, idx) => (
                <li key={idx}>
                  <a
                    className="text-xs mr-0.5"
                    href={`https://huggingface.co/${model.id}`}
                    target="_blank"
                    onClick={() => {
                      mixpanel.track('Model link clicked')
                    }}
                  >
                    {model.id}
                  </a>
                  <Tooltip label="Copy model id">
                    <Button
                      variant="subtle"
                      className="text-xs"
                      size="compact-xs"
                      onClick={() => {
                        mixpanel.track('Model ID copied')
                        clipboard.copy(model.id)
                        notifications.show({
                          title: 'Model ID copied',
                          message: `Copied ${model.id} to clipboard`,
                          color: 'green',
                        })
                      }}
                    >
                      <IconClipboard size={15} />
                    </Button>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <div className="center-col">
        <Pagination
          total={totalPages}
          value={page + 1}
          onChange={(next) => setPage(next - 1)}
          size="xs"
        />
      </div>
    </div>
  )
}
