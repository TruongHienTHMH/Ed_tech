"use client";

import React, { useState } from "react";

export interface CodeBlockWithCopyProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export default function CodeBlockWithCopy({
  code,
  language = "sql",
  filename,
  className = "",
}: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`my-6 rounded-2xl overflow-hidden border border-neutral-800 bg-[#1A1D24] shadow-xl text-neutral-100 ${className}`}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#14161C] border-b border-neutral-800/80 text-xs">
        <div className="flex items-center gap-2">
          {/* Mac window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {filename ? (
            <span className="text-neutral-400 font-mono text-xs">{filename}</span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300">
              {language}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${copied
            ? "bg-emerald-600 text-white shadow-xs"
            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
            }`}
          aria-label={copied ? "Đã sao chép" : "Sao chép mã"}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Đã chép!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Sao chép mã</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700 text-neutral-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

