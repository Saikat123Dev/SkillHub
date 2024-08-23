"use client"
import { useState, useEffect } from "react";
import { Icons } from "@/components/icons"; // Adjust path if necessary
import { UploadButton } from "@uploadthing/react";
import type { ExtendedUser } from "@/next-auth"; // Adjust path and import type if necessary
import { Pencil } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

// Interface for UserInfoProps
interface UserInfoProps {
  user?: ExtendedUser;
}

// Function to get the current profile picture from the backend
const fetchProfilePic = async (): Promise<string | null> => {
  const response = await fetch("/api/upload");
  if (response.ok) {
    const data = await response.json();
    return data.profilePic;
  }
  return null;
};

// Function to update the profile picture on the backend
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
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await fetchProfilePic();
      setImageUrl(url || user?.image || null);
    };

    fetchImageUrl();
  }, [user]);

  // Update localStorage whenever imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      localStorage.setItem("userImageUrl", imageUrl);
    } else {
      localStorage.removeItem("userImageUrl");
    }
  }, [imageUrl]);

  const handleImageReset = () => {
    setImageUrl(null);
    // Optionally, you can also update the backend to remove the profile picture
    updateProfilePic("");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="h-[150px] w-[150px] hover:cursor-pointer relative">
        {imageUrl ? (
          <div className="relative h-full w-full rounded-full overflow-hidden">
            <img
              src={imageUrl}
              alt="Profile Picture"
              className="h-full w-full object-cover"
            />
            <button
              onClick={handleImageReset}
              type="button"
              className="absolute top-0 right-0 p-2 bg-slate-900 rounded-full shadow text-slate-50"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="h-full w-full bg-pink-300 flex items-center justify-center rounded-full text-[100px]">
            {currentUser?.name[0]}
          </div>
        )}
      </div>
      {!imageUrl && (
        <UploadButton<string|null, string>
          className="text-white"
          endpoint="imageUploader" // Replace with your actual endpoint URL
          onClientUploadComplete={async (res) => {
            const newUrl = res[0].url;
            setImageUrl(newUrl);
            await updateProfilePic(newUrl);
            console.log("Files: ", res);
            alert("Upload Completed");
          }}
          onUploadError={(error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      )}
      <p className="text-lg text-white font-semibold">
        {user?.name || "Anonymous"}
      </p>
    </div>
  );
};
