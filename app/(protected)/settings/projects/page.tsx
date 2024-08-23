'use client'


import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useState } from "react";

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





function page() {
    const user = useCurrentUser();
    const [projects, setProjects] = useState([{}]);

  
  


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

  return (
    <>
   <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-700">
      <div className="min-w-full min-h-full p-3 bg-blue-950 rounded-lg ">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-bold">Setting</h1>
        </header>
      

    <div className="w-4/4 p-4 bg-gray-700 rounded-lg">
    <Form {...form}>
    <div className="p-8 bg-gray-900 rounded-lg shadow-lg">
                          <h1 className="text-yellow-400 text-3xl font-bold underline mb-6">
                            Projects
                          </h1>

                          <div
                            className="grid grid-cols-1 gap-8"
                            id="projects-container"
                          >
                            {projects.map((_, index) => (
                              <div
                                key={index}
                                className="project-entry space-y-4 mb-8"
                              >
                                {/* Project Title */}
                                <FormField
                                  control={form.control}
                                  name={`projects.${index}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white font-semibold">
                                        Project Title
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="text"
                                          placeholder="Enter your project title"
                                         
                                          className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 mt-1" />
                                    </FormItem>
                                  )}
                                />

                                {/* Project Description */}
                                <FormField
                                  control={form.control}
                                  name={`projects.${index}.about`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white font-semibold">
                                        Project Description
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="Describe your project"
                                      
                                          className="input-field resize-none overflow-hidden w-full p-2 border rounded-md bg-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                                          rows={3}
                                          onInput={(e) => {
                                            const target =
                                              e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 mt-1" />
                                    </FormItem>
                                  )}
                                />

                                {/* Technologies Used */}
                                <FormField
                                  control={form.control}
                                  name={`projects.${index}.techStack`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white font-semibold">
                                        Technologies Used
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="List the technologies used"
                                        
                                          className="input-field resize-none overflow-hidden w-full p-2 border rounded-md bg-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                                          rows={2}
                                          onInput={(e) => {
                                            const target =
                                              e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 mt-1" />
                                    </FormItem>
                                  )}
                                />

                                {/* Demo Video Link */}
                                <FormField
                                  control={form.control}
                                  name={`projects.${index}.demovideo`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white font-semibold">
                                        Demo Video Link (Optional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="url"
                                          placeholder="https://www.example.com/video"
                                   
                                          className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 mt-1" />
                                    </FormItem>
                                  )}
                                />

                                {/* Collaborator Profile Link */}
                                <FormField
                                  control={form.control}
                                  name={`projects.${index}.collaborator`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white font-semibold">
                                        Collaborator Profile Link (Optional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="url"
                                          placeholder="https://www.github.com"
                                  
                                          className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 mt-1" />
                                    </FormItem>
                                  )}
                                />

                                {/* Live Project Link */}
                                <FormField
                                  control={form.control}
                                  name={`projects.${index}.liveLink`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-white font-semibold">
                                        Live Project Link (Optional)
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="url"
                                          placeholder="https://www.example.com/live"
                                        
                                          className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 mt-1" />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-between mt-4">
                                  {projects.length > 1 && (
                                    <button
                                      type="button"
                                      className="remove-project-btn bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                                      onClick={() => removeProject(index)}
                                    >
                                      Remove Project
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={addProject}
                                    id="add-btn"
                                    className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300"
                                  >
                                    Add More Projects
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        </Form>
                        </div>
                      
                        </div>
                        </div>
                        </>

  )
}

export default page