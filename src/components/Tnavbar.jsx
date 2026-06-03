import { ArrowLeft, Heart, Share2, Download } from "lucide-react";

const Tnavbar = () => {
  return (
    <nav className="bg-white border-bottom shadow-sm fixed w-full z-10 ">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        
        <button className="flex items-center gap-2 font-medium hover:cursor-pointer transition">
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-6">
          <Heart size={20} />
          <Share2 size={20} />

          <button className="flex items-center gap-2 px-5 py-3 rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600">
            <Download size={18} />
            Download PDF
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Tnavbar;