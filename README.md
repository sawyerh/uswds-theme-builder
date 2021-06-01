# USWDS Theme Builder

## Local development

Prerequisites:

- Node v14+

Install all dependencies:

```
npm run setup
```

Run all systems:

1. In one terminal window, start the serverless emulator:
   ```sh
   npm run serve --prefix functions
   ```
1. In another terminal window, start the frontend app:
   ```sh
   npm run dev --prefix site
   ```

### File structure

```
├── bin           🤖 Development scripts
├── functions     ⚡️ Serverless endpoint for Sass compilation
└── site          🎨 Frontend
```
