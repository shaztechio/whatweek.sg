// eslint-disable-next-line no-unused-vars
import * as addToHomeScreen from '../assets/vendor/add-to-homescreen/add-to-homescreen.min';

/**
 * Gets the first day of the year, UTC.
 *
 * @param {Date} referenceDate the date whose year should be used
 * @returns {Date} Jan 01 of the reference year, UTC
 */
export function getFirstDateOfTheYear(referenceDate = new Date()) {
  return new Date(referenceDate.getFullYear(), 0, 1);
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

  const yearStart = getFirstDateOfTheYear(clonedDate);
  const millisecondsInADay = 86400000;

  // calculate full weeks to nearest Thursday (add 1 to account for the current day)
  const weekNo = Math.ceil(
    ((clonedDate - yearStart) / millisecondsInADay + 1) / 7,
  );

  return weekNo;
}

/**
 * Gets the term information for a given week number.
 *
 * @param {number} weekNo - The ISO week number to get term info for
 * @param {Array} termsData - The full set of term definitions to search
 * @returns {Object|undefined} The term information object containing:
 *   - term: {number} The term number (1-4)
 *   - start: {number} The starting week number of the term
 *   - end: {number} The ending week number of the term
 *   - break: {number[]} Array of week numbers that are breaks in this term
 */
export function getTermWeekInfo(weekNo, termsData = []) {
  if (!Array.isArray(termsData) || termsData.length === 0) {
    return undefined;
  }

  return termsData.find((term) => {
    return (
      (weekNo >= term.start && weekNo <= term.end) ||
      term.break.includes(weekNo)
    );
  });
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
  // surface the error for diagnostics without crashing the UI loop
  // eslint-disable-next-line no-console
  console.error(err);
}

/**
 * Returns the day of week (0=Sun … 6=Sat) in Asia/Singapore time.
 *
 * @param {Date} date
 * @returns {number}
 */
export function getSingaporeDayOfWeek(date) {
  const short = date.toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'Asia/Singapore',
  });
  return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[short];
}

/**
 * On Saturday or Sunday in SGT, advance to the upcoming Monday so callers
 * can show next week's info. On any other day returns the same date unchanged.
 *
 * @param {Date} date
 * @returns {Date}
 */
export function getNextWeekReferenceDate(date) {
  const sgDay = getSingaporeDayOfWeek(date);
  if (sgDay === 6) {
    const d = new Date(date);
    d.setDate(d.getDate() + 2);
    return d;
  }
  if (sgDay === 0) {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
  }
  return date;
}

/**
 * Calculate the week offset based on the Singapore school system.
 *
 * See  https://en.wikipedia.org/wiki/Academic_year#:~:text=Term%201%20starts%20the%20day%20immediately%20after%20New%20Year%27s%20Day.%20If%20the%20first%20school%20day%20is%20a%20Thursday%20or%20a%20Friday%2C%20it%20is%20not%20counted%20as%20a%20school%20week.
 */
export function calculateWeekOffset(referenceDate = new Date()) {
  const startOfTheYear = getFirstDateOfTheYear(referenceDate); // 1st Jan
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
  const digitEmojiMap = {
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
  };

  return String(num)
    .split('')
    .map((char) => {
      if (/^\d$/.test(char)) {
        return digitEmojiMap[parseInt(char, 10)];
      }
      return char;
    })
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

/**
 * Create an AddToHomeScreen instance.
 *
 * @param {object} params params
 * @param {string} params.appName the app name
 * @param {string} params.appNameDisplay the app name to display
 * @param {string} params.appIconUrl the url to the app icon
 * @param {string} params.assetUrl the url to the component assets
 * @param {object} params.displayOptions the display options (properties: showMobile(boolean) showDesktop(boolean))
 * @returns {object} an AddToHomeScreen instance
 */
export function createAddToHomeScreenComponent({
  appName,
  appNameDisplay,
  appIconUrl,
  assetUrl,
  displayOptions,
}) {
  const { AddToHomeScreen } = window;
  return AddToHomeScreen({
    appName,
    appNameDisplay,
    appIconUrl,
    assetUrl,
    displayOptions,
  });
}

/**
 * Gets the browser properties from the AddToHomeScreen instance.
 *
 * @param {object} addToHomeScreenInstance
 * @returns {object} the browser properties
 */
export function getAddToHomeScreenProperties(addToHomeScreenInstance) {
  const {
    isStandAlone,
    isBrowserAndroidChrome,
    isBrowserAndroidFacebook,
    isBrowserAndroidFirefox,
    isBrowserAndroidSamsung,
    isBrowserIOSChrome,
    isBrowserIOSFirefox,
    isBrowserIOSInAppFacebook,
    isBrowserIOSInAppInstagram,
    isBrowserIOSInAppLinkedin,
    isBrowserIOSInAppThreads,
    isBrowserIOSInAppTwitter,
    isBrowserIOSSafari,
  } = addToHomeScreenInstance;
  const isInStandAloneMode = isStandAlone();
  const isBrowserAndroid =
    isBrowserAndroidChrome() ||
    isBrowserAndroidFacebook() ||
    isBrowserAndroidFirefox() ||
    isBrowserAndroidSamsung();
  const isBrowserIos =
    isBrowserIOSChrome() ||
    isBrowserIOSFirefox() ||
    isBrowserIOSInAppFacebook() ||
    isBrowserIOSInAppInstagram() ||
    isBrowserIOSInAppLinkedin() ||
    isBrowserIOSInAppThreads() ||
    isBrowserIOSInAppTwitter() ||
    isBrowserIOSSafari();
  const isDesktop = !isBrowserAndroid && !isBrowserIos;

  return {
    isBrowserIos,
    isBrowserAndroid,
    isStandAlone: isInStandAloneMode,
    isDesktop,
  };
}
