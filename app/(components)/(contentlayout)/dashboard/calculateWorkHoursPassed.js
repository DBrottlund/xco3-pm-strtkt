import { DateTime } from 'luxon';

const parseFlexibleDate = (dateString) => {
  // Use JavaScript's Date object to parse the string first
  const nativeDate = new Date(dateString);

  if (isNaN(nativeDate.getTime())) {
    return null;
  }

  // Convert to Luxon DateTime, defaulting to 'America/Chicago' if no timezone info
  let date = DateTime.fromJSDate(nativeDate);

  // If the original string doesn't contain a timezone, set to 'America/Chicago'
  if (!date.isValid || !date.offset) {
    date = date.setZone('America/Chicago');
  }

  return date;
};

const calculateWorkHoursPassed = async (startedAt, deadline) => {
  // Parse the input dates using the parseFlexibleDate function
  let start = parseFlexibleDate(startedAt);
  let end = parseFlexibleDate(deadline);

  if (!start || !end) {
    return 0;
  }

  // Working hours and working days (Monday to Friday)
  const workingStartHour = 8; // 08:00
  const workingEndHour = 17;  // 17:00 (5 PM)
  const workingDays = [1, 2, 3, 4, 5]; // Monday to Friday

  const calculateWorkHoursBetween = (start, end) => {
    let totalWorkHours = 0;

    while (start < end) {
      // If outside working hours, move to the next working start time
      if (start.hour < workingStartHour) {
        start = start.set({ hour: workingStartHour, minute: 0 });
      }
      if (start.hour >= workingEndHour) {
        start = start.plus({ days: 1 }).set({ hour: workingStartHour, minute: 0 });
      }
      if (!workingDays.includes(start.weekday)) {
        start = start.plus({ days: 1 }).set({ hour: workingStartHour, minute: 0 });
      }

      // Calculate hours left in the current working day
      if (start < end) {
        const endOfWorkDay = start.set({ hour: workingEndHour, minute: 0 });
        const timeToCount = Math.min(end.diff(start, 'hours').hours, endOfWorkDay.diff(start, 'hours').hours);
        totalWorkHours += timeToCount;
        start = start.plus({ hours: timeToCount });
      }
    }

    return totalWorkHours;
  };

  // Total available work hours between the start and deadline
  const totalWorkHours = calculateWorkHoursBetween(start, end);

  // Calculate hours passed up to now
  const now = DateTime.now().setZone('America/Chicago');
  const hoursPassed = now > start ? calculateWorkHoursBetween(start, now) : 0;

  // Calculate percentage
  let percentagePassed = totalWorkHours > 0 ? (hoursPassed / totalWorkHours) * 100 : 0;

  // Cap percentage at 100
  percentagePassed = Math.min(percentagePassed, 100);

  // Return the percentage as a whole number (two digits)
  return Math.floor(percentagePassed);
};

export default calculateWorkHoursPassed;
