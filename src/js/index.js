import {
  calculateWeekOffset,
  getWeekNumber,
  updateTextContents,
  numberToEmoji,
  millisecondsUntilMidnight,
  reportError,
} from './utils';

/**
 * Main function.
 *
 * @param {Date} testDate the date that is set to "today" (if set, it's for test purposes). Defaults to now.
 */
export function main(testDate) {
  const today = testDate ?? new Date();
  const todayDateString = today.toDateString('en-GB');

  const weekOffset = calculateWeekOffset();
  const todayWeekNumber = getWeekNumber(today) - weekOffset;
  const isEven = todayWeekNumber % 2 === 0;

  const weekNumberNodeList = document.querySelectorAll('.week-number');
  updateTextContents(weekNumberNodeList, () => numberToEmoji(todayWeekNumber));

  const todayDateNodeList = document.querySelectorAll('.today-date');
  updateTextContents(todayDateNodeList, () => todayDateString);

  const allOddOrEvenNodeList = document.querySelectorAll('.odd-or-even');
  updateTextContents(allOddOrEvenNodeList, () => {
    return isEven ? 'even' : 'odd';
  });

  const oeDecoratorNodeList = document.querySelectorAll('.oe-decorator');
  updateTextContents(oeDecoratorNodeList, () => {
    return isEven ? '\u270c' : '\u261d';
  });
}

/**
 * Refresh the page, and set a timer to refresh it again at midnight.
 *
 * @param {number} timeoutId the timeout id for refreshing the page at midnight
 * @returns {number} the new timeoutId
 */
export function refresh(timeoutId) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  // update
  main();
  // update again at midnight
  const ms = millisecondsUntilMidnight();
  return setTimeout(main, ms);
}

/**
 * Kick off
 */
try {
  let timeoutId;

  // when the page is visible, we refresh
  document.addEventListener('visibilitychange', (e) => {
    if (e.target.visibilityState === 'visible') {
      timeoutId = refresh(timeoutId);
    } else if (e.target.visibilityState === 'hidden') {
      // do nothing
    }
  });

  // run it at least once
  timeoutId = refresh(timeoutId);
} catch (err) {
  reportError(err);
}
