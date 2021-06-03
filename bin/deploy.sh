trash site/out
npm run build --prefix site
# Excluding Firebase function deploy in favor of the dart-sass-server Cloud Run instead
firebase deploy --only hosting