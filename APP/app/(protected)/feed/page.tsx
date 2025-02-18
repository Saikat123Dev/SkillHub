"use client";
import AddPost from "@/components/AddPost";
import Feed from "@/components/feed/Feed";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <div className={`flex gap-6 pt-6 transition-all duration-300 ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="w-full">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center items-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Post
              </Button>
            </div>
            <Feed />
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-50 bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 animate-in slide-in-from-bottom-4">
            <div className="p-6">
              <AddPost onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
