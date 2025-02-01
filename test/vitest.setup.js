import { vi, afterAll, beforeAll } from 'vitest';

// //////////////////////////////////////////

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

function testCreateAddToHomeScreenInstance({
  standalone = false,
  android = false,
  ios = false,
  chrome = false,
  firefox = false,
  samsung = false,
  facebook = false,
  inapp = false,
  safari = false,
  instagram = false,
  linkedin = false,
  threads = false,
  twitter = false,
}) {
  return {
    isStandAlone: vi.fn().mockReturnValue(standalone),
    isBrowserAndroidChrome: vi.fn().mockReturnValue(android && chrome),
    isBrowserAndroidFacebook: vi.fn().mockReturnValue(android && facebook),
    isBrowserAndroidFirefox: vi.fn().mockReturnValue(android && firefox),
    isBrowserAndroidSamsung: vi.fn().mockReturnValue(android && samsung),
    isBrowserIOSChrome: vi.fn().mockReturnValue(ios && chrome),
    isBrowserIOSFirefox: vi.fn().mockReturnValue(ios && firefox),
    isBrowserIOSInAppFacebook: vi
      .fn()
      .mockReturnValue(ios && inapp && facebook),
    isBrowserIOSInAppInstagram: vi
      .fn()
      .mockReturnValue(ios && inapp && instagram),
    isBrowserIOSInAppLinkedin: vi
      .fn()
      .mockReturnValue(ios && inapp && linkedin),
    isBrowserIOSInAppThreads: vi.fn().mockReturnValue(ios && inapp && threads),
    isBrowserIOSInAppTwitter: vi.fn().mockReturnValue(ios && inapp && twitter),
    isBrowserIOSSafari: vi.fn().mockReturnValue(ios && safari),
  };
}

// //////////////////////////////////////////

beforeAll(() => {
  global.testCreateAddToHomeScreenInstance = testCreateAddToHomeScreenInstance;
});

afterAll(() => {
  delete global.testCreateAddToHomeScreenInstance;
});
