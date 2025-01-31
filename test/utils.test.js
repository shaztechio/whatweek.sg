// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test, vi } from 'vitest';
import {
  getFirstDateOfTheYear,
  getWeekNumber,
  updateTextContents,
  reportError,
  calculateWeekOffset,
  numberToEmoji,
  millisecondsUntilMidnight,
} from '../src/js/utils';

test('getFirstDateOfTheYear', () => {
  const firstDate = getFirstDateOfTheYear();
  expect(firstDate.getUTCFullYear()).toBe(new Date().getFullYear());
  expect(firstDate.getUTCMonth()).toBe(0);
  expect(firstDate.getUTCDate()).toBe(1);
});

test('getWeekNumber - first week of the year', () => {
  const date = new Date('2023-01-01');
  const weekNumber = getWeekNumber(date);
  expect(weekNumber).toEqual(1);
});

test('getWeekNumber - middle of the year', () => {
  const date = new Date('2023-06-15');
  const weekNumber = getWeekNumber(date);
  expect(weekNumber).toEqual(24);
});

test('getWeekNumber - last week of the year', () => {
  const date = new Date('2023-12-31');
  const weekNumber = getWeekNumber(date);
  expect(weekNumber).toEqual(53);
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

test('calculateWeekOffset - Thursday', () => {
  const date = new Date('2023-01-05'); // 5th Jan 2023 is a Thursday
  vi.setSystemTime(date);
  expect(calculateWeekOffset()).toEqual(1);
});

test('calculateWeekOffset - Friday', () => {
  const date = new Date('2023-01-06'); // 6th Jan 2023 is a Friday
  vi.setSystemTime(date);
  expect(calculateWeekOffset()).toEqual(1);
});

test('calculateWeekOffset - Other days', () => {
  const date = new Date('2023-01-02'); // 2nd Jan 2023 is a Monday
  vi.setSystemTime(date);
  expect(calculateWeekOffset()).toEqual(0);
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
