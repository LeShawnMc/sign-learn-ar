import { useState } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Target, Check, Briefcase, MessageCircle, Home, BookOpen } from 'lucide-react';
import type { LearningGoal } from '../../types';

const goals = [
  { 
    id: 'basics' as LearningGoal, 
    title: 'Learn the Basics', 
    description: 'Essential signs for everyday communication',
    icon: BookOpen,
    color: 'blue'
  },
  { 
    id: 'conversation' as LearningGoal, 
    title: 'Hold Conversations', 
    description: 'Build fluency for real-world interactions',
    icon: MessageCircle,
    color: 'green'
  },
  { 
    id: 'professional' as LearningGoal, 
    title: 'Professional Use', 
    description: 'Sign language for work and business',
    icon: Briefcase,
    color: 'purple'
  },
  { 
    id: 'daily-life' as LearningGoal, 
    title: 'Daily Life', 
    description: 'Communicate with family and friends',
    icon: Home,
    color: 'orange'
  },
];

export function GoalsSetupScreen() {
  const { setLearningGoals, setCurrentStep } = useApp();
  const [selected, setSelected] = useState<LearningGoal[]>([]);

  const handleToggleGoal = (goal: LearningGoal) => {
    setSelected(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleContinue = () => {
    setLearningGoals(selected);
    setCurrentStep('first-lesson');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="goals-setup-title"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4" aria-hidden="true">
          <Target className="w-8 h-8 text-blue-500" />
        </div>
        <h1 id="goals-setup-title" className="text-2xl font-bold mb-2">
          Set Your Learning Goals
        </h1>
        <p className="text-gray-400">
          Select one or more goals to personalize your learning experience
        </p>
      </div>

      {/* Goal Options */}
      <div className="flex-1 space-y-3" role="group" aria-labelledby="goals-setup-title">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const isSelected = selected.includes(goal.id);
          
          return (
            <motion.button
              key={goal.id}
              onClick={() => handleToggleGoal(goal.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              aria-pressed={isSelected}
              aria-label={`${goal.title}: ${goal.description}`}
            >
              <div className="flex items-start gap-4">
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-600/30' : 'bg-gray-800'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                  <p className="text-sm text-gray-400">{goal.description}</p>
                </div>
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-600'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Daily Goal Setting */}
      <motion.div 
        className="mt-6 p-5 rounded-2xl bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Daily Goal</h3>
            <p className="text-sm text-gray-400">Signs to learn each day</p>
          </div>
          <div className="text-2xl font-bold text-blue-500">10</div>
        </div>
        <div className="flex gap-2" role="radiogroup" aria-label="Daily learning goal">
          {[5, 10, 15, 20].map(num => (
            <button
              key={num}
              className={`flex-1 py-2 rounded-lg border-2 font-semibold ${
                num === 10
                  ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
              role="radio"
              aria-checked={num === 10}
              aria-label={`${num} signs per day`}
            >
              {num}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div 
        className="mt-4 p-4 rounded-xl bg-gray-900 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        role="note"
      >
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">Tip:</span> Start with a manageable daily goal and increase it as you progress. Consistency is key to mastering sign language!
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={selected.length > 0 ? `Continue with ${selected.length} goal${selected.length > 1 ? 's' : ''} selected` : 'Select at least one goal to continue'}
        >
          {selected.length > 0 ? 'Continue' : 'Select at Least One Goal'}
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2" role="progressbar" aria-valuenow={6} aria-valuemin={1} aria-valuemax={7} aria-label="Onboarding progress: step 6 of 7">
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
      </div>
    </div>
  );
}
