import { Md5 } from "ts-md5";

export default function autoVersionPlugin() {
  return {
    name: 'auto-version',
    async transformIndexHtml(html: string) {
      const hash = Md5.hashStr(html);
      return html.replace(/(src|href)="(.*?)"/g, `$1="$2?v=${hash}"`)
    },
  }
}