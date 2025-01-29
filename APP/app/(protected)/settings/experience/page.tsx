"use client";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Plus,
  Trash2,
  Save,
  Briefcase,
  Code,
  Clock1,
  Award,
} from "lucide-react";

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
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { addExperiences } from "@/actions/experience";
import { FaAudioDescription } from "react-icons/fa";

const ExperienceSchema = z.object({
      company: z.string().min(1, "Company name is required"),
      role: z.string().min(1, "Role is required"),
      duration: z.string().min(1, "Duration is required"),
      description: z.string().optional(),
    })
  


const SettingsSchema = z.object({
  experiences: z.array(ExperienceSchema),
});

function ExperienceSettingsPage() {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // Initialize form with empty values
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      experiences: [
        {
          company: "",
          role: "",
          duration: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: "experiences",
    control: form.control,
  });

  const addExperience = () => {
    append({
      company: "",
      role: "",
      duration: "",
      description: "",
    });
  };

  const removeExperience = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    console.log("Form submitted with values:", values);
    startTransition(() => {
      addExperiences(values)
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          <header className="mb-10 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-5">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Award className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Work Experience
                </h1>
                <p className="text-gray-500 mt-2">Showcase your Experiences</p>
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
                    className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-indigo-500" />
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your company name"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.role`}
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
                      name={`experiences.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                            <FaAudioDescription className="w-5 h-5 text-indigo-500" />
                            Description
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="Write description"
                              className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 min-h-[150px] focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                            <Clock1 className="w-5 h-5 text-indigo-500" />
                            Duration
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="3 months"
                              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                      {fields.length > 1 && (
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
                        <Plus className="w-5 h-5" /> Add Experience
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending} // Remove this temporarily
                className="flex items-center gap-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-6 py-3 rounded-xl shadow-lg"
              >
                <Save className="w-5 h-5" />
                Save All Experiences
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
    </div>
  );
}

export default ExperienceSettingsPage;
