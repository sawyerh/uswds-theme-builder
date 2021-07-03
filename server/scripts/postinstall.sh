echo "Copying USWDS Sass files for themeing"
cp -R node_modules/uswds/dist/scss public/uswds
sed -i '' -e 's/function pow/function _relaced_with_builtin_pow/g' ./public/uswds/core/_functions.scss

echo "Installing Dart dependencies"
dart pub get