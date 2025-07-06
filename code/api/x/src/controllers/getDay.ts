// day-number.js

export function getChallengeDay(startDateStr: string) {
    const startDate = new Date(startDateStr); // e.g., '2025-06-10'
    const today = new Date();

    // Normalize both dates to midnight
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return diffDays - 1;
}