import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import ApplicationForm from '../components/ApplicationForm';
import type { ApplicationRequest, ApplicationResponse } from '../types';

export default function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await api.get<ApplicationResponse>(
          `/api/applications/${id}`,
        );
        setApplication(response.data);
      } catch {
        setFetchError('Failed to load application. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplication();
  }, [id]);

  const toFormData = (
    app: ApplicationResponse,
  ): ApplicationRequest => ({
    company: app.company,
    position: app.position,
    status: app.status,
    appliedAt: app.appliedAt,
    source: app.source,
    notes: app.notes,
  });

  const handleSubmit = async (data: ApplicationRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await api.put(`/api/applications/${id}`, data);
      navigate(`/applications/${id}`);
    } catch {
      setSubmitError('Failed to update application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <button
          onClick={() => navigate(`/applications/${id}`)}
          className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Application
        </button>

        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Edit Application
        </h2>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        )}

        {/* Fetch error */}
        {!loading && fetchError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{fetchError}</p>
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Form */}
        {!loading && !fetchError && application && (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <ApplicationForm
              initialData={toFormData(application)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Save Changes"
            />
          </div>
        )}
      </main>
    </div>
  );
}