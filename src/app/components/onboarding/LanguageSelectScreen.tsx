import { useState } from 'react';
import { Button } from '../ui/button';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import { Check, Globe } from 'lucide-react';
import type { Language } from '../../types';

const languages = [
  { code: 'ASL' as Language, name: 'American Sign Language', region: 'United States & Canada', learners: '2.5M+' },
  { code: 'BSL' as Language, name: 'British Sign Language', region: 'United Kingdom', learners: '850K+' },
  { code: 'ISL' as Language, name: 'Indian Sign Language', region: 'India', learners: '1.2M+' },
  { code: 'LSF' as Language, name: 'French Sign Language', region: 'France & French-speaking regions', learners: '650K+' },
];

export function LanguageSelectScreen() {
  const { selectedLanguage, setSelectedLanguage, setCurrentStep } = useApp();
  const [selected, setSelected] = useState<Language>(selectedLanguage);

  const handleContinue = () => {
    setSelectedLanguage(selected);
    setCurrentStep('goals-setup');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex flex-col p-6"
      role="main"
      aria-labelledby="language-select-title"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4" aria-hidden="true">
          <Globe className="w-8 h-8 text-blue-500" />
        </div>
        <h1 id="language-select-title" className="text-2xl font-bold mb-2">
          Choose Your Language
        </h1>
        <p className="text-gray-400">
          Select which sign language you'd like to learn
        </p>
      </div>

      {/* Language Options */}
      <div className="flex-1 space-y-3" role="radiogroup" aria-labelledby="language-select-title">
        {languages.map((lang, index) => (
          <motion.button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
              selected === lang.code
                ? 'bg-blue-600/20 border-blue-500'
                : 'bg-gray-900 border-gray-800 hover:border-gray-700'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            role="radio"
            aria-checked={selected === lang.code}
            aria-label={`${lang.name}, ${lang.region}, ${lang.learners} learners`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{lang.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400">
                    {lang.code}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{lang.region}</p>
                <p className="text-xs text-gray-500">{lang.learners} active learners</p>
              </div>
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selected === lang.code
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-600'
                }`}
                aria-hidden="true"
              >
                {selected === lang.code && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <motion.div 
        className="mt-6 p-4 rounded-xl bg-gray-900 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        role="note"
      >
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">Note:</span> You can change your language preference anytime in settings. Each sign language has its own unique grammar and structure.
        </p>
      </motion.div>

      {/* Action Button */}
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleContinue}
          className="w-full bg-white text-black hover:bg-gray-100 h-14 text-lg font-semibold rounded-full"
          aria-label={`Continue with ${languages.find(l => l.code === selected)?.name}`}
        >
          Continue with {selected}
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center gap-2" role="progressbar" aria-valuenow={5} aria-valuemin={1} aria-valuemax={7} aria-label="Onboarding progress: step 5 of 7">
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600" aria-hidden="true"></div>
      </div>
    </div>
  );
}
