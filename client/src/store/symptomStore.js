import { create } from 'zustand';

export const useSymptomStore = create((set, get) => ({ // Add 'get' parameter here
  symptoms: [],
  conditions: [],
  isLoading: false,
  error: null,

  // Reset action
  resetSymptoms: () => set({ symptoms: [], conditions: [], error: null }),

  // Add a new symptom
  addSymptom: (symptomName) => {
    const currentSymptoms = get().symptoms; // Use get() to access current state
    if (currentSymptoms.some(s => s.name.toLowerCase() === symptomName.toLowerCase())) {
      return;
    }
    set(state => ({
      symptoms: [...state.symptoms, {
        id: `symptom-${Math.random()}`,
        name: symptomName.trim()
      }]
    }));
  },

  // Remove a symptom
  removeSymptom: (id) => {
    set(state => ({
      symptoms: state.symptoms.filter(s => s.id !== id)
    }));
  },

  // Check symptoms
  checkSymptoms: async () => {
    const currentSymptoms = get().symptoms;
    if (currentSymptoms.length === 0) {
      set({ error: 'Please enter at least one symptom' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const conditions = await mockCheckSymptoms(currentSymptoms);
      set({ conditions, isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to analyze symptoms. Please try again.',
        isLoading: false
      });
    }
  },

  // Clear symptoms
  clearSymptoms: () => {
    set({ symptoms: [], conditions: [], error: null });
  },
}));

// Mock API simulation
const mockCheckSymptoms = async (symptoms) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return symptoms.map(symptom => ({
    id: `condition-${Math.random()}`,
    name: `${symptom.name.charAt(0).toUpperCase() + symptom.name.slice(1)} Related Condition`,
    description: `A condition commonly associated with ${symptom.name.toLowerCase()}.`,
    urgency: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)],
    suggestedAction: Math.random() > 0.5
      ? 'Consult a doctor within 24 hours'
      : 'Rest and monitor symptoms'
  }));
};