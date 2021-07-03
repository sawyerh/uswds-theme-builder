echo "Copying USWDS assets"
cp -R ./node_modules/uswds/dist/fonts/ ./public/fonts/
cp -R ./node_modules/uswds/dist/img/ ./public/img/

echo "Copying USWDS tokens"
node ./scripts/copy-uswds-tokens.js