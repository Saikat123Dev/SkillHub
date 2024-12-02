"use client";

import { useState, useEffect } from "react";
import { Pencil, Upload, Loader2 } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { ExtendedUser } from "@/next-auth";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UserInfoProps {
  user?: ExtendedUser;
}

const fetchProfilePic = async (): Promise<string | null> => {
  const response = await fetch("/api/upload");
  if (response.ok) {
    const data = await response.json();
    return data.profilePic;
  }
  return null;
};

const updateProfilePic = async (url: string): Promise<void> => {
  await fetch("/api/upload", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profilePic: url }),
  });
};

export const UserInfo = ({ user }: UserInfoProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchImageUrl = async () => {
      setIsLoading(true);
      const url = await fetchProfilePic();
      setImageUrl(url || user?.image || null);
      setIsLoading(false);
    };

    fetchImageUrl();
  }, [user]);

  const handleImageReset = async () => {
    setIsLoading(true);
    try {
      await updateProfilePic("");
      setImageUrl(null);
    } catch (error) {
      console.error("Failed to reset image:", error);
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
        {/* Profile Image Container */}
        <div className="
          h-[150px] w-[150px] 
          rounded-full 
          transition-transform duration-300 ease-out
          transform group-hover:scale-105
          relative
        ">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : imageUrl ? (
            <div className="relative h-full w-full">
              <img
                src={imageUrl}
                alt="Profile Picture"
                className="
                  h-full w-full 
                  object-cover 
                  rounded-full 
                  transition-all duration-300
                  group-hover:brightness-90
                "
              />
              {/* Overlay on hover */}
              <div className={`
                absolute inset-0 
                bg-black/20 
                rounded-full 
                transition-opacity duration-300
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `} />
            </div>
          ) : (
            <div className="
              h-full w-full 
              bg-gradient-to-br from-blue-500 to-blue-600
              flex items-center justify-center 
              rounded-full 
              text-[80px] 
              font-bold 
              text-white
              transition-all duration-300
              shadow-lg
              group-hover:shadow-xl
            ">
              {currentUser?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          )}

          {/* Edit Button */}
          {imageUrl && (
            <button
              onClick={handleImageReset}
              type="button"
              className="
                absolute -bottom-2 -right-2
                p-2.5 
                bg-white 
                rounded-full 
                shadow-lg
                text-gray-700
                transition-all duration-300
                transform
                hover:scale-110
                hover:bg-gray-50
                hover:text-blue-600
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
              "
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Button */}
        {!imageUrl && !isLoading && (
          <div className="mt-4">
            <UploadButton<string|null, string>
              endpoint="imageUploader"
              onClientUploadComplete={async (res) => {
                setIsLoading(true);
                try {
                  const newUrl = res[0].url;
                  await updateProfilePic(newUrl);
                  setImageUrl(newUrl);
                } catch (error) {
                  console.error("Upload error:", error);
                }
                setIsLoading(false);
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
                alert(`Error: ${error.message}`);
              }}
              appearance={{
                button: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300",
                allowedContent: "text-gray-400 text-sm"
              }}
            />
          </div>
        )}

        {/* User Name */}
        <div className="
          mt-4 
          text-center 
          transform 
          transition-all 
          duration-300
          group-hover:scale-105
        ">
          <h2 className="
            text-xl 
            font-semibold 
            text-gray-800
            mb-1
          ">
            {user?.name || "Anonymous"}
          </h2>
          {user?.email && (
            <p className="
              text-sm 
              text-gray-500
              transition-colors
              duration-300
              group-hover:text-gray-700
            ">
              {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};