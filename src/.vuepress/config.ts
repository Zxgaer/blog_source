import { defineUserConfig } from "vuepress";
import theme from "./theme.js";


export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "Zxgaer's Blog",
    description: "Zxgaer的个人网站",
    theme,
    head: [
        [
            "link",
            {
                rel: "preload",
                as: "image",
                href: "https://zxgaer-blog.cn-nb1.rains3.com/background.webp",
            },
        ],
        [
            "link",
            {
                rel: "preload",
                as: "image",
                href: "https://zxgaer-blog.cn-nb1.rains3.com/background_dark.webp",
            },
        ]
    ]
});
