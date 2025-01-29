"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Clock1,
  Code,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { addExperiences } from "@/actions/experience";
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
import { FaAudioDescription } from "react-icons/fa";

const ExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
});

const SettingsSchema = z.object({
  experiences: z.array(ExperienceSchema),
});

function ExperienceSettingsPage() {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

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

  const { fields, append, remove } = useFieldArray({
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
    <div className=" bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">

<div className="py-6 w-full max-w-7xl px-4 sm:px-6">

<header className="mb-8 sm:mb-10 flex items-center justify-between border-b border-gray-200 pb-4 sm:pb-6">
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl  font-bold text-gray-800">
                  Work Experience
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Showcase your Experiences
                </p>
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
                    className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-6 shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name={`experiences.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base font-semibold flex items-center gap-2">
                              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your company name"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm sm:text-base"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experiences.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base font-semibold flex items-center gap-2">
                              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                              Role
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Software Engineer"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm sm:text-base"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-4 sm:mt-6">
                          <FormLabel className="text-sm sm:text-base font-semibold flex items-center gap-2">
                            <FaAudioDescription className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                            Description
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="Write description"
                              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base min-h-[100px] sm:min-h-[120px] focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`experiences.${index}.duration`}
                      render={({ field }) => (
                        <FormItem className="mt-4 sm:mt-6">
                          <FormLabel className="text-sm sm:text-base font-semibold flex items-center gap-2">
                            <Clock1 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                            Duration
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="3 months"
                              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm sm:text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-2 mt-4 pt-4 sm:pt-6 border-t border-gray-200">
                      {fields.length > 1 && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => removeExperience(index)}
                          className="w-full py-2 flex items-center justify-center gap-2 text-sm sm:text-base text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" /> Remove Experience
                        </motion.button>
                      )}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addExperience}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm sm:text-base text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" /> Add Experience
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow-md text-sm sm:text-base"
              >
                <Save className="w-5 h-5 sm:w-6 sm:h-6" />
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
                className="mt-4"
              >
                <FormError message={error} />
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4"
              >
                <FormSuccess message={success} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

  );
}

export default ExperienceSettingsPage;
