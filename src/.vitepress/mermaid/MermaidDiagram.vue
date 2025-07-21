<template>
  <div ref="containerRef" class="mermaid-diagram" v-html="content"></div>
</template>

<script lang="ts">
// Mermaidが使われていないページでMermaidを読み込むのを防ぐために、
// Mermaidを別のバンドルに隔離しておいて、必要になるまで読み込まないようにする。
const loadMermaid = createLoadMermaid();

function createLoadMermaid() {
  let mermaid: Promise<typeof import("mermaid")> | null = null;
  return () => {
    if (!mermaid) {
      mermaid = import("mermaid").then((m) => {
        m.default.initialize({
          startOnLoad: false,
          theme: "default",
        });
        return m;
      });
    }
    return mermaid;
  };
}
</script>
<script setup lang="ts">
import { onMounted, ref, useId } from "vue";

const props = defineProps<{
  diagram: string;
}>();

const internalId = useId();
const id = `mermaid-svg-${internalId}`;
const containerRef = ref<SVGSVGElement | null>(null);
const content = ref("読み込み中...");

onMounted(async () => {
  const mermaid = await loadMermaid();
  const { svg, bindFunctions } = await mermaid.default.render(
    id,
    props.diagram,
  );
  content.value = svg;
  if (!containerRef.value) {
    throw new Error("Container element is not available");
  }
  bindFunctions?.(containerRef.value);
});
</script>
