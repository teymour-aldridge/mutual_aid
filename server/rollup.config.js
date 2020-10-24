let flow = require('rollup-plugin-flow');

export default {
    input: 'src/index.js',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [flow({all: true})]
};