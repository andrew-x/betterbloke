import { Model, ModelGroup } from '@/types/data'
import dayjs from 'dayjs'

function extract(id: string, patter: RegExp) {
  const match = id.match(patter)
  return match ? match[1] : null
}

export async function getData() {
  const res = await fetch(
    `https://huggingface.co/api/models?author=TheBloke&sort=createdAt&direction=-1`,
    {
      method: 'GET',
    }
  )
  const data = await res.json()

  const flat: Model[] = Array.from(data)
    .map(
      (model) =>
        model as {
          id: string
          tags: string[]
          likes: number
          downloads: number
          createdAt: string
        }
    )
    .map((model) => {
      const stripped = model.id.replace('TheBloke/', '')
      const type = extract(stripped, /.+(?:-|_)([^-_]+)$/)
      const size = extract(stripped, /(\d+[bB])(?:_|-|$)/)

      const name = stripped
        .split(/-|_/)
        .filter((part) => part !== type && part !== size)
        .join('-')
      return {
        id: model.id,
        base: name,
        type: type,
        size: size,
        tags: model.tags,
        downloads: model.downloads,
        likes: model.likes,
        createdAt: dayjs(model.createdAt).valueOf(),
      }
    })
  const grouped: Record<string, ModelGroup> = {}
  flat.forEach((model) => {
    if (!grouped[model.base]) {
      grouped[model.base] = {
        base: model.base,
        likes: 0,
        downloads: 0,
        tags: [],
        models: [],
        createdAt: dayjs().valueOf(),
      }
    }
    grouped[model.base].likes += model.likes
    grouped[model.base].downloads += model.downloads
    grouped[model.base].tags = Array.from(
      new Set([...grouped[model.base].tags, ...model.tags])
    ).sort((a, b) => a.localeCompare(b))
    grouped[model.base].models = [
      ...(grouped[model.base].models || []),
      model,
    ].sort((a, b) => a.id.localeCompare(b.id))
    grouped[model.base].createdAt = Math.min(
      grouped[model.base].createdAt,
      model.createdAt
    )
  })
  return Object.values(grouped).sort((a, b) => b.createdAt - a.createdAt)
}
