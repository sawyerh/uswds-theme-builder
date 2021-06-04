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

  server.autoCompress = true;

  print('Serving at http://${server.address.host}:${server.port}');
}

Future<Response> _compileHandler(Request request) async {
  const corsHeaders = {'Access-Control-Allow-Origin': '*'};

  if (request.method == 'OPTIONS') {
    return Response.ok(null, headers: corsHeaders);
  }

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

  // There's an issue somewhere, related to the luminance function in USWDS that results in
  // a "Infinity or NaN toInt" exception to throw. Related: https://github.com/sass/dart-sass/issues/1059
  var output = sass.compileString(source,
      loadPaths: ['bin'], quietDeps: true, style: sass.OutputStyle.compressed);

  return Response.ok(output,
      headers: {'Content-Type': 'text/css', ...corsHeaders});
}
