import dayjs from 'dayjs'
import type { Context } from 'hono'
import type { Bindings } from './bindings'

export namespace KV {
  export namespace MEMBERS {
    const timestamp: string = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
    export const get = async (c: Context<{ Bindings: Bindings }>): Promise<unknown> => {
      return c.env.MEMBERS.get(timestamp, { type: 'json' })
    }

    export const set = async (c: Context<{ Bindings: Bindings }>, data: unknown): Promise<void> => {
      c.executionCtx.waitUntil(c.env.MEMBERS.put(timestamp, JSON.stringify(data)))
      return
    }
  }
}
