import 'dart:convert';
import 'dart:io';

import 'package:sass/sass.dart' as sass;
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;

Future main() async {
  // https://cloud.google.com/run/docs/reference/container-contract#port
  final port = int.parse(Platform.environment['PORT'] ?? '8080');
  final origin = Platform.environment['ORIGIN'] ?? 'https://uswds-theme.dev';

  Response _setDefaultHeaders(Response response) {
    final corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Max-Age': '300',
      'Vary': 'Origin'
    };

    return response.change(headers: corsHeaders);
  }

  final pipeline = Pipeline()
      .addMiddleware(logRequests())
      .addMiddleware(createMiddleware(responseHandler: _setDefaultHeaders))
      .addHandler(_requestHandler);

  final server = await shelf_io.serve(
    pipeline,
    // Allow external connections
    InternetAddress.anyIPv4,
    port,
  );

  server.autoCompress = true;

  print(
      'Dart server running at http://${server.address.host}:${server.port} for ${origin}');
}

Future<Response> _requestHandler(Request request) async {
  if (request.method == 'OPTIONS') {
    return Response.ok(null);
  }

  var sassContents = await createSassContents(request);

  try {
    var output = sass.compileString(sassContents,
        loadPaths: ['bin'],
        quietDeps: true,
        style: sass.OutputStyle.compressed);

    return Response.ok(output, headers: {'Content-Type': 'text/css'});
  } on sass.SassException catch (e) {
    return Response(400, body: e.toString());
  }
}

Future<String> createSassContents(Request request) async {
  var bodyRaw = await request.readAsString();
  var body = bodyRaw.isNotEmpty ? json.decode(bodyRaw) : {};
  var sassVars = [];
  body.forEach((key, value) => sassVars.add('$key: $value;'));

  return '''
  /*! USWDS Theme Builder */

  /*
    Fix USWDS themeing in Dart Sass:
    https://github.com/uswds/uswds/issues/4220
  */
  @use "sass:math" as *;

  /*
    Make the Sass compilation log less noisy
  */
  \$theme-show-notifications: false;
  \$theme-show-compile-warnings: false;

  /* Don't let the theme site's utilities override the previews */
  \$utilities-use-important: true;

  \$background-color-palettes: ("palette-color-state");
  \$theme-font-path: "/assets/fonts";
  \$theme-image-path: "/assets/img";

  /*
    Custom Sass variables passed in through the request
  */
  ${sassVars.join('')}

  @import "../public/uswds/uswds.scss";
''';
}
