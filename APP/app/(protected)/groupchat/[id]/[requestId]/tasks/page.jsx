"use client";
import React, { useState, useEffect } from "react";
import { PlusCircle, X, Plus, Trash2, Lock } from "lucide-react";
import {
  createLane,
  deleteLane,
  createCard,
  deleteCard,
  moveCard,
  getLanesByGroup,
} from "@/actions/tasks";

const KanbanBoard = ({ params }) => {
  const groupId = params.id;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lanes, setLanes] = useState([]);
  const [NewLaneTitle, setNewLaneTitle] = useState("");
  const [showNewLaneForm, setShowNewLaneForm] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showNewCardForm, setShowNewCardForm] = useState({
    visible: false,
    laneId: null,
  });
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    label: "",
    assignee: null,
    priority: null,
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const { isAdmin } = await Findgrouprole(groupId);
        setIsAdmin(isAdmin === true);
        const Members = await findMembers(groupId);
        const teamMembers = Members[0].members;
        setTeamMembers(teamMembers);

        const { success, lanes: fetchedLanes } = await getLanesByGroup(groupId);
        if (success) {
          const formattedLanes = fetchedLanes.map((lane) => ({
            ...lane,
            cards: lane.cards.map((card) => ({
              ...card,
              priority: priorities.find((p) => p.id === card.priority),
            })),
          }));
          setLanes(formattedLanes);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [groupId]);

  const priorities = [
    { id: "high", label: "High", color: "bg-red-500 text-red-50" },
    { id: "medium", label: "Medium", color: "bg-yellow-500 text-yellow-50" },
    { id: "low", label: "Low", color: "bg-green-500 text-green-50" },
  ];

  const handleDragStart = (card, sourceLaneId) => {
    setDraggedCard({ ...card, sourceLaneId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetLaneId) => {
    if (!isAdmin || !draggedCard) return;

    try {
      const { success } = await moveCard(draggedCard.id, targetLaneId);
      if (success) {
        const updatedLanes = lanes.map((lane) => {
          if (lane.id === draggedCard.sourceLaneId) {
            return {
              ...lane,
              cards: lane.cards.filter((card) => card.id !== draggedCard.id),
            };
          }
          if (lane.id === targetLaneId) {
            return {
              ...lane,
              cards: [...lane.cards, draggedCard],
            };
          }
          return lane;
        });
        setLanes(updatedLanes);
      }
    } catch (error) {
      console.error("Error moving card:", error);
    }
    setDraggedCard(null);
  };

  const handleNewCardSubmit = async (laneId) => {
    if (
        !isAdmin ||
        !newCard.title.trim() ||
        !newCard.assignee ||
        !newCard.priority
    )
      return;

    try {
      const { success, card } = await createCard(laneId, newCard);
      if (success) {
        const formattedCard = {
          ...card,
          priority: priorities.find((p) => p.id === card.priority),
        };
        const updatedLanes = lanes.map((lane) => {
          if (lane.id === laneId) {
            return {
              ...lane,
              cards: [...lane.cards, formattedCard],
            };
          }
          return lane;
        });
        setLanes(updatedLanes);
        setNewCard({
          title: "",
          description: "",
          label: "",
          assignee: null,
          priority: null,
        });
        setShowNewCardForm({ visible: false, laneId: null });
      }
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  const handleDeleteCard = async (cardId, laneId) => {
    if (!isAdmin) return;

    try {
      const { success } = await deleteCard(cardId);
      if (success) {
        const updatedLanes = lanes.map((lane) => {
          if (lane.id === laneId) {
            return {
              ...lane,
              cards: lane.cards.filter((card) => card.id !== cardId),
            };
          }
          return lane;
        });
        setLanes(updatedLanes);
      }
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleAddLane = async () => {
    if (!isAdmin || !NewLaneTitle.trim()) return;

    try {
      const { success, lane } = await createLane(groupId, NewLaneTitle);
      if (success) {
        setLanes([...lanes, { ...lane, cards: [] }]);
        setNewLaneTitle("");
        setShowNewLaneForm(false);
      }
    } catch (error) {
      console.error("Error creating lane:", error);
    }
  };

  const handleDeleteLane = async (laneId) => {
    if (!isAdmin) return;

    try {
      const { success } = await deleteLane(laneId);
      if (success) {
        setLanes(lanes.filter((lane) => lane.id !== laneId));
      }
    } catch (error) {
      console.error("Error deleting lane:", error);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-navy-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-navy-600"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-white text-navy-800 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-navy-800">Kanban Board</h1>
            {!isAdmin && (
                <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg">
                  <Lock size={16} className="text-navy-600" />
                  <span className="text-sm text-navy-600">Read-only mode</span>
                </div>
            )}
            {isAdmin && (
                <button
                    onClick={() => setShowNewLaneForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Plus size={20} />
                  <span>Add Lane</span>
                </button>
            )}
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8">
            {lanes.map((lane) => (
                <div
                    key={lane.id}
                    className={`flex-shrink-0 w-80 bg-navy-50 rounded-xl p-4 border border-navy-100 ${
                        isAdmin ? "cursor-pointer" : "cursor-default"
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(lane.id)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg text-navy-800">
                      {lane.title} ({lane.cards.length})
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => handleDeleteLane(lane.id)}
                            className="text-navy-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {lane.cards.map((card) => (
                        <div
                            key={card.id}
                            className={`flex-shrink-0 w-72 py-5 bg-white border border-navy-100 rounded-xl p-4 shadow-sm ${
                                isAdmin ? "cursor-pointer" : "cursor-default"
                            }`}
                            draggable
                            onDragStart={() => handleDragStart(card, lane.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-navy-800">{card.title}</h3>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteCard(card.id, lane.id)}
                                    className="text-navy-500 hover:text-red-500"
                                >
                                  <X size={16} />
                                </button>
                            )}
                          </div>
                          <p className="text-sm text-navy-600 mt-2">{card.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {card.assignee && (
                                <span className="inline-block bg-blue-100 text-navy-800 text-xs px-2 py-1 rounded">
                    {card.assignee.name}
                  </span>
                            )}
                            {card.priority && (
                                <span
                                    className={`inline-block ${card.priority.color} text-xs px-2 py-1 rounded`}
                                >
                    {card.priority.label}
                  </span>
                            )}
                            {card.label && (
                                <span className="inline-block bg-blue-100 text-navy-800 text-xs px-2 py-1 rounded">
                    {card.label}
                  </span>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>

                  {showNewCardForm.visible && showNewCardForm.laneId === lane.id ? (
                      <div className="bg-white border border-navy-100 p-4 rounded-lg shadow-sm">
                        <input
                            type="text"
                            placeholder="Card Title"
                            className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded text-navy-800 placeholder-navy-500"
                            value={newCard.title}
                            onChange={(e) =>
                                setNewCard({ ...newCard, title: e.target.value })
                            }
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded text-navy-800 placeholder-navy-500"
                            value={newCard.description}
                            onChange={(e) =>
                                setNewCard({ ...newCard, description: e.target.value })
                            }
                        />
                        {/* Select Inputs */}
                        <div className="flex gap-2">
                          <button
                              onClick={() => handleNewCardSubmit(lane.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all flex-1"
                          >
                            Add
                          </button>
                          <button
                              onClick={() =>
                                  setShowNewCardForm({ visible: false, laneId: null })
                              }
                              className="bg-navy-100 hover:bg-navy-200 text-navy-800 px-4 py-2 rounded transition-all flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                  ) : (
                      <>
                        {isAdmin ? (
                            <button
                                onClick={() =>
                                    setShowNewCardForm({ visible: true, laneId: lane.id })
                                }
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors w-full justify-center py-2"
                            >
                              <PlusCircle size={16} />
                              <span>Add Card</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-1 text-navy-400 justify-center py-2">
                              <Lock size={16} />
                            </div>
                        )}
                      </>
                  )}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default KanbanBoard;