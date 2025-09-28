import { expect, test, describe, vi } from 'vitest';
import {
  getFirstDateOfTheYear,
  getTermWeekInfo,
  getWeekNumber,
  updateTextContents,
  reportError,
  calculateWeekOffset,
  numberToEmoji,
  millisecondsUntilMidnight,
  refresh,
  createAddToHomeScreenComponent,
  getAddToHomeScreenProperties,
} from '../src/js/utils';
import termsData2025 from '../src/js/terms.2025';

test('getFirstDateOfTheYear', () => {
  const referenceDate = new Date('2025-06-15T10:00:00Z');
  const firstDate = getFirstDateOfTheYear(referenceDate);
  expect(firstDate.getFullYear()).toBe(2025);
  expect(firstDate.getMonth()).toBe(0);
  expect(firstDate.getDate()).toBe(1);
});

test('updateTextContents', () => {
  document.body.innerHTML = '<div class="test"></div><div class="test"></div>';
  const nodeList = document.querySelectorAll('.test');
  const updateFn = () => 'updated';
  updateTextContents(nodeList, updateFn);
  nodeList.forEach((node) => {
    expect(node.textContent).toEqual('updated');
  });
});

test('reportError', () => {
  const error = new Error('Test error');
  const originalAlert = window.alert;
  window.alert = vi.fn();
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  reportError(error);

  expect(window.alert).toHaveBeenCalledWith(
    `uh oh there was an error in the code (sorry!) or you are probably not running a modern browser:\n\n${error}`,
  );
  expect(consoleSpy).toHaveBeenCalledWith(error);

  consoleSpy.mockRestore();
  window.alert = originalAlert;
});

test('createAddToHomeScreenComponent', () => {
  const options = {
    appName: 'My App',
    appNameDisplay: 'standalone',
    appIconUrl: './foo/bar',
    assetUrl: './foo/bar',
    displayOptions: { showMobile: true, showDesktop: false },
  };
  const component = createAddToHomeScreenComponent(options);

  expect(typeof component).toEqual('object');
  expect(component.appName).toEqual(options.appName);
  expect(component.appIconUrl).toEqual(options.appIconUrl);
  expect(component.assetUrl).toEqual(options.assetUrl);
  expect(component.displayOptions).toEqual(options.displayOptions);
});

describe('getWeekNumber', () => {
  test('first week of the year', () => {
    const date = new Date('2025-01-01');
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toEqual(1);
  });

  test('middle of the year', () => {
    const date = new Date('2025-06-15');
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toEqual(24);
  });

  test('last week of the year', () => {
    const date = new Date('2025-12-31');
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toEqual(1);
  });
});

describe('calculateWeekOffset', () => {
  const scenarios = [
    [1, '2025-06-01'],
    [1, '2026-06-01'],
    [0, '2027-06-01'],
    [0, '2028-06-01'],
    [0, '2029-06-01'],
    [0, '2030-06-01'],
    [1, '2031-06-01'],
    [1, '2032-06-01'],
  ];

  test.each(scenarios)(
    'returns %i for reference date %s',
    (expected, dateString) => {
      expect(calculateWeekOffset(new Date(`${dateString}T00:00:00Z`))).toEqual(
        expected,
      );
    },
  );
});

test('numberToEmoji', () => {
  expect(numberToEmoji(123)).toEqual('1️⃣2️⃣3️⃣');
  expect(numberToEmoji(456)).toEqual('4️⃣5️⃣6️⃣');
  expect(numberToEmoji(7890)).toEqual('7️⃣8️⃣9️⃣0️⃣');
  expect(numberToEmoji(-12)).toEqual('-1️⃣2️⃣');
  expect(numberToEmoji('N/A')).toEqual('N/A');
});

test('millisecondsUntilMidnight', () => {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const expectedMilliseconds = midnight - now;
  expect(millisecondsUntilMidnight()).toBeCloseTo(expectedMilliseconds, -2);
});

test('refresh - sets a timeout to refresh at midnight', () => {
  const originalClearTimeout = global.clearTimeout;
  const originalSetTimeout = global.setTimeout;
  global.clearTimeout = vi.fn();
  global.setTimeout = vi.fn(() => 12345);

  const timeoutId = 67890;
  const newTimeoutId = refresh(timeoutId, () => {});

  expect(global.clearTimeout).toHaveBeenCalledWith(timeoutId);
  expect(global.setTimeout).toHaveBeenCalled();
  expect(newTimeoutId).toEqual(12345);

  global.clearTimeout = originalClearTimeout;
  global.setTimeout = originalSetTimeout;
});

describe('getAddToHomeScreenProperties', () => {
  test('android chrome && standalone', () => {
    const instance = global.testCreateAddToHomeScreenInstance({
      android: true,
      chrome: true,
      standalone: true,
    });
    const props = getAddToHomeScreenProperties(instance);
    expect(props).toEqual({
      isBrowserAndroid: true,
      isBrowserIos: false,
      isDesktop: false,
      isStandAlone: true,
    });
  });

  test('ios safari', () => {
    const instance = global.testCreateAddToHomeScreenInstance({
      ios: true,
      safari: true,
    });
    const props = getAddToHomeScreenProperties(instance);
    expect(props).toEqual({
      isBrowserAndroid: false,
      isBrowserIos: true,
      isDesktop: false,
      isStandAlone: false,
    });
  });

  test('desktop', () => {
    const instance = global.testCreateAddToHomeScreenInstance({
      android: false,
      ios: false,
    });
    const props = getAddToHomeScreenProperties(instance);
    expect(props).toEqual({
      isBrowserAndroid: false,
      isBrowserIos: false,
      isDesktop: true,
      isStandAlone: false,
    });
  });
});

describe('getTermWeekInfo', () => {
  test.each([1, 5, 10, 11])('term 1 includes week %i', (week) => {
    expect(getTermWeekInfo(week, termsData2025)).toEqual(termsData2025[0]);
  });

  test.each([12, 17, 21, 22, 23, 24, 25])('term 2 includes week %i', (week) => {
    expect(getTermWeekInfo(week, termsData2025)).toEqual(termsData2025[1]);
  });

  test.each([26, 30, 35, 36])('term 3 includes week %i', (week) => {
    expect(getTermWeekInfo(week, termsData2025)).toEqual(termsData2025[2]);
  });

  test.each([37, 41, 46, 47, 48, 49, 50, 51, 52])(
    'term 4 includes week %i',
    (week) => {
      expect(getTermWeekInfo(week, termsData2025)).toEqual(termsData2025[3]);
    },
  );

  test('returns undefined when no term matches', () => {
    expect(getTermWeekInfo(0, termsData2025)).toBeUndefined();
  });
});
