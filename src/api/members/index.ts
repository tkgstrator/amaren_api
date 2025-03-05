import { HTTPMethod } from '@/enums/http_method'
import { Member } from '@/models/member.dto'
import type { Bindings } from '@/utils/bindings'
import { update_cache } from '@/utils/handler'
import { KV } from '@/utils/kv'
import { NotFoundResponse } from '@/utils/response'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import type { JSONValue } from 'hono/utils/types'
import { update } from 'lodash'

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['ユーザー'],
    summary: '取得',
    description: 'ユーザー一覧を返します。',
    request: {},
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(Member).openapi({ description: 'ユーザー情報' })
          }
        },
        description: 'ユーザー情報'
      },
      ...NotFoundResponse
    }
  }),
  async (c) => {
    return c.json(await KV.MEMBERS.get(c.env))
  }
)
