import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import ApplicationForm from '../components/ApplicationForm';
import type { ApplicationRequest, ApplicationResponse } from '../types';

export default function CreateApplicationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: ApplicationRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await api.post<ApplicationResponse>(
        '/api/applications',
        data,
      );
      navigate(`/applications/${response.data.id}`);
    } catch {
      setSubmitError('Failed to create application. Please try again.');
    } finally {
      setIsSubmitting(false);
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

        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          New Application
        </h2>

        {submitError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <ApplicationForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Application"
          />
        </div>
      </main>
    </div>
  );
}