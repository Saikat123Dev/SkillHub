'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, X, Award, Star, ChevronDown, Pin, Vote, Paperclip, Smile, MoreHorizontal, Users, Trophy, Target } from 'lucide-react';

const ComprehensiveCollaborationHub = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium'); // Default to medium priority
  const [selectedList, setSelectedList] = useState('To Do'); // Default to "To Do" list
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alice Smith', content: 'Hey team! Let\'s discuss our progress on the current sprint.', timestamp: '10:30 AM', reactions: ['👍', '🎉'] },
    { id: 2, sender: 'Bob Johnson', content: 'I\'ve completed the user authentication module. Ready for review!', timestamp: '10:32 AM', reactions: ['🚀'] },
    { id: 3, sender: 'John Doe', content: 'Great job, Bob! I\'ll start the review process right away.', timestamp: '10:35 AM', reactions: ['👀'] },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [tasks, setTasks] = useState({
    'To Do': [
      { id: 1, title: 'Design homepage', priority: 'high', progress: 0, streak: 2, votes: 3 },
      { id: 2, title: 'Set up database', priority: 'medium', progress: 0, streak: 0, votes: 1 },
    ],
    'In Progress': [
      { id: 3, title: 'Implement user authentication', priority: 'high', progress: 50, streak: 5, votes: 4 },
    ],
    'Done': [
      { id: 4, title: 'Project setup', priority: 'low', progress: 100, streak: 0, votes: 2 },
      { id: 5, title: 'Create wireframes', priority: 'medium', progress: 100, streak: 3, votes: 3 },
    ]
  });
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: 'Alice Smith', points: 120, role: 'Project Manager' },
    { id: 2, name: 'Bob Johnson', points: 95, role: 'Developer' },
    { id: 3, name: 'John Doe', points: 80, role: 'Designer' },
    { id: 4, name: 'Emma Wilson', points: 75, role: 'QA Tester' },
  ]);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([
    { id: 1, content: 'Team meeting tomorrow at 10 AM', author: 'Alice Smith' },
    { id: 2, content: 'New project deadline: June 30th', author: 'John Doe' },
  ]);
  const [groupAchievements, setGroupAchievements] = useState([
    { id: 1, title: 'Sprint Master', description: 'Completed all tasks in a sprint', icon: '🏃‍♂️' },
    { id: 2, title: 'Perfect Harmony', description: 'All members contributed equally', icon: '🎵' },
  ]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const addVote = (listName, taskId) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [listName]: prevTasks[listName].map(task =>
        task.id === taskId ? { ...task, votes: (task.votes || 0) + 1 } : task
      )
    }));
  };

  const addNewTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: tasks[selectedList].length + 1,
        title: newTaskTitle,
        priority: newTaskPriority,
        progress: 0,
        streak: 0,
        votes: 0,
      };
      setTasks(prevTasks => ({
        ...prevTasks,
        [selectedList]: [...prevTasks[selectedList], newTask]
      }));
      setNewTaskTitle(''); // Clear the input after adding
    }
  };

  const renderMainContent = () => {
    switch(activeTab) {
      case 'tasks':
        return (
          <div className="flex space-x-4 overflow-x-auto p-4">
            {Object.entries(tasks).map(([list, items]) => (
              <div key={list} className="bg-gray-100 rounded-lg p-4 min-w-[300px]">
                <h2 className="font-bold text-lg mb-4">{list}</h2>
                {items.map((task) => (
                  <div key={task.id} className="bg-white rounded-lg p-3 mb-3 shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{task.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-200 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="mb-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{width: `${task.progress}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Streak: {task.streak} 🔥</span>
                      <button 
                        onClick={() => addVote(list, task.id)}
                        className="flex items-center space-x-1 bg-gray-200 rounded px-2 py-1 hover:bg-gray-300"
                      >
                        <Vote size={14} />
                        <span>{task.votes || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full p-2 rounded border"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full p-2 rounded border"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                  <button
                    onClick={addNewTask}
                    className="w-full text-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'leaderboard':
        return (
          <div className="p-4">
            <h2 className="font-bold text-2xl mb-4">Group Leaderboard</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {leaderboard.map((member, index) => (
                <div key={member.id} className="flex items-center p-4 border-b last:border-b-0">
                  <div className="font-bold text-2xl w-10 text-center">{index + 1}</div>
                  <div className="flex-grow ml-4">
                    <div className="font-bold">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                  <div className="text-xl font-bold text-gray-700">{member.points} pts</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="p-4">
            <h2 className="font-bold text-2xl mb-4">Pinned Announcements</h2>
            {pinnedAnnouncements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg p-4 mb-4 shadow">
                <div className="font-bold">{announcement.content}</div>
                <div className="text-sm text-gray-500 mt-2">- {announcement.author}</div>
              </div>
            ))}
          </div>
        );
      case 'achievements':
        return (
          <div className="p-4">
            <h2 className="font-bold text-2xl mb-4">Group Achievements</h2>
            {groupAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg p-4 mb-4 shadow flex items-center">
                <div className="text-3xl mr-4">{achievement.icon}</div>
                <div>
                  <div className="font-bold">{achievement.title}</div>
                  <div className="text-sm text-gray-500">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'chat':
        return (
          <div className="flex flex-col h-[calc(100vh-120px)]">
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-auto">
              {messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <div className="font-bold">{message.sender}</div>
                  <div>{message.content}</div>
                  <div className="text-xs text-gray-500">{message.timestamp}</div>
                  <div className="mt-1 space-x-2">
                    {message.reactions.map((reaction, idx) => (
                      <span key={idx}>{reaction}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t bg-white flex items-center space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-2 rounded border"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                <Send size={16} />
              </button>
            </form>
          </div>
        );
      default:
        return <div>Invalid tab</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Comprehensive Collaboration Hub</h1>
        <nav className="space-x-4">
          <button
            className={`${activeTab === 'tasks' ? 'bg-blue-500' : 'bg-gray-700'} px-3 py-2 rounded`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`${activeTab === 'leaderboard' ? 'bg-blue-500' : 'bg-gray-700'} px-3 py-2 rounded`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={`${activeTab === 'announcements' ? 'bg-blue-500' : 'bg-gray-700'} px-3 py-2 rounded`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          <button
            className={`${activeTab === 'achievements' ? 'bg-blue-500' : 'bg-gray-700'} px-3 py-2 rounded`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
          <button
            className={`${activeTab === 'chat' ? 'bg-blue-500' : 'bg-gray-700'} px-3 py-2 rounded`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
        </nav>
      </div>
      <div className="flex-grow overflow-auto">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default ComprehensiveCollaborationHub;
