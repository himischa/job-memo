import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import type { ApplicationResponse } from '../types';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApplicationResponse>(
        `/api/applications/${id}`,
      );
      setApplication(response.data);
    } catch (err: unknown) {
      if (err instanceof Object && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 404) {
          setError('Application not found.');
        } else {
          setError('Failed to load application. Please try again.');
        }
      } else {
        setError('Failed to load application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplication();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await api.delete(`/api/applications/${id}`);
      navigate('/');
    } catch {
      setError('Failed to delete application. Please try again.');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Dashboard
        </button>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>
            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={fetchApplication}
                className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
              {error === 'Application not found.' && (
                <button
                  onClick={() => navigate('/')}
                  className="rounded-md bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        )}

        {/* Detail */}
        {!loading && !error && application && (
          <>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {application.position}
                  </h2>
                  <p className="mt-1 text-lg text-gray-600">
                    {application.company}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Applied Date
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {application.appliedAt
                      ? new Date(application.appliedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Source
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {application.source || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Created
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(application.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-medium uppercase text-gray-500">
                  Notes
                </p>
                {application.notes ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-900">
                    {application.notes}
                  </p>
                ) : (
                  <p className="mt-2 text-sm italic text-gray-400">
                    No notes added.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate(`/applications/${id}/edit`)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </>
        )}

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Application
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this application? This action
                cannot be undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}