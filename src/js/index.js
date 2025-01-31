import {
  calculateWeekOffset,
  getWeekNumber,
  updateTextContents,
  numberToEmoji,
  reportError,
  refresh,
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
 * Kick off
 */
export function start() {
  try {
    let timeoutId;

    // when the page is visible, we refresh
    document.addEventListener('visibilitychange', (e) => {
      if (e.target.visibilityState === 'visible') {
        timeoutId = refresh(timeoutId, main);
      } else if (e.target.visibilityState === 'hidden') {
        // do nothing
      }
    });

    // run it at least once
    timeoutId = refresh(timeoutId, main);
  } catch (e) {
    reportError(e);
  }
}

// UNHANDLED ERRORS /////////////////////////////
/* v8 ignore start */
window.onunhandledrejection = (event) =>
  reportError(`unhandled promise rejection: ${event.reason}`);
const onError = (_message, _source, _lineNumber, _colno, error) =>
  reportError(error);

window.onerror = onError;
window.addEventListener('error', onError);
/* v8 ignore stop */
// //////////////////////////////////////////////

start();
