/**
 * Vitepressで使われているVue入りMarkdownを整形するスクリプト。
 * 具体的には以下の処理を行う：
 * - Markdownファイル全体をPrettierで整形する
 * - mdast-util-from-markdownを使ってHTML部分を抽出し、Vueの部分だけPrettierで整形する
 *   - この時、Vueの部分は`<script>`タグでは無い限りは`<template>`タグで囲んであるものとして扱う
 *
 * 使い方:
 * - `--check`：ファイルが整形されているかチェックする
 * - `--write`：ファイルを整形する
 * - `--verbose`：差分を表示する
 */
import { glob, readFile, writeFile } from "node:fs/promises";
import { styleText } from "node:util";
import { format } from "prettier";
import { fromMarkdown } from "mdast-util-from-markdown";
import { createPatch } from "diff";

const { mode, verbose } = parseArgs();
main().catch((e) => {
  console.error(styleText("red", String(e)));
  process.exit(1);
});

async function main() {
  console.log(
    `Mode: ${mode === "check" ? styleText("green", "Check") : styleText("red", "Write")}${
      verbose ? " (Verbose)" : ""
    }`,
  );

  let changedCount = 0;
  for await (const filePath of glob("./src/**/*.md")) {
    process.stdout.write(`${filePath}: `);

    const source = await readFile(filePath, "utf8");
    const result = await formatMarkdown(source);
    if (source !== result) {
      changedCount++;
      if (mode === "write") {
        await writeFile(filePath, result);
      }
    }

    printResult(filePath, source, result);
  }

  if (mode === "check") {
    console.log(`${changedCount} files need formatting`);
    if (changedCount > 0) {
      throw new Error("Some files need formatting");
    }
  } else {
    console.log(`Formatted ${changedCount} files`);
  }
}

function parseArgs() {
  const help = process.argv.includes("--help");

  const check = process.argv.includes("--check");
  const write = process.argv.includes("--write");
  const verbose = process.argv.includes("--verbose");

  if (help || (!check && !write)) {
    console.log(`Usage: tools/format.ts [--check|--write] [--verbose]`);
    process.exit(0);
  }

  if (check && write) {
    throw new Error("Cannot use both --check and --write");
  }

  return { mode: check ? "check" : "write", verbose };
}

function dedent(source: string): string {
  const lines = source.split("\n");
  const indent = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.match(/^\s*/)![0].length)
    .reduce((a, b) => Math.min(a, b), Infinity);
  return lines.map((line) => line.slice(indent)).join("\n");
}

async function formatVueLike(segment: string): Promise<string> {
  if (segment.trimStart().startsWith("<script")) {
    // scriptっぽい場合：そのまま整形
    const base = await format(segment, {
      parser: "vue",
    });
    return dedent(base).trim();
  } else {
    const trimLinePattern = /^\n+|\n+$/g;
    // scriptでない場合：templateタグで囲んで整形した後に、templateタグを取り除いて先頭のインデントを取り除く
    const base = await format(`<template>${segment}</template>`, {
      parser: "vue",
    });
    return dedent(
      base
        .replace(trimLinePattern, "")
        .slice("<template>".length, -"</template>".length)
        .replace(trimLinePattern, ""),
    ).trim();
  }
}

type Node = {
  type: string;
  position: {
    start: {
      offset: number;
    };
    end: {
      offset: number;
    };
  };
};
type HtmlNode = Node & {
  type: "html";
};

function findHtmlNodes(node: Node): HtmlNode[] {
  const htmlNodes: HtmlNode[] = [];

  const visit = (node: Node) => {
    if (node.type === "html") {
      htmlNodes.push(node as HtmlNode);
    }
    if ("children" in node) {
      for (const child of node.children as Node[]) {
        visit(child);
      }
    }
  };

  visit(node);

  return htmlNodes;
}

async function formatMarkdown(source: string): Promise<string> {
  const baseFormatted = await format(source, {
    parser: "markdown",
  });
  const ast = fromMarkdown(baseFormatted);

  const htmlNodes = findHtmlNodes(ast as Node);

  // 処理を楽にするために、後ろから処理する
  htmlNodes.sort((a, b) => {
    return b.position.start.offset - a.position.start.offset;
  });

  // HTML部分を切り取って整形して、元のMarkdownの部分を置き換える
  let replaced = baseFormatted;
  for (const node of htmlNodes) {
    const nodeContent = replaced.slice(
      node.position.start.offset,
      node.position.end.offset,
    );
    const formattedNode = await formatVueLike(nodeContent);

    replaced =
      replaced.slice(0, node.position.start.offset) +
      formattedNode +
      replaced.slice(node.position.end.offset);
  }

  return replaced;
}

function printDiff(filePath: string, source: string, result: string) {
  // patchの先頭のIndexとかを削除。
  const diff = createPatch(filePath, source, result).replace(
    /[\s\S]+?(?=@@)/,
    "",
  );
  console.log("=".repeat(80));
  for (const line of diff.split("\n")) {
    if (line.startsWith("-")) {
      console.log(styleText("red", line));
    } else if (line.startsWith("+")) {
      console.log(styleText("green", line));
    } else {
      console.log(styleText("gray", line));
    }
  }
  console.log("=".repeat(80));
}

function printResult(filePath: string, source: string, result: string) {
  if (source !== result) {
    if (mode === "check") {
      console.log(styleText("red", "Needs formatting"));
    } else {
      console.log(styleText("green", "Formatted"));
    }

    if (verbose) {
      printDiff(filePath, source, result);
    }
  } else {
    console.log(styleText("gray", "No changes"));
  }
}
