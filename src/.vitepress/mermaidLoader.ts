import { toByteArray } from "base64-js";

// Mermaidが使われていないページでMermaidのクライアントを読み込むのは無駄なので、
// カスタム要素とdynamic importを使って、mermaid-diagramが使われるまでmermaidを読み込まないようにする
const createLoadMermaid = () => {
  let mermaid: Promise<typeof import("mermaid")> | undefined;
  return () => {
    if (!mermaid) {
      mermaid = import("mermaid").then((mod) => {
        // Mermaidの設定を初期化
        mod.default.initialize({
          startOnLoad: false,
          theme: "default",
        });
        return mod;
      });
    }
    return mermaid;
  };
};
const loadMermaid = createLoadMermaid();

class MermaidDiagramElement extends HTMLDivElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const b64EncodedDiagramText = this.innerHTML || "";
    if (!b64EncodedDiagramText) {
      throw new Error("MermaidDiagramElement should have innerHTML.");
    }

    const diagramElement = document.createElement("div");
    diagramElement.textContent = "Mermaidを読み込み中...";

    const svgId = `mermaid-diagram-${crypto.randomUUID()}`;
    const svgElement = document.createElement("svg");
    svgElement.id = svgId;
    diagramElement.appendChild(svgElement);
    this.replaceWith(diagramElement);

    void (async () => {
      const mermaid = await loadMermaid();
      try {
        const textDecoder = new TextDecoder();
        const diagramText = textDecoder.decode(
          toByteArray(b64EncodedDiagramText),
        );
        const { svg, bindFunctions } = await mermaid.default.render(
          svgId,
          diagramText,
        );
        diagramElement.innerHTML = svg;
        bindFunctions?.(diagramElement);
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        diagramElement.textContent = "Mermaidのレンダリングに失敗しました。";
      }
    })();
  }
}

customElements.define("mermaid-diagram", MermaidDiagramElement, {
  extends: "div",
});
