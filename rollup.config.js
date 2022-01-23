import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.tsx', // our source file
  output: [
    {
      exports: 'named',
      file: pkg.main,
      format: 'cjs'
    },
    {
      exports: 'named',
      file: pkg.module,
      format: 'es' // the preferred format
    }
    // {
    //   file: pkg.browser,
    //   format: 'iife',
    //   // the global which can be used in a browser
    //   name: 'ReactTinyMarkup'
    // }
  ],
  external: [...Object.keys(pkg.dependencies || {}), 'react'],
  plugins: [
    typescript({
      typescript: require('typescript')
    }),
    terser() // minifies generated bundles
  ]
};
