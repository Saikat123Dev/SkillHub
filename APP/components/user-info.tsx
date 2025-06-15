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
    return data.image || null;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

const updateProfilePic = async (url: string): Promise<void> => {
  const response = await fetch("/api/upload", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profilePic: url }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update profile picture");
  }
};

export const UserInfo = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchImage = async () => {
      if (!currentUser?.id) return;

      setIsLoading(true);
      setFetchError(null);
      
      try {
        // Fetch from API
        const uploadedImage = await fetchProfilePic();
        
        // Priority: uploaded image -> current user image -> null
        const newImageUrl = uploadedImage || currentUser?.image || null;
        setImageUrl(newImageUrl);
        
      } catch (error) {
        console.error("Fetch error:", error);
        setFetchError("Failed to load profile picture");
        // Fallback to currentUser image if API fails
        setImageUrl(currentUser?.image || null);
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
      await updateProfilePic(""); // Send empty string to remove image
      setImageUrl(currentUser?.image || null); // Fallback to default user image
      setIsEditing(false);
    } catch (error) {
      console.error("Reset error:", error);
      alert("Failed to remove profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUploadComplete = async (res: any) => {
    if (res?.[0]?.url && currentUser?.id) {
      setIsLoading(true);
      try {
        await updateProfilePic(res[0].url);
        setImageUrl(res[0].url);
        setIsEditing(false);
      } catch (error) {
        console.error("Upload complete error:", error);
        alert("Failed to update profile picture");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    alert(`Upload failed: ${error.message}`);
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
                onError={() => {
                  console.error("Image failed to load:", imageUrl);
                  setImageUrl(currentUser?.image || null);
                }}
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

          {imageUrl && !isEditing && (
            <button
              onClick={handleEditClick}
              className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-full shadow-lg
                hover:scale-110 transition-transform"
              title="Edit profile picture"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Show error message if fetch failed */}
        {fetchError && (
          <div className="mt-2 text-sm text-red-500 text-center">
            {fetchError}
          </div>
        )}

        {/* Show upload button when editing or no image */}
        {(isEditing || !imageUrl) && !isLoading && (
          <div className="mt-4">
            <UploadButton<OurFileRouter>
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              appearance={{
                button: "bg-blue-600 ut-ready:bg-blue-700 ut-uploading:cursor-not-allowed",
                allowedContent: "hidden"
              }}
            />
            
            {/* Show cancel and reset buttons when editing */}
            {isEditing && (
              <div className="flex gap-2 mt-2 justify-center">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageReset}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Remove Image
                </button>
              </div>
            )}
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