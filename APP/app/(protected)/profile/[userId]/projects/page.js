"use client";
import { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  PlayCircle,
  Code2,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  Boxes,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { getProjects } from "@/actions/projects";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProjectPortfolio = ({ params }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState("all");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await getProjects(params.userId);
        const transformedProjects = fetchedProjects.getProjects.map(project => ({
          ...project,
          techStack: project.techStack ? project.techStack.split(',').map(tech => tech.trim()) : []
        }));
        setProjects(transformedProjects);
      } catch (error) {
        setError("Failed to fetch projects");
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [params.userId]);

  const allTechnologies = [...new Set(projects.flatMap(project => project.techStack))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.about?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTech = selectedTech === "all" ||
      project.techStack.some(tech => tech.toLowerCase() === selectedTech.toLowerCase());

    return matchesSearch && matchesTech;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="text-center space-y-4 p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Error Loading Projects</h3>
              <p className="text-gray-600">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-white">
      

      <div className="relative  mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 space-y-5">
  <h1 className="text-2xl font-extrabold text-gray-800 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
    Project Portfolio
  </h1>
  <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
    Explore my collection of innovative projects and technical achievements, showcasing creativity and expertise.
  </p>
</div>


        {/* Search and Filter */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardContent className="flex flex-col md:flex-row gap-4 p-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technologies</SelectItem>
                {allTechnologies.map((tech) => (
                  <SelectItem key={tech} value={tech.toLowerCase()}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </div>

                <p className="text-gray-600 line-clamp-2">{project.about}</p>

                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  {project.collaborator && (
                    <Link
                      href={project.collaborator}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm font-medium">Source Code</span>
                    </Link>
                  )}
                  {project.demovideo && (
                    <Link
                      href={project.demovideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Watch Demo</span>
                    </Link>
                  )}
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">Live Preview</span>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <Card className="max-w-md mx-auto mt-12">
            <CardContent className="text-center p-8 space-y-4">
              <Search className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-900">
                No projects found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTech("all");
                }} 
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectPortfolio;