<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog"
import { Icon } from "@iconify/vue"
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute } from "vuepress/client"
import Typed from "typed.js"

const quotes = [
  "悟已往之不谏，知来者之可追",
  "Stay hungry, stay foolish.",
  "天接云涛连晓雾, 星河欲转千帆舞",
  "醉后不知天在水，满船清梦压星河",
  "要么独处，要么庸俗"
]

const route = useRoute()
const quoteRef = ref<HTMLElement>()

let typed: Typed | null = null

function destroyTyped() {
  typed?.destroy()
  typed = null
}

async function initTyped() {
  destroyTyped()
  await nextTick()
  const el = quoteRef.value
  if (!el || !el.isConnected) return
  destroyTyped()

  el.innerHTML = ""
  const random = quotes[Math.floor(Math.random() * quotes.length)]

  typed = new Typed(el, {
    strings: [random],
    typeSpeed: 50,
    backSpeed: 0,
    showCursor: true,
    loop: false,
  })
}

onMounted(() => {
  void initTyped()
})

// 解决重新回到主页时quote动画消失问题
watch(() => route.path, () => {
  void initTyped()
})

onBeforeUnmount(() => {
  destroyTyped()
})
</script>

<template>
  <Blog>
    <template #heroInfo>
      <div class="custom-hero">

        <div class="hero-divider"></div>
        <h1 class="hero-title">猫璃琉霜 | Neliko Zxgaer</h1>
        <h3 class="hero-quote"><span ref="quoteRef"></span></h3>
        <div class="hero-divider"></div>

        <!-- 链接 -->
        <div class="hero-socials">
          <a href="https://space.bilibili.com/651930576" target="_blank" rel="noopener noreferrer"
            aria-label="Bilibili">
            <Icon icon="simple-icons:bilibili" class="social-icon" />
          </a>

          <a href="https://github.com/Zxgaer" target="_blank" rel="noopener noreferrer" aria-label="Github">
            <Icon icon="mdi:github" class="social-icon" />
          </a>

          <a href="https://x.com/Zxgaer16971" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Icon icon="ri:twitter-x-fill" class="social-icon" />
          </a>

          <a href="https://steamcommunity.com/id/zxgaer/" target="_blank" rel="noopener noreferrer" aria-label="Steam">
            <Icon icon="mdi:steam" class="social-icon" />
          </a>

          <a href="https://discordapp.com/users/1136217074633560114" target="_blank" rel="noopener noreferrer"
            aria-label="Discord">
            <Icon icon="ic:baseline-discord" class="social-icon" />
          </a>

        </div>
      </div>
    </template>
  </Blog>
</template>

<style scoped>
.hero-title {
  font-family:
    "Noto Serif SC",
    "Noto Serif CJK SC",
    "Noto Serif",
    "Source Han Serif SC",
    "Songti SC",
    "STSong",
    "SimSun",
    serif;
  margin-top: -8px;
  font-size: clamp(1.2rem, 5vw, 2rem);
  line-height: 1.35;
  letter-spacing: .02em;
  background: linear-gradient(135deg, #f4d6ff 0%, #9d8cff 50%, #97c2f3 100%);

  background-clip: text;
  -webkit-background-clip: text;

  color: transparent;
  -webkit-text-fill-color: transparent;
}

.hero-quote {
  font-family: "LXGW Wenkai",sans-serif;
  font-size: clamp(0.6rem, 5vw, 1.3rem);

  margin-top: 6px;
  font-weight: 400;
  opacity: .9;
}

.custom-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-socials {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  width: fit-content;
  max-width: 100%;

  margin-top: 20px;
}

.hero-socials a {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: white;
  text-decoration: none;
  background: rgba(255, 255, 255, .12);
  border: 1px solid rgba(255, 255, 255, .18);
  backdrop-filter: blur(14px);
  transition: .25s ease;
}

.hero-socials a:hover {
  transform: translateY(-4px);

  background: rgba(140, 100, 255, .25);
}

.social-icon {
  font-size: 28px;
}

.hero-divider {
  width: 70%;
  height: 1px;
  margin: 14px 0;
  background:
    linear-gradient(to right,
      transparent,
      rgba(255, 255, 255, .45),
      transparent);

  opacity: .9;
}

@media (prefers-reduced-motion: reduce) {
  .hero-socials a {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
</style>
