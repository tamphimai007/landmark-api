https://clerk.com/docs/quickstarts/express
https://clerk.com/docs/upgrade-guides/core-2/node

```bash
npm install @clerk/express
npm install dotenv
```

server.js

```js
const { clerkMiddleware } = require("@clerk/express");
require("dotenv/config");

app.use(clerkMiddleware());
```

## Install prisma

```bash
npm install prisma
npx prisma init
```

## Migrate DB

```bash
npx prisma migrate dev --name 'init'

npx prisma db push
```
