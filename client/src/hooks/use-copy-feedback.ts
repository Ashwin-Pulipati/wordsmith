import { useCallback, useState } from "react";

export type CopyType = "snippet" | "keyword" | "hashtag";

export type CopiedState =
  | { type: CopyType; value: string | number }
  | { type: null; value: null };

export function useCopyFeedback() {
  const [copied, setCopied] = useState<CopiedState>({
    type: null,
    value: null,
  });
  const [message, setMessage] = useState<string>("");

  const handleCopy = useCallback(
    async (type: CopyType, value: string | number, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied({ type, value });

        const label =
          type === "snippet"
            ? "Branding snippet copied to clipboard."
            : type === "keyword"
            ? `Keyword "${text}" copied to clipboard.`
            : `Hashtag "${text}" copied to clipboard.`;

        setMessage(label);

        setTimeout(() => {
          setCopied({ type: null, value: null });
          setMessage("");
        }, 1500);
      } catch (err) {
        console.error("Copy failed:", err);
        setMessage("Copy to clipboard failed.");
      }
    },
    []
  );

  return { copied, message, handleCopy };
}