import { useState, type FormEvent } from 'react';
import type { ApplicationRequest, ApplicationStatus } from '../types';

interface ApplicationFormProps {
  initialData?: ApplicationRequest;
  onSubmit: (data: ApplicationRequest) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export default function ApplicationForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ApplicationFormProps) {
  const [company, setCompany] = useState(initialData?.company ?? '');
  const [position, setPosition] = useState(initialData?.position ?? '');
  const [status, setStatus] = useState<ApplicationStatus>(
    initialData?.status ?? 'APPLIED',
  );
  const [appliedAt, setAppliedAt] = useState(initialData?.appliedAt ?? '');
  const [source, setSource] = useState(initialData?.source ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!position.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      company: company.trim(),
      position: position.trim(),
      status,
      appliedAt: appliedAt || undefined,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="e.g. Google"
          />
          {errors.company && (
            <p className="mt-1 text-xs text-red-600">{errors.company}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label
            htmlFor="position"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Position <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.position ? 'border-red-400' : 'border-gray-300'
            }`}
            placeholder="e.g. Software Engineer"
          />
          {errors.position && (
            <p className="mt-1 text-xs text-red-600">{errors.position}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        {/* Applied Date */}
        <div>
          <label
            htmlFor="appliedAt"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Applied Date
          </label>
          <input
            id="appliedAt"
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Source */}
        <div className="sm:col-span-2">
          <label
            htmlFor="source"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Source
          </label>
          <input
            id="source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. LinkedIn, Jobstreet, Company website"
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Interview feedback, contact info, next steps..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}