// DATE
export function getTimeAgo(date) {
  const diff = Math.abs(new Date(date) - new Date());
  let result = Math.floor(diff / (1000 * 60 * 60 * 24)); // DAYS
  if (result === 0) {
    result = Math.floor(diff / (1000 * 60 * 60)); // HOURS
    if (result === 0) {
      result = Math.floor(diff / (1000 * 60)); // MINUTES
      return `Added ${result} minutes ago`;
    }
    return `Added ${result} hours ago`;
  }
  return `Added ${result} days ago`;
}

export function getDate(date) {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString('default', { month: 'long' });
  return `${dateObj.getDate()} ${month} ${dateObj.getFullYear()}`;
}
