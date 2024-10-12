import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(`${__dirname}/package.json`, 'utf-8'));

const extensions = ['.js', '.ts'];

export default {
  input: 'src/index.ts',

  external: ["bufferpack", "dayjs", "fs"], // 告诉rollup不要将这些模块打包进去

  output: [
    {
      file: pkg.module,
      format: 'esm', // es module 形式的包， 用来import 导入， 可以tree shaking
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs', // commonjs 形式的包， require 导入
      sourcemap: true,
    },
  ],

  plugins: [
    uglify(),
    resolve({
      extensions,
      modulesOnly: true,
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig.json',
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
};
