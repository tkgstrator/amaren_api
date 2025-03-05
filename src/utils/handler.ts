import { Members } from '@/models/member.dto'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { Bindings } from './bindings'
import { KV } from './kv'

const update_cache = async (env: Bindings, ctx: ExecutionContext): Promise<void> => {
  const data = await (await fetch(new URL(env.API_URL).href)).json()
  const members: Members = Members.parse(data)
  await KV.MEMBERS.set(env, ctx, members)
  return
}

export const scheduled = async (event: ScheduledController, env: Bindings, ctx: ExecutionContext): Promise<void> => {
  switch (event.cron) {
    case '0 15 * * *':
      ctx.waitUntil(update_cache(env, ctx))
      break
    default:
      break
  }
}
