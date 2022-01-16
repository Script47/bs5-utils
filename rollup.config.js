import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';

const input = ['src/js/Bs5Utils.js'];

export default [
  {
    // UMD
    input,
    plugins: [
      nodeResolve(),
      babel({
        babelHelpers: 'bundled'
      }),
      terser()
    ],
    output: {
      file: `dist/Bs5Utils.min.js`,
      format: 'umd',
      name: 'Bs5Utils',
      esModule: false,
      sourcemap: true
    }
  },
  {
    // ESM and CJS
    input,
    plugins: [nodeResolve()],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      }
    ]
  }
];
