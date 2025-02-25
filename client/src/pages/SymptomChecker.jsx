import React, { useState } from 'react';
import {
  AlertCircle,
  Plus,
  X,
  Loader2,
  ThermometerSun,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { useSymptomStore } from '../store/symptomStore';

const SymptomChecker = () => {
  const [input, setInput] = useState('');
  const {
    symptoms,
    conditions,
    isLoading,
    error,
    addSymptom,
    removeSymptom,
    checkSymptoms,
    clearSymptoms
  } = useSymptomStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addSymptom(input.trim());
      setInput('');
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'mild':
        return <ThermometerSun className="h-5 w-5 text-green-500" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'severe':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'mild':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'moderate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'severe':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <AlertCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Symptom Checker</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a symptom (e.g., headache, fever)"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {symptoms.map(symptom => (
                <span
                  key={symptom.id}
                  className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{symptom.name}</span>
                  <button
                    onClick={() => removeSymptom(symptom.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearSymptoms}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={checkSymptoms}
              disabled={isLoading || symptoms.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span>Check Symptoms</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {conditions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Possible Conditions</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {conditions.map(condition => (
              <div
                key={condition.id}
                className={`rounded-xl border p-4 ${getUrgencyColor(condition.urgency)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{condition.name}</h4>
                    <p className="text-sm opacity-90">{condition.description}</p>
                  </div>
                  {getUrgencyIcon(condition.urgency)}
                </div>
                <div className="mt-4 pt-4 border-t border-current border-opacity-10">
                  <p className="text-sm font-medium">
                    Suggested Action: {condition.suggestedAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;