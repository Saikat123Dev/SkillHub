"use client";
import { Eye, File, Folder, GitFork, Github, Star } from 'lucide-react';
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Dynamically import Monaco Editor and xterm, disable SSR
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });


import "xterm/css/xterm.css";

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_REST_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

type Contributor = { login: string; avatarUrl: string; contributions: number; url: string; };
type Issue = { id: string; number: number; title: string; state: string; url: string; createdAt: string; author: { login: string; avatarUrl: string; }; };
type Commit = { oid: string; messageHeadline: string; committedDate: string; url: string; author: { name: string; avatarUrl: string; }; };
type PullRequest = { id: string; number: number; title: string; state: string; url: string; createdAt: string; author: { login: string; avatarUrl: string; }; };
type Language = { name: string; color: string; percentage: number; };
type Release = { name: string; tagName: string; createdAt: string; url: string; description: string; };
type FileItem = { name: string; path: string; type: "file" | "dir"; url: string; downloadUrl?: string; sha?: string; };
type RepoDetails = {
  owner: string; name: string; description: string; stargazerCount: number; forkCount: number; watcherCount: number;
  url: string; homepageUrl: string | null; createdAt: string; updatedAt: string; isArchived: boolean; isPrivate: boolean;
  defaultBranch: string; licenseInfo: { name: string; } | null; languages: Language[]; contributors: Contributor[];
  issues: { totalCount: number; openCount: number; closedCount: number; items: Issue[]; };
  pullRequests: { totalCount: number; openCount: number; closedCount: number; mergedCount: number; items: PullRequest[]; };
  commits: Commit[]; releases: { totalCount: number; items: Release[]; }; topics: string[];
  files: FileItem[];
};

const GitHubRepoDetails = ({ githublink }: { githublink: string }) => {
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [editorFile, setEditorFile] = useState<{ path: string; content: string; sha: string } | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<any>(null); // Using 'any' for simplicity with dynamic imports

  const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    try {
      const githubUrlRegex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(githubUrlRegex);
      return match && match.length >= 3 ? { owner: match[1], repo: match[2].split('#')[0].split('?')[0] } : null;
    } catch {
      return null;
    }
  };

  const fetchRepoDetails = async (url: string) => {
    setLoading(true);
    setError(null);
    setRepoDetails(null);

    const parsedUrl = parseGitHubUrl(url);
    if (!parsedUrl) {
      setError("Invalid GitHub repository URL.");
      setLoading(false);
      return;
    }

    const { owner, repo } = parsedUrl;

    const query = `{
      repository(owner: "${owner}", name: "${repo}") {
        name
        owner { login }
        description
        url
        homepageUrl
        stargazerCount
        forkCount
        watchers { totalCount }
        createdAt
        updatedAt
        isArchived
        isPrivate
        defaultBranchRef {
          name
          target {
            ... on Commit {
              history(first: 100) {
                nodes {
                  oid
                  messageHeadline
                  committedDate
                  url
                  author { name avatarUrl }
                }
              }
            }
          }
        }
        licenseInfo { name }
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
          totalSize
        }
        mentionableUsers(first: 10) {
          nodes { login avatarUrl url }
        }
        issues(first: 10, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
          totalCount
          nodes { id number title state url createdAt author { login avatarUrl } }
        }
        closedIssues: issues(states: CLOSED) { totalCount }
        pullRequests(first: 100, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) {
          totalCount
          nodes { id number title state url createdAt author { login avatarUrl } }
        }
        closedPullRequests: pullRequests(states: CLOSED) { totalCount }
        mergedPullRequests: pullRequests(states: MERGED) { totalCount }
        releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
          totalCount
          nodes { name tagName createdAt url description }
        }
        repositoryTopics(first: 10) {
          nodes { topic { name } }
        }
      }
    }`;

    try {
      const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.errors || !result.data.repository) {
        setError(result.errors?.[0]?.message || `Repository not found: ${owner}/${repo}`);
        setLoading(false);
        return;
      }

      const repoData = result.data.repository;

      const totalSize = repoData.languages.totalSize;
      const languages = repoData.languages.edges.map((edge: any) => ({
        name: edge.node.name,
        color: edge.node.color,
        percentage: totalSize ? Math.round((edge.size / totalSize) * 100) : 0,
      }));

      let contributors: Contributor[] = [];
      try {
        const contributorsResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/contributors?per_page=10`, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });
        if (contributorsResponse.ok) {
          const contributorsData = await contributorsResponse.json();
          contributors = contributorsData.map((c: any) => ({
            login: c.login,
            avatarUrl: c.avatar_url,
            contributions: c.contributions,
            url: c.html_url,
          }));
        }
      } catch {
        contributors = repoData.mentionableUsers.nodes.map((user: any) => ({
          login: user.login,
          avatarUrl: user.avatarUrl,
          contributions: 0,
          url: user.url,
        }));
      }

      const issues = {
        totalCount: repoData.issues.totalCount + repoData.closedIssues.totalCount,
        openCount: repoData.issues.totalCount,
        closedCount: repoData.closedIssues.totalCount,
        items: repoData.issues.nodes.map((node: any) => ({
          id: node.id,
          number: node.number,
          title: node.title,
          state: node.state,
          url: node.url,
          createdAt: new Date(node.createdAt).toLocaleDateString(),
          author: node.author ? { login: node.author.login, avatarUrl: node.author.avatarUrl } : { login: "ghost", avatarUrl: "" },
        })),
      };

      const pullRequests = {
        totalCount: repoData.pullRequests.totalCount + repoData.closedPullRequests.totalCount + repoData.mergedPullRequests.totalCount,
        openCount: repoData.pullRequests.totalCount,
        closedCount: repoData.closedPullRequests.totalCount,
        mergedCount: repoData.mergedPullRequests.totalCount,
        items: repoData.pullRequests.nodes.map((node: any) => ({
          id: node.id,
          number: node.number,
          title: node.title,
          state: node.state,
          url: node.url,
          createdAt: new Date(node.createdAt).toLocaleDateString(),
          author: node.author ? { login: node.author.login, avatarUrl: node.author.avatarUrl } : { login: "ghost", avatarUrl: "" },
        })),
      };

      const commits = repoData.defaultBranchRef?.target.history.nodes.map((node: any) => ({
        oid: node.oid.substring(0, 7),
        messageHeadline: node.messageHeadline,
        committedDate: new Date(node.committedDate).toLocaleDateString(),
        url: node.url,
        author: { name: node.author.name, avatarUrl: node.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(node.author.name)}` },
      })) || [];

      const releases = {
        totalCount: repoData.releases.totalCount,
        items: repoData.releases.nodes.map((node: any) => ({
          name: node.name || node.tagName,
          tagName: node.tagName,
          createdAt: new Date(node.createdAt).toLocaleDateString(),
          url: node.url,
          description: node.description || "",
        })),
      };

      const topics = repoData.repositoryTopics.nodes.map((node: any) => node.topic.name);

      const fetchFiles = async (path: string = ""): Promise<FileItem[]> => {
        const filesResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/contents/${path}?ref=${repoData.defaultBranchRef?.name || "main"}`, {
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });
        if (!filesResponse.ok) return [];
        const filesData = await filesResponse.json();
        return filesData.map((item: any) => ({
          name: item.name,
          path: item.path,
          type: item.type as "file" | "dir",
          url: item.html_url,
          downloadUrl: item.download_url || undefined,
          sha: item.sha,
        }));
      };

      const files = await fetchFiles("");

      setRepoDetails({
        owner: repoData.owner.login,
        name: repoData.name,
        description: repoData.description || "",
        stargazerCount: repoData.stargazerCount,
        forkCount: repoData.forkCount,
        watcherCount: repoData.watchers.totalCount,
        url: repoData.url,
        homepageUrl: repoData.homepageUrl,
        createdAt: new Date(repoData.createdAt).toLocaleDateString(),
        updatedAt: new Date(repoData.updatedAt).toLocaleDateString(),
        isArchived: repoData.isArchived,
        isPrivate: repoData.isPrivate,
        defaultBranch: repoData.defaultBranchRef?.name || "main",
        licenseInfo: repoData.licenseInfo,
        languages,
        contributors,
        issues,
        pullRequests,
        commits,
        releases,
        topics,
        files,
      });
    } catch (error) {
      setError("Failed to fetch repository details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (githublink) fetchRepoDetails(githublink);
  }, [githublink]);

  // useEffect(() => {
  //   if (!editorFile || !terminalRef.current || terminalInstance.current) return;

  //   const initTerminal = async () => {
  //     const { Terminal } = await import("xterm");
  //     const { FitAddon } = await import("xterm-addon-fit");

  //     const term = new Terminal({
  //       rows: 10,
  //       cols: 80,
  //       cursorBlink: true,
  //     });
  //     const fitAddon = new FitAddon();
  //     term.loadAddon(fitAddon);
  //     term.open(terminalRef.current!);
  //     fitAddon.fit();
  //     term.writeln("Terminal initialized. Use 'save' to update file, 'pr' to create pull request.");
  //     terminalInstance.current = term;

  //     // Handle terminal input
  //     let command = "";
  //     term.onData((data) => {
  //       if (data === "\r") { // Enter key
  //         if (command === "save") saveFile();
  //         else if (command === "pr") createPullRequest();
  //         term.writeln(`> ${command}`);
  //         command = "";
  //       } else if (data === "\b") { // Backspace
  //         command = command.slice(0, -1);
  //         term.write("\b \b");
  //       } else {
  //         command += data;
  //         term.write(data);
  //       }
  //     });
  //   };

  //   if (typeof window !== "undefined") {
  //     initTerminal().catch((err) => console.error("Terminal initialization failed:", err));
  //   }

  //   // Cleanup on unmount
  //   return () => {
  //     if (terminalInstance.current) {
  //       terminalInstance.current.dispose();
  //       terminalInstance.current = null;
  //     }
  //   };
  // }, [editorFile]);

  const fetchFolderContents = async (path: string) => {
    if (!repoDetails) return;
    const { owner, name, defaultBranch } = repoDetails;
    const response = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/contents/${path}?ref=${defaultBranch}`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });
    if (response.ok) {
      const data = await response.json();
      setRepoDetails({
        ...repoDetails,
        files: data.map((item: any) => ({
          name: item.name,
          path: item.path,
          type: item.type as "file" | "dir",
          url: item.html_url,
          downloadUrl: item.download_url || undefined,
          sha: item.sha,
        })),
      });
    }
  };

  const handleFolderClick = (path: string) => {
    setCurrentPath(path);
    fetchFolderContents(path);
  };

  const handleBack = () => {
    if (!currentPath) return;
    const newPath = currentPath.split("/").slice(0, -1).join("/");
    setCurrentPath(newPath);
    fetchFolderContents(newPath);
  };

  const openEditor = async (file: FileItem) => {
    if (!repoDetails || !file.downloadUrl) return;
    const response = await fetch(file.downloadUrl);
    const content = await response.text();
    setEditorFile({ path: file.path, content, sha: file.sha || "" });
  };

  const saveFile = async () => {
    if (!repoDetails || !editorFile) {
      terminalInstance.current?.writeln("Error: Repository details or editor file not available.");
      return null;
    }

    const { owner, name, defaultBranch } = repoDetails;
    const branchName = `edit-${editorFile.path.replace(/\//g, "-")}-${Date.now()}`;
    const content = btoa(unescape(encodeURIComponent(editorFile.content))); // Properly encode content

    try {
      // Step 1: Get the latest SHA for the file
      const fileResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/contents/${editorFile.path}?ref=${defaultBranch}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      });
      if (!fileResponse.ok) {
        const errorData = await fileResponse.json();
        terminalInstance.current?.writeln(`Error fetching file info: ${errorData.message || "Unknown error"}`);
        if (fileResponse.status === 403) {
          terminalInstance.current?.writeln("Permission denied: Check if token has 'repo' scope and repository access.");
        }
        return null;
      }
      const fileData = await fileResponse.json();
      const latestSha = fileData.sha;
      terminalInstance.current?.writeln(`Fetched latest SHA for ${editorFile.path}: ${latestSha}`);

      // Step 2: Get the latest commit SHA from the default branch
      const branchResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/branches/${defaultBranch}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      });
      if (!branchResponse.ok) {
        const errorData = await branchResponse.json();
        terminalInstance.current?.writeln(`Error fetching branch info: ${errorData.message || "Unknown error"}`);
        if (branchResponse.status === 403) {
          terminalInstance.current?.writeln("Permission denied: Check if token has 'repo' scope and repository access.");
        }
        return null;
      }
      const branchData = await branchResponse.json();
      const latestCommitSha = branchData.commit.sha;
      terminalInstance.current?.writeln(`Fetched latest commit SHA: ${latestCommitSha}`);

      // Step 3: Create a new branch from the latest commit
      const refResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/git/refs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: latestCommitSha,
        }),
      });
      if (!refResponse.ok) {
        const errorData = await refResponse.json();
        terminalInstance.current?.writeln(`Error creating branch: ${errorData.message || "Unknown error"}`);
        if (refResponse.status === 403) {
          terminalInstance.current?.writeln("Permission denied: Token may lack 'repo' scope or repository write access.");
        }
        return null;
      }
      terminalInstance.current?.writeln(`Created branch: ${branchName}`);

      // Step 4: Commit the file update to the new branch using the latest SHA
      const updateResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/contents/${editorFile.path}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Update ${editorFile.path} via web editor`,
          content,
          sha: latestSha, // Use the latest SHA fetched from the file
          branch: branchName,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        terminalInstance.current?.writeln(`Error committing file: ${errorData.message || "Unknown error"}`);
        if (updateResponse.status === 403) {
          terminalInstance.current?.writeln("Permission denied: Token may lack 'repo' scope or repository write access.");
        }
        return null;
      }

      const data = await updateResponse.json();
      terminalInstance.current?.writeln(`File ${editorFile.path} committed to branch ${branchName}.`);
      setEditorFile({ ...editorFile, sha: data.content.sha }); // Update SHA for future edits
      return branchName;
    } catch (error) {
      terminalInstance.current?.writeln(`Unexpected error in saveFile: ${error.message || "Unknown error"}`);
      console.error("saveFile error:", error);
      return null;
    }
  };

  const createPullRequest = async () => {
    if (!repoDetails || !editorFile) {
      terminalInstance.current?.writeln("Error: Repository details or editor file not available.");
      return;
    }

    const { owner, name, defaultBranch } = repoDetails;

    try {
      // Step 1: Save file and get the branch name
      const branchName = await saveFile();
      if (!branchName) {
        terminalInstance.current?.writeln("Cannot create PR: File commit failed.");
        return;
      }

      // Step 2: Create pull request from the new branch
      const prResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/pulls`, {
        method: "POST",
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Update ${editorFile.path}`,
          body: "Created via web editor",
          head: branchName,
          base: defaultBranch,
        }),
      });

      if (!prResponse.ok) {
        const errorData = await prResponse.json();
        terminalInstance.current?.writeln(`Error creating pull request: ${errorData.message || "Unknown error"}`);
        return;
      }

      const prData = await prResponse.json();
      terminalInstance.current?.writeln(`Pull request created: ${prData.html_url}`);
    } catch (error) {
      terminalInstance.current?.writeln(`Unexpected error in createPullRequest: ${error.message || "Unknown error"}`);
      console.error("createPullRequest error:", error);
    }
  };

  const renderOverview = () => repoDetails ? (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Repository Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p><span className="text-gray-500">Created:</span> {repoDetails.createdAt}</p>
            <p><span className="text-gray-500">Last Updated:</span> {repoDetails.updatedAt}</p>
            <p><span className="text-gray-500">Default Branch:</span> {repoDetails.defaultBranch}</p>
            {repoDetails.licenseInfo && <p><span className="text-gray-500">License:</span> {repoDetails.licenseInfo.name}</p>}
          </div>
          <div>
            <p><span className="text-gray-500">Status:</span> {repoDetails.isArchived ? "Archived" : "Active"} {repoDetails.isPrivate ? "(Private)" : "(Public)"}</p>
            {repoDetails.homepageUrl && <p><span className="text-gray-500">Website:</span> <a href={repoDetails.homepageUrl} target="_blank" className="text-blue-500 hover:underline">{repoDetails.homepageUrl}</a></p>}
          </div>
        </div>
      </div>
      {/* ... rest of renderOverview ... */}
    </div>
  ) : null;

  const renderCommits = () => repoDetails?.commits.length ? (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-semibold text-gray-800">Recent Commits</h3>
      {repoDetails.commits.map((commit) => (
        <div key={commit.oid} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <Image src={commit.author.avatarUrl} alt={commit.author.name} width={32} height={32} className="rounded-full" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 font-medium">{commit.author.name} • <span className="text-gray-500">{commit.committedDate}</span></p>
              <p className="text-gray-800"><a href={commit.url} className="text-blue-500 hover:underline font-mono mr-2">{commit.oid}</a>{commit.messageHeadline}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : <p className="text-gray-500">No commits available.</p>;

  const renderIssues = () => repoDetails?.issues.items.length ? (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Issues</h3>
        <div className="text-sm space-x-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{repoDetails.issues.openCount} Open</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{repoDetails.issues.closedCount} Closed</span>
        </div>
      </div>
      {repoDetails.issues.items.map((issue) => (
        <a key={issue.id} href={issue.url} target="_blank" className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-green-500 text-xl">●</span>
            <div className="flex-1">
              <h4 className="text-blue-500 font-medium hover:underline">{issue.title} <span className="text-gray-500">#{issue.number}</span></h4>
              <p className="text-sm text-gray-600">Opened on {issue.createdAt} by <Image src={issue.author.avatarUrl} alt={issue.author.login} width={20} height={20} className="inline rounded-full mx-1" /> {issue.author.login}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  ) : <p className="text-gray-500">No issues available.</p>;

  const renderPullRequests = () => repoDetails?.pullRequests.items.length ? (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Pull Requests</h3>
        <div className="text-sm space-x-2">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{repoDetails.pullRequests.openCount} Open</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{repoDetails.pullRequests.mergedCount} Merged</span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{repoDetails.pullRequests.closedCount} Closed</span>
        </div>
      </div>
      {repoDetails.pullRequests.items.map((pr) => (
        <a key={pr.id} href={pr.url} target="_blank" className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-green-500 text-xl">↳</span>
            <div className="flex-1">
              <h4 className="text-blue-500 font-medium hover:underline">{pr.title} <span className="text-gray-500">#{pr.number}</span></h4>
              <p className="text-sm text-gray-600">Opened on {pr.createdAt} by <Image src={pr.author.avatarUrl} alt={pr.author.login} width={20} height={20} className="inline rounded-full mx-1" /> {pr.author.login}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  ) : <p className="text-gray-500">No pull requests available.</p>;

  const renderFiles = () => repoDetails?.files.length ? (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Files</h3>
        {currentPath && (
          <button onClick={handleBack} className="text-blue-500 hover:underline">
            Back
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600">Path: {currentPath || "/"}</div>
      <div className="grid grid-cols-1 gap-2">
        {repoDetails.files.map((item) => (
          <div
            key={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg ${item.type === "dir" ? "hover:bg-gray-100 cursor-pointer" : "bg-white"}`}
            onClick={item.type === "dir" ? () => handleFolderClick(item.path) : undefined}
          >
            {item.type === "dir" ? (
              <Folder className="text-blue-500" size={20} />
            ) : (
              <File className="text-gray-500" size={20} />
            )}
            <span className="text-gray-800">{item.name}</span>
            {item.type === "file" && item.downloadUrl && (
              <div className="ml-auto space-x-2">
                <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                  View
                </a>
                <button onClick={() => openEditor(item)} className="text-blue-500 hover:underline text-sm">
                  Open in Editor
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : <p className="text-gray-500">No files available.</p>;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      {repoDetails && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Github className="text-gray-800" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">
                <a href={repoDetails.url} target="_blank" className="hover:underline">{repoDetails.owner}/{repoDetails.name}</a>
              </h2>
              {repoDetails.isPrivate && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Private</span>}
              {repoDetails.isArchived && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Archived</span>}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-700">
              <div className="flex items-center"><Star className="mr-1 text-yellow-500" size={16} />{repoDetails.stargazerCount.toLocaleString()}</div>
              <div className="flex items-center"><GitFork className="mr-1 text-gray-500" size={16} />{repoDetails.forkCount.toLocaleString()}</div>
              <div className="flex items-center"><Eye className="mr-1 text-blue-500" size={16} />{repoDetails.watcherCount.toLocaleString()}</div>
            </div>
          </div>
          {repoDetails.description && <p className="text-gray-700 text-lg">{repoDetails.description}</p>}
          <div className="border-b border-gray-200 pb-2">
            <div className="flex space-x-6 overflow-x-auto">
              {["overview", "commits", "issues", "pullRequests", "files"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 border-b-2 transition-all duration-200 ${
                    activeTab === tab ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "commits" && renderCommits()}
            {activeTab === "issues" && renderIssues()}
            {activeTab === "pullRequests" && renderPullRequests()}
            {activeTab === "files" && renderFiles()}
          </div>
        </div>
      )}
      {editorFile && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Editing {editorFile.path}</h3>
              <button onClick={() => setEditorFile(null)} className="text-red-500 hover:text-red-700">Close</button>
            </div>
            <div className="flex-1">
              <Editor
                height="70%"
                defaultLanguage="javascript"
                value={editorFile.content}
                onChange={(value) => setEditorFile({ ...editorFile, content: value || "" })}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubRepoDetails;
