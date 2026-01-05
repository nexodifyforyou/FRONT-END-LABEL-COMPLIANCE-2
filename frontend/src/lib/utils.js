import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCredits(credits) {
  return credits?.toFixed(1) || '0.0';
}

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'pass':
    case 'passed':
    case 'compliant':
      return 'emerald';
    case 'fail':
    case 'failed':
    case 'non-compliant':
      return 'rose';
    case 'warning':
    case 'caution':
      return 'amber';
    default:
      return 'slate';
  }
}

export function getSeverityLabel(severity) {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return { label: 'Critical', color: 'bg-rose-500 text-white' };
    case 'high':
      return { label: 'High', color: 'bg-orange-500 text-white' };
    case 'medium':
      return { label: 'Medium', color: 'bg-amber-500 text-white' };
    case 'low':
      return { label: 'Low', color: 'bg-slate-400 text-white' };
    default:
      return { label: 'Info', color: 'bg-blue-500 text-white' };
  }
}

export function truncate(str, maxLength = 50) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
