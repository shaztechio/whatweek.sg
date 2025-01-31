// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test, vi } from 'vitest';
import { main, refresh } from '../src/js/index';

test('exports', () => {
  expect(typeof main).toEqual('function');
  expect(typeof refresh).toEqual('function');
});

test('main - updates week number, date, and odd/even status', () => {
  document.body.innerHTML = `
    <div class="week-number"></div>
    <div class="today-date"></div>
    <div class="odd-or-even"></div>
    <div class="oe-decorator"></div>
  `;

  const testDate = new Date('2023-06-15');
  main(testDate);

  const weekNumberNode = document.querySelector('.week-number');
  const todayDateNode = document.querySelector('.today-date');
  const oddOrEvenNode = document.querySelector('.odd-or-even');
  const oeDecoratorNode = document.querySelector('.oe-decorator');

  expect(weekNumberNode.textContent).toEqual('2️⃣4️⃣');
  expect(todayDateNode.textContent).toEqual(testDate.toDateString('en-GB'));
  expect(oddOrEvenNode.textContent).toEqual('even');
  expect(oeDecoratorNode.textContent).toEqual('\u270c');
});

test('refresh - sets a timeout to refresh at midnight', () => {
  const originalClearTimeout = global.clearTimeout;
  const originalSetTimeout = global.setTimeout;
  global.clearTimeout = vi.fn();
  global.setTimeout = vi.fn(() => 12345);

  const timeoutId = 67890;
  const newTimeoutId = refresh(timeoutId);

  expect(global.clearTimeout).toHaveBeenCalledWith(timeoutId);
  expect(global.setTimeout).toHaveBeenCalled();
  expect(newTimeoutId).toEqual(12345);

  global.clearTimeout = originalClearTimeout;
  global.setTimeout = originalSetTimeout;
});
