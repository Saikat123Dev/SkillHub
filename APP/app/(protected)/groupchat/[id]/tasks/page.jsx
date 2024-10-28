'use client'
import React, { useState } from 'react';
import { PlusCircle, X, Plus, Trash2 } from 'lucide-react';

const KanbanBoard = ({params}) => {
  console.log('params',params);
  
  const teamMembers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Mike Johnson' },
    { id: 4, name: 'Sarah Wilson' }
  ];

  const priorities = [
    { id: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-800' }
  ];

  const [lanes, setLanes] = useState([
    {
      id: 'lane1',
      title: 'Planned Tasks',
      cards: [
        { 
          id: 'card1', 
          title: 'Write Blog', 
          description: 'Can AI make memes', 
          label: '30 mins',
          assignee: teamMembers[0],
          priority: priorities[0]
        },
        { 
          id: 'card2', 
          title: 'Pay Rent', 
          description: 'Transfer via NEFT', 
          label: '5 mins',
          assignee: teamMembers[1],
          priority: priorities[1]
        }
      ]
    },
    {
      id: 'lane2',
      title: 'In Progress',
      cards: []
    },
    {
      id: 'lane3',
      title: 'Completed',
      cards: []
    }
  ]);

  const [draggedCard, setDraggedCard] = useState(null);
  const [showNewCardForm, setShowNewCardForm] = useState({ visible: false, laneId: null });
  const [newCard, setNewCard] = useState({ 
    title: '', 
    description: '', 
    label: '',
    assignee: null,
    priority: null
  });
  const [showNewLaneForm, setShowNewLaneForm] = useState(false);
  const [newLaneTitle, setNewLaneTitle] = useState('');

  const handleDragStart = (card, laneId) => {
    setDraggedCard({ ...card, sourceLaneId: laneId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetLaneId) => {
    if (draggedCard && draggedCard.sourceLaneId !== targetLaneId) {
      const updatedLanes = lanes.map(lane => {
        if (lane.id === draggedCard.sourceLaneId) {
          return {
            ...lane,
            cards: lane.cards.filter(card => card.id !== draggedCard.id)
          };
        }
        if (lane.id === targetLaneId) {
          return {
            ...lane,
            cards: [...lane.cards, { 
              ...draggedCard,
              id: draggedCard.id
            }]
          };
        }
        return lane;
      });
      setLanes(updatedLanes);
    }
    setDraggedCard(null);
  };

  const handleNewCardSubmit = (laneId) => {
    if (newCard.title.trim() && newCard.assignee && newCard.priority) {
      const updatedLanes = lanes.map(lane => {
        if (lane.id === laneId) {
          return {
            ...lane,
            cards: [...lane.cards, { 
              id: `card${Date.now()}`,
              ...newCard
            }]
          };
        }
        return lane;
      });
      setLanes(updatedLanes);
      setNewCard({ title: '', description: '', label: '', assignee: null, priority: null });
      setShowNewCardForm({ visible: false, laneId: null });
    }
  };

  const handleDeleteCard = (cardId, laneId) => {
    const updatedLanes = lanes.map(lane => {
      if (lane.id === laneId) {
        return {
          ...lane,
          cards: lane.cards.filter(card => card.id !== cardId)
        };
      }
      return lane;
    });
    setLanes(updatedLanes);
  };

  const handleAddLane = () => {
    if (newLaneTitle.trim()) {
      setLanes([...lanes, {
        id: `lane${Date.now()}`,
        title: newLaneTitle,
        cards: []
      }]);
      setNewLaneTitle('');
      setShowNewLaneForm(false);
    }
  };

  const handleDeleteLane = (laneId) => {
    setLanes(lanes.filter(lane => lane.id !== laneId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <button
            onClick={() => setShowNewLaneForm(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Plus size={20} />
            <span>Add Lane</span>
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8">
          {lanes.map(lane => (
            <div
              key={lane.id}
              className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-lg rounded-xl p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(lane.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">{lane.title} ({lane.cards.length})</h2>
                <button
                  onClick={() => handleDeleteLane(lane.id)}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {lane.cards.map(card => (
                <div
                  key={card.id}
                  className="bg-white/5 backdrop-blur-lg p-4 rounded-lg mb-3 cursor-move hover:bg-white/10 transition-all border border-white/10"
                  draggable
                  onDragStart={() => handleDragStart(card, lane.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{card.title}</h3>
                    <button
                      onClick={() => handleDeleteCard(card.id, lane.id)}
                      className="text-white/60 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-white/70 mt-2">{card.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {card.assignee && (
                      <span className="inline-block bg-white/10 text-white text-xs px-2 py-1 rounded">
                        {card.assignee.name}
                      </span>
                    )}
                    {card.priority && (
                      <span className={`inline-block ${card.priority.color} text-xs px-2 py-1 rounded`}>
                        {card.priority.label}
                      </span>
                    )}
                    {card.label && (
                      <span className="inline-block bg-blue-100/10 text-white text-xs px-2 py-1 rounded">
                        {card.label}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {showNewCardForm.visible && showNewCardForm.laneId === lane.id ? (
                <div className="bg-white/5 backdrop-blur-lg p-4 rounded-lg border border-white/10">
                  <input
                    type="text"
                    placeholder="Card Title"
                    className="w-full mb-2 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    className="w-full mb-2 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    value={newCard.description}
                    onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  />
                   <select
            className="w-full mb-2 p-2 bg-gray-800 border border-white/20 rounded text-white appearance-none hover:bg-gray-700 transition-colors"
            value={newCard.assignee?.id || ''}
            onChange={(e) => {
              const member = teamMembers.find(m => m.id === parseInt(e.target.value));
              setNewCard({ ...newCard, assignee: member });
            }}
            style={{
              background: `rgba(31, 41, 55, 0.8) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 8px center`,
              backgroundSize: '16px',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" className="bg-gray-800 text-white">Select Assignee</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id} className="bg-gray-800 text-white">
                {member.name}
              </option>
            ))}
          </select>
          <select
            className="w-full mb-2 p-2 bg-gray-800 border border-white/20 rounded text-white appearance-none hover:bg-gray-700 transition-colors"
            value={newCard.priority?.id || ''}
            onChange={(e) => {
              const priority = priorities.find(p => p.id === e.target.value);
              setNewCard({ ...newCard, priority });
            }}
            style={{
              background: `rgba(31, 41, 55, 0.8) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 8px center`,
              backgroundSize: '16px',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" className="bg-gray-800 text-white">Select Priority</option>
            {priorities.map(priority => (
              <option key={priority.id} value={priority.id} className="bg-gray-800 text-white">
                {priority.label}
              </option>
            ))}
          </select>
                  <input
                    type="text"
                    placeholder="Time Estimate"
                    className="w-full mb-2 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                    value={newCard.label}
                    onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleNewCardSubmit(lane.id)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-all flex-1"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowNewCardForm({ visible: false, laneId: null })}
                      className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded transition-all flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewCardForm({ visible: true, laneId: lane.id })}
                  className="flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors w-full justify-center py-2"
                >
                  <PlusCircle size={16} />
                  <span>Add Card</span>
                </button>
              )}
            </div>
          ))}

          {showNewLaneForm && (
            <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <input
                type="text"
                placeholder="Lane Title"
                className="w-full mb-2 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                value={newLaneTitle}
                onChange={(e) => setNewLaneTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddLane}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded transition-all flex-1"
                >
                  Add Lane
                </button>
                <button
                  onClick={() => setShowNewLaneForm(false)}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded transition-all flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;