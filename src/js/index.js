import posthog from 'posthog-js';
// eslint-disable-next-line no-unused-vars
import * as addToHomeScreen from '../assets/vendor/add-to-homescreen/add-to-homescreen.min';
import {
  calculateWeekOffset,
  getWeekNumber,
  updateTextContents,
  numberToEmoji,
  reportError,
  refresh,
  createAddToHomeScreenComponent,
  getAddToHomeScreenProperties,
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

/**
 * Setup all the Add to Homescreen components.
 */
export function setupAddToHomeScreen() {
  posthog.init('phc_EFfe5zO3shj309xQC10LIp8f4Isnf7VVAIbSN7kNsjX', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });

  document.addEventListener('DOMContentLoaded', () => {
    const addToHomeScreenInstance = createAddToHomeScreenComponent({
      appName: 'Odd or Even',
      appNameDisplay: 'standalone',
      appIconUrl: 'index.png',
      assetUrl: './add-to-homescreen/img/',
      displayOptions: { showMobile: true, showDesktop: false },
    });

    const { isStandAlone, isDesktop } = getAddToHomeScreenProperties(
      addToHomeScreenInstance,
    );

    const hideInstallButton = isStandAlone || isDesktop;
    posthog.capture('add_to_homescreen', { isDesktop, isStandAlone });
    if (hideInstallButton) {
      document.getElementById('install-pwa').classList.add('hidden');
    } else {
      document.getElementById('install-pwa').classList.remove('hidden');
      document.getElementById('install-pwa').addEventListener('click', () => {
        addToHomeScreenInstance.show('en');
        posthog.capture('install_button_pressed');
      });
    }
  });
}

setupAddToHomeScreen();
start();
