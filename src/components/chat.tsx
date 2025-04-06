"use client";

import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { CornerDownLeft, RotateCcw, Square } from "lucide-react";
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

  const onClick = () => {
    if (status === "ready" || status === "error") {
      handleSubmit();
    } else {
      stop();
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 max-w-md">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id} className={cn("whitespace-pre-wrap")}>
            {message.role === "user" ? "User: " : "AI: "}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
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
