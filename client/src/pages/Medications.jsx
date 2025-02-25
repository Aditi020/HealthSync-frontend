import React, { useState } from 'react';
import {
  Pill,
  Plus,
  X,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useMedicationStore } from '../store/medicationStore';

const Medications = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);

  const { medications, addMedication, updateMedication, deleteMedication, markAsTaken } =
    useMedicationStore();

  const initialFormState = {
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: 'morning',
    nextDose: new Date().toISOString(),
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMedication) {
      updateMedication(selectedMedication.id, formData);
    } else {
      addMedication(formData);
    }
    setShowForm(false);
    setSelectedMedication(null);
    setFormData(initialFormState);
  };

  const handleEdit = (medication) => {
    setSelectedMedication(medication);
    setFormData(medication);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      deleteMedication(id);
    }
  };

  const getTimeOfDayColor = (timeOfDay) => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-yellow-50 text-yellow-700';
      case 'afternoon':
        return 'bg-blue-50 text-blue-700';
      case 'evening':
        return 'bg-purple-50 text-purple-700';
      case 'night':
        return 'bg-indigo-50 text-indigo-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily':
        return 'Every Day';
      case 'weekly':
        return 'Every Week';
      case 'monthly':
        return 'Every Month';
      default:
        return frequency;
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Pill className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Medications</h2>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedMedication(null);
            setFormData(initialFormState);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Medication</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedMedication ? 'Edit Medication' : 'Add New Medication'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedMedication(null);
                    setFormData(initialFormState);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 1 pill, 5ml"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      frequency: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time of Day
                  </label>
                  <select
                    value={formData.timeOfDay}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      timeOfDay: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Dose
                  </label>
                  <input
                    type="datetime-local"
                    value={new Date(formData.nextDose).toISOString().slice(0, 16)}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nextDose: new Date(e.target.value).toISOString(),
                    }))}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedMedication(null);
                      setFormData(initialFormState);
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedMedication ? 'Update' : 'Add'} Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {medications.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Medications</h3>
            <p className="text-gray-500">
              Start tracking your medications by adding your first medication.
            </p>
          </div>
        ) : (
          medications.map((medication) => (
            <div
              key={medication.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Pill className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{medication.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Frequency:</span>
                      </div>
                      <p className="text-sm font-medium">
                        {getFrequencyLabel(medication.frequency)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Time of Day:</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTimeOfDayColor(
                          medication.timeOfDay
                        )}`}
                      >
                        {medication.timeOfDay.charAt(0).toUpperCase() +
                          medication.timeOfDay.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Next Dose:</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(medication.nextDose).toLocaleString()}
                    </p>
                  </div>

                  {medication.lastTaken && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Last Taken:</span>
                      </div>
                      <p className="text-sm font-medium">
                        {new Date(medication.lastTaken).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => markAsTaken(medication.id)}
                    className="text-green-600 hover:text-green-700"
                    title="Mark as taken"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(medication)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(medication.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Medications;