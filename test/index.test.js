import {
  expect,
  test,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';
import { main, start, setupAddToHomeScreen } from '../src/js/index';
import {
  refresh,
  reportError,
  createAddToHomeScreenComponent,
  getAddToHomeScreenProperties,
} from '../src/js/utils';

vi.mock('../src/js/utils', { spy: true });
window.alert = vi.fn();

const DATE_FORMAT_OPTIONS = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Singapore',
};
const TEST_YEAR = 2025;

const formatDisplayDate = (date) =>
  date.toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS);

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(`${TEST_YEAR}-01-01T00:00:00Z`));
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  refresh.mockClear();
  reportError.mockClear();
});

test('exports', () => {
  expect(typeof main).toEqual('function');
});

describe('main', () => {
  vi.doUnmock('../src/js/utils');

  let weekNumberNode;
  let todayDateNode;
  let oddOrEvenNode;
  let oeDecoratorNode;

  const expectUiState = ({
    date,
    weekText,
    stateText,
    emoji,
    term,
    options,
  }) => {
    main(date, options);
    expect(weekNumberNode.textContent).toEqual(weekText);
    expect(todayDateNode.textContent).toEqual(
      `${formatDisplayDate(date)} (Term ${term})`,
    );
    expect(oddOrEvenNode.textContent).toEqual(stateText);
    expect(oeDecoratorNode.textContent).toEqual(emoji);
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="week-number"></div>
      <div class="today-date"></div>
      <div class="odd-or-even"></div>
      <div class="oe-decorator"></div>
    `;
    weekNumberNode = document.querySelector('.week-number');
    todayDateNode = document.querySelector('.today-date');
    oddOrEvenNode = document.querySelector('.odd-or-even');
    oeDecoratorNode = document.querySelector('.oe-decorator');
  });

  test('pre-term break is treated as a break week', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-01`),
      weekText: '0️⃣',
      stateText: 'break',
      emoji: '🌴',
      term: 1,
    });
  });

  test('odd - term 1', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-06`),
      weekText: '1️⃣',
      stateText: 'odd',
      emoji: '☝',
      term: 1,
    });
  });

  test('even - term 1', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-13`),
      weekText: '2️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 1,
    });
  });

  test('break - term 1', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-03-20`),
      weekText: '0️⃣',
      stateText: 'break',
      emoji: '🌴',
      term: 1,
    });
  });

  test('odd - term 2', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-03-24`),
      weekText: '1️⃣',
      stateText: 'odd',
      emoji: '☝',
      term: 2,
    });
  });

  test('even - term 2', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-04-01`),
      weekText: '2️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 2,
    });
  });

  test.each([['06-02'], ['06-09'], ['06-16'], ['06-23']])(
    'break - term 2 on %s',
    (dateStr) => {
      expectUiState({
        date: new Date(`${TEST_YEAR}-${dateStr}`),
        weekText: '0️⃣',
        stateText: 'break',
        emoji: '🌴',
        term: 2,
      });
    },
  );

  test('odd - term 3', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-06-30`),
      weekText: '1️⃣',
      stateText: 'odd',
      emoji: '☝',
      term: 3,
    });
  });

  test('even - term 3', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-07-07`),
      weekText: '2️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 3,
    });
  });

  test('break - term 3', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-09-08`),
      weekText: '0️⃣',
      stateText: 'break',
      emoji: '🌴',
      term: 3,
    });
  });

  test('odd - term 4', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-09-15`),
      weekText: '1️⃣',
      stateText: 'odd',
      emoji: '☝',
      term: 4,
    });
  });

  test('even - term 4', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-09-22`),
      weekText: '2️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 4,
    });
  });

  test.each([['11-24'], ['12-01'], ['12-08'], ['12-15'], ['12-22'], ['12-31']])(
    'break - term 4 on %s',
    (dateStr) => {
      expectUiState({
        date: new Date(`${TEST_YEAR}-${dateStr}`),
        weekText: '0️⃣',
        stateText: 'break',
        emoji: '🌴',
        term: 4,
      });
    },
  );

  test('falls back to default term info when override lacks data', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-06`),
      weekText: '1️⃣',
      stateText: 'odd',
      emoji: '☝',
      term: '?',
      options: { termsDataOverride: [] },
    });
  });

  test('handles null term data override gracefully', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-13`),
      weekText: '2️⃣',
      stateText: 'even',
      emoji: '✌',
      term: '?',
      options: { termsDataOverride: null },
    });
  });

  test('normalizes malformed custom term data', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-13`),
      weekText: '2️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 'X',
      options: {
        termsDataOverride: [
          { term: 'X', start: undefined, end: undefined, break: 'invalid' },
        ],
      },
    });
  });

  test('uses last term end when break metadata is missing', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-12-31`),
      weekText: '1️⃣0️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 'Final',
      options: {
        termsDataOverride: [
          { term: 'Term 1', start: 1, end: 10, break: [] },
          { term: 'Final', start: 37, end: 46, break: [] },
        ],
      },
    });
  });

  test('falls back to current week number when last term lacks end', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-12-31`),
      weekText: '0️⃣',
      stateText: 'even',
      emoji: '✌',
      term: 'Term 1',
      options: {
        termsDataOverride: [
          { term: 'Term 1', start: 1, end: 10, break: [] },
          { term: 'Final', start: 37, break: [] },
        ],
      },
    });
  });

  test('defaults term label when metadata omits term name', () => {
    expectUiState({
      date: new Date(`${TEST_YEAR}-01-06`),
      weekText: '1️⃣',
      stateText: 'odd',
      emoji: '☝',
      term: '?',
      options: {
        termsDataOverride: [{ start: 1, end: 10, break: [] }],
      },
    });
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

  test('errors bubble to reportError without crashing', async () => {
    const error = new Error('this is an error');
    refresh.mockImplementationOnce(() => {
      throw error;
    });

    expect(() => start()).not.toThrow();
    expect(reportError).toHaveBeenCalledWith(error);
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
      isStandAlone: false,
      isDesktop: false,
    });

    setupAddToHomeScreen();
    expect(installPwaButtonNode.classList).not.toContain('hidden');
  });

  test('skips setup when install button is missing', () => {
    document.body.innerHTML = '';

    getAddToHomeScreenProperties.mockReturnValue({
      isStandAlone: false,
      isDesktop: false,
    });

    expect(() => setupAddToHomeScreen()).not.toThrow();
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
      isStandAlone: false,
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
      isStandAlone: false,
      isDesktop: false,
    });

    setupAddToHomeScreen();
    expect(installPwaButtonNode.classList).not.toContain('hidden');
    expect(installPwaButtonNode.addEventListener).toHaveBeenCalled();
    expect(mockShow).toHaveBeenCalled();
  });
});
