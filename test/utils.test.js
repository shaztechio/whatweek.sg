import { expect, test, describe, vi } from 'vitest';
import {
  getFirstDateOfTheYear,
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

test('getFirstDateOfTheYear', () => {
  const firstDate = getFirstDateOfTheYear();
  expect(firstDate.getFullYear()).toBe(new Date().getFullYear());
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
  window.alert = vi.fn();
  expect(() => reportError(error)).toThrow('Test error');
  expect(window.alert).toHaveBeenCalledWith(
    `uh oh there was an error in the code (sorry!) or you are probably not running a modern browser:\n\n${error}`,
  );
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
    expect(weekNumber).toEqual(53);
  });
});

describe('calculateWeekOffset', () => {
  test('2025', () => {
    const date = new Date('2025-01-02'); // 2nd Jan 2025 is a Thursday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(1);
  });

  test('2026', () => {
    const date = new Date('2026-01-02'); // 2nd Jan 2026 is a Friday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(1);
  });

  test('2027', () => {
    const date = new Date('2027-01-02'); // 2nd Jan 2027 is a Saturday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(0);
  });

  test('2028', () => {
    const date = new Date('2028-01-02'); // 2nd Jan 2028 is a Sunday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(0);
  });

  test('2029', () => {
    const date = new Date('2029-01-02'); // 2nd Jan 2029 is a Tuesday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(0);
  });

  test('2030', () => {
    const date = new Date('2030-01-02'); // 2nd Jan 2030 is a Wednesday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(0);
  });

  test('2031', () => {
    const date = new Date('2031-01-02'); // 2nd Jan 2031 is a Thursday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(1);
  });

  test('2032', () => {
    const date = new Date('2032-01-02'); // 2nd Jan 2032 is a Friday
    vi.setSystemTime(date);
    expect(calculateWeekOffset()).toEqual(1);
  });
});

test('numberToEmoji', () => {
  expect(numberToEmoji(123)).toEqual('1️⃣2️⃣3️⃣');
  expect(numberToEmoji(456)).toEqual('4️⃣5️⃣6️⃣');
  expect(numberToEmoji(7890)).toEqual('7️⃣8️⃣9️⃣0️⃣');
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
