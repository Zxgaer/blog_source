import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
export default hopeTheme({
    hostname: "https://neliko.top",
    author: {
        name: "Zxgaer",
        url: "https://neliko.top",
    },
    logo: "https://zxgaer-blog.cn-nb1.rains3.com/logo2.webp",
    docsDir: "src",
    favicon: "https://zxgaer-blog.cn-nb1.rains3.com/favicon.svg",
    navbar,
    sidebar,
    footer: "Everyone is lovely.",
    displayFooter: true,
    blog: {
        avatar:"https://zxgaer-blog.cn-nb1.rains3.com/avatar2.webp",
        description:"The quieter you are, the more you hear.",
        intro: "/introduction.html"
    },
    metaLocales: {
        editLink: "在 GitHub 上编辑此页",
    },
    markdown: {
        math: {
            type: "katex",
        },
        //上下角标
        sub: true,
        sup: true,
        spoiler: true
    },
    plugins: {
        blog: {
            excerptLength:20
        },
        icon: {
            //"iconify", "fontawesome", "fontawesome-with-brands"
            assets: "iconify",
        },
    }
});
