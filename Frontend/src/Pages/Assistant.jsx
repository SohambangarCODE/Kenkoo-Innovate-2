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

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";

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
      // Dummy fallback for demonstration
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I'm currently in offline mode. I received: " + trimmed },
        ]);
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const analyzeFile = async () => {
    if (!file || isLoading) return;

    setIsLoading(true);
    
    // Show file upload message
    setMessages((prev) => [...prev, { 
        role: "user", 
        type: "file", 
        content: `Uploaded: ${file.name}`,
        fileName: file.name 
    }]);

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
       // Dummy fallback
       setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `I've analyzed ${file.name}. It looks good! (Dummy response)` },
          ]);
          clearFile();
      }, 1000);
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
    // Main Container: Fills available height between Navbar and Footer
    // h-[calc(100vh-130px)] accounts for Navbar (~70px) + Footer (~60px)
    <div className="flex flex-col h-[calc(100vh-130px)] bg-gray-50">
      
      {/* Chat Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-500">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                <span className="text-3xl"><img src="/logo.png-removebg-preview.png" alt="" /></span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Kenkoo Assistant</h2>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Ask about your health records, care plan, or upload documents for analysis.
              </p>
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === "user" ? "bg-blue-600 text-white" : " text-black"
                }`}>
                    {msg.role === "user" ? <i class="ri-robot-2-fill"></i> : <i class="ri-robot-2-fill"></i>}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.type === "file" ? (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/20 rounded-lg">
                        <i className="ri-file-text-line text-lg"></i>
                      </div>
                      <span className="font-medium truncate">{msg.fileName}</span>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex w-full justify-start">
               <div className="flex max-w-[85%] gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-sm">
                     <i className="ri-openai-fill text-sm"></i>
                  </div>
                  <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
               </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom of the flex container */}
      <div className="bg-white border-t border-gray-100 p-4 md:px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10">
        <div className="max-w-3xl mx-auto">
            
            {/* Selected File Preview */}
            {file && (
                <div className="mb-3 flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg w-fit text-sm border border-blue-100 animate-fade-in">
                    <i className="ri-attachment-line"></i>
                    <span className="truncate max-w-[200px] font-medium">{file.name}</span>
                    <button onClick={clearFile} className="ml-2 text-blue-400 hover:text-blue-700 transition-colors">
                        <i className="ri-close-circle-fill text-lg"></i>
                    </button>
                </div>
            )}

          <div className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all shadow-inner">
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
            />
            
            {/* Attachment Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
              title="Attach file"
            >
              <i className="ri-add-circle-line text-2xl"></i>
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={file ? "Add a message about this file..." : "Message Assistant..."}
              className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 text-gray-700 placeholder-gray-400 max-h-[120px] overflow-y-auto leading-relaxed focus:outline-none"
              rows={1}
              style={{ minHeight: '48px' }}
            />

            {/* Send Button */}
            <button
              onClick={file ? analyzeFile : sendMessage}
              disabled={(!input.trim() && !file) || isLoading}
              className={`p-2.5 rounded-lg shrink-0 transition-all duration-200 flex items-center justify-center ${
                (!input.trim() && !file) || isLoading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                 <i className="ri-loader-4-line animate-spin text-xl"></i>
              ) : (
                 <i className="ri-arrow-up-line text-xl font-bold"></i>
              )}
            </button>
          </div>
          
          <div className="text-center mt-3">
             <p className="text-[11px] text-gray-400">
                Kenkoo Assistant can make mistakes. Consider checking important information.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;













// import React, { useState, useRef, useEffect } from "react";

// const API_CHAT_URL = "/api/assistant/chat";
// const API_UPLOAD_URL = "/api/assistant/upload";

// const Assistant = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [file, setFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const textareaRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isLoading]);

//   const sendMessage = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || isLoading) return;

//     const userMessage = { role: "user", content: trimmed };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const res = await fetch(API_CHAT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: trimmed }),
//       });

//       if (!res.ok) throw new Error("Network error");

//       const data = await res.json();
//       const reply = data?.reply || "No response received.";

//       setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Sorry, something went wrong. Try again?" },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFileSelect = (e) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);

//     // Add file upload message to chat immediately (like user message)
//     const fileMessage = {
//       role: "user",
//       type: "file",
//       content: `📎 ${selectedFile.name}`,
//       fileName: selectedFile.name,
//       // You can add fileUrl: URL.createObjectURL(selectedFile) if you want preview
//     };

//     setMessages((prev) => [...prev, fileMessage]);
//   };

//   const clearFile = () => {
//     setFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const analyzeFile = async () => {
//     if (!file || isLoading) return;

//     setIsLoading(true);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch(API_UPLOAD_URL, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       const result = data?.result || "File processed successfully.";

//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: result },
//       ]);

//       clearFile();
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Failed to analyze file." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       if (file) {
//         analyzeFile();
//       } else {
//         sendMessage();
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50/70">
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
//         <div className="max-w-3xl mx-auto space-y-6 pb-6">
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
//               <div className="w-16 h-16 rounded-2xl bg-white shadow border border-gray-200 flex items-center justify-center text-3xl mb-4">
//                 ✨
//               </div>
//               <h2 className="text-xl font-semibold text-gray-700">
//                 How can I assist you today?
//               </h2>
//               <p className="mt-2 text-sm text-gray-500">
//                 Ask anything or upload a file (PDF, image) to analyze
//               </p>
//             </div>
//           )}

//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} group`}
//             >
//               <div
//                 className={`max-w-[86%] md:max-w-[78%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
//                   msg.role === "user"
//                     ? "bg-[#0f62fe] text-white rounded-br-xl"
//                     : "bg-white border border-gray-200 rounded-bl-xl prose prose-slate"
//                 }`}
//               >
//                 {msg.type === "file" ? (
//                   <div className="flex items-center gap-2">
//                     <i className="ri-file-line text-lg opacity-90"></i>
//                     <span className="font-medium">{msg.content}</span>
//                   </div>
//                 ) : (
//                   <div className="whitespace-pre-wrap break-words">
//                     {msg.content}

//                     {msg.role === "assistant" &&
//                       idx === messages.length - 1 &&
//                       !isLoading && (
//                         <button
//                           className="mt-2 text-xs text-blue-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
//                           onClick={() => alert("Regenerate not implemented yet")}
//                         >
//                           Regenerate
//                         </button>
//                       )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2.5 shadow-sm">
//                 <div className="flex gap-1.5">
//                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
//                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
//                   <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
//                 </div>
//                 <span className="text-sm text-gray-500 font-medium">Thinking...</span>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Input area */}
//       <div className="border-t bg-white px-4 py-4 md:px-6 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
//         <div className="max-w-3xl mx-auto">
//           <div className="relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:border-[#0f62fe] focus-within:ring-2 focus-within:ring-[#0f62fe]/15 transition-all duration-150">

//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileSelect}
//               accept="application/pdf,image/*,.docx,.txt"
//               className="hidden"
//             />

//             {/* Paperclip + file preview */}
//             <div className="flex items-center min-w-0">
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="p-3 text-gray-500 hover:text-[#0f62fe] hover:bg-gray-50 rounded-lg transition-colors"
//                 title="Attach file"
//               >
//                 <i className="ri-attachment-2 text-xl"></i>
//               </button>

//               {file && (
//                 <div className="flex items-center gap-2 max-w-[180px] md:max-w-[260px] truncate">
//                   <span className="text-sm text-gray-600 truncate">
//                     {file.name}
//                   </span>
//                   <button
//                     onClick={clearFile}
//                     className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
//                     title="Remove file"
//                   >
//                     <i className="ri-close-line text-lg"></i>
//                   </button>
//                 </div>
//               )}
//             </div>

//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask anything... (Shift + Enter for new line)"
//               rows={1}
//               disabled={isLoading}
//               className="flex-1 resize-none py-3.5 px-2 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-50 min-h-[52px] max-h-[180px]"
//             />

//             <div className="flex items-center gap-1.5 pr-2">
//               {file ? (
//                 <button
//                   onClick={analyzeFile}
//                   disabled={isLoading}
//                   className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-xl disabled:opacity-60 transition-colors shadow-sm"
//                 >
//                   Analyze
//                 </button>
//               ) : (
//                 <button
//                   onClick={sendMessage}
//                   disabled={!input.trim() || isLoading}
//                   className="p-3 bg-[#0f62fe] hover:bg-[#0b55e6] text-white rounded-xl disabled:opacity-50 disabled:hover:bg-[#0f62fe] transition-all shadow-sm"
//                   aria-label="Send"
//                 >
//                   <i className="ri-send-plane-2-fill text-lg"></i>
//                 </button>
//               )}
//             </div>
//           </div>

//           <p className="text-xs text-gray-400 mt-2.5 text-center md:text-left">
//             Enter to {file ? "analyze file" : "send"} • Shift+Enter for new line
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Assistant;