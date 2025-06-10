"use client";
import { Eye, File, Folder, GitFork, Github, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import Tree from "react-d3-tree";

// Dynamically import Monaco Editor
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_REST_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

type Contributor = { login: string; avatarUrl: string; contributions: number; url: string };
type Issue = { id: string; number: number; title: string; state: string; url: string; createdAt: string; author: { login: string; avatarUrl: string } };
type Commit = { oid: string; messageHeadline: string; committedDate: string; url: string; author: { name: string; avatarUrl: string } };
type PullRequest = { id: string; number: number; title: string; state: string; url: string; createdAt: string; author: { login: string; avatarUrl: string } };
type Language = { name: string; color: string; percentage: number };
type Release = { name: string; tagName: string; createdAt: string; url: string; description: string };
type FileItem = { name: string; path: string; type: "file" | "dir"; url: string; downloadUrl?: string; sha?: string };
type RepoDetails = {
  owner: string; name: string; description: string; stargazerCount: number; forkCount: number; watcherCount: number;
  url: string; homepageUrl: string | null; createdAt: string; updatedAt: string; isArchived: boolean; isPrivate: boolean;
  defaultBranch: string; licenseInfo: { name: string } | null; languages: Language[]; contributors: Contributor[];
  issues: { totalCount: number; openCount: number; closedCount: number; items: Issue[] };
  pullRequests: { totalCount: number; openCount: number; closedCount: number; mergedCount: number; items: PullRequest[] };
  commits: Commit[]; releases: { totalCount: number; items: Release[] }; topics: string[];
  files: FileItem[];
};

type FolderStructureItem = {
  name: string;
  type: "file" | "dir";
  path: string;
  children?: FolderStructureItem[];
};

const fetchFolderStructureRecursively = async (
  owner: string,
  repo: string,
  path: string = "",
  branch: string = "main"
): Promise<FolderStructureItem[]> => {
  try {
    const headers: HeadersInit = {};
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `${GITHUB_REST_API_URL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers }
    );

    if (!response.ok) {
      console.error(`Failed to fetch folder structure: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const items = await response.json();

    const processItems = async (items: any[]): Promise<FolderStructureItem[]> => {
      return Promise.all(
        items.map(async (item) => {
          const node: FolderStructureItem = {
            name: item.name,
            type: item.type,
            path: item.path,
            children: [],
          };

          if (item.type === "dir") {
            node.children = await fetchFolderStructureRecursively(
              owner,
              repo,
              item.path,
              branch
            );
          }
          return node;
        })
      );
    };

    return processItems(Array.isArray(items) ? items : [items]);
  } catch (error) {
    console.error("Error fetching folder structure:", error);
    return [];
  }
};

const FolderTree = ({ data }: { data: FolderStructureItem[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(true);
  }, []);

  if (!data?.length) return null;

  return (
    <div className="pl-4">
      {data.map((item, index) => (
        <div
          key={item.path}
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center py-2">
            {item.type === "dir" ? (
              <Folder className="text-blue-500 mr-2" size={20} />
            ) : (
              <File className="text-gray-500 mr-2" size={20} />
            )}
            <span className="text-gray-800">{item.name}</span>
          </div>
          {item.children && item.children.length > 0 && (
            <FolderTree data={item.children} />
          )}
        </div>
      ))}
    </div>
  );
};

const GitHubRepoDetails = ({ githublink, groupId }: { githublink: string; groupId: any }) => {
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  const [summaryData, setSummaryData] = useState({ summary: "", folderStructure: "", folderStructureJSON: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [editorFile, setEditorFile] = useState<{ path: string; content: string; sha: string } | null>(null);
  const [folderStructure, setFolderStructure] = useState<FolderStructureItem[] | null>(null);

  const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
    try {
      const githubUrlRegex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = url.match(githubUrlRegex);
      return match && match.length >= 3 ? { owner: match[1], repo: match[2].split('#')[0].split('?')[0] } : null;
    } catch {
      return null;
    }
  };

  // Fallback to REST API if GraphQL fails
  const fetchRepoDetailsREST = async (owner: string, repo: string) => {
    try {
      const headers: HeadersInit = {};
      if (GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
      }

      // Fetch basic repo info
      const repoResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}`, { headers });
      if (!repoResponse.ok) {
        throw new Error(`Repository not found: ${owner}/${repo}`);
      }
      const repoData = await repoResponse.json();

      // Fetch languages
      const languagesResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/languages`, { headers });
      const languagesData = languagesResponse.ok ? await languagesResponse.json() : {};
      
      const totalBytes = Object.values(languagesData).reduce((sum: number, bytes: any) => sum + bytes, 0);
      const languages = Object.entries(languagesData).map(([name, bytes]: [string, any]) => ({
        name,
        color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color fallback
        percentage: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
      }));

      // Fetch contributors
      const contributorsResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/contributors?per_page=10`, { headers });
      const contributors = contributorsResponse.ok ? 
        (await contributorsResponse.json()).map((c: any) => ({
          login: c.login,
          avatarUrl: c.avatar_url,
          contributions: c.contributions,
          url: c.html_url,
        })) : [];

      // Fetch issues
      const issuesResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/issues?state=open&per_page=10`, { headers });
      const issuesData = issuesResponse.ok ? await issuesResponse.json() : [];
      
      const issues = {
        totalCount: repoData.open_issues_count || 0,
        openCount: repoData.open_issues_count || 0,
        closedCount: 0, // Would need separate API call
        items: issuesData.filter((issue: any) => !issue.pull_request).map((issue: any) => ({
          id: issue.id.toString(),
          number: issue.number,
          title: issue.title,
          state: issue.state,
          url: issue.html_url,
          createdAt: new Date(issue.created_at).toLocaleDateString(),
          author: {
            login: issue.user?.login || "ghost",
            avatarUrl: issue.user?.avatar_url || "",
          },
        })),
      };

      // Fetch pull requests
      const prsResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/pulls?state=open&per_page=10`, { headers });
      const prsData = prsResponse.ok ? await prsResponse.json() : [];
      
      const pullRequests = {
        totalCount: prsData.length,
        openCount: prsData.length,
        closedCount: 0,
        mergedCount: 0,
        items: prsData.map((pr: any) => ({
          id: pr.id.toString(),
          number: pr.number,
          title: pr.title,
          state: pr.state,
          url: pr.html_url,
          createdAt: new Date(pr.created_at).toLocaleDateString(),
          author: {
            login: pr.user?.login || "ghost",
            avatarUrl: pr.user?.avatar_url || "",
          },
        })),
      };

      // Fetch commits
      const commitsResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/commits?per_page=10`, { headers });
      const commitsData = commitsResponse.ok ? await commitsResponse.json() : [];
      
      const commits = commitsData.map((commit: any) => ({
        oid: commit.sha.substring(0, 7),
        messageHeadline: commit.commit.message.split('\n')[0],
        committedDate: new Date(commit.commit.committer.date).toLocaleDateString(),
        url: commit.html_url,
        author: {
          name: commit.commit.author.name,
          avatarUrl: commit.author?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(commit.commit.author.name)}`,
        },
      }));

      // Fetch releases
      const releasesResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/releases?per_page=5`, { headers });
      const releasesData = releasesResponse.ok ? await releasesResponse.json() : [];
      
      const releases = {
        totalCount: releasesData.length,
        items: releasesData.map((release: any) => ({
          name: release.name || release.tag_name,
          tagName: release.tag_name,
          createdAt: new Date(release.created_at).toLocaleDateString(),
          url: release.html_url,
          description: release.body || "",
        })),
      };

      // Fetch files
      const filesResponse = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${repo}/contents?ref=${repoData.default_branch}`, { headers });
      const filesData = filesResponse.ok ? await filesResponse.json() : [];
      
      const files = filesData.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type as "file" | "dir",
        url: item.html_url,
        downloadUrl: item.download_url || undefined,
        sha: item.sha,
      }));

      return {
        owner: repoData.owner.login,
        name: repoData.name,
        description: repoData.description || "",
        stargazerCount: repoData.stargazers_count || 0,
        forkCount: repoData.forks_count || 0,
        watcherCount: repoData.watchers_count || 0,
        url: repoData.html_url,
        homepageUrl: repoData.homepage,
        createdAt: new Date(repoData.created_at).toLocaleDateString(),
        updatedAt: new Date(repoData.updated_at).toLocaleDateString(),
        isArchived: repoData.archived || false,
        isPrivate: repoData.private || false,
        defaultBranch: repoData.default_branch || "main",
        licenseInfo: repoData.license ? { name: repoData.license.name } : null,
        languages,
        contributors,
        issues,
        pullRequests,
        commits,
        releases,
        topics: repoData.topics || [],
        files,
      };
    } catch (error) {
      console.error("REST API error:", error);
      throw error;
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

    // Check if token is available
    if (!GITHUB_TOKEN) {
      console.warn("No GitHub token found. API rate limits will be very restrictive.");
    }

    // Try GraphQL first, fallback to REST API
    const query = `{
      repository(owner: "${owner}", name: "${repo}") {
        name owner { login } description url homepageUrl stargazerCount forkCount watchers { totalCount }
        createdAt updatedAt isArchived isPrivate defaultBranchRef { name target { ... on Commit { history(first: 10) { nodes { oid messageHeadline committedDate url author { name avatarUrl } } } } } }
        licenseInfo { name } languages(first: 10, orderBy: {field: SIZE, direction: DESC}) { edges { size node { name color } } totalSize }
        mentionableUsers(first: 10) { nodes { login avatarUrl url } }
        issues(first: 10, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) { totalCount nodes { id number title state url createdAt author { login avatarUrl } } }
        closedIssues: issues(states: CLOSED) { totalCount }
        pullRequests(first: 10, states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}) { totalCount nodes { id number title state url createdAt author { login avatarUrl } } }
        closedPullRequests: pullRequests(states: CLOSED) { totalCount } mergedPullRequests: pullRequests(states: MERGED) { totalCount }
        releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) { totalCount nodes { name tagName createdAt url description } }
        repositoryTopics(first: 10) { nodes { topic { name } } }
      }
    }`;

    try {
      let details: RepoDetails;

      if (GITHUB_TOKEN) {
        try {
          const response = await fetch(GITHUB_API_URL, {
            method: "POST",
            headers: { 
              Authorization: `Bearer ${GITHUB_TOKEN}`, 
              "Content-Type": "application/json" 
            },
            body: JSON.stringify({ query }),
          });

          const result = await response.json();
          
          if (result.errors || !result.data?.repository) {
            console.warn("GraphQL failed, falling back to REST API:", result.errors?.[0]?.message);
            details = await fetchRepoDetailsREST(owner, repo);
          } else {
            // Process GraphQL response (your existing logic)
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

            details = {
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
            };
          }
        } catch (graphqlError) {
          console.warn("GraphQL request failed, falling back to REST API:", graphqlError);
          details = await fetchRepoDetailsREST(owner, repo);
        }
      } else {
        // No token available, use REST API only
        details = await fetchRepoDetailsREST(owner, repo);
      }

      setRepoDetails(details);
      
      // Fetch summary after setting repo details
      const fetchSummary = async (data: RepoDetails) => {
        try {
          const id = groupId?.id;
          const response = await fetch("/api/summarize-repo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ repoData: data, groupId: id }),
          });
          
          if (response.ok) {
            const result = await response.json();
            setSummaryData(result);
          } else {
            console.error("Failed to fetch summary:", await response.text());
            setSummaryData({ 
              summary: "Summary temporarily unavailable", 
              folderStructure: "Folder structure temporarily unavailable", 
              folderStructureJSON: null 
            });
          }
        } catch (error) {
          console.error("Error fetching summary:", error);
          setSummaryData({ 
            summary: "Summary temporarily unavailable", 
            folderStructure: "Folder structure temporarily unavailable", 
            folderStructureJSON: null 
          });
        }
      };

      fetchSummary(details);
      
    } catch (error) {
      console.error("Final error:", error);
      setError(`Failed to fetch repository details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullFolderStructure = async () => {
    if (!repoDetails) return;
    const { owner, name, defaultBranch } = repoDetails;

    try {
      const structure = await fetchFolderStructureRecursively(
        owner,
        name,
        "",
        defaultBranch
      );
      setFolderStructure(structure);
    } catch (error) {
      console.error("Error fetching folder structure:", error);
    }
  };

  const fetchFolderContents = async (path: string) => {
    if (!repoDetails) return;
    const { owner, name, defaultBranch } = repoDetails;
    
    const headers: HeadersInit = {};
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }
    
    const response = await fetch(`${GITHUB_REST_API_URL}/repos/${owner}/${name}/contents/${path}?ref=${defaultBranch}`, {
      headers,
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

  useEffect(() => {
    if (repoDetails) {
      fetchFullFolderStructure();
    }
  }, [repoDetails]);

  useEffect(() => {
    if (githublink) fetchRepoDetails(githublink);
  }, [githublink]);

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
    try {
      const response = await fetch(file.downloadUrl);
      const content = await response.text();
      setEditorFile({ path: file.path, content, sha: file.sha || "" });
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const renderFolderStructure = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Full Repository Structure
      </h3>
      <div className="overflow-auto max-h-[600px]">
        {folderStructure ? (
          <FolderTree data={folderStructure} />
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-4 animate-fade-in">
      {repoDetails?.files.length ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Current Directory</h3>
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
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.type === "dir" ? "hover:bg-gray-100 cursor-pointer" : "bg-white"
                }`}
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
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View
                    </a>
                    <button
                      onClick={() => openEditor(item)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Open in Editor
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No files available.</p>
      )}
      {renderFolderStructure()}
    </div>
  );

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          {!GITHUB_TOKEN && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> No GitHub token detected. This may cause rate limiting issues.
                <br />
                Add <code>NEXT_PUBLIC_GITHUB_TOKEN</code> to your environment variables for better performance.
              </p>
            </div>
          )}
        </div>
      )}
      
      {repoDetails && (
        <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {repoDetails.owner}/{repoDetails.name}
              </h1>
              <p className="text-gray-600 mt-1">{repoDetails.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-gray-700">
                  <Star size={16} />
                  <span>{repoDetails.stargazerCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <GitFork size={16} />
                  <span>{repoDetails.forkCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Eye size={16} />
                  <span>{repoDetails.watcherCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <a
              href={repoDetails.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github size={18} />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['overview', 'files', 'commits', 'issues', 'prs', 'releases'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">About</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Created:</span> {repoDetails.createdAt}</p>
                    <p><span className="font-medium">Last updated:</span> {repoDetails.updatedAt}</p>
                    {repoDetails.licenseInfo && (
                      <p><span className="font-medium">License:</span> {repoDetails.licenseInfo.name}</p>
                    )}
                    {repoDetails.homepageUrl && (
                      <p>
                        <span className="font-medium">Website:</span>{' '}
                        <a href={repoDetails.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {repoDetails.homepageUrl}
                        </a>
                      </p>
                    )}
                    <p><span className="font-medium">Default branch:</span> {repoDetails.defaultBranch}</p>
                    <p><span className="font-medium">Status:</span> {repoDetails.isArchived ? 'Archived' : 'Active'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Languages</h3>
                  <div className="space-y-2">
                    {repoDetails.languages.map((lang) => (
                      <div key={lang.name} className="flex items-center">
                        <div
                          className="h-4 rounded-full"
                          style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color,
                          }}
                        />
                        <span className="ml-2 text-sm">
                          {lang.name} ({lang.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {summaryData.summary && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Repository Summary</h3>
                  <p className="text-gray-700 whitespace-pre-line">{summaryData.summary}</p>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Top Contributors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {repoDetails.contributors.map((contributor) => (
                    <a
                      key={contributor.login}
                      href={contributor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <Image
                        src={contributor.avatarUrl}
                        alt={contributor.login}
                        width={64}
                        height={64}
                        className="rounded-full"
                      />
                      <span className="mt-2 font-medium text-center">{contributor.login}</span>
                      <span className="text-xs text-gray-500">{contributor.contributions} commits</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && renderFiles()}

          {activeTab === 'commits' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Recent Commits</h3>
              <div className="space-y-2">
                {repoDetails.commits.map((commit) => (
                  <a
                    key={commit.oid}
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={commit.author.avatarUrl}
                        alt={commit.author.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{commit.messageHeadline}</p>
                        <p className="text-sm text-gray-500">
                          {commit.author.name} committed on {commit.committedDate}
                        </p>
                      </div>
                      <span className="ml-auto font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {commit.oid}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Issues ({repoDetails.issues.totalCount})
                </h3>
                <div className="flex gap-2 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Open: {repoDetails.issues.openCount}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    Closed: {repoDetails.issues.closedCount}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {repoDetails.issues.items.map((issue) => (
                  <a
                    key={issue.id}
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Image
                        src={issue.author.avatarUrl}
                        alt={issue.author.login}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{issue.title}</p>
                        <p className="text-sm text-gray-500">
                          #{issue.number} opened on {issue.createdAt} by {issue.author.login}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          issue.state === 'OPEN'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {issue.state}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'prs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  Pull Requests ({repoDetails.pullRequests.totalCount})
                </h3>
                <div className="flex gap-2 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Open: {repoDetails.pullRequests.openCount}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    Closed: {repoDetails.pullRequests.closedCount}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Merged: {repoDetails.pullRequests.mergedCount}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {repoDetails.pullRequests.items.map((pr) => (
                  <a
                    key={pr.id}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Image
                        src={pr.author.avatarUrl}
                        alt={pr.author.login}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{pr.title}</p>
                        <p className="text-sm text-gray-500">
                          #{pr.number} opened on {pr.createdAt} by {pr.author.login}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          pr.state === 'OPEN'
                            ? 'bg-green-100 text-green-800'
                            : pr.state === 'MERGED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {pr.state}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'releases' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Releases ({repoDetails.releases.totalCount})
              </h3>
              <div className="space-y-4">
                {repoDetails.releases.items.map((release) => (
                  <a
                    key={release.tagName}
                    href={release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {release.name} ({release.tagName})
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Released on {release.createdAt}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Latest
                      </span>
                    </div>
                    {release.description && (
                      <div className="mt-3 text-gray-700 whitespace-pre-line text-sm">
                        {release.description}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {editorFile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b p-4">
                  <h3 className="font-semibold">{editorFile.path}</h3>
                  <button
                    onClick={() => setEditorFile(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  <Editor
                    height="60vh"
                    language={editorFile.path.split('.').pop()}
                    value={editorFile.content}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubRepoDetails;
