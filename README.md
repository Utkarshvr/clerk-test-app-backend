# Setup Node Express Server with TypeScript

## Initialization

`yarn init`

## Install Dev Dependencies

`yarn add --dev nodemon ts-node tsconfig-paths typescript`

- Create `tsconfig.json` (in Root Directory)

- **Assuming that your TS files will be in src folder and index.ts is the main starting file**

```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types"],
    "target": "es2016",
    "baseUrl": "src",
    "outDir": "dist",
    "paths": {
      "@/*": ["./*"]
    },

    "module": "CommonJS",
    "moduleResolution": "Node",
    "sourceMap": true,
    "noImplicitAny": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}

```

- Create `nodemon.json` (in Root Directory)

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "exec": "ts-node -r tsconfig-paths/register ./src/index.ts"
}
```

- Write a script for starting project

```json
{
    "dev": "nodemon"
} 
```

## Install Main Dependencies

`yarn add express cors mongoose dotenv jsonwebtoken cookie-parser`

## Install Types

`yarn add --dev @types/express @types/body-parser @types/cookie-parser @types/cors`

## Others

- package.json

```json
{
  "name": "backend-ts",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon"
  },
  "dependencies": {
    "body-parser": "^1.20.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.2.1"
  },
  "devDependencies": {
    "@types/body-parser": "^1.19.5",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.26",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.4.2"
  }
}
```
