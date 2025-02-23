import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REST_API_URL = "https://api.github.com";

interface FileItem {
  name: string;
  path: string;
  type: "file" | "dir";
  url: string;
  downloadUrl?: string;
  sha: string;
}

interface FileNodeJSON {
  name: string;
  type: "file" | "folder";
  path: string;
  url: string;
  children: FileNodeJSON[];
}

interface RepoFile {
  path: string;
  type: string;
  url: string;
  name?: string;
  content?: RepoFile[];
}

// Fetch files for a specific path (mirroring frontend's fetchFolderContents)
async function fetchFolderContents(
  owner: string,
  repo: string,
  branch: string,
  path: string = ""
): Promise<FileItem[]> {
  if (!GITHUB_TOKEN) throw new Error("GitHub token not configured");

  const response = await fetch(
    `${GITHUB_REST_API_URL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (!response.ok) {
    console.error(`Failed to fetch contents at ${path}: ${response.statusText}`);
    return [];
  }
  const filesData = await response.json();
  return filesData.map((item: any) => ({
    name: item.name,
    path: item.path,
    type: item.type as "file" | "dir",
    url: item.html_url,
    downloadUrl: item.download_url || undefined,
    sha: item.sha,
  }));
}

// Recursively fetch all files and folders
async function fetchFilesRecursively(
  owner: string,
  repo: string,
  branch: string = "main",
  path: string = ""
): Promise<RepoFile[]> {
  const allFiles: RepoFile[] = [];
  const files = await fetchFolderContents(owner, repo, branch, path);

  for (const item of files) {
    const repoFile: RepoFile = {
      name: item.name,
      path: item.path,
      type: item.type === "dir" ? "folder" : "file",
      url: item.url,
    };

    if (item.type === "dir") {
      // Recursively fetch subdirectories
      const subFiles = await fetchFilesRecursively(owner, repo, branch, item.path);
      repoFile.content = subFiles;
      allFiles.push(...subFiles);
    }
    allFiles.push(repoFile);
  }

  return allFiles;
}

async function generateSummary(repoData: any): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Generate a well-structured and concise summary of the following GitHub repository details:

    - **Repository Name:** ${repoData.name}
    - **Owner:** ${repoData.owner}
    - **Description:** ${repoData.description || "No description available."}
    - **Contents:** ${repoData.files.length} files/folders, including (${repoData.files.map((f: any) => f.name).join(", ") || "No files listed."}).
    - **Commit History:** ${repoData.commits?.length || "N/A"} commits recorded.
    - **Issue Tracker:** ${repoData.issues?.totalCount || "N/A"} total issues (${repoData.issues?.openCount || "N/A"} open, ${repoData.issues?.closedCount || "N/A"} closed).
    - **Pull Requests:** ${repoData.pullRequests?.totalCount || "N/A"} total pull requests (${repoData.pullRequests?.openCount || "N/A"} open, ${repoData.pullRequests?.mergedCount || "N/A"} merged).
    - **Primary Languages Used:** ${repoData.languages?.map((l: any) => `${l.name} (${l.percentage}%)`).join(", ") || "No language data available."}
    - **Topics and Tags:** ${repoData.topics?.join(", ") || "No topics specified."}

    Ensure the summary is concise, informative, and easy to understand while capturing the key aspects of the repository and how we locally setup this any general idea , over all github repo details .
`;


  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
}

function processPath(path: string): string[] {
  return path.split("/").filter((part) => part.length > 0);
}

function getBranchName(url: string): string {
  if (url.includes("/master/")) return "master";
  if (url.includes("/main/")) return "main";
  return "main"; // Default fallback
}

function getRepoBaseUrl(url: string): string {
  return url.split("/blob/")[0] || url.split("/tree/")[0] || url;
}

function buildFileTreeRecursive(
  files: RepoFile[],
  baseUrl: string,
  currentPath: string = "",
  processedPaths: Set<string> = new Set()
): FileNodeJSON {
  const node: FileNodeJSON = {
    name: currentPath.split("/").pop() || "root",
    type: "folder",
    path: currentPath,
    url: currentPath ? `${getRepoBaseUrl(baseUrl)}/tree/${getBranchName(baseUrl)}/${currentPath}` : baseUrl,
    children: [],
  };

  const immediateChildren = files.filter((file) => {
    const relativePath = file.path;
    if (processedPaths.has(relativePath)) return false;

    const parts = processPath(relativePath);
    const parentParts = processPath(currentPath);

    if (parentParts.length === 0) {
      return parts.length === 1;
    }

    return (
      parts.length === parentParts.length + 1 &&
      parts.slice(0, parentParts.length).join("/") === parentParts.join("/")
    );
  });

  immediateChildren.forEach((file) => {
    processedPaths.add(file.path);

    if (file.type === "folder" && file.content) {
      const folderNode = buildFileTreeRecursive(files, baseUrl, file.path, processedPaths);
      node.children.push(folderNode);
    } else {
      node.children.push({
        name: file.path.split("/").pop() || file.name || "",
        type: file.type as "file" | "folder",
        path: file.path,
        url: file.url,
        children: [],
      });
    }
  });

  node.children.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "folder" ? -1 : 1;
  });

  return node;
}

function renderFileTree(node: FileNodeJSON, prefix: string = "", isRoot: boolean = true): string {
  let result = "";
  if (!isRoot) {
    result += `${prefix}${node.name} (${node.url})\n`;
  }

  if (node.children.length > 0) {
    node.children.forEach((child, index) => {
      const isLast = index === node.children.length - 1;
      const newPrefix = prefix + (isLast ? "└── " : "├── ");
      result += renderFileTree(child, newPrefix, false);
    });
  }

  return result;
}

function generateFolderStructure(files: RepoFile[], baseUrl: string): string {
  const processedPaths = new Set<string>();
  const structure = buildFileTreeRecursive(files, baseUrl, "", processedPaths);
  return renderFileTree(structure) || "No folder structure available";
}

function generateFolderStructureJSON(files: RepoFile[], baseUrl: string): Record<string, any> {
  const processedPaths = new Set<string>();
  const structure = buildFileTreeRecursive(files, baseUrl, "", processedPaths);
  return JSON.parse(JSON.stringify(structure));
}

export async function POST(req: NextRequest) {
  try {
    const { repoData, groupId } = await req.json();

    if (!repoData || !groupId) {
      return NextResponse.json({ error: "Invalid repository data or missing groupId" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    // Extract owner and repo from URL
    const match = repoData.url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error("Invalid GitHub URL");
    const [_, owner, repo] = match;

    // Fetch files recursively if not provided or incomplete
    let files: RepoFile[] = repoData.files || [];
    if (!files.length) {
      const branch = repoData.defaultBranch || getBranchName(repoData.url); // Use defaultBranch from repoData
      files = await fetchFilesRecursively(owner, repo, branch);
    }

    // Ensure repoData has required fields for summary, with fallbacks
    const fullRepoData = {
      ...repoData,
      files,
      description: repoData.description || "No description",
      commits: repoData.commits || [],
      issues: repoData.issues || { totalCount: "N/A", openCount: "N/A", closedCount: "N/A" },
      pullRequests: repoData.pullRequests || { totalCount: "N/A", openCount: "N/A", mergedCount: "N/A" },
      languages: repoData.languages || [],
      topics: repoData.topics || [],
    };

    const summary = await generateSummary(fullRepoData);
    const folderStructure = generateFolderStructure(files, repoData.url);
    const folderStructureJSON = generateFolderStructureJSON(files, repoData.url);

    const repoSummary = await prisma.repoSummary.upsert({
      where: { repoUrl: repoData.url },
      update: {
        summary,
        folderStructure,
        folderStructureJSON,
        groupId,
      },
      create: {
        repoUrl: repoData.url,
        summary,
        folderStructure,
        folderStructureJSON,
        groupId,
      },
    });

    return NextResponse.json({
      summary,
      folderStructure,
      folderStructureJSON,
      repoSummaryId: repoSummary.id,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error in summarize-repo API:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed, use POST instead" }, { status: 405 });
}
