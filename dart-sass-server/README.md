# Dart Sass Server

Simple Dockerized web server for compiling a themed Sass file, written in [Dart](https://dart.dev/).

Send a `POST` request to `/compile`. Accepts a JSON body where the key/value pairs are Sass variable name/value.

## Local development

Prerequisites:

- Dart or Docker Desktop

```
dart run bin/server.dart
```

## Deploy

Works well on [Google Cloud Run](https://cloud.google.com/run).

```
npm run deploy
```
