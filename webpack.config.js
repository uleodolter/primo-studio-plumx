import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: 'primoStudioPlumx.js',
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  mode: 'production',
}
