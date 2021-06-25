# Dart Sass Server

Web server for compiling a themed Sass file, written in [Dart](https://dart.dev/).

## Local development

Prerequisites:

- Dart or Docker Desktop
- NPM v7+

**Install dependencies:**

```
npm install
```

```
dart pub get
```

**Run the server:**

```
npm run dev
```

**Usage**:

Send a `POST` request to `/compile`. Accepts a JSON body where the key/value pairs are Sass variable name/value.

## Deploy

Works well on [Google Cloud Run](https://cloud.google.com/run).

```
npm run deploy
```
