echo "Installing top-level dependencies\n"
npm install

echo "Installing frontend dependencies\n"
npm install --prefix site

echo "Installing server dependencies\n"
npm install --prefix server