<template>
  <div class="mermaid-diagram">
    <svg ref="svgRef" :svgId v-html="svgContent" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useId } from "vue";
import mermaid from "mermaid";

const props = defineProps<{
  diagram: string;
}>();

const id = useId();
const svgId = ref(`mermaid-svg-${id}`);
const svgRef = ref<SVGSVGElement | null>(null);
const svgContent = ref("");

onMounted(async () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
  });

  const { svg, bindFunctions } = await mermaid.render(
    svgId.value,
    props.diagram,
  );
  svgContent.value = svg;
  if (!svgRef.value) {
    throw new Error("SVG element is not available");
  }
  bindFunctions?.(svgRef.value);
});
</script>
