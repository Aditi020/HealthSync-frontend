import React, { useState } from 'react';
import { Download, Loader2, ChevronDown } from 'lucide-react';
import { useHealthMetricsStore } from '../store/healthMetricsStore';

const HealthMetricsExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { exportMetrics } = useHealthMetricsStore();

  const handleExport = async (format) => {
    setIsExporting(true);
    setIsDropdownOpen(false);
    try {
      const data = exportMetrics(format);
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-metrics.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>Export</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            onClick={() => handleExport('csv')}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthMetricsExport;