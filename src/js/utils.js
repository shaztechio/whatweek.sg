/**
 * Gets the first day of the year, UTC.
 *
 * @returns {Date} Jan 01 of the current year, UTC
 */
export function getFirstDateOfTheYear() {
  return new Date(new Date().getFullYear(), 0, 1);
}

/**
 * This is the core logic for determining the week number according to the ISO-8601 standard
 * The week number can be described by counting the Thursdays
 *
 * @param {Date} aDate the date to calculate the week number for
 * @returns {number} the week number
 */
export function getWeekNumber(aDate) {
  const clonedDate = new Date(aDate.getTime());

  // if day is 0 (Sunday) we make the value 7. Monday is 1, Tue is 2, ..., Sunday is 7.
  const currentDayNumber = clonedDate.getDay() || 7;
  // calculate the date of the nearest Thursday
  clonedDate.setDate(clonedDate.getDate() + 4 - currentDayNumber);

  const yearStart = getFirstDateOfTheYear();
  const millisecondsInADay = 86400000;

  // calculate full weeks to nearest Thursday (add 1 to account for the current day)
  const weekNo = Math.ceil(
    ((clonedDate - yearStart) / millisecondsInADay + 1) / 7,
  );

  return weekNo;
}

/**
 * Update all nodes in a NodeList with the output of updateFn.
 *
 * @param {NodeList} nodeList the nodeList that contains all the nodes to update
 * @param {Function} updateFn the function to call to get the text contents to update with
 */
export function updateTextContents(nodeList, updateFn) {
  for (let i = 0; i < nodeList.length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    nodeList[i].textContent = updateFn && updateFn();
  }
}

/**
 * Report an error to console and the user.
 *
 * @param {Error} err the error that was thrown
 */
export function reportError(err) {
  // eslint-disable-next-line no-alert
  window.alert(
    `uh oh there was an error in the code (sorry!) or you are probably not running a modern browser:\n\n${
      err
    }`,
  );
  throw err;
}

/**
 * Calculate the week offset based on the Singapore school system.
 *
 * See  https://en.wikipedia.org/wiki/Academic_year#:~:text=Term%201%20starts%20the%20day%20immediately%20after%20New%20Year%27s%20Day.%20If%20the%20first%20school%20day%20is%20a%20Thursday%20or%20a%20Friday%2C%20it%20is%20not%20counted%20as%20a%20school%20week.
 */
export function calculateWeekOffset() {
  const startOfTheYear = getFirstDateOfTheYear(); // 1st Jan
  startOfTheYear.setDate(startOfTheYear.getDate() + 1); // now set to next day 2nd Jan - when school starts

  // remember, 0 is Sun, 1 is Mon, and so on
  const day = startOfTheYear.getDay();

  if (day === 4 /* Thurs */ || day === 5 /* Fri */) {
    return 1; // the next week will be counted as the first school week
  }
  return 0;
}

/**
 * Convert a number to a number emoji.
 *
 * @param {Number} num the number to convert
 * @returns {String} the emoji number string
 */
export function numberToEmoji(num) {
  const digitEmojis = [
    '0️⃣',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
  ];

  return String(num)
    .split('')
    .map((digit) => digitEmojis[parseInt(digit, 10)])
    .join('');
}

/**
 * Gets the number of milliseconds from now to midnight.
 *
 * @returns {Number} ms from now until midnight
 */
export function millisecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  return midnight - now;
}

/**
 * Refresh the page, and set a timer to refresh it again at midnight.
 *
 * @param {number} timeoutId the timeout id for refreshing the page at midnight
 * @returns {number} the new timeoutId
 */
export function refresh(timeoutId, callback) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  // update
  callback();
  // update again at midnight
  const ms = millisecondsUntilMidnight();
  return setTimeout(callback, ms);
}
