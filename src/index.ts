import { OpenAPIHono as Hono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { cache } from 'hono/cache'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { ZodError } from 'zod'
import { app as members } from './api/members'
import type { Bindings } from './utils/bindings'
import { reference, specification } from './utils/docs'
import { scheduled } from './utils/handler'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Asia/Tokyo')

const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())
// app.use(csrf())
app.use(
  '*',
  cache({
    cacheName: 'default',
    cacheControl: 'public, max-age=300'
  })
)
app.use('*', cors())
app.use(compress({ encoding: 'deflate' }))
app.doc('/specification', specification)
app.get('/docs', apiReference(reference))
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    console.error(err)
    return c.json({ message: err.message }, err.status)
  }
  if (err instanceof ZodError) {
    console.error(err)
    return c.json({ message: JSON.parse(err.message), description: err.cause }, 400)
  }
  console.error(err)
  return c.json({ message: err.message }, 500)
})
app.notFound((c) => c.redirect('/docs'))
app.route('/members', members)

export default {
  port: 3000,
  fetch: app.fetch,
  scheduled
}
