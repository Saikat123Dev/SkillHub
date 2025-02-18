"use client";

import { AllGroups } from "@/actions/group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import axios from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const techStackOptions = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB",
  "PostgreSQL", "MySQL", "Prisma", "GraphQL", "Docker", "Redis", "Blockchain",
  "Solidity", "WebRTC", "Machine Learning", "AI", "Python", "GoLang", "Rust"
];

const AddProjectPost = ({ onClose }) => {
  const user = useCurrentUser();
  const [projectDesc, setProjectDesc] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("no-group");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const loadGroups = async () => {
      if (user?.id) {
        const fetchedGroups = await AllGroups(user.id);
        setGroups(fetchedGroups);
      }
    };
    loadGroups();
  }, [user]);

  const handleSkillSelect = (value) => {
    if (!selectedSkills.includes(value)) {
      setSelectedSkills([...selectedSkills, value]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleCollaboratorSelect = (value) => {
    if (!collaborators.includes(value)) {
      setCollaborators([...collaborators, value]);
    }
  };

  const removeCollaborator = (collaboratorToRemove) => {
    setCollaborators(collaborators.filter(collaborator => collaborator !== collaboratorToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectDesc.trim() || selectedSkills.length === 0 || collaborators.length === 0) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/posts/create", {
        description: projectDesc,
        techStack: selectedSkills,
        looking: collaborators,
        userId: user?.id,
        groupId: selectedGroup === "no-group" ? null : selectedGroup,
        groupName: groupName
      });

      if (response.status === 201) {
        alert("Project post created successfully");
        onClose(); // Close the modal after successful submission
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12">
            <Image
              src={user?.image || "/noAvatar.png"}
              alt="Profile Picture"
              width={48}
              height={48}
              className="rounded-full object-cover ring-2 ring-primary/10"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Create Project Post</h3>
            <p className="text-sm text-muted-foreground">Share your project and find collaborators</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="project-desc">Project Description</Label>
            <Textarea
              id="project-desc"
              placeholder="Describe your project idea, goals, and requirements..."
              className="min-h-32 resize-none"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tech-stack">Tech Stack</Label>
            <Select onValueChange={handleSkillSelect} disabled={loading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tech stack" />
              </SelectTrigger>
              <SelectContent>
                {techStackOptions.map((tech) => (
                  <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collaborators">Looking for</Label>
            <Select
              onValueChange={handleCollaboratorSelect}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select collaborators needed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                <SelectItem value="Full-Stack Developer">Full-Stack Developer</SelectItem>
                <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                <SelectItem value="Blockchain Developer">Blockchain Developer</SelectItem>
                <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {collaborators.map((collaborator, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm"
                >
                  <span>{collaborator}</span>
                  <button
                    type="button"
                    onClick={() => removeCollaborator(collaborator)}
                    className="hover:text-green-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Select Group (Optional)</Label>
            <Select
              value={selectedGroup}
              onValueChange={(value) => {
                const selected = groups.find(g => g.id === value);
                setSelectedGroup(value);
                setGroupName(selected ? selected.grpname : "");
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-group">No Group</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.grpname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProjectPost;
