import fs from "node:fs";
import path from "node:path";

function emojiToCodePoint(emoji: string) {
  return [...emoji].map((c) => c.codePointAt(0)!.toString(16)).join("-");
}

const emojiCache = new Map<string, string>();

// Get the emoji image uri from the emoji code
function getEmojiDataUri(emoji: string) {
  if (emojiCache.has(emoji)) return emojiCache.get(emoji)!;

  const code = emojiToCodePoint(emoji);
  const filePath = path.resolve("node_modules/@twemoji/svg", `${code}.svg`);

  if (!fs.existsSync(filePath)) return null;

  const svg = fs.readFileSync(filePath, "utf8");
  const encoded = Buffer.from(svg).toString("base64");
  const uri = `data:image/svg+xml;base64,${encoded}`;

  emojiCache.set(emoji, uri);
  return uri;
}

// Component to display an emoji in a template
export function Emoji({ emoji, size = 4 }: { emoji: string; size?: number }) {
  const src = getEmojiDataUri(emoji);
  if (!src) return null;

  return (
    <img src={src} width={size} height={size} style={{ display: "inline" }} />
  );
}

// helper function to extract emoji from a string (from a mdx for example) and use the Emoji component after
export function extractEmoji(input: string) {
  const emojiRegex = /\p{Extended_Pictographic}/gu;

  const emojis = input.match(emojiRegex) ?? [];
  const text = input.replace(emojiRegex, "").trim();

  return {
    text,
    emojis,
  };
}
