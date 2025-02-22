'use client';

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Creategroup } from '../../../actions/group';

// shadcn components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, GitBranch, Rocket, Target, Users } from 'lucide-react';

const TECH_STACK_OPTIONS = [
  { label: 'React', value: 'React' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'Express', value: 'Express' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'Firebase', value: 'Firebase' },
  { label: 'GraphQL', value: 'GraphQL' },
  { label: 'Tailwind CSS', value: 'Tailwind CSS' },
  { label: 'Python', value: 'Python' },
  { label: 'Django', value: 'Django' },
  { label: 'Flask', value: 'Flask' },
  { label: 'Vue.js', value: 'Vue.js' },
  { label: 'AWS', value: 'AWS' },
  { label: 'Docker', value: 'Docker' },
  { label: 'Kotlin', value: 'Kotlin' },
  { label: 'Flutter', value: 'Flutter' }
];

export default function GroupForm() {
  const form = useForm({
    defaultValues: {
      Name: '',
      description: '',
      projectTitle: '',
      projectDescription: '',
      githubLink: '',
      techStack: [],
      projectGoals: ''
    }
  });

  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [activeTab, setActiveTab] = useState('group-info');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'techStack') {
          formData.append(key, JSON.stringify(value.map(item => item.value || item)));
        } else {
          formData.append(key, value);
        }
      });

      const res = await Creategroup(formData);
      if (res && res.id) {
        router.push(`/groupchat/${res.id}/${userId}`);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-4xl">
        <Card className="border-gray-200 bg-white shadow-lg shadow-blue-900/10">
          <CardHeader className="pb-4 space-y-6 text-center border-b border-gray-200">
            <div className="flex justify-center mb-2">
              <div className="size-16 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center">
                <Users size={28} className="text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Create Your Dream Team
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-lg max-w-xl mx-auto">
                Build a collaborative space for your next breakthrough project
              </CardDescription>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-600">
                Seamless Collaboration
              </Badge>
              <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-600">
                Project Management
              </Badge>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
                Tech Community
              </Badge>
            </div>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-0">
                <Tabs defaultValue="group-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="w-full bg-gray-100 p-0 h-12">
                      <TabsTrigger
                        value="group-info"
                        className="flex-1 data-[state=active]:bg-white rounded-lg data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>Group Info</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="project-details"
                        className="flex-1 data-[state=active]:bg-white rounded-lg data-[state=active]:text-violet-600 data-[state=active]:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Rocket size={16} />
                          <span>Project Details</span>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="timeline-goals"
                        className="flex-1 data-[state=active]:bg-white rounded-lg data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Target size={16} />
                          <span>Goals</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="group-info" className="p-6 space-y-6 mt-0">
                    <FormField
                      control={form.control}
                      name="Name"
                      rules={{ required: "Group name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Group Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter a creative name for your group"
                                className="bg-gray-50 border-gray-200 h-12 pl-10 focus-visible:ring-blue-500 text-gray-900"
                                {...field}
                              />
                              <div className="absolute left-3 top-3 text-gray-400">🏷️</div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>{form.formState.errors.Name?.message}</span>
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      rules={{ required: "Group description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Group Description</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Describe the purpose and vision of your group"
                                className="min-h-32 bg-gray-50 border-gray-200 resize-none pl-10 focus-visible:ring-blue-500 text-gray-900"
                                {...field}
                              />
                              <div className="absolute left-3 top-3 text-gray-400">📘</div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>{form.formState.errors.description?.message}</span>
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <Button
                        type="button"
                        onClick={() => setActiveTab('project-details')}
                        className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white h-12 rounded-lg shadow-lg shadow-blue-900/20"
                      >
                        Continue to Project Details
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="project-details" className="p-6 space-y-6 mt-0">
                    <FormField
                      control={form.control}
                      name="projectTitle"
                      rules={{ required: "Project title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Project Title</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Give your project a clear, descriptive title"
                                className="bg-gray-50 border-gray-200 h-12 pl-10 focus-visible:ring-violet-500 text-gray-900"
                                {...field}
                              />
                              <div className="absolute left-3 top-3 text-gray-400">📋</div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>{form.formState.errors.projectTitle?.message}</span>
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectDescription"
                      rules={{ required: "Project description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Project Description</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="Describe the problem your project solves and its core features"
                                className="min-h-32 bg-gray-50 border-gray-200 resize-none pl-10 focus-visible:ring-violet-500 text-gray-900"
                                {...field}
                              />
                              <div className="absolute left-3 top-3 text-gray-400">📝</div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>{form.formState.errors.projectDescription?.message}</span>
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubLink"
                      rules={{
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+$/,
                          message: "Please enter a valid GitHub repository URL"
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">GitHub Repository</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="https://github.com/username/repository"
                                className="bg-gray-50 border-gray-200 h-12 pl-10 focus-visible:ring-violet-500 text-gray-900"
                                {...field}
                              />
                              <div className="absolute left-3 top-3 text-gray-400">
                                <GitBranch size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 flex items-center gap-2">
                            <AlertCircle size={14} />
                            <span>{form.formState.errors.githubLink?.message}</span>
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="techStack"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Tech Stack</FormLabel>
                          <FormControl>
                            <Controller
                              name="techStack"
                              control={form.control}
                              render={({ field }) => (
                                <ScrollArea className="h-60 bg-gray-50 rounded-lg border border-gray-200 p-4">
                                  <div className="flex flex-wrap gap-2">
                                    {TECH_STACK_OPTIONS.map((tech) => (
                                      <Badge
                                        key={tech.value}
                                        variant={field.value.some(item =>
                                          (item.value || item) === tech.value) ? "default" : "outline"}
                                        className={field.value.some(item =>
                                          (item.value || item) === tech.value)
                                          ? "bg-violet-50 text-violet-700 hover:bg-violet-100 cursor-pointer"
                                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
                                        }
                                        onClick={() => {
                                          const currentValue = field.value || [];
                                          const exists = currentValue.some(item =>
                                            (item.value || item) === tech.value);

                                          if (exists) {
                                            field.onChange(currentValue.filter(item =>
                                              (item.value || item) !== tech.value));
                                          } else {
                                            field.onChange([...currentValue, tech]);
                                          }
                                        }}
                                      >
                                        {tech.label}
                                        {field.value.some(item => (item.value || item) === tech.value) && (
                                          <Check size={14} className="ml-1" />
                                        )}
                                      </Badge>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 text-xs">
                            Select all technologies your project will use
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setActiveTab('group-info')}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-600 h-12 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActiveTab('timeline-goals')}
                        className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white h-12 rounded-lg shadow-lg shadow-violet-900/20"
                      >
                        Continue to Goals
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline-goals" className="p-6 space-y-6 mt-0">


                    <FormField
                      control={form.control}
                      name="projectGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Project Goals</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="List the key goals, milestones and expected outcomes of your project"
                                className="min-h-40 bg-gray-50 border-gray-200 resize-none pl-10 focus-visible:ring-emerald-500 text-gray-900"
                                {...field}
                              />
                              <div className="absolute left-3 top-3 text-gray-400">
                                <Target size={16} />
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-gray-500 text-xs">
                            Clear goals help team members understand the project direction
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setActiveTab('project-details')}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-600 h-12 hover:bg-gray-100 hover:text-gray-800"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12 rounded-lg shadow-lg shadow-emerald-900/20"
                      >
                        {submitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Creating...</span>
                          </div>
                        ) : (
                          <span>Launch Your Group 🚀</span>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col gap-6 border-t border-gray-200 p-6">
                <div className="w-full">
                  <Separator className="bg-gray-200 w-full mb-6" />

                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-1">
                        <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-600">
                          Pro Tip
                        </Badge>
                        <span className="text-gray-700 text-sm font-medium">Build community trust</span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        Groups with complete project details attract 3x more active participants
                      </p>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="relative bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 group-hover:border-blue-500/50 transition-all duration-300"
                      >
                        Complete Registration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
