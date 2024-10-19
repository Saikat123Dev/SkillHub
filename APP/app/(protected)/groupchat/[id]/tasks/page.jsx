// app/group/[id]/tasks/page.tsx
'use client'
import React, { useState } from 'react';
import { Vote } from 'lucide-react';

const TasksPage = () => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [selectedList, setSelectedList] = useState('To Do');
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
      setNewTaskTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 justify-between text-white flex  items-center  p-4">
      {Object.entries(tasks).map(([list, items]) => (
        <div key={list} className="border border-white border-opacity-20 rounded-lg p-4 min-w-[300px]">
          <h2 className="font-bold text-lg mb-4">{list}</h2>
          {items.map((task) => (
            <div key={task.id} className=" rounded-lg p-3 mb-3 shadow">
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
                  className="flex items-center space-x-1 rounded px-2 py-1 hover:bg-gray-300"
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
              className="w-full p-2 rounded border text-black"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="w-full p-2 rounded border text-black"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button
              onClick={addNewTask}
              className="w-full text-center py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600"
            >
              + Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksPage;