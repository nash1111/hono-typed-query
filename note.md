```
✔ Using target directory … hono-typed-query
? Which template do you want to use? nodejs
? Do you want to install project dependencies? yes
? Which package manager do you want to use? yarn
✔ Cloning the template
✔ Installing project dependencies
🎉 Copied project files
Get started with: cd hono-typed-query
Done in 48.70s.

yarn add -D prisma
docker-compose up -d
yarn prisma init
yarn add openapi-typescript
yarn add -D typescript

npx openapi-typescript openapi.yml --output src/types.ts
```