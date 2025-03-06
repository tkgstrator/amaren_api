import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { last } from 'lodash'

export const Member = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    if (input === undefined || input === null) {
      return null
    }
    return {
      id: Number.parseInt(input['ID'], 10),
      name: input['氏名'],
      furigana: input['フリガナ'],
      registered: input['アマレン'] === 'Yes',
      games: Number.parseInt(input['対局数'], 10),
      win: Number.parseInt(input['勝ち数'], 10),
      lose: Number.parseInt(input['対局数'], 10) - Number.parseInt(input['勝ち数'], 10),
      rate: Number.parseInt(input['レート'], 10),
      rate_history: [
        Number.parseInt(input['2回前レート'], 10),
        Number.parseInt(input['3回前レート'], 10),
        Number.parseInt(input['4回前レート'], 10),
        Number.parseInt(input['5回前レート'], 10),
        Number.parseInt(input['6回前レート'], 10),
        Number.parseInt(input['7回前レート'], 10),
        Number.parseInt(input['8回前レート'], 10),
        Number.parseInt(input['9回前レート'], 10),
        Number.parseInt(input['10回前レート'], 10)
      ],
      updated_at: input['最新入力日'],
      last_played: input['最新対局日'],
      area: input['地域'],
      prefacture: input['住所']
    }
  },
  z.object({
    id: z.number().int().min(0),
    name: z.string(),
    furigana: z.string(),
    registered: z.boolean(),
    games: z.number().int().min(0),
    win: z.number().int().min(0),
    lose: z.number().int(),
    rate: z.number().int().min(0),
    rate_history: z.array(z.number().int()),
    updated_at: z.string(),
    last_played: z.string(),
    area: z.string().nullable(),
    prefacture: z.string().nullable()
  })
)

export const Members = z.array(Member)

export type Member = z.infer<typeof Member>
export type Members = z.infer<typeof Members>
