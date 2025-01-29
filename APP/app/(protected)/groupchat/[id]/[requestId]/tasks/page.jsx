"use client";
import { Lock, Plus, PlusCircle, Trash2, X } from "lucide-react";
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

  const priorities = [
    { id: "high", label: "High", color: "bg-red-500 text-red-50" },
    { id: "medium", label: "Medium", color: "bg-yellow-500 text-yellow-50" },
    { id: "low", label: "Low", color: "bg-green-500 text-green-50" },
  ];

  useEffect(() => {
    const initialize = async () => {
      try {
        const [roleResponse, membersResponse, lanesResponse] = await Promise.all([
          Findgrouprole(groupId),
          findMembers(groupId),
          getLanesByGroup(groupId),
        ]);

        setIsAdmin(roleResponse.isAdmin === true);
        setTeamMembers(membersResponse[0].members);
        console.log(membersResponse)
        

        console.log(teamMembers)
        console.log(membersResponse[0].members)

        if (lanesResponse.success) {
          const formattedLanes = lanesResponse.lanes.map((lane) => ({
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
        setError("Failed to load board data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [groupId]);

  const handleDragStart = (card, sourceLaneId) => {
    setDraggedCard({ ...card, sourceLaneId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetLaneId) => {
    if (!isAdmin || !draggedCard || draggedCard.sourceLaneId === targetLaneId) return;

    try {
      const { success } = await moveCard(draggedCard.id, targetLaneId);
      if (success) {
        setLanes(lanes.map((lane) => {
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
        }));
      }
    } catch (error) {
      setError("Failed to move card. Please try again.");
    }
    setDraggedCard(null);
  };

  const handleNewCardSubmit = async (laneId) => {
    if (!isAdmin || !newCard.title.trim() || !newCard.assignee || !newCard.priority) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const { success, card } = await createCard(laneId, newCard);
      if (success) {
        const formattedCard = {
          ...card,
          priority: priorities.find((p) => p.id === card.priority),
        };
        setLanes(lanes.map((lane) => {
          if (lane.id === laneId) {
            return {
              ...lane,
              cards: [...lane.cards, formattedCard],
            };
          }
          return lane;
        }));
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
      setError("Failed to create card. Please try again.");
    }
  };

  const handleDeleteCard = async (cardId, laneId) => {
    if (!isAdmin) return;

    try {
      const { success } = await deleteCard(cardId);
      if (success) {
        setLanes(lanes.map((lane) => {
          if (lane.id === laneId) {
            return {
              ...lane,
              cards: lane.cards.filter((card) => card.id !== cardId),
            };
          }
          return lane;
        }));
      }
    } catch (error) {
      setError("Failed to delete card. Please try again.");
    }
  };

  const handleAddLane = async () => {
    if (!isAdmin || !newLaneTitle.trim()) {
      setError("Please enter a lane title");
      return;
    }

    try {
      const { success, lane } = await createLane(groupId, newLaneTitle);
      if (success) {
        setLanes([...lanes, { ...lane, cards: [] }]);
        setNewLaneTitle("");
        setShowNewLaneForm(false);
      }
    } catch (error) {
      setError("Failed to create lane. Please try again.");
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
      setError("Failed to delete lane. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-navy-600" />
      </div>
    );
  }
  return (
    <div className="max-h-screen bg-slate-100 text-navy-800 p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
              aria-label="Add new lane"
            >
              <Plus size={20} />
              <span>Add Lane</span>
            </button>
          )}
        </div>

        {showNewLaneForm && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter lane title"
              className="flex-1 p-2 border border-navy-200 rounded"
              value={newLaneTitle}
              onChange={(e) => setNewLaneTitle(e.target.value)}
            />
            <button
              onClick={handleAddLane}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowNewLaneForm(false)}
              className="bg-navy-100 text-navy-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex gap-6 overflow-x-auto pb-8">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="flex-shrink-0 w-80 bg-navy-50 rounded-xl p-4 border border-navy-100"
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
                    aria-label={`Delete ${lane.title} lane`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {lane.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white border border-navy-100 rounded-xl p-4 shadow-sm"
                    draggable={isAdmin}
                    onDragStart={() => handleDragStart(card, lane.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-navy-800">{card.title}</h3>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteCard(card.id, lane.id)}
                          className="text-navy-500 hover:text-red-500"
                          aria-label="Delete card"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-navy-600 mt-2">{card.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {card.assignee && (
                        <span className="inline-block bg-blue-100 text-black text-xs px-2 py-1 rounded">
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

                {showNewCardForm.visible && showNewCardForm.laneId === lane.id && (
                  <div className="bg-white border border-navy-100 p-4 rounded-lg shadow-sm mt-4">
                    <input
                      type="text"
                      placeholder="Card Title"
                      className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded"
                      value={newCard.title}
                      onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    />
                    <textarea
                      placeholder="Description"
                      className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded"
                      value={newCard.description}
                      onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                    />
                    <select
                      className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded"
                      value={newCard.priority?.id || ""}
                      onChange={(e) => {
                        const selectedPriority = priorities.find(p => p.id === e.target.value);
                        setNewCard({ ...newCard, priority: selectedPriority });
                      }}
                    >
                      <option value="">Select Priority *</option>
                      {priorities.map((priority) => (
                        <option key={priority.id} value={priority.id}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded"
                      value={newCard.assignee?.user.name || ""}
                      onChange={(e) => {
                        const selectedassignee = teamMembers.find(p => p.user.name === e.target.value);
                        setNewCard({ ...newCard, assignee: selectedassignee });
                      }}
                    >
                      <option value="">Assign To</option>
                      {teamMembers.map((member) => (
                        <option key={member.user.id} value={member.user.name}>
                          {member.user.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Label (optional)"
                      className="w-full mb-2 p-2 bg-navy-50 border border-navy-100 rounded"
                      value={newCard.label}
                      onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleNewCardSubmit(lane.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all flex-1"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowNewCardForm({ visible: false, laneId: null })}
                        className="bg-navy-100 hover:bg-navy-200 text-navy-800 px-4 py-2 rounded transition-all flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && !showNewCardForm.visible && (
                <button
                  onClick={() => setShowNewCardForm({ visible: true, laneId: lane.id })}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors w-full justify-center mt-4 py-2"
                  aria-label={`Add card to ${lane.title}`}
                >
                  <PlusCircle size={16} />
                  <span>Add Card</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default KanbanBoard;
