import vue from 'rollup-plugin-vue2';
import css from 'rollup-plugin-css-only';
import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.js',
  dest: 'dist/vue-popper.min.js',
  sourcemaps: true,
  plugins: [
    vue(),
    css(),
    buble(),
    nodeResolve({ browser: true, jsnext: true, main: true }),
    commonjs(),
    uglify()
  ]
}
