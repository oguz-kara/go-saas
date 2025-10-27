export interface ApiKey {
  id: string
  name: string
  prefix: string
  isActive: boolean
  usageCount: number
  lastUsedAt?: string | null
  lastUsedIp?: string | null
  createdAt: string
  updatedAt: string
  createdBy?: {
    id: string
    email: string
    name?: string | null
  }
}

export interface GeneratedApiKey extends ApiKey {
  plainKey: string
}

export interface CreateApiKeyInput {
  name: string
}

