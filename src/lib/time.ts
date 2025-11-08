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
  // Weeks (for 7-29 days)
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return "قبل أسبوع";
    if (weeks === 2) return "قبل أسبوعين";
    if (weeks < 11) return `قبل ${weeks} أسابيع`;
    return `قبل ${weeks} أسبوع`;
  }
  // Months (for 30-364 days)
  if (days < 365) {
    const months = Math.floor(days / 30);
    if (months === 1) return "قبل شهر";
    if (months === 2) return "قبل شهرين";
    if (months < 11) return `قبل ${months} أشهر`;
    return `قبل ${months} شهر`;
  }
  // Years (for 365+ days)
  const years = Math.floor(days / 365);
  if (years === 1) return "قبل سنة";
  if (years === 2) return "قبل سنتين";
  if (years < 11) return `قبل ${years} سنوات`;
  return `قبل ${years} سنة`;
}

// Arabic time until with Arabic plural style (minute, hour, day, week, year)
export function timeUntil(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);
  const seconds = Math.floor((then.getTime() - now.getTime()) / 1000);

  // If the date is in the past or very soon, return "الآن"
  if (seconds < 60) return "الآن";

  // Minutes
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    if (mins === 1) return "بعد دقيقة";
    if (mins === 2) return "بعد دقيقتين";
    if (mins < 11) return `بعد ${mins} دقائق`;
    return `بعد ${mins} دقيقة`;
  }
  // Hours
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    if (hours === 1) return "بعد ساعة";
    if (hours === 2) return "بعد ساعتين";
    if (hours < 11) return `بعد ${hours} ساعات`;
    return `بعد ${hours} ساعة`;
  }
  // Days
  const days = Math.floor(seconds / 86400);
  if (days === 1) return "بعد يوم";
  if (days === 2) return "بعد يومين";
  if (days < 7) return `بعد ${days} أيام`;
  // Weeks (for 7-29 days)
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return "بعد أسبوع";
    if (weeks === 2) return "بعد أسبوعين";
    if (weeks < 11) return `بعد ${weeks} أسابيع`;
    return `بعد ${weeks} أسبوع`;
  }
  // Months (for 30-364 days)
  if (days < 365) {
    const months = Math.floor(days / 30);
    if (months === 1) return "بعد شهر";
    if (months === 2) return "بعد شهرين";
    if (months < 11) return `بعد ${months} أشهر`;
    return `بعد ${months} شهر`;
  }
  // Years (for 365+ days)
  const years = Math.floor(days / 365);
  if (years === 1) return "بعد سنة";
  if (years === 2) return "بعد سنتين";
  if (years < 11) return `بعد ${years} سنوات`;
  return `بعد ${years} سنة`;
}
