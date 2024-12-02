'use client'
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/auth/back-button";


interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: CardWrapperProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-8 px-4 mt-20 ">
      <Card className="w-full max-w-4xl  bg-white rounded-2xl shadow-lg overflow-hidden my-8">
        <div className="flex flex-col w-full h-full">
          {/* Image Section - Shows at top on mobile, right side on desktop */}
          <div className="relative w-full lg:hidden h-64 bg-indigo-600 mt-5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-indigo-800/90" />
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
              alt="Team collaboration"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
            <div className="relative h-full flex flex-col justify-center p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">Team Building Made Simple</h2>
              <p className="text-sm opacity-90">
                Connect with professionals, form high-performing teams
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12">
              <div className="h-full flex flex-col">
                <div className="space-y-2 mb-8">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {headerLabel}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600">
                    Join our platform and build your dream team effortlessly
                  </p>
                </div>

                <div className="flex-grow">
                  {children}
                </div>

                <div className="mt-6">
                  <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                  />
                </div>
              </div>
            </div>

            {/* Desktop Image Section */}
            <div className="hidden lg:block w-1/2 relative  bg-indigo-600 ">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-indigo-800/90" />
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
                alt="Team collaboration"
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
              />
              <div className="relative h-full flex flex-col justify-center p-12 text-white">
                <h2 className="text-4xl font-bold mb-4">
                  Team Building Made Simple
                </h2>
                <p className="text-lg opacity-90">
                  Connect with professionals, form high-performing teams, and achieve your goals together
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardWrapper;