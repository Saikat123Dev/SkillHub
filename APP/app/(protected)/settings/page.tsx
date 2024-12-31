"use client";
import { useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { SettingsSchema } from "@/schemas";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings, getSettings } from "@/actions/settings";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { roles } from "@/utils/data/roles";

import {
  User,
  Book,
  Code,
  Link as LinkIcon,
  Save,
  X,
  Settings,
  Edit,
  Sliders,
  Globe,
} from "lucide-react";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { techtags } from "@/utils/data/techtags";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const SettingsPage = () => {
  const user = useCurrentUser();
  const { data: session, update } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const initialValues = {
    password: undefined,
    newPassword: undefined,
    name: user?.name || undefined,
    email: user?.email || undefined,
    Roles: user?.Roles || undefined,
    about:user?.about ||undefined,
    Skills: user?.Skills || undefined,
    country: user?.country || undefined,
    location: user?.location || undefined,
    profilePic: user?.profilePic || undefined,
    linkedin: user?.linkedin || undefined,
    github: user?.github || undefined,
    twitter: user?.twitter || undefined,
    gender: user?.gender || undefined,
    class10: user?.schl10th || undefined,
    percentage_10: user?.percentage_10 || undefined,
    class12: user?.class12 || undefined,
    percentage_12: user?.percentage_12 || undefined,
    shortIntro:user?.shortIntro || undefined,
    leetcode:user?.leetcode || undefined,
    duration:user?.duration || undefined

  };

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const getDetails = async () => {
      try {
        const data = await getSettings();
        console.log(data);
        
      
        if (data) {
          data.getsettingdetails.name && form.setValue('name', data.getsettingdetails.name);
          data.getsettingdetails.pssword && form.setValue('password', data.getsettingdetails.password);
          data.getsettingdetails.email && form.setValue('email', data.getsettingdetails.email);
          data.getsettingdetails.Roles && form.setValue('Roles', data.getsettingdetails.Roles);
          data.getsettingdetails.Skills && form.setValue('Skills', data.getsettingdetails.Skills);
          data.getsettingdetails.country && form.setValue('country', data.getsettingdetails.country);
          data.getsettingdetails.gender && form.setValue('gender', data.getsettingdetails.gender);
          data.getsettingdetails.location && form.setValue('location', data.getsettingdetails.location);
          data.getsettingdetails.profilePic && form.setValue('profilePic', data.getsettingdetails.profilePic);
          data.getsettingdetails.linkedin && form.setValue('linkedin', data.getsettingdetails.linkedin);
          data.getsettingdetails.github && form.setValue('github', data.getsettingdetails.github);
          data.getsettingdetails.twitter && form.setValue('twitter', data.getsettingdetails.twitter);
          data.getsettingdetails.class10 && form.setValue('class10', data.getsettingdetails.class10);
          data.getsettingdetails.percentage_10 && form.setValue('percentage_10', data.getsettingdetails.percentage_10);
          data.getsettingdetails.class12 && form.setValue('class12', data.getsettingdetails.class12);
          data.getsettingdetails.percentage_12 && form.setValue('percentage_12', data.getsettingdetails.percentage_12);
          data.getsettingdetails.college && form.setValue('college', data.getsettingdetails.college);
          data.getsettingdetails.currentYear&& form.setValue('currentYear', data.getsettingdetails.currentYear);
          data.getsettingdetails.dept && form.setValue('dept', data.getsettingdetails.dept);
          data.getsettingdetails.domain && form.setValue('domain', data.getsettingdetails.domain);
          data.getsettingdetails.username && form.setValue('username', data.getsettingdetails.username);
          data.getsettingdetails.about && form.setValue('about', data.getsettingdetails.about)
          data.getsettingdetails.shortIntro && form.setValue('shortIntro', data.getsettingdetails.shortIntro)
          data.getsettingdetails.duration && form.setValue('duration', data.getsettingdetails.duration)
          data.getsettingdetails.leetcode && form.setValue('leetcode', data.getsettingdetails.leetcode)
        }
  
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load user settings');
      }
    };
  
    getDetails();
  }, [form]); // Add form as dependency

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setSuccess(undefined);
          } else if (data.success) {
            setSuccess(data.success);
            setError(undefined);
            update();
            form.reset(initialValues);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          className="mb-12 text-center relative"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center mb-4 space-x-3">
              <Settings className="w-8 h-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <Edit className="w-8 h-8 text-indigo-600" />
            </div>

            <div className="relative">
              <p className="text-gray-600 max-w-2xl mx-auto relative">
                <span className="absolute -left-10 top-0 opacity-50">
                  <Sliders className="w-6 h-6 text-indigo-500" />
                </span>
                Customize your profile information and preferences to make your
                profile stand out
                <span className="absolute -right-10 top-0 opacity-50">
                  <Globe className="w-6 h-6 text-indigo-500" />
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200">
                <CardHeader className="border-b border-gray-100 bg-blue-100 rounded-t-lg px-6 py-4">
                  <div className="flex items-center space-x-3 p-3">
                    <User className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Personal Information
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your full name"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="your.email@example.com"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="*******"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="******"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your Unique UserName"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Country Field */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Country
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Your country"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Gender Field */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Gender
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    {/* About Field */}
                    <FormField
                      control={form.control}
                      name="about"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            About
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                              rows={4}
                              placeholder="Tell us about yourself"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Short Intro Field */}
                    <FormField
                      control={form.control}
                      name="shortIntro"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-700 font-medium">
                            Short Introduction (2-3 Words)
                          </FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              placeholder="e.g., Professional Software Developer"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                              rows={1}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Education Section */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl">
                <CardHeader className="border-b border-gray-200 bg-blue-100 rounded-t-xl">
                  <div className="flex items-center space-x-3 p-3">
                    <Book className="w-5 h-5 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Educational Details
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Class 10th Section */}
                    <div className="col-span-full">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Class 10th
                      </h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="class10"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            School Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your school name"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="percentage_10"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            Percentage
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your percentage"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    {/* Class 12th Section */}
                    <div className="col-span-full mt-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Class 12th
                      </h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="class12"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            School Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your school name"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="percentage_12"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            Percentage
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your percentage"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    {/* College Details Section */}
                    <div className="col-span-full mt-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        College Details
                      </h3>
                    </div>
                    <FormField
                      control={form.control}
                      name="college"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            College Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="Enter your college name"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentYear"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            Current Year
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., 3rd"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    {/* Additional Fields */}
                    <FormField
                      control={form.control}
                      name="dept"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            Department
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., Computer Science"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            Domain
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., BTech"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-600 font-medium">
                            Duration
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., 2022-2026"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-gray-100 bg-blue-100 rounded-t-lg">
                  <div className="flex items-center space-x-3 p-4 ">
                    <Code className="w-6 h-6 text-purple-600 " />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Skills & Expertise
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="col-span-full">
                      <h2 className="text-lg font-semibold text-gray-700 mb-1">
                        Enter the skill where you possess the greatest expertise
                        and experience. This should be your strongest area of
                        knowledge and proficiency.
                      </h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="Roles"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-600 font-medium">
                            {" "}
                            Roles
                          </FormLabel>
                          <div className="space-y-4">
                            <Select
                              onValueChange={(value) => {
                                const currentSkills = field.value || [];
                                if (!currentSkills.includes(value)) {
                                  field.onChange([...currentSkills, value]);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your Roles" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role: any) => (
                                  <SelectItem
                                    key={role.value}
                                    value={role.value}
                                  >
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex flex-wrap gap-2">
                              {(field.value || []).map((role: any) => (
                                <Badge
                                  key={role}
                                  variant="secondary"
                                  className="px-3 py-1 text-sm flex items-center gap-1"
                                >
                                  {role}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedSkills = field.value.filter(
                                        (s: any) => s !== role
                                      );
                                      field.onChange(updatedSkills);
                                    }}
                                    className="ml-1 hover:text-red-500 transition-colors"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">
                      List additional skills that complement your primary
                      expertise. These should be areas where you are proficient
                      and can support your primary skill.
                    </h2>

                    <FormField
                      control={form.control}
                      name="Skills"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-600 font-medium">
                            {" "}
                            Skills
                          </FormLabel>
                          <div className="space-y-4">
                            <Select
                              onValueChange={(value) => {
                                const currentSkills = field.value || [];
                                if (!currentSkills.includes(value)) {
                                  field.onChange([...currentSkills, value]);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your Skills" />
                              </SelectTrigger>
                              <SelectContent>
                                {techtags.map((tag: any) => (
                                  <SelectItem key={tag.value} value={tag.value}>
                                    {tag.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex flex-wrap gap-2">
                              {(field.value || []).map((skill: any) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="px-3 py-1 text-sm flex items-center gap-1"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedSkills = field.value.filter(
                                        (s: any) => s !== skill
                                      );
                                      field.onChange(updatedSkills);
                                    }}
                                    className="ml-1 hover:text-red-500 transition-colors"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Links Section */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
            >
              <Card className=" shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-gray-100 bg-blue-100 rounded-t-lg ">
                  <div className="flex items-center space-x-3 p-3 0">
                    <LinkIcon className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Proffessional Links
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-600 font-medium">
                            Linkedin Profile
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., https://www.linkedin.com/in/username"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                  
                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-600 font-medium">
                            GitHub Profile
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., https://www.github.com/username"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-600 font-medium">
                            Twitter Profile
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., https://www.twitter.com/username"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leetcode"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-gray-600 font-medium">
                            LeetCode Profile
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              className="w-full p-3 border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-lg"
                              placeholder="e.g., https://www.leetcode.com/username"
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form Actions */}
            <motion.div
              className="flex justify-end space-x-4"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.5 }}
            >
              <Button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                disabled={isPending}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                disabled={isPending}
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormError message={error} />
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormSuccess message={success} />
              </motion.div>
            )}
          </form>
        </Form>
          
      </div>
    </div>
  );
};

export default SettingsPage;
