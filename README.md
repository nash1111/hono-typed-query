### boot hono
```
yarn install
yarn dev
```

### prepare badckend
```
docker compose up -d
npx prisma generate
```

### generate type from openapi
```
npx openapi-typescript openapi.yml --output src/types.ts
```

### generate typed sql
```
npx prisma generate --sql
```