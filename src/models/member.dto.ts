import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const Member = z.preprocess((input: any) => {
  return input
}, z.object({}))

export type Member = z.infer<typeof Member>
