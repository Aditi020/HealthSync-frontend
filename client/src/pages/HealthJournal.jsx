import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Pill,
  Stethoscope,
  FileText
} from 'lucide-react';
import { useJournalStore } from '../store/journalStore';

const HealthJournal = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { logs, addLog, updateLog, deleteLog } = useJournalStore();

  const filteredLogs = logs.filter(
    (log) => log.date >= dateFilter.startDate && log.date <= dateFilter.endDate
  );

  const initialFormState = {
    date: new Date().toISOString().split('T')[0],
    symptoms: [],
    medications: [],
    doctorVisit: {
      doctorName: '',
      specialization: '',
      notes: '',
    },
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedLog) {
      updateLog(selectedLog.id, formData);
    } else {
      addLog(formData);
    }
    setShowForm(false);
    setSelectedLog(null);
    setFormData(initialFormState);
  };

  const handleEdit = (log) => {
    setSelectedLog(log);
    setFormData(log);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      deleteLog(id);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Health Journal</h2>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedLog(null);
            setFormData(initialFormState);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedLog ? 'Edit Health Log' : 'New Health Log'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedLog(null);
                    setFormData(initialFormState);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.symptoms.join(', ')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        symptoms: e.target.value.split(',').map((s) => s.trim()),
                      }))
                    }
                    placeholder="e.g., headache, fever, fatigue"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.medications.join(', ')}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        medications: e.target.value.split(',').map((s) => s.trim()),
                      }))
                    }
                    placeholder="e.g., aspirin, vitamin C"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Doctor Visit (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        value={formData.doctorVisit?.doctorName || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            doctorVisit: {
                              ...prev.doctorVisit,
                              doctorName: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.doctorVisit?.specialization || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            doctorVisit: {
                              ...prev.doctorVisit,
                              specialization: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visit Notes
                    </label>
                    <textarea
                      value={formData.doctorVisit?.notes || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          doctorVisit: {
                            ...prev.doctorVisit,
                            notes: e.target.value,
                          },
                        }))
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedLog(null);
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
                    {selectedLog ? 'Update Log' : 'Add Log'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Logs</h3>
            <p className="text-gray-500">
              Start tracking your health by adding your first log entry.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                  </div>

                  {log.symptoms.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Stethoscope className="h-4 w-4" />
                        <span>Symptoms:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {log.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.medications.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Pill className="h-4 w-4" />
                        <span>Medications:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {log.medications.map((medication, index) => (
                          <span
                            key={index}
                            className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-sm"
                          >
                            {medication}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.doctorVisit?.doctorName && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Stethoscope className="h-4 w-4" />
                        <span>Doctor Visit:</span>
                      </div>
                      <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
                        <p className="font-medium">
                          Dr. {log.doctorVisit.doctorName}
                        </p>
                        <p className="text-sm">
                          {log.doctorVisit.specialization}
                        </p>
                        {log.doctorVisit.notes && (
                          <p className="text-sm mt-2">{log.doctorVisit.notes}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {log.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FileText className="h-4 w-4" />
                        <span>Notes:</span>
                      </div>
                      <p className="text-gray-700">{log.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(log)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(log.id)}
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

export default HealthJournal;