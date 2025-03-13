import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'

export default [
  {
    input: 'src/module.js',
    output: {
      name: '$checkout',
      file: 'dist/esm/checkout.js',
      format: 'esm',
    },
    plugins: [commonjs({}), resolve({})],
  },
  {
    input: 'src/common.js',
    output: {
      file: 'dist/cjs/checkout.js',
      format: 'cjs',
    },
    plugins: [
      commonjs({}),
      resolve({}),
      copy({
        targets: [
          {
            src: 'package.cjs.json',
            dest: 'dist/cjs',
            rename: () => 'package.json',
          },
        ],
      }),
      babel({
        babelHelpers: 'bundled',
      }),
    ],
  },
  {
    input: 'src/browser.js',
    output: {
      file: 'dist/umd/checkout.js',
      format: 'umd',
      sourcemap: true,
      name: '$checkout',
    },
    plugins: [
      commonjs(),
      resolve({}),
      babel({
        presets: ['@babel/preset-env'],
        babelHelpers: 'bundled',
      }),
      terser(),
    ],
  },
]
