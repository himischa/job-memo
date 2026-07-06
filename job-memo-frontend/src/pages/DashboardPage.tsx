import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import type { ApplicationResponse, ApplicationStatus } from '../types';

interface Filters {
  status: ApplicationStatus | '';
  company: string;
  startDate: string;
  endDate: string;
}

const initialFilters: Filters = {
  status: '',
  company: '',
  startDate: '',
  endDate: '',
};

export default function DashboardPage() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (appliedFilters: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (appliedFilters.status) params.append('status', appliedFilters.status);
      if (appliedFilters.company) params.append('company', appliedFilters.company);
      if (appliedFilters.startDate) params.append('startDate', appliedFilters.startDate);
      if (appliedFilters.endDate) params.append('endDate', appliedFilters.endDate);

      const query = params.toString();
      const url = query ? `/api/applications?${query}` : '/api/applications';
      const response = await api.get<ApplicationResponse[]>(url);
      setApplications(response.data);
    } catch (err) {
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications(initialFilters);
  }, [fetchApplications]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchApplications(filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    fetchApplications(initialFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Applications
          </h2>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Application
          </button>
        </div>

        {/* Filters */}
        <div
          className="mb-6 rounded-lg border bg-white p-4 shadow-sm"
          onKeyDown={handleKeyDown}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">All</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="company"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                Company
              </label>
              <input
                id="company"
                type="text"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                placeholder="Search company..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                From Date
              </label>
              <input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="mb-1 block text-xs font-medium text-gray-600"
              >
                To Date
              </label>
              <input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => fetchApplications(filters)}
              className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">
              No applications found.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Click "+ New Application" to add your first job application.
            </p>
          </div>
        )}

        {/* Application list */}
        {!loading && !error && applications.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {app.company}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {app.position}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}