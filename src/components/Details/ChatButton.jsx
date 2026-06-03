import { MessageCircle } from "lucide-react";

const ChatButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative transition-transform duration-300 ease-in-out hover:scale-110">
        
        {/* Notification Dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-300 rounded-full border-2 border-white"></div>

        {/* Chat Button */}
        <button
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
        >
          <MessageCircle size={28} />
        </button>

      </div>
    </div>
  );
};

export default ChatButton;