export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getSubjectColor(subject: string): string {
  const map: Record<string, string> = {
    'Mathematics': 'var(--subject-math)',
    'Science': 'var(--subject-science)',
    'English': 'var(--subject-english)',
    'Hindi': 'var(--subject-hindi)',
    'Social Science': 'var(--subject-social)',
    'Computer Science': 'var(--subject-computer)',
    'Art': 'var(--subject-art)',
    'Physical Education': 'var(--subject-sports)',
  };
  return map[subject] || 'var(--gray-500)';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    present: 'var(--success)',
    approved: 'var(--success)',
    paid: 'var(--success)',
    evaluated: 'var(--success)',
    submitted: 'var(--primary)',
    pending: 'var(--warning)',
    late: 'var(--warning)',
    partial: 'var(--warning)',
    absent: 'var(--danger)',
    rejected: 'var(--danger)',
    overdue: 'var(--danger)',
    cancelled: 'var(--gray-400)',
    holiday: 'var(--gray-400)',
    leave: 'var(--info)',
    'half-day': 'var(--info)',
  };
  return map[status] || 'var(--gray-500)';
}
