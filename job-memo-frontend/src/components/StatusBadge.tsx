import type { ApplicationStatus } from '../types';

const statusStyles: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-blue-100 text-blue-800',
  INTERVIEW: 'bg-amber-100 text-amber-800',
  OFFER: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  WITHDRAWN: 'bg-gray-100 text-gray-800',
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}