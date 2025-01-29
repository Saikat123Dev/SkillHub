"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Code,
  Link2,
  Plus,
  Save,
  Trash2,
  Users,
  Video
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

import { addProjects } from "@/actions/projects";

const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  techstack: z.string().min(1, "Technologies are required"),
  about: z.string().min(1, "Description is required"),
  demovideo: z.string().url().optional().or(z.literal("")),
  livelink: z.string().url().optional().or(z.literal("")),
  collaborator: z.string().optional().or(z.literal(""))
});

const SettingsSchema = z.object({
  projects: z.array(ProjectSchema)
});

function ProjectSettingsPage() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      projects: [{
        title: "",
        techstack: "",
        about: "",
        demovideo: "",
        livelink: "",
        collaborator: ""
      }]
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: "projects",
    control: form.control
  });

  const addProject = () => {
    append({
      title: "",
      techstack: "",
      about: "",
      demovideo: "",
      livelink: "",
      collaborator: ""
    });
  };

  const removeProject = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      addProjects(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSuccess(undefined);
          } else if (data.success) {
            setSuccess(data.success);
            setError(undefined);
            update();
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">

<div className="py-6 w-full max-w-7xl px-4 sm:px-6">
          <header className="mb-8 sm:mb-10 flex items-center justify-between border-b border-gray-200 pb-4 sm:pb-6">
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Briefcase className="w-6 sm:w-8 h-6 sm:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Project Portfolio</h1>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">Showcase and manage your professional projects</p>
              </div>
            </div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-indigo-500" />
                              Project Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your project name"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.techstack`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Code className="w-5 h-5 text-indigo-500" />
                              Technologies
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="React, Node.js, TypeScript"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`projects.${index}.about`}
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" />
                            Project Description
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="Provide a comprehensive overview of your project"
                              className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 min-h-[150px] focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.demovideo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Video className="w-5 h-5 text-indigo-500" />
                              Demo Video
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="url"
                                placeholder="YouTube or Vimeo link"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.livelink`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Link2 className="w-5 h-5 text-indigo-500" />
                              Live Link
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="url"
                                placeholder="Deployed project URL"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.collaborator`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Users className="w-5 h-5 text-indigo-500" />
                              Collaborators
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="GitHub or profile link"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                      {fields.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeProject(index)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" /> Remove Project
                        </motion.button>
                      )}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addProject}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" /> Add Another Project
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-6 py-3 rounded-xl shadow-lg w-full sm:w-auto"
              >
                <Save className="w-5 h-5" />
                Save All Projects
              </Button>
            </form>
          </Form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <FormError message={error} />
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <FormSuccess message={success} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

    </div>
  );
}

export default ProjectSettingsPage;
