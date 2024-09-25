import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { components } from './types';
import { PrismaClient, Prisma } from '@prisma/client';
import { Console, Effect } from 'effect'
import * as S from "@effect/schema/Schema";
import { bearerAuth } from 'hono/bearer-auth';
import { jwt } from 'hono/jwt';
const prisma = new PrismaClient();


// TODO: move to other file
type User = components['schemas']['User'];
type Note = components['schemas']['Note'];

const UserSchema = S.Struct({
  id: S.optional(S.String),
  name: S.optional(S.String),
  email: S.optional(S.String),
});

const NoteSchema = S.Struct({
  id: S.optional(S.String),
  title: S.String,
  content: S.String,
  userId: S.String,
});

const app = new Hono()

const token = 'api-token'

app.use('/notes/*', bearerAuth({ token }))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Create User
app.post('/users', async (c) => {
  const user: Prisma.UserCreateInput = await c.req.json()
  const createdUser = await prisma.user.create({ data: user })
  return c.json(createdUser)
})

// User Login
app.post('/users/login', async (c) => {
  const { email, password } = await c.req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    // Implement password check logic here
    return c.json(user)
  }
  return c.text('Invalid credentials', 401)
})

// Create Note
app.post('/notes', async (c) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return c.text('Unauthorized', 401);
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret') as { userId: number };
    const noteData = await c.req.json();
    const note: Prisma.NoteCreateInput = {
      ...noteData,
      user: { connect: { id: decoded.userId } }
    };
    const createdNote = await prisma.note.create({ data: note });
    return c.json(createdNote);
  } catch (error) {
    return c.text('Invalid token', 401);
  }
});

// Get Note by ID
app.get('/notes/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const note = await prisma.note.findUnique({ where: { id } })
  if (note) {
    return c.json(note)
  }
  return c.text('Note not found', 404)
})

// Update Note
app.patch('/notes/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const noteData: Prisma.NoteUpdateInput = await c.req.json()
  const updatedNote = await prisma.note.update({
    where: { id },
    data: noteData
  })
  return c.json(updatedNote)
})

// Delete Note
app.delete('/notes/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await prisma.note.delete({ where: { id } })
  return c.text('Note deleted', 204)
})

// Get all Notes for a User
app.get('/users/:userId/notes', async (c) => {
  const userId = parseInt(c.req.param('userId'))
  const notes = await prisma.note.findMany({ where: { userId } })
  return c.json(notes)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})