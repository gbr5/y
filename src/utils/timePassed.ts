export function timePassed(date: Date): string {
  const now = new Date();
  const secondsPassed = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(secondsPassed / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // If less than a week has passed, return time passed
  if (days < 7) {
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'just now';
  }

  // If more than a week has passed, format the date
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }

  return date.toLocaleDateString('en-US', options);
}