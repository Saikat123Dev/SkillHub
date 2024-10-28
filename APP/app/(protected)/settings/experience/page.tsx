
"use client";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";

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
    const [experience, setexperience] = useState([{}]);
    const [isPending] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

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
    


    const addExperience = () => {
        setexperience([...experience, {}]);
      };
    
      const removeExperience = (index: number) => {
        if (experience.length > 1) {
          const newexperience = experience.filter((_, i) => i !== index);
          setexperience(newexperience);
        }
      };
  return (
    <>
     <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-700">
      <div className="min-w-full min-h-full p-3 bg-slate-500 rounded-lg ">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl text-white font-bold">Setting</h1>
        </header>
      

    <div className="w-4/4 p-4 bg-gray-700 rounded-lg">
    <Form {...form}>
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
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
                   
                      className="input-field text-white bg-gray-700 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
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
                     
                      className="input-field text-white bg-gray-700 border-gray-700 focus:border-yellow-400 focus:ring-yellow-400"
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
  </Form>
  <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className="flex justify-end mt-3">
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="button"
                      >
                        Save
                      </Button>
                    </div>
  </div>
  </div>
  </div>
  </>
  )
}

export default page