import { defineClientConfig } from "vuepress/client";
import Blog from "./layouts/Blog.vue";
import FileIndex from "./components/FileIndex.vue";
import FileEntry from "./components/FileEntry.vue";
import FriendLinks from "./components/FriendLinks.vue";
import FriendLinkCard from "./components/FriendLinkCard.vue";

/* 修复深浅主题突变问题 */
function fixViewTransitionFlash() {
  if (typeof Element === "undefined") return;

  const originalAnimate = Element.prototype.animate;
  if (!originalAnimate || (originalAnimate as any).__hopeViewTransitionFixed) {
    return;
  }

  const patchedAnimate = function (
    this: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ) {
    if (
      typeof options === "object" &&
      options !== null &&
      "pseudoElement" in options &&
      String(options.pseudoElement).includes("::view-transition")
    ) {
      options = { ...options, fill: "forwards" }; //唉唉
    }

    return (originalAnimate as any).call(this, keyframes, options);
  };

  (patchedAnimate as any).__hopeViewTransitionFixed = true;
  Element.prototype.animate =
    patchedAnimate as typeof Element.prototype.animate;
}

export default defineClientConfig({
  enhance({ app }) {

    app.component("FileIndex", FileIndex);
    app.component("FileEntry", FileEntry);
    app.component("FriendLinks", FriendLinks);
    app.component("FriendLinkCard", FriendLinkCard);
  },

  setup() {
    fixViewTransitionFlash();
  },

  layouts: {
    Blog,
  },
});
