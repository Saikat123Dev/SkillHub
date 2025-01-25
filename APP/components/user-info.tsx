"use client";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UploadButton } from "@uploadthing/react";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

const fetchProfilePic = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/upload");
    if (!response.ok) throw new Error("Failed to fetch profile picture");
    const data = await response.json();
    return data.profilePic;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

const updateProfilePic = async (url: string): Promise<void> => {
  await fetch("/api/upload", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profilePic: url }),
  });
};

export const UserInfo = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchImage = async () => {
      if (!currentUser?.id) return;

      setIsLoading(true);
      try {
        // Check cache first
        const cacheKey = `profilePic_${currentUser.id}`;
        const cachedPic = localStorage.getItem(cacheKey);
        if (cachedPic) {
          setImageUrl(cachedPic);
        }

        // Fetch from API
        const uploadedImage = await fetchProfilePic();
        const newImageUrl = uploadedImage || currentUser?.image || null;

        // Update state and cache if server response differs
        if (uploadedImage !== cachedPic) {
          setImageUrl(newImageUrl);
          if (uploadedImage) {
            localStorage.setItem(cacheKey, uploadedImage);
          } else {
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [currentUser?.id, currentUser?.image]);

  const handleImageReset = async () => {
    if (!currentUser?.id) return;

    setIsLoading(true);
    try {
      await updateProfilePic("");
      setImageUrl(currentUser?.image || null);
      localStorage.removeItem(`profilePic_${currentUser.id}`);
    } catch (error) {
      console.error("Reset error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-[150px] w-[150px] rounded-full relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Profile"
                className="h-full w-full object-cover rounded-full transition-all group-hover:brightness-90"
              />
              <div className={`absolute inset-0 bg-black/20 rounded-full transition-opacity
                ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center
              justify-center rounded-full text-[80px] font-bold text-white shadow-lg">
              {currentUser?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          )}

          {imageUrl && (
            <button
              onClick={handleImageReset}
              className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-full shadow-lg
                hover:scale-110 transition-transform"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        {!imageUrl && !isLoading && (
          <div className="mt-4">
            <UploadButton<OurFileRouter>
              endpoint="imageUploader"
              onClientUploadComplete={async (res) => {
                if (res?.[0]?.url && currentUser?.id) {
                  setIsLoading(true);
                  try {
                    await updateProfilePic(res[0].url);
                    setImageUrl(res[0].url);
                    localStorage.setItem(`profilePic_${currentUser.id}`, res[0].url);
                  } finally {
                    setIsLoading(false);
                  }
                }
              }}
              onUploadError={(error) => {
                alert(`Upload failed: ${error.message}`);
              }}
              appearance={{
                button: "bg-blue-600 ut-ready:bg-blue-700 ut-uploading:cursor-not-allowed",
                allowedContent: "hidden"
              }}
            />
          </div>
        )}

        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentUser?.name || "Anonymous"}
          </h2>
          {currentUser?.email && (
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          )}
        </div>
      </div>
    </div>
  );
};
