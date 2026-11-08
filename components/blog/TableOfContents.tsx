"use client";

import React, { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface TableOfContentsProps {
  items?: TocItem[];
  className?: string;
}

export default function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>(items || []);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      // If items not provided or empty, extract dynamically from container
      if (!items || items.length === 0) {
        const articleEl = document.querySelector("article[data-blog-content]");
        if (articleEl) {
          const found = Array.from(articleEl.querySelectorAll("h2, h3"))
            .map((el) => {
              const level = el.tagName.toLowerCase() === "h2" ? 2 : 3;
              const text = el.textContent || "";
              let id = el.id;
              if (!id) {
                id = text
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");
                el.id = id;
              }
              return { id, text, level };
            })
            .filter((h) => h.id && h.text);
          setHeadings(found);
        }
      } else {
        setHeadings(items);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [items]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // 120px offset for top navbar
      let currentActiveId = headings[0]?.id || "";

      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            currentActiveId = h.id;
          }
        }
      }
      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 90; // offset for sticky header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Mục lục bài viết"
      className={`bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-200/60">
        <svg
          className="w-4 h-4 text-[#8B1D2C]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
          Mục Lục Bài Viết
        </span>
      </div>

      <ul className="space-y-2 text-sm">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          const isH3 = h.level === 3;

          return (
            <li
              key={h.id}
              className={`${isH3 ? "pl-4" : ""} transition-colors duration-150`}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => scrollToHeading(e, h.id)}
                className={`block py-1 text-xs leading-relaxed transition-all cursor-pointer border-l-2 pl-3 -ml-px ${isActive
                  ? "border-[#8B1D2C] text-[#8B1D2C] font-bold"
                  : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                  }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

