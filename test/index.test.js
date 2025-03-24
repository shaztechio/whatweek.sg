import { expect, test, describe, beforeEach, vi } from 'vitest';
import { main, start, setupAddToHomeScreen } from '../src/js/index';
import {
  refresh,
  reportError,
  createAddToHomeScreenComponent,
  getAddToHomeScreenProperties,
} from '../src/js/utils';

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

  test('even - term 1', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-01-13`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('2️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 1)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('even');
    expect(oeDecoratorNode.textContent).toEqual('\u270c'); // 2 fingers up / peace sign
  });

  test('odd - term 1', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-01-06`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('1️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 1)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('odd');
    expect(oeDecoratorNode.textContent).toEqual('\u261d'); // 1 finger up
  });

  test('break - term 1', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-03-20`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('0️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 1)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('break');
    expect(oeDecoratorNode.textContent).toEqual('🌴'); // vacation
  });

  test('odd - term 2', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-03-24`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('1️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 2)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('odd');
    expect(oeDecoratorNode.textContent).toEqual('\u261d'); // 1 finger up
  });

  test('even - term 2', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-04-01`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('2️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 2)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('even');
    expect(oeDecoratorNode.textContent).toEqual('\u270c'); // 2 fingers up / peace sign
  });

  test.each([['06-02'], ['06-09'], ['06-16'], ['06-23']])(
    'break - term 2 on %s',
    (dateStr) => {
      const currentYear = new Date().getFullYear();
      const testDate = new Date(`${currentYear}-${dateStr}`);
      main(testDate);

      expect(weekNumberNode.textContent).toEqual('0️⃣');
      expect(todayDateNode.textContent).toEqual(
        `${testDate.toDateString('en-GB')} (Term 2)`,
      );
      expect(oddOrEvenNode.textContent).toEqual('break');
      expect(oeDecoratorNode.textContent).toEqual('🌴'); // vacation
    },
  );

  test('odd - term 3', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-06-30`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('1️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 3)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('odd');
    expect(oeDecoratorNode.textContent).toEqual('\u261d'); // 1 finger up
  });

  test('even - term 3', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-07-07`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('2️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 3)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('even');
    expect(oeDecoratorNode.textContent).toEqual('\u270c'); // 2 fingers up / peace sign
  });

  test('break - term 3', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-09-08`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('0️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 3)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('break');
    expect(oeDecoratorNode.textContent).toEqual('🌴'); // vacation
  });

  test('odd - term 4', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-09-15`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('1️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 4)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('odd');
    expect(oeDecoratorNode.textContent).toEqual('\u261d'); // 1 finger up
  });

  test('even - term 4', () => {
    const currentYear = new Date().getFullYear();
    const testDate = new Date(`${currentYear}-09-22`);
    main(testDate);

    expect(weekNumberNode.textContent).toEqual('2️⃣');
    expect(todayDateNode.textContent).toEqual(
      `${testDate.toDateString('en-GB')} (Term 4)`,
    );
    expect(oddOrEvenNode.textContent).toEqual('even');
    expect(oeDecoratorNode.textContent).toEqual('\u270c'); // 2 fingers up / peace sign
  });

  test.each([['11-24'], ['12-01'], ['12-08'], ['12-15'], ['12-22'], ['12-31']])(
    'break - term 4 on %s',
    (dateStr) => {
      const currentYear = new Date().getFullYear();
      const testDate = new Date(`${currentYear}-${dateStr}`);
      main(testDate);

      expect(weekNumberNode.textContent).toEqual('0️⃣');
      expect(todayDateNode.textContent).toEqual(
        `${testDate.toDateString('en-GB')} (Term 4)`,
      );
      expect(oddOrEvenNode.textContent).toEqual('break');
      expect(oeDecoratorNode.textContent).toEqual('🌴'); // vacation
    },
  );
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

describe('setupAddToHomeScreen', () => {
  beforeEach(() => {
    createAddToHomeScreenComponent.mockReturnValue({});
    getAddToHomeScreenProperties.mockClear();

    document.addEventListener = vi.fn((eventname, handler) => {
      if (eventname === 'DOMContentLoaded') {
        handler();
      }
    });
  });

  test('not desktop nor standalone - show install button', () => {
    document.body.innerHTML = `
      <button type="button" id="install-pwa" class="install-pwa"></button>
    `;

    const installPwaButtonNode = document.getElementById('install-pwa');
    getAddToHomeScreenProperties.mockReturnValue({
      isStandalone: false,
      isDesktop: false,
    });

    setupAddToHomeScreen();
    expect(installPwaButtonNode.classList).not.toContain('hidden');
  });

  test('standalone - hidden install button', () => {
    document.body.innerHTML = `
      <button type="button" id="install-pwa" class="install-pwa"></button>
    `;

    const installPwaButtonNode = document.getElementById('install-pwa');
    getAddToHomeScreenProperties.mockReturnValue({
      isStandAlone: true,
      isDesktop: false,
    });

    setupAddToHomeScreen();
    expect(installPwaButtonNode.classList).toContain('hidden');
  });

  test('desktop - hidden install button', () => {
    document.body.innerHTML = `
      <button type="button" id="install-pwa" class="install-pwa"></button>
    `;

    const installPwaButtonNode = document.getElementById('install-pwa');
    getAddToHomeScreenProperties.mockReturnValue({
      isStandalone: false,
      isDesktop: true,
    });

    setupAddToHomeScreen();
    expect(installPwaButtonNode.classList).toContain('hidden');
  });

  test('install button click handler', () => {
    document.body.innerHTML = `
      <button type="button" id="install-pwa" class="install-pwa"></button>
    `;

    const installPwaButtonNode = document.getElementById('install-pwa');
    installPwaButtonNode.addEventListener = vi.fn((eventname, handler) => {
      if (eventname === 'click') {
        handler();
      }
    });

    const mockShow = vi.fn();
    createAddToHomeScreenComponent.mockReturnValue({
      show: mockShow,
    });
    getAddToHomeScreenProperties.mockReturnValue({
      isStandalone: false,
      isDesktop: false,
    });

    setupAddToHomeScreen();
    expect(installPwaButtonNode.classList).not.toContain('hidden');
    expect(installPwaButtonNode.addEventListener).toHaveBeenCalled();
    expect(mockShow).toHaveBeenCalled();
  });
});
