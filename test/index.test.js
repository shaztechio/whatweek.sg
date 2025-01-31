import { expect, test, describe, beforeEach, vi } from 'vitest';
import { main, start } from '../src/js/index';
import { refresh, reportError } from '../src/js/utils';

vi.mock('../src/js/utils', { spy: true });
window.alert = vi.fn();

beforeEach(() => {
  refresh.mockClear();
  reportError.mockClear();
});

test('exports', () => {
  expect(typeof main).toEqual('function');
});

describe('main', () => {
  vi.doUnmock('../src/js/utils');
  document.body.innerHTML = `
    <div class="week-number"></div>
    <div class="today-date"></div>
    <div class="odd-or-even"></div>
    <div class="oe-decorator"></div>
  `;
  const weekNumberNode = document.querySelector('.week-number');
  const todayDateNode = document.querySelector('.today-date');
  const oddOrEvenNode = document.querySelector('.odd-or-even');
  const oeDecoratorNode = document.querySelector('.oe-decorator');

  test('even', () => {
    const testDate = new Date('2025-06-16');
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('2️⃣4️⃣');
    expect(todayDateNode.textContent).toEqual(testDate.toDateString('en-GB'));
    expect(oddOrEvenNode.textContent).toEqual('even');
    expect(oeDecoratorNode.textContent).toEqual('\u270c'); // 2 fingers up / peace sign
  });

  test('odd', () => {
    const testDate = new Date('2025-06-23');
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('2️⃣5️⃣');
    expect(todayDateNode.textContent).toEqual(testDate.toDateString('en-GB'));
    expect(oddOrEvenNode.textContent).toEqual('odd');
    expect(oeDecoratorNode.textContent).toEqual('\u261d'); // 1 finger up
  });
});

describe('kickoff', () => {
  test('visibilityState: visible', async () => {
    document.addEventListener = vi.fn((eventname, handler) => {
      const evt = {
        target: {
          visibilityState: 'visible',
        },
      };
      if (eventname === 'visibilitychange') {
        handler(evt);
      }
    });

    start();
    expect(refresh).toBeCalledTimes(2); // once at init, once during event
  });

  test('visibilityState: hidden', async () => {
    document.addEventListener = vi.fn((eventname, handler) => {
      const evt = {
        target: {
          visibilityState: 'hidden',
        },
      };
      if (eventname === 'visibilitychange') {
        handler(evt);
      }
    });

    start();
    expect(refresh).toBeCalledTimes(1); // once at init only
  });

  test('visibilityState: hidden', async () => {
    const error = new Error('this is an error');
    refresh.mockImplementation(() => {
      throw error;
    });
    expect(() => start()).toThrow(error);
    expect(reportError).toHaveBeenCalled();
  });
});
