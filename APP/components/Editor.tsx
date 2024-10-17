import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
 import { uploadFiles}  from "@/utils/uploadthing";
import { PostCreationRequest, PostValidator } from "@/lib/post";
import axios from "axios";

import "@/styles/editor.css";

type FormData = z.infer<typeof PostValidator>;

async function handleFileUpload(files: any) {
  try {
    const endpoint = "imageUploader";
    const uploadedFiles = await uploadFiles(endpoint, {
      files,
    });
    console.log("Uploaded files:", uploadFiles);
    return {
      success: 1,
      files: uploadedFiles.map((file) => ({
        url: file.url,
      })),
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return {
      success: 0,
      message: "Upload failed",
    };
  }
}

export const Editor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      slug: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;
  
    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: {
            class: Header as any,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4],
            },
          },
          embed: Embed,
          table: Table,
          list: List,
          code: Code,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: any) {
                  try {
                    const endpoint = "imageUploader";
                    const res = await uploadFiles(endpoint, {
                      files: [file],
                    });
                    return {
                      success: 1,
                      file: {
                        url: res[0].url,
                      },
                    };
                  } catch (error) {
                    console.error("File upload error:", error);
                    return {
                      success: 0,
                      message: "File upload error",
                    };
                  }
                },
              },
            },
          },
          inlineCode: InlineCode,
        },
      });
      ref.current = editor;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  async function savePost(data: FormData) {
    setIsLoading(true);
    setError(null);
    console.log(data.slug)
    try {
      
      const blocks = await ref.current?.save();
      const payload: PostCreationRequest = {
        title: data.title,
        slug: data.slug,
        content: blocks,
      };
      const { data: responseData } = await axios.post(
        "/api/posts/create",
        payload
      );
      toast({
        description: "Your post has been saved.",
      });
    } catch (error) {
      setError("Your post was not saved. Please try again.");
      toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: FormData) => {
    await savePost(data);
    const newPathname = pathname.split("/").slice(0, -1).join("/");
    router.push(newPathname);
    router.refresh();
  };

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");
 
  return (
    <div className="w-[900px] h-full p-4 bg-white rounded-lg border border-zinc-900 shadow-lg">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-scroll bg-transparent text-5xl font-bold focus:outline-none"
          />
          <input
            {...register("slug")}
            placeholder="Enter slug"
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div id="editor" className="pl-9 min-h-[500px] text-black" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
          {isLoading && <p className="text-sm text-gray-500">Saving...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-2 px-4 py-2 bg-neon-blue text-black rounded-lg shadow-lg transition-transform transform hover:scale-105"
            onClick={handleSubmit(savePost)}
            disabled={isLoading}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};