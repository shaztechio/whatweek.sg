import posthog from 'posthog-js';
// eslint-disable-next-line no-unused-vars
import * as addToHomeScreen from '../assets/vendor/add-to-homescreen/add-to-homescreen.min';
import {
  calculateWeekOffset,
  getTermWeekInfo,
  getWeekNumber,
  updateTextContents,
  numberToEmoji,
  reportError,
  refresh,
  createAddToHomeScreenComponent,
  getAddToHomeScreenProperties,
} from './utils';
import { getTermsDataForYear } from './terms';

/* v8 ignore start */
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // eslint-disable-next-line import/no-unresolved
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {
      // ignore registration errors in unsupported contexts
    });
}
/* v8 ignore stop */

export function setupCopyEmail() {
  const email = ['contact', 'whatweek.sg'].join('@');
  const btn = document.getElementById('copyEmail');

  if (!btn) {
    return;
  }

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      // eslint-disable-next-line no-alert
      window?.alert('Email copied!');
    } catch {
      const errorMessage = `Copy failed — email is: ${email}`;
      // eslint-disable-next-line no-alert
      window?.alert(errorMessage);
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.error(errorMessage);
      }
    }
  });
}

/**
 * Main function.
 *
 * @param {Date} testDate the date that is set to "today" (if set, it's for test purposes). Defaults to now.
 * @param {Object} options optional overrides used mainly for tests
 * @param {Array} options.termsDataOverride pre-loaded term data to use instead of loading by year
 */
export function main(testDate, options = {}) {
  let today = testDate;
  if (!today && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!Number.isNaN(parsedDate.getTime())) {
        today = parsedDate;
      }
    }
  }
  today = today ?? new Date();
  const todayDateString = today.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Singapore',
  });

  const { termsDataOverride } = options;
  const rawTermsData =
    termsDataOverride !== undefined
      ? termsDataOverride
      : getTermsDataForYear(today.getFullYear());
  const termsData = rawTermsData ?? [];

  const weekOffset = calculateWeekOffset(today);
  const weekNumber = getWeekNumber(today);
  const todayWeekNumber = weekNumber - weekOffset;
  const lastTerm = termsData.at(-1);
  const weekLookupNumber =
    weekNumber === 1 && today.getMonth() === 11
      ? (lastTerm?.break?.slice(-1)[0] ?? lastTerm?.end ?? todayWeekNumber)
      : todayWeekNumber;
  const rawTermInfo = getTermWeekInfo(weekLookupNumber, termsData) ??
    termsData[0] ?? { term: '?', start: 1, end: 1, break: [] };
  const termInfo = {
    term: rawTermInfo.term ?? '?',
    start: rawTermInfo.start ?? 1,
    end: rawTermInfo.end ?? rawTermInfo.start ?? 1,
    break: Array.isArray(rawTermInfo.break) ? rawTermInfo.break : [],
  };
  const isPreTermBreak = todayWeekNumber <= 0 && today.getMonth() === 0;
  const isBreak =
    isPreTermBreak || termInfo.break.includes(weekLookupNumber) === true;

  // adjust week number for new terms and breaks
  let adjustedWeekNumber = weekLookupNumber - termInfo.start + 1;
  if (isBreak || adjustedWeekNumber < 1) {
    adjustedWeekNumber = 0;
  }

  const isEven = adjustedWeekNumber % 2 === 0;

  const weekNumberNodeList = document.querySelectorAll('.week-number');
  updateTextContents(weekNumberNodeList, () =>
    numberToEmoji(adjustedWeekNumber),
  );

  const todayDateNodeList = document.querySelectorAll('.today-date');
  updateTextContents(
    todayDateNodeList,
    () => `${todayDateString} (Term ${termInfo.term})`,
  );

  const allOddOrEvenNodeList = document.querySelectorAll('.odd-or-even');
  updateTextContents(allOddOrEvenNodeList, () => {
    let text = isEven ? 'even' : 'odd';
    if (isBreak) {
      text = 'break';
    }
    return text;
  });

  const oeDecoratorNodeList = document.querySelectorAll('.oe-decorator');
  updateTextContents(oeDecoratorNodeList, () => {
    let text = isEven ? '\u270c' : '\u261d';
    if (isBreak) {
      text = '🌴';
    }
    return text;
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

    const installButton = document.getElementById('install-pwa');
    if (!installButton) {
      return;
    }

    if (hideInstallButton) {
      installButton.classList.add('hidden');
      return;
    }

    installButton.classList.remove('hidden');
    installButton.addEventListener('click', () => {
      addToHomeScreenInstance.show('en');
      posthog.capture('install_button_pressed');
    });
  });
}

setupCopyEmail();
setupAddToHomeScreen();
start();
