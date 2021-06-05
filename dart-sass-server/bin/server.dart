import 'dart:convert';
import 'dart:io';

import 'package:sass/sass.dart' as sass;
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

Future main() async {
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

  var source = '''
  /*! USWDS Theme Builder */

  /* Fix uswds themeing in dart sass */
  @use "sass:math" as *;

  \$theme-show-notifications: false;
  ${tokens.join('')}

  @import "../public/uswds/uswds.scss";
''';

  var output = sass.compileString(source,
      quietDeps: true, style: sass.OutputStyle.compressed);

  return Response.ok(output,
      headers: {'Content-Type': 'text/css', ...corsHeaders});
}
