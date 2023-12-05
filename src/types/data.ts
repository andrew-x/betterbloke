export type Model = {
  id: string
  base: string
  type: string | null
  size: string | null
  tags: string[]
  downloads: number
  likes: number
  createdAt: number
}

export type ModelGroup = {
  base: string
  likes: number
  downloads: number
  tags: string[]
  createdAt: number
  models: Model[]
}
