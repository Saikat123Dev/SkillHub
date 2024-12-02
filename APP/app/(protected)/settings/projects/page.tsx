"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SettingsSchema } from "@/schemas";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";
import { 
  Plus, 
  Trash2, 
  Save, 
  Briefcase, 
  Code, 
  Link2, 
  Video, 
  Users 
} from "lucide-react";

function ProjectSettingsPage() {
  const user = useCurrentUser();
  const [projects, setProjects] = useState([{}]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const addProject = () => {
    setProjects([...projects, {}]);
  };

  const removeProject = (index: number) => {
    if (projects.length > 1) {
      const newProjects = projects.filter((_, i) => i !== index);
      setProjects(newProjects);
    }
  };

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      projects: user?.projects || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      // Placeholder for actual submit logic
      setSuccess("Projects updated successfully!");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          <header className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-5">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Project Portfolio</h1>
                <p className="text-gray-500 mt-2">Showcase and manage your professional projects</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isPending}
                className="flex items-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-6 py-3 rounded-xl shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Portfolio
              </Button>
            </motion.div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence>
                {projects.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Project Title */}
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

                      {/* Technologies Used */}
                      <FormField
                        control={form.control}
                        name={`projects.${index}.techStack`}
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

                    {/* Project Description */}
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
                              placeholder="Provide a comprehensive overview of your project, its purpose, and key features"
                              className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 min-h-[150px] focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      {/* Demo Video Link */}
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

                      {/* Live Project Link */}
                      <FormField
                        control={form.control}
                        name={`projects.${index}.liveLink`}
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

                      {/* Collaborator Link */}
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
                                type="url"
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
                      {projects.length > 1 && (
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
            </form>
          </Form>

          {/* Error and Success Messages */}
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
    </div>
  );
}

export default ProjectSettingsPage;