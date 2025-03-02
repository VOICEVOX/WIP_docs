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

const trimLinePattern = /^\n+|\n+$/g;
const dedent = (source: string): string => {
  const lines = source.split("\n");
  const indent = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.match(/^\s*/)![0].length)
    .reduce((a, b) => Math.min(a, b), Infinity);
  return lines.map((line) => line.slice(indent)).join("\n");
};
const formatVueLike = async (segment: string): Promise<string> => {
  if (segment.trimStart().startsWith("<script")) {
    return await format(segment, {
      parser: "vue",
    });
  } else {
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
};

const formatMarkdown = async (
  source: string,
  file: string,
): Promise<string> => {
  let formatted = await format(source, {
    parser: "markdown",
    filepath: file,
  });
  const ast = fromMarkdown(formatted);

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

  visit(ast as Node);

  // 処理を楽にするために、後ろから処理する
  htmlNodes.sort((a, b) => {
    return b.position.start.offset - a.position.start.offset;
  });

  for (const node of htmlNodes) {
    const nodeContent = formatted.slice(
      node.position.start.offset,
      node.position.end.offset,
    );
    const formattedNode = await formatVueLike(nodeContent);

    formatted =
      formatted.slice(0, node.position.start.offset) +
      formattedNode +
      formatted.slice(node.position.end.offset);
  }

  return formatted;
};

console.log(
  `Mode: ${check ? styleText("green", "Check") : styleText("red", "Write")}`,
);
let count = 0;
for await (const file of glob("./src/**/*.md")) {
  console.log(`${file}:`);
  const source = await readFile(file, "utf8");

  const result = await formatMarkdown(source, file);
  if (source !== result) {
    if (check) {
      console.log(styleText("red", "  Needs formatting"));
    } else {
      await writeFile(file, result);
      console.log(styleText("green", "  Formatted"));
    }

    if (verbose) {
      const diff = createPatch(file, source, result);
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
    count++;
  } else {
    console.log(styleText("gray", "  No changes"));
  }
}

console.log(`Formatted ${count} files.`);
if (check && count > 0) {
  throw new Error("Some files need formatting");
}
