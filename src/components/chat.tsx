"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import "highlight.js/styles/github-dark.min.css";
import { CornerDownLeft, RotateCcw, Square } from "lucide-react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Chat() {
  const {
    messages,
    input,
    error,
    status,
    stop,
    reload,
    handleInputChange,
    handleSubmit,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, error]);

  const onClick = () => {
    if (status === "ready" || status === "error") {
      handleSubmit();
    } else {
      stop();
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 max-w-md">
      <div className="flex flex-col gap-2 h-[calc(100vh-180px)] overflow-y-auto pb-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("whitespace-pre-wrap")}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <div className="prose dark:prose-invert max-w-full">
                      <ReactMarkdown
                        key={`${message.id}-${i}`}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                case "reasoning":
                  return (
                    <pre key={i}>
                      {part.details.map((detail) =>
                        detail.type === "text" ? detail.text : "<redacted>"
                      )}
                    </pre>
                  );
              }
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />

        {error && (
          <div className="flex justify-between">
            <div className="text-red-500">An error occurred.</div>
            <Button type="button" onClick={() => reload()}>
              <RotateCcw />
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bottom-0 w-full max-w-md p-2 mb-8 flex gap-4 rounded-xl shadow-xl fixed bg-white dark:bg-background"
      >
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <Button type="submit" onClick={onClick}>
          {(status === "streaming" || status === "submitted") && <Square />}
          {(status === "ready" || status === "error") && <CornerDownLeft />}
        </Button>
      </form>
    </div>
  );
}
