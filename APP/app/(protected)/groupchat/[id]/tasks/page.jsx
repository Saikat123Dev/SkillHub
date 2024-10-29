'use client'
import React, { useState,useEffect } from 'react';
import { PlusCircle, X, Plus, Trash2,Lock } from 'lucide-react';
import {Findgrouprole} from '../../../../../actions/group'
import { createLane, deleteLane, createCard, deleteCard, moveCard, getLanesByGroup } from '../../../../../actions/tasks'



const KanbanBoard = ({params}) => {
  const groupId = params.id
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lanes, setLanes] = useState([])
  const[NewLaneTitle,setNewLaneTitle]=useState(" ")
  const[showNewLaneForm,setShowNewLaneForm]=useState(false);
  const [draggedCard, setDraggedCard] = useState(null)
  const [showNewCardForm, setShowNewCardForm] = useState({ visible: false, laneId: null })
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    label: '',
    assignee: null,
    priority: null
  })

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check admin status
        const { isAdmin } = await Findgrouprole(groupId)
        setIsAdmin(isAdmin === true)

        // Fetch lanes and cards
        const { success, lanes: fetchedLanes } = await getLanesByGroup(groupId)
        if (success) {
          const formattedLanes = fetchedLanes.map(lane => ({
            ...lane,
            cards: lane.cards.map(card => ({
              ...card,
              priority: priorities.find(p => p.id === card.priority),
            }))
          }))
          setLanes(formattedLanes)
        }
      } catch (error) {
        console.error('Initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [groupId])
  
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

  const handleDragStart = (card, sourceLaneId) => {
    setDraggedCard({ ...card, sourceLaneId })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (targetLaneId) => {
    if (!isAdmin || !draggedCard) return

    try {
      const { success } = await moveCard(draggedCard.id, targetLaneId)
      if (success) {
        const updatedLanes = lanes.map(lane => {
          if (lane.id === draggedCard.sourceLaneId) {
            return {
              ...lane,
              cards: lane.cards.filter(card => card.id !== draggedCard.id)
            }
          }
          if (lane.id === targetLaneId) {
            return {
              ...lane,
              cards: [...lane.cards, draggedCard]
            }
          }
          return lane
        })
        setLanes(updatedLanes)
      }
    } catch (error) {
      console.error('Error moving card:', error)
    }
    setDraggedCard(null)
  }
  const handleNewCardSubmit = async (laneId) => {
    if (!isAdmin || !newCard.title.trim() || !newCard.assignee || !newCard.priority) return

    try {
    
      const { success, card } = await createCard(laneId, newCard)
      if (success) {
        const formattedCard = {
          ...card,
          priority: priorities.find(p => p.id === card.priority)
        }
        const updatedLanes = lanes.map(lane => {
          if (lane.id === laneId) {
            return {
              ...lane,
              cards: [...lane.cards, formattedCard]
            }
          }
          return lane
        })
        setLanes(updatedLanes)
        setNewCard({ title: '', description: '', label: '', assignee: null, priority: null })
        setShowNewCardForm({ visible: false, laneId: null })
      }
    } catch (error) {
      console.error('Error creating card:', error)
    }
  }

  const handleDeleteCard = async (cardId, laneId) => {
    if (!isAdmin) return

    try {
      const { success } = await deleteCard(cardId)
      if (success) {
        const updatedLanes = lanes.map(lane => {
          if (lane.id === laneId) {
            return {
              ...lane,
              cards: lane.cards.filter(card => card.id !== cardId)
            }
          }
          return lane
        })
        setLanes(updatedLanes)
      }
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  const handleAddLane = async () => {
    if (!isAdmin || !NewLaneTitle.trim()) return

    try {
      const { success, lane } = await createLane(groupId, NewLaneTitle)
      if (success) {
        setLanes([...lanes, { ...lane, cards: [] }])
        setNewLaneTitle('')
        setShowNewLaneForm(false)
      }
    } catch (error) {
      console.error('Error creating lane:', error)
    }
  }

  const handleDeleteLane = async (laneId) => {
    if (!isAdmin) return

    try {
      const { success } = await deleteLane(laneId)
      if (success) {
        setLanes(lanes.filter(lane => lane.id !== laneId))
      }
    } catch (error) {
      console.error('Error deleting lane:', error)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          {!isAdmin && (
            <div className='flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg'>
              <Lock size={16}/>
              <span className="text-sm">Read-only mode</span>
              </div>
          ) 

          }
          {isAdmin && (
          <button
            onClick={() => setShowNewLaneForm(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Plus size={20} />
            <span>Add Lane</span>
          </button>
           )}
        </div>
         

        <div className="flex gap-6 overflow-x-auto pb-8">
          {lanes.map(lane => (
            <div
              key={lane.id}
              className={`flex-shrink-0 w-80 bg-white/10 backdrop-blur-lg rounded-xl p-4 ${
                isAdmin ? 'cursor-pointer' : 'cursor-default'
              }`}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(lane.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">{lane.title} ({lane.cards.length})</h2>
                {isAdmin && (
                <button
                  onClick={() => handleDeleteLane(lane.id)}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                )}
              </div>
<div className='space-y-4'>              
              {lane.cards.map(card => (
                <div
                  key={card.id}
                  className={`flex-shrink-0 w-72 py-5 bg-white/10 backdrop-blur-lg rounded-xl p-4 ${
                    isAdmin ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(card, lane.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{card.title}</h3>
                    {isAdmin && (
                    <button
                      onClick={() => handleDeleteCard(card.id, lane.id)}
                      className="text-white/60 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                    )}
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
              </div> 

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
                <>
               {isAdmin ? (
  <button
    onClick={() => setShowNewCardForm({ visible: true, laneId: lane.id })}
    className="flex items-center gap-1 text-white/60 hover:text-white/90 transition-colors w-full justify-center py-2"
  >
    <PlusCircle size={16} />
    <span>Add Card</span>
  </button>
) : (
  <div className="flex items-center gap-1 text-white/40 justify-center py-2">
    <Lock size={16} />
  </div>
)}
                </>
              )}
            </div>
          ))}
          

          {isAdmin && showNewLaneForm && (
            <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <input
                type="text"
                placeholder="Lane Title"
                className="w-full mb-2 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
                value={NewLaneTitle}
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