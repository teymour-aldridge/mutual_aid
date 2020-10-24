cd client;
npm install
npm run-script build;
cd ../
mv client/build server
cd server
npm install --global rollup
npm install
rollup --config rollup.config.js
cat bundle.js
cd ../
