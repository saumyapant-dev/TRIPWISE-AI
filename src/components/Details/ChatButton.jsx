import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";
import { chatWithAI } from "../../services/api.js";

const ChatButton = ({ destination = "your destination", tripData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello! I'm your TripWise AI concierge for ${destination}. Ask me anything about your itinerary, packing advice, local customs, or hidden gems!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    `What are the top local dishes to try in ${destination}?`,
    `What should I pack for this trip?`,
    `How do I get around locally on a budget?`,
  ];

  const handleSend = async (questionText) => {
    const query = questionText || input;
    if (!query.trim() || loading) return;

    const userMessage = { role: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setInput("");
    setLoading(true);

    try {
      const tripContext = tripData
        ? (typeof tripData === "string" ? tripData.slice(0, 1000) : JSON.stringify(tripData).slice(0, 1000))
        : `Destination: ${destination}`;

      const response = await chatWithAI({
        destination,
        tripContext,
        question: query,
      });

      const reply = response?.data?.reply || response?.reply || "I'm happy to help you with your itinerary! What else would you like to know?";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply },
      ]);
    } catch {
      // Fallback friendly reply if connection has issues
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Here is a tip for ${destination}: Remember to carry comfortable walking shoes, check local payment customs (cards vs cash), and download offline maps before you arrive! Let me know if you need specific attraction details.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                  TripWise Assistant <Sparkles size={13} className="text-yellow-300" />
                </h3>
                <p className="text-[11px] text-white/80 mt-0.5">Online • {destination}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat window"
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/60 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-purple-600" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={12} className="text-indigo-600" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-gray-400 pl-8">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Thinking of recommendations...
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && !loading && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex flex-wrap gap-1.5">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-[11px] bg-gray-100 hover:bg-purple-50 hover:text-purple-700 text-gray-600 px-2.5 py-1 rounded-full transition text-left truncate max-w-full cursor-pointer"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your trip..."
              className="flex-1 text-sm bg-gray-100 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message to AI assistant"
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="relative transition-transform duration-300 ease-in-out hover:scale-105">
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-300 rounded-full border-2 border-white animate-pulse" />
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI chat assistant" : "Open AI travel concierge assistant"}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-xl hover:scale-105 transition cursor-pointer"
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={28} />}
        </button>
      </div>
    </div>
  );
};

export default ChatButton;