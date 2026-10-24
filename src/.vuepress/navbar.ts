import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "主页",
    icon: "ic:round-home",
    link: "/",
  },
  {
    text: "所有文章",
    icon: "ic:round-article",
    link: "/article/",
  },
  {
    text: "时间轴",
    icon: "ic:round-access-time-filled",
    link: "/timeline/",
  },
  {
    text: "关于我",
    icon: "ic:sharp-account-circle",
    link: "/introduction.html",
  },
  {
    text: "文件索引",
    icon: "ic:baseline-insert-drive-file",
    link: "/files.html",
  }
]);
