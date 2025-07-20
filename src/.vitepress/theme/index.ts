// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import WipHeader from "./WipHeader.vue";
import "./style.css";
import "./fonts.css";
import MermaidDiagram from "../MermaidDiagram.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => h(WipHeader),
    });
  },
  enhanceApp(ctx) {
    ctx.app.component("MermaidDiagram", MermaidDiagram);
  },
} satisfies Theme;
