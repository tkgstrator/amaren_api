import { Members } from '@/models/member.dto'
import dayjs from 'dayjs'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { JSONValue } from 'hono/utils/types'
import type { Bindings } from './bindings'

export namespace KV {
  export namespace MEMBERS {
    const timestamp: string = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
    export const get = async (env: Bindings, ctx: ExecutionContext): Promise<Members> => {
      const cache: unknown | null = await env.MEMBERS.get(timestamp, { type: 'json' })
      // キャッシュが存在していなければ一日前のデータを返す
      if (cache === null) {
        console.warn('[CACHE]: MISS HIT')
        const timestamp: string = dayjs().tz('Asia/Tokyo').subtract(1, 'day').format('YYYY-MM-DD')
        const post_cache: unknown | null = await env.MEMBERS.get(timestamp, { type: 'json' })
        if (post_cache === null) {
          throw new HTTPException(404, { message: 'Not Found' })
        }
        return Members.parse(post_cache)
      }
      console.info('[CACHE]: HIT')
      return Members.parse(cache)
    }

    export const set = async (env: Bindings, ctx: ExecutionContext, data: Members): Promise<void> => {
      ctx.waitUntil(env.MEMBERS.put(timestamp, JSON.stringify(data)))
      return
    }
  }
}
