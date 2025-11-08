// Arabic time ago with Arabic plural style (minute, hour, day, week, year)
export function timeAgo(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "الآن";

  // Minutes
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    if (mins === 1) return "قبل دقيقة";
    if (mins === 2) return "قبل دقيقتين";
    if (mins < 11) return `قبل ${mins} دقائق`;
    return `قبل ${mins} دقيقة`;
  }
  // Hours
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    if (hours === 1) return "قبل ساعة";
    if (hours === 2) return "قبل ساعتين";
    if (hours < 11) return `قبل ${hours} ساعات`;
    return `قبل ${hours} ساعة`;
  }
  // Days
  const days = Math.floor(seconds / 86400);
  if (days === 1) return "قبل يوم";
  if (days === 2) return "قبل يومين";
  if (days < 7) return `قبل ${days} أيام`;
  // Weeks
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "قبل أسبوع";
  if (weeks === 2) return "قبل أسبوعين";
  if (weeks < 11) return `قبل ${weeks} أسابيع`;
  if (days < 365) return `قبل ${weeks} أسبوع`;
  // Years
  const years = Math.floor(days / 365);
  if (years === 1) return "قبل سنة";
  if (years === 2) return "قبل سنتين";
  if (years < 11) return `قبل ${years} سنوات`;
  return `قبل ${years} سنة`;
}
