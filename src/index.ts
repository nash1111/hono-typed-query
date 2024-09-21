import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { components } from './types';
import { PrismaClient } from '@prisma/client';
import * as S from "@effect/schema/Schema";

const prisma = new PrismaClient();

type User = components['schemas']['User'];

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
