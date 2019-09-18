import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/unide.js",
  output: {
    file: "public/bundle.js",
    name: "bundle",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true
  },
  plugins: [
    css({ output: "public/bundle.css" }),
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    production && terser() // minify, but only in production
  ]
};
