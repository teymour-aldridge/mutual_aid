cd client;
npm install
npm run-script build;
cd ../
mv client/build server
cd server
npm install --global rollup
npm install
npm install rollup-plugin-flow
rollup --config rollup.config.js
cd ../
