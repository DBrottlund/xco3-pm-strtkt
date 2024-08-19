import { DateTime } from 'luxon';

const calculateFutureDate = async (deadline, startDate) => {
  try {
    const { timeUnit, timeNumber } = deadline;

    // Parse the startDate. Try parsing as ISO first, then fall back to JS Date parsing if necessary.
    let start;
    if (DateTime.fromISO(startDate).isValid) {
      start = DateTime.fromISO(startDate, { zone: 'America/Chicago' });
    } else {
      start = DateTime.fromJSDate(new Date(startDate)).setZone('America/Chicago');
    }

    // Working hours and working days (Monday to Friday)
    const workingStartHour = 8; // 08:00
    const workingEndHour = 17; // 17:00 (5 PM)
    const workingDays = [1, 2, 3, 4, 5]; // Monday to Friday

    // Adjust function for timeUnit (hours, days, weeks) and account for working days/hours
    const addWorkingTime = (date, amount, unit) => {
      while (amount > 0) {
        // If outside working hours, move to the next working start time
        if (date.hour < workingStartHour) {
          date = date.set({ hour: workingStartHour, minute: 0 });
        }
        if (date.hour >= workingEndHour) {
          date = date.plus({ days: 1 }).set({ hour: workingStartHour, minute: 0 });
        }
        if (!workingDays.includes(date.weekday)) {
          date = date.plus({ days: 1 }).set({ hour: workingStartHour, minute: 0 });
        }

        if (unit === 'hour') {
          const hoursLeftToday = workingEndHour - date.hour;
          const hoursToAdd = Math.min(hoursLeftToday, amount);
          date = date.plus({ hours: hoursToAdd });
          amount -= hoursToAdd;
        } else if (unit === 'day') {
          date = date.plus({ days: 1 });
          amount--;
        } else if (unit === 'week') {
          date = date.plus({ weeks: 1 });
          amount--;
        }
      }
      return date;
    };

    // Add the working time according to the unit and number of the deadline
    let futureDate = addWorkingTime(start, timeNumber, timeUnit?.toLowerCase());

    // Ensure that futureDate is a valid DateTime object
    if (!futureDate.isValid) {
      throw new Error("Invalid DateTime object");
    }

    // Format the future date as 'May 21, 2024 5:33 PM'
    return futureDate.toLocaleString(DateTime.DATETIME_MED);
  } catch (error) {
    throw error; // Rethrow error for higher-level handling
  }
};

export default calculateFutureDate;
