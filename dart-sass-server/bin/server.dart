// Copyright (c) 2021, the Dart project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'dart:convert';
import 'dart:io';

import 'package:sass/sass.dart' as sass;
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

Future main() async {
  // If the "PORT" environment variable is set, listen to it. Otherwise, 8080.
  // https://cloud.google.com/run/docs/reference/container-contract#port
  final port = int.parse(Platform.environment['PORT'] ?? '8080');

  final pipeline =
      Pipeline().addMiddleware(logRequests()).addHandler(_compileHandler);

  final server = await shelf_io.serve(
    pipeline,
    InternetAddress.anyIPv4, // Allows external connections
    port,
  );

  print('Serving at http://${server.address.host}:${server.port}');
}

Future<Response> _compileHandler(Request request) async {
  var bodyRaw = await request.readAsString();
  var body = bodyRaw.isNotEmpty ? json.decode(bodyRaw) : {};
  var tokens = [];
  body.forEach((key, value) => tokens.add('$key: $value;'));
  var tokensStr = tokens.join('');

  var source = '''
  \$theme-show-notifications: false;
  $tokensStr
  /* USWDS Theme Builder */
  @import "../public/uswds/uswds.scss";
''';

  var output = sass.compileString(source, loadPaths: ['bin'], quietDeps: true);

  return Response.ok(output);
}
