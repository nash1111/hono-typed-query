import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { components } from './types';
import { PrismaClient } from '@prisma/client';
import { Console, Effect } from 'effect'
import * as S from "@effect/schema/Schema";

const prisma = new PrismaClient();

type User = components['schemas']['User'];


// TODO: 
// automatically generate schema ?
// type User = {
//   id?: number;
//   name?: string;
//   email?: string;
// }
const UserSchema = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  email: S.optional(S.String),
});

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
