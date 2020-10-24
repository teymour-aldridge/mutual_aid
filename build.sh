cd client;
npm install react-scripts
npm run-script build;
cd ../
mv client/build server
cd server
npm install --global rollup
rollup --config rollup.config.js
cat bundle.js
cd ../
