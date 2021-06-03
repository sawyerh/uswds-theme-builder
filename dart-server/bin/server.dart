// Copyright (c) 2021, the Dart project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'dart:convert';
import 'dart:io';

import 'package:sass/sass.dart' as sass;
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_router/shelf_router.dart' as shelf_router;
import 'package:shelf_static/shelf_static.dart' as shelf_static;

Future main() async {
  // If the "PORT" environment variable is set, listen to it. Otherwise, 8080.
  // https://cloud.google.com/run/docs/reference/container-contract#port
  final port = int.parse(Platform.environment['PORT'] ?? '8080');

  // See https://pub.dev/documentation/shelf/latest/shelf/Cascade-class.html
  final cascade = Cascade()
      // First, serve files from the 'public' directory
      .add(_staticHandler)
      // If a corresponding file is not found, send requests to a `Router`
      .add(_router);

  // See https://pub.dev/documentation/shelf/latest/shelf/Pipeline-class.html
  final pipeline = Pipeline()
      // See https://pub.dev/documentation/shelf/latest/shelf/logRequests.html
      .addMiddleware(logRequests())
      .addHandler(cascade.handler);

  // See https://pub.dev/documentation/shelf/latest/shelf_io/serve.html
  final server = await shelf_io.serve(
    pipeline,
    InternetAddress.anyIPv4, // Allows external connections
    port,
  );

  print('Serving at http://${server.address.host}:${server.port}');
}

// Serve files from the file system.
final _staticHandler =
    shelf_static.createStaticHandler('public', defaultDocument: 'index.html');

// Router instance to handler requests.
final _router = shelf_router.Router()
  ..get('/helloworld', _helloWorldHandler)
  ..get('/compile', _compileHandler);

Response _helloWorldHandler(Request request) => Response.ok('Hello, World!');
Response _compileHandler(Request request) {
  var source = '''
  \$test: #ff0000;
  body { color: \$test };
  \$theme-show-notifications: false;
  @import "../public/uswds/uswds.scss";
''';

  // https://github.com/dart-lang/sdk/issues/46141
  var output = sass.compileString(source,
      loadPaths: ['bin'], quietDeps: true, verbose: true);
  return Response.ok(output);
}
