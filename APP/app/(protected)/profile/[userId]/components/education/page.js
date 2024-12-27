'use client'
import { GraduationCap, School } from "lucide-react";
import { Badge } from "../../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";

// Define the type for the details prop
const Education = ({ details}) => {
  const educationData = [
    {
      level: "Secondary Education",
      icon: <School className="h-8 w-8" />,
      type: "Class 10th",
      institution: details?.class10 || "Enter your School's Name",
      score: details?.percentage_10 || "Enter your percentage marks",
      badge: "Secondary"
    },
    {
      level: "Higher Secondary",
      icon: <School className="h-8 w-8" />,
      type: "Class 12th",
      institution: details?.class12 || "Enter your School's Name",
      score: details?.percentage_12  || "Enter your percentage marks",
      badge: "Higher Secondary"
    },
    {
      level: "University Education",
      icon: <GraduationCap className="h-8 w-8" />,
      type: "College",
      institution: details?.college || "Enter your College's Name",
      additionalInfo: [
        { label: "Current Year", value: details?.currentYear || "Enter your Current Year" },
        { label: "Department", value: details?.dept || "Enter your Department" },
        { label: "Field of Study", value: details?.domain || "Enter your Domain" }
      ],
      badge: "Undergraduate"
    }
  ];

  return (
    <div className="w-full py-12 border-t border-[#25213b] bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Educational Journey</h2>
          </div>
          <div className="h-1 w-20 bg-indigo-600 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {educationData.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-indigo-100">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                    {item.badge}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {item.level}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-base font-medium text-gray-600">{item.type}</p>
                  <p className="text-lg font-semibold text-gray-900">{item.institution}</p>
                  {item.score && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className="font-medium text-indigo-600">{item.score}</span>
                    </div>
                  )}
                  {item.additionalInfo && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                      {item.additionalInfo.map((info, infoIndex) => (
                        <div key={infoIndex} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{info.label}:</span>
                          <span className="text-sm font-medium text-gray-900">{info.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
