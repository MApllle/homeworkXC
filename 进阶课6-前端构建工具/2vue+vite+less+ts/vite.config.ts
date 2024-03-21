import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import autoVersionPlugin from "./plugins/myplugin.js";
import legacy from '@vitejs/plugin-legacy';
import path, { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons")],
      symbolId: "icon-[dir]-[name]",
      customDomId: "__svg__icons__dom__",
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    autoVersionPlugin(),
  ],
  //配置别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  base: "./", // 设置打包路径
  server: {
    port: 8899,
    open: true,
    cors: true,
  },
});
