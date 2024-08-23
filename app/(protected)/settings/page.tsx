// SettingsPage.tsx
"use client";
import * as z from "zod";
import countries from "@/countries.json"; // Adjust the path as per your project structure

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { SettingsSchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { UserInfo } from "@/components/user-info";
import UserPage from "../client/page";

const SettingsPage = () => {
  const user = useCurrentUser();
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");

  const [projects, setProjects] = useState([{}]);
  const [experience, setexperience] = useState([{}]);

  const addProject = () => {
    setProjects([...projects, {}]);
  };

  const removeProject = (index) => {
    if (projects.length > 1) {
      const newProjects = projects.filter((_, i) => i !== index);
      setProjects(newProjects);
    }
  };
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  const addExperience = () => {
    setexperience([...experience, {}]);
  };

  const removeExperience = (index: number) => {
    if (experience.length > 1) {
      const newexperience = experience.filter((_, i) => i !== index);
      setexperience(newexperience);
    }
  };

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      primarySkill: user?.primarySkill || undefined,
      secondarySkills: user?.secondarySkills || undefined,
      country: user?.country || undefined,
      location: user?.location || undefined,
      projects: user?.projects || undefined,
      profilePic: user?.profilePic || undefined,
      linkedin: user?.linkedin || undefined,
      github: user?.github || undefined,
      twitter: user?.twitter || undefined,
      gender: user?.gender || undefined,
      class10: user?.schl10th || undefined,
      percentage_10: user?.percentage_10 || undefined,
      class12: user?.class12 || undefined,
      percentage_12: user?.percentage_12 || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      const updatedValues = {
        ...values,
      };

      settings(updatedValues)
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

  function handleSubmit(
    onSubmit: (values: z.infer<typeof SettingsSchema>) => Promise<void>
  ): import("react").FormEventHandler<HTMLFormElement> | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-700">
      <div className=" w-full min-h-full p-6 bg-blue-950 rounded-lg ">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-bold">Setting</h1>
        </header>
        <Card className="border mt-6 bg-gray-800 shadow-lg rounded-lg ">
          <div className="ml-6 mr-6 flex space-x-6">
            <nav className="flex mt-7 flex-col w-1/4 space-y-4">
              <div className="relative w-full">
                <UserPage />
              </div>
              <button className="p-2 text-left text-white bg-blue-500 rounded-lg">
                Edit Profile
              </button>
              <button className="p-2 text-left text-white rounded-lg">
                Notifications
              </button>
              <button className="p-2 text-left text-white rounded-lg">
                Password Management
              </button>
            </nav>

            <div className="w-3/4 p-6 bg-gray-700 rounded-lg">
              <h2 className="mb-4 text-white text-lg font-bold">
                Edit Profile
              </h2>
              <CardContent>
                <Form {...form}>
                  <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="space-y-4">
                      <div className="grid  gap-4">
                        <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                          <h1 className="text-yellow-400 text-2xl font-bold underline mb-4">
                            Personal Information
                          </h1>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="John Doe"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {!user?.isOAuth && (
                              <>
                                <div>
                                  <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white font-semibold">
                                          Email
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            disabled={isPending}
                                            className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1" />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div>
                                  <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white font-semibold">
                                          Password
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="password"
                                            placeholder="******"
                                            disabled={isPending}
                                            className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1" />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div>
                                  <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white font-semibold">
                                          New Password
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="password"
                                            placeholder="******"
                                            disabled={isPending}
                                            className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1" />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </>
                            )}

                            <div>
                              <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Country
                                    </FormLabel>
                                    <FormControl>
                                      <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your country"
                                        disabled={isPending}
                                        className="w-full bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400 p-2 rounded"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Username
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="akashGay"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <FormField
                                control={form.control}
                                name="about"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      About
                                    </FormLabel>
                                    <FormControl>
                                      <textarea
                                        {...field}
                                        placeholder="Tell us about yourself"
                                        disabled={isPending}
                                        className="input-field resize-none overflow-hidden w-full p-2 border rounded-md bg-gray-700 text-white focus:border-yellow-400 focus:ring-yellow-400"
                                        rows={1}
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
                            </div>

                            <div>
                              <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Gender
                                    </FormLabel>
                                    <FormControl>
                                      <Select {...field}>
                                        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400">
                                          <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700">
                                          <SelectGroup>
                                            <SelectItem
                                              value="male"
                                              className="text-white hover:bg-gray-600"
                                            >
                                              Male
                                            </SelectItem>
                                            <SelectItem
                                              value="female"
                                              className="text-white hover:bg-gray-600"
                                            >
                                              Female
                                            </SelectItem>
                                            <SelectItem
                                              value="other"
                                              className="text-white hover:bg-gray-600"
                                            >
                                              Other
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                          <h1 className="text-yellow-400 text-2xl font-bold underline mb-4">
                            Educational Details
                          </h1>

                          <div className="mt-6">
                            <h2 className="text-slate-400 text-xl font-semibold">
                              Class 10th
                            </h2>
                            <div className="grid grid-cols-2 gap-6 mt-4">
                              <FormField
                                control={form.control}
                                name="class10"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      School Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your School Name"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="percentage_10"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Total Percentage
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your Total Percentage"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <div className="mt-6">
                            <h2 className="text-slate-400 text-xl font-semibold">
                              Class 12th
                            </h2>
                            <div className="grid grid-cols-2 gap-6 mt-4">
                              <FormField
                                control={form.control}
                                name="class12"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      School Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your School Name"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="percentage_12"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Total Percentage
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your Total Percentage"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <div className="mt-6">
                            <h2 className="text-slate-400 text-xl font-semibold">
                              College Details
                            </h2>
                            <div className="grid grid-cols-2 gap-6 mt-4">
                              <FormField
                                control={form.control}
                                name="college"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      College Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your College Name"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="currentYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Year
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your current Year"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="dept"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Department
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your Department"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="domain"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Domain
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your Current Domain"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                          <h1 className="text-yellow-400 text-2xl font-bold underline mb-4">
                            ProfileLink
                          </h1>

                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <h3 className="text-slate-300 font-serif text-lg mb-2">
                                `Enter the skill where you possess the greatest
                                expertise and experience. This should be your
                                strongest area of knowledge and proficiency.`
                              </h3>
                              <FormField
                                control={form.control}
                                name="primarySkill"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Primary Skills (comma-separated)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="e.g., JavaScript, Python"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-700 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <h3 className="text-slate-300 font-serif text-lg mb-2 mt-3">
                                `List additional skills that complement your
                                primary expertise. These should be areas where
                                you are proficient and can support your primary
                                skill.`
                              </h3>
                              <FormField
                                control={form.control}
                                name="secondarySkills"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white">
                                      Secondary Skills (comma-separated)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="text"
                                        placeholder="Secondary Skills"
                                        disabled={isPending}
                                        className="input-field"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-8 bg-gray-900 rounded-lg shadow-lg">
                          <h1 className="text-yellow-400 text-3xl font-bold underline mb-6">
                            Professional Profiles
                          </h1>

                          <div className="grid grid-cols-1  gap-8">
                            <div>
                              <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      LinkedIn Profile
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://www.linkedin.com/in/yourprofile"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <FormField
                                control={form.control}
                                name="github"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      GitHub Profile
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://github.com/yourusername"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div>
                              <FormField
                                control={form.control}
                                name="twitter"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-white font-semibold">
                                      Twitter Profile
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://twitter.com/yourusername"
                                        disabled={isPending}
                                        className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 mt-1" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>

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
                                          disabled={isPending}
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
                                          disabled={isPending}
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
                                          disabled={isPending}
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
                                          disabled={isPending}
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
                                          disabled={isPending}
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
                                          disabled={isPending}
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

                        <div className="p-8 bg-gray-900 rounded-lg shadow-lg">
                          <h1 className="text-yellow-400 text-3xl font-bold underline mb-6">
                            Experience(If any)
                          </h1>
                          {experience.map((_, index) => (
                            <div key={index} className="flex flex-col mb-4">
                              <div className="grid grid-cols-1 gap-8">
                                <div className="experience-entry space-y-4 mb-8">
                                  <FormField
                                    control={form.control}
                                    name={`experience.${index}.company`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white font-semibold">
                                          Name of the Company
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter name of the company"
                                            disabled={isPending}
                                            className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1" />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`experience.${index}.duration`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white font-semibold">
                                          Duration
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter Duration you've worked for"
                                            disabled={isPending}
                                            className="input-field text-white bg-gray-800 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
                                          />
                                        </FormControl>
                                        <FormMessage className="text-red-500 mt-1" />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`experience.${index}.role`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-white font-semibold">
                                          Role
                                        </FormLabel>
                                        <FormControl>
                                          <textarea
                                            {...field}
                                            placeholder="Describe the  role in details"
                                            disabled={isPending}
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

                                  <div className="mt-4 flex justify-between">
                                    {experience.length > 1 && (
                                      <div className="flex justify-between mt-4">
                                        <button
                                          type="button"
                                          className=" bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                                          onClick={() =>
                                            removeExperience(index)
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      onClick={addExperience}
                                      className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300"
                                    >
                                      Add More
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className="flex justify-end">
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="button"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
