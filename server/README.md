# Dart Sass Server

Web server for compiling a themed Sass file, written in [Dart](https://dart.dev/).

## Local development

See root [`README`](../README.md) for instructions on how to run the server locally.

**Usage**:

Send a `POST` request to `/compile`. Accepts a JSON body where the key/value pairs are Sass variable name/value.

## Deploy

Works well on [Google Cloud Run](https://cloud.google.com/run).

```
npm run deploy
```
