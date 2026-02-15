import React, { useState, useRef, useEffect } from "react";

const API_CHAT_URL = "/api/assistant/chat";
const API_UPLOAD_URL = "/api/assistant/upload";

const Assistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(API_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      const reply = data?.reply || "No response received.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Try again?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Add file upload message to chat immediately (like user message)
    const fileMessage = {
      role: "user",
      type: "file",
      content: `📎 ${selectedFile.name}`,
      fileName: selectedFile.name,
      // You can add fileUrl: URL.createObjectURL(selectedFile) if you want preview
    };

    setMessages((prev) => [...prev, fileMessage]);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeFile = async () => {
    if (!file || isLoading) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(API_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const result = data?.result || "File processed successfully.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result },
      ]);

      clearFile();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to analyze file." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (file) {
        analyzeFile();
      } else {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50/70">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="max-w-3xl mx-auto space-y-6 pb-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-white shadow border border-gray-200 flex items-center justify-center text-3xl mb-4">
                ✨
              </div>
              <h2 className="text-xl font-semibold text-gray-700">
                How can I assist you today?
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Ask anything or upload a file (PDF, image) to analyze
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`max-w-[86%] md:max-w-[78%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#0f62fe] text-white rounded-br-xl"
                    : "bg-white border border-gray-200 rounded-bl-xl prose prose-slate"
                }`}
              >
                {msg.type === "file" ? (
                  <div className="flex items-center gap-2">
                    <i className="ri-file-line text-lg opacity-90"></i>
                    <span className="font-medium">{msg.content}</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}

                    {msg.role === "assistant" &&
                      idx === messages.length - 1 &&
                      !isLoading && (
                        <button
                          className="mt-2 text-xs text-blue-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => alert("Regenerate not implemented yet")}
                        >
                          Regenerate
                        </button>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                </div>
                <span className="text-sm text-gray-500 font-medium">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t bg-white px-4 py-4 md:px-6 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:border-[#0f62fe] focus-within:ring-2 focus-within:ring-[#0f62fe]/15 transition-all duration-150">

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="application/pdf,image/*,.docx,.txt"
              className="hidden"
            />

            {/* Paperclip + file preview */}
            <div className="flex items-center min-w-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-500 hover:text-[#0f62fe] hover:bg-gray-50 rounded-lg transition-colors"
                title="Attach file"
              >
                <i className="ri-attachment-2 text-xl"></i>
              </button>

              {file && (
                <div className="flex items-center gap-2 max-w-[180px] md:max-w-[260px] truncate">
                  <span className="text-sm text-gray-600 truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={clearFile}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove file"
                  >
                    <i className="ri-close-line text-lg"></i>
                  </button>
                </div>
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Shift + Enter for new line)"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none py-3.5 px-2 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 min-h-[52px] max-h-[180px]"
            />

            <div className="flex items-center gap-1.5 pr-2">
              {file ? (
                <button
                  onClick={analyzeFile}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl disabled:opacity-60 transition-colors shadow-sm"
                >
                  Analyze
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-[#0f62fe] hover:bg-[#0b55e6] text-white rounded-xl disabled:opacity-50 disabled:hover:bg-[#0f62fe] transition-all shadow-sm"
                  aria-label="Send"
                >
                  <i className="ri-send-plane-2-fill text-lg"></i>
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2.5 text-center md:text-left">
            Enter to {file ? "analyze file" : "send"} • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assistant;