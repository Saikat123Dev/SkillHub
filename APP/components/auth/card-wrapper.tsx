import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import Image from 'next/image';
import authimg from "@/images/wallpaperflare.com_wallpaper.jpg";

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
    <div className="flex justify-center items-center w-full h-screen bg-green-200">
      <Card className="w-[80%] h-[80%] flex flex-col justify-center items-center p-8">
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Left half for the image */}
          <div className="w-full md:w-1/2 h-[400px] md:h-auto relative">
            <Image
              src={authimg}
              alt="Auth Image"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          {/* Right half for the card */}
          <div className="w-full md:w-1/2 px-4 py-8">
            <Card className="shadow-lg border-black w-full h-full flex flex-col justify-center">
              <CardHeader>
                <Header label={headerLabel} />
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
              {showSocial && (
                <CardFooter>
                  <Social />
                </CardFooter>
              )}
              <CardFooter>
                <BackButton
                  label={backButtonLabel}
                  href={backButtonHref}
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default CardWrapper