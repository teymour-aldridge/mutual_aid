cd client;
npm run-script build;
cd ../
mv client/build server
cd server
npm install --global rollup
rollup --config rollup.config.js
cd ../
