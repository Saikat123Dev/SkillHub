"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Trash2, 
  Save, 
  Briefcase, 
  Calendar, 
  MapPin 
} from "lucide-react";

// Define a schema for experience (you'll need to create this)
const ExperienceSchema = z.object({
  experiences: z.array(z.object({
    company: z.string().min(1, "Company name is required"),
    role: z.string().min(1, "Role is required"),
    location: z.string().optional(),
    duration: z.string().min(1, "Duration is required"),
    description: z.string().optional()
  }))
});

function ExperienceSettingsPage() {
  const [experiences, setExperiences] = useState([{}]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const addExperience = () => {
    setExperiences([...experiences, {}]);
  };

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(newExperiences);
    }
  };

  const form = useForm<z.infer<typeof ExperienceSchema>>({
    resolver: zodResolver(ExperienceSchema),
    defaultValues: {
      experiences: experiences
    },
  });

  const onSubmit = (values: z.infer<typeof ExperienceSchema>) => {
    setIsPending(true);
    // Placeholder for actual submit logic
    setTimeout(() => {
      setSuccess("Experiences updated successfully!");
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          <header className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-5">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Professional Experience</h1>
                <p className="text-gray-500 mt-2">Showcase your career journey and achievements</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isPending}
                className="flex items-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-6 py-3 rounded-xl shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save Experiences
              </Button>
            </motion.div>
          </header>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence>
                {experiences.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Name */}
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-indigo-500" />
                              Company
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter company name"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      {/* Role */}
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-indigo-500" />
                              Role
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your job title"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Location */}
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.location`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-indigo-500" />
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="City, Country"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      {/* Duration */}
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-indigo-500" />
                              Duration
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Jan 2020 - Present"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-500" />
                            Job Description
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="Describe your key responsibilities, achievements, and impact"
                              className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 min-h-[150px] focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                      {experiences.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeExperience(index)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" /> Remove Experience
                        </motion.button>
                      )}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addExperience}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" /> Add Another Experience
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
                className="mt-6 text-red-500"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 text-green-500"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ExperienceSettingsPage;