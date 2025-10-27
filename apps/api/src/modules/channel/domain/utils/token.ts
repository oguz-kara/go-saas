import { randomBytes } from 'crypto'

export const generateChannelToken = (): string => {
  const prefix = 'ch_'
  const randomString = randomBytes(10).toString('hex')
  return `${prefix}${randomString}`
}

export const generateClientToken = (): string => {
  const prefix = 'cl_'
  const randomString = randomBytes(10).toString('hex')
  return `${prefix}${randomString}`
}
