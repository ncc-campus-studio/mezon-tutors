import type { Request } from 'express'

function stripIpv4MappedPrefix(ip: string): string {
  const v = ip.trim()
  if (v.startsWith('::ffff:')) {
    return v.slice(7)
  }
  return v
}

/**
 * Client IP for payment providers / logs. Prefer X-Forwarded-For first hop when behind a proxy.
 */
export function getRequestClientIp(req: Request): string {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    const first = xff.split(',')[0]?.trim()
    if (first) {
      return stripIpv4MappedPrefix(first)
    }
  }
  if (Array.isArray(xff) && xff[0]) {
    const first = String(xff[0]).split(',')[0]?.trim()
    if (first) {
      return stripIpv4MappedPrefix(first)
    }
  }

  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) {
    return stripIpv4MappedPrefix(realIp.trim())
  }

  if (req.ip) {
    return stripIpv4MappedPrefix(req.ip)
  }

  const remote = req.socket?.remoteAddress
  if (remote) {
    return stripIpv4MappedPrefix(remote)
  }

  return '127.0.0.1'
}
