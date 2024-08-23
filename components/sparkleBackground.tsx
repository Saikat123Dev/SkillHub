"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import Link from "next/link";
import { Button } from "./ui/moving-border";
import { GlobeDemo } from "./globeGithub";

export function SparklesPreview() {
  return (
    <div className="h-full relative w-full  flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
       <div className="relative flex flex-col md:flex-row justify-between items-center w-full h-full">
          
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-start p-4 md:p-6 space-y-4 z-10">
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight">
              Connect.<br />Showcase.<br />Collaborate.<br />Succeed.
            </h1>
            <p className="text-white text-base md:text-lg">
              Integrate profiles, showcase skills, collaborate seamlessly, and grow together.
            </p>
            <Button
              borderRadius="1.75rem"
              className="dark:bg-slate-900 border-neutral-200 dark:border-slate-800 transform transition-transform duration-300 hover:scale-95"
            >
              <Link href="/auth/register" className="text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold">
                Join Now
              </Link>
            </Button>
          </div>
          <div className="relative w-full h-full">
            <div className="absolute right-1 flex items-center h-full">
              <GlobeDemo />
            </div>
          </div>
        </div>
    </div>
  );
}
