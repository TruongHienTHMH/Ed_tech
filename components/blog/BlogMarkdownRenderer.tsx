"use client";

import React from "react";
import CodeBlockWithCopy from "./CodeBlockWithCopy";

export interface BlogMarkdownRendererProps {
  content: string;
  className?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderInlineText(text: string): React.ReactNode {
  // Simple inline parser for bold **text**, inline code `code`, and links [text](url)
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-neutral-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-neutral-100 text-[#8B1D2C] font-mono text-xs font-semibold border border-neutral-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            className="text-[#8B1D2C] underline hover:text-[#AF445A] font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts.length > 0 ? parts : text;
}

export default function BlogMarkdownRenderer({
  content,
  className = "",
}: BlogMarkdownRendererProps) {
  if (!content) return null;

  // Split lines into blocks (code blocks vs regular text blocks)
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "sql";
  let listBuffer: string[] = [];

  const flushList = (key: number) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="my-4 space-y-2 pl-5 list-disc text-neutral-700 text-base leading-relaxed">
          {listBuffer.map((item, idx) => (
            <li key={idx}>{renderInlineText(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code block start/end
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        flushList(i);
        inCodeBlock = true;
        codeLang = line.trim().replace(/^```/, "").trim() || "sql";
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <CodeBlockWithCopy
            key={`code-${i}`}
            code={codeBuffer.join("\n")}
            language={codeLang}
          />
        );
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // List item
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      listBuffer.push(line.trim().replace(/^[-*]\s+/, ""));
      continue;
    } else {
      flushList(i);
    }

    // Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-neutral-200" />
      );
      continue;
    }

    // Heading 2
    if (line.startsWith("## ")) {
      const headingText = line.replace(/^##\s+/, "").trim();
      const id = slugify(headingText);
      elements.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="font-heading font-bold text-2xl sm:text-3xl text-neutral-900 mt-10 mb-4 pt-4 scroll-mt-24 border-b border-neutral-100 pb-2"
        >
          {headingText}
        </h2>
      );
      continue;
    }

    // Heading 3
    if (line.startsWith("### ")) {
      const headingText = line.replace(/^###\s+/, "").trim();
      const id = slugify(headingText);
      elements.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="font-heading font-bold text-xl sm:text-2xl text-neutral-800 mt-8 mb-3 scroll-mt-24"
        >
          {headingText}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteText = line.replace(/^>\s+/, "").trim();
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 p-4 sm:p-5 rounded-r-2xl border-l-4 border-[#8B1D2C] bg-[#FAF7F8] text-neutral-700 italic text-base leading-relaxed"
        >
          {renderInlineText(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-base sm:text-[17px] text-neutral-700 leading-relaxed my-3">
        {renderInlineText(line)}
      </p>
    );
  }

  flushList(lines.length);

  return (
    <article data-blog-content className={`blog-prose ${className}`}>
      {elements}
    </article>
  );
}

