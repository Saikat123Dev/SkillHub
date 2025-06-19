"use client";

import { Lock, Plus, PlusCircle, Trash2, X, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createCard,
  createLane,
  deleteCard,
  deleteLane,
  getLanesByGroup,
  moveCard,
} from "../../../../../../actions/tasks";
import { Findgrouprole, findMembers } from "@/actions/group";
import { Alert, AlertDescription } from "@/components/ui/alert";

const KanbanBoard = ({ params }) => {
  const groupId = params.id;

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lanes, setLanes] = useState([]);
  const [newLaneTitle, setNewLaneTitle] = useState("");
  const [showNewLaneForm, setShowNewLaneForm] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showNewCardForm, setShowNewCardForm] = useState({ visible: false, laneId: null });
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    label: "",
    assignee: null,
    priority: null,
  });

  const priorities = [
    { id: "high", label: "High", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
    { id: "medium", label: "Medium", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    { id: "low", label: "Low", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  ];

  useEffect(() => {
    const initialize = async () => {
      try {
        const [roleRes, membersRes, lanesRes] = await Promise.all([
          Findgrouprole(groupId),
          findMembers(groupId),
          getLanesByGroup(groupId),
        ]);

        setIsAdmin(roleRes.isAdmin === true);
        setTeamMembers(membersRes[0].members);

        if (lanesRes.success) {
          const formattedLanes = lanesRes.lanes.map((lane) => ({
            ...lane,
            cards: lane.cards.map((card) => ({
              ...card,
              priority: priorities.find((p) => p.id === card.priority),
            })),
          }));
          setLanes(formattedLanes);
        }
      } catch (error) {
        console.error(error);
        setError("Something went wrong while loading the board.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [groupId]);

  const handleDragStart = (card, sourceLaneId) => {
    setDraggedCard({ ...card, sourceLaneId });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (targetLaneId) => {
    if (!isAdmin || !draggedCard || draggedCard.sourceLaneId === targetLaneId) return;

    try {
      const { success } = await moveCard(draggedCard.id, targetLaneId);
      if (success) {
        setLanes((prev) =>
          prev.map((lane) => {
            if (lane.id === draggedCard.sourceLaneId) {
              return { ...lane, cards: lane.cards.filter((c) => c.id !== draggedCard.id) };
            }
            if (lane.id === targetLaneId) {
              return { ...lane, cards: [...lane.cards, draggedCard] };
            }
            return lane;
          })
        );
      }
    } catch {
      setError("Failed to move card.");
    } finally {
      setDraggedCard(null);
    }
  };

  const handleNewCardSubmit = async (laneId) => {
    if (!newCard.title || !newCard.priority || !newCard.assignee) {
      return setError("Please fill in all required fields.");
    }

    try {
      const { success, card } = await createCard(laneId, newCard);
      if (success) {
        const formattedCard = {
          ...card,
          priority: priorities.find((p) => p.id === card.priority),
        };

        setLanes((prev) =>
          prev.map((lane) =>
            lane.id === laneId
              ? { ...lane, cards: [...lane.cards, formattedCard] }
              : lane
          )
        );
        setNewCard({ title: "", description: "", label: "", assignee: null, priority: null });
        setShowNewCardForm({ visible: false, laneId: null });
      }
    } catch {
      setError("Failed to create card.");
    }
  };

  const handleDeleteCard = async (cardId, laneId) => {
    try {
      const { success } = await deleteCard(cardId);
      if (success) {
        setLanes((prev) =>
          prev.map((lane) =>
            lane.id === laneId
              ? { ...lane, cards: lane.cards.filter((c) => c.id !== cardId) }
              : lane
          )
        );
      }
    } catch {
      setError("Failed to delete card.");
    }
  };

  const handleAddLane = async () => {
    if (!newLaneTitle.trim()) return setError("Enter a lane title.");

    try {
      const { success, lane } = await createLane(groupId, newLaneTitle);
      if (success) {
        setLanes((prev) => [...prev, { ...lane, cards: [] }]);
        setNewLaneTitle("");
        setShowNewLaneForm(false);
      }
    } catch {
      setError("Failed to create lane.");
    }
  };

  const handleDeleteLane = async (laneId) => {
    try {
      const { success } = await deleteLane(laneId);
      if (success) {
        setLanes((prev) => prev.filter((l) => l.id !== laneId));
      }
    } catch {
      setError("Failed to delete lane.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Project Board</h1>
            <p className="text-slate-600 text-sm">Manage tasks and track progress</p>
          </div>
          
          {isAdmin ? (
            <button
              onClick={() => setShowNewLaneForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Plus size={18} />
              <span>Add Column</span>
            </button>
          ) : (
            <div className="bg-slate-100 text-slate-700 text-sm px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
              <Lock size={16} />
              View Only
            </div>
          )}
        </div>

        {/* New Lane Form */}
        {showNewLaneForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Create New Column</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Column Name</label>
                <input
                  type="text"
                  placeholder="Enter column name..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newLaneTitle}
                  onChange={(e) => setNewLaneTitle(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddLane} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewLaneForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Kanban Lanes */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="flex-shrink-0 w-80 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(lane.id)}
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{lane.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lane.cards.length} {lane.cards.length === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteLane(lane.id)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                    aria-label={`Delete ${lane.title} column`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Cards Container */}
              <div className="p-4 space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {lane.cards.map((card) => (
                  <div
                    key={card.id}
                    className="group bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
                    draggable={isAdmin}
                    onDragStart={() => handleDragStart(card, lane.id)}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-slate-900 leading-snug pr-2">{card.title}</h3>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteCard(card.id, lane.id)}
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 rounded"
                          aria-label="Delete card"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Card Description */}
                    {card.description && (
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{card.description}</p>
                    )}

                    {/* Card Meta */}
                    <div className="flex flex-wrap gap-2">
                      {card.assignee && (
                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1.5 rounded-md border border-blue-200">
                          <User size={12} />
                          <span className="font-medium">{card.assignee.name}</span>
                        </div>
                      )}
                      
                      {card.priority && (
                        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border font-medium ${card.priority.color}`}>
                          <div className={`w-2 h-2 rounded-full ${card.priority.dot}`}></div>
                          <span>{card.priority.label}</span>
                        </div>
                      )}
                      
                      {card.label && (
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-md border border-slate-200 font-medium">
                          {card.label}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* New Card Form */}
                {showNewCardForm.visible && showNewCardForm.laneId === lane.id && (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Create New Task</h4>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Task title..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newCard.title}
                        onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                      />
                      
                      <textarea
                        placeholder="Task description..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        value={newCard.description}
                        onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={newCard.priority?.id || ""}
                          onChange={(e) => setNewCard({ ...newCard, priority: e.target.value })}
                        >
                          <option value="">Select Priority</option>
                          {priorities.map((priority) => (
                            <option key={priority.id} value={priority.id}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                        
                        <select
                          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={newCard.assignee?.id || ""}
                          onChange={(e) => {
                            const member = teamMembers.find(m => m.id === e.target.value);
                            setNewCard({ ...newCard, assignee: member });
                          }}
                        >
                          <option value="">Assign to...</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Label (optional)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newCard.label}
                        onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
                      />
                      
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleNewCardSubmit(lane.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                        >
                          Create Task
                        </button>
                        <button
                          onClick={() => setShowNewCardForm({ visible: false, laneId: null })}
                          className="px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Card Button */}
              {isAdmin && !showNewCardForm.visible && (
                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={() => setShowNewCardForm({ visible: true, laneId: lane.id })}
                    className="w-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 text-sm py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-300 flex items-center justify-center gap-2 font-medium transition-all"
                    aria-label={`Add task to ${lane.title}`}
                  >
                    <PlusCircle size={16} />
                    Add Task
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;