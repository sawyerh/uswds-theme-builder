# USWDS Theme Builder

🚨 **This is super early in development and not ready for general use**. There is a lot still missing, and it suffers from Sass compilation performance issues in the Firebase Functions context. Performance may be bearable when you run things locally. Migrating from the Sass JS API to the Sass Dark API is something I'm investigating.

## Local development

Prerequisites:

- Node v14+
- NPM v7+

Get started:

1. Install dependencies:
   ```
   npm run setup
   ```
1. Run serverless function and SPA:
   1. In one terminal window, start the serverless emulator:
      ```sh
      npm run serve --prefix functions
      ```
   2. In another terminal window, start the frontend app:
      ```sh
      npm run dev --prefix site
      ```

### File structure

```
├── bin           🤖 Development scripts
├── functions     ⚡️ Serverless endpoint for Sass compilation
└── site          🎨 Frontend
```
