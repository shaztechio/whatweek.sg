import { describe, expect, test } from 'vitest';
import { getTermsDataForYear, getAvailableTermYears } from '../src/js/terms';
import termsData2025 from '../src/js/terms.2025';

describe('getTermsDataForYear', () => {
  test('returns data for matching year', () => {
    expect(getTermsDataForYear(2025)).toBe(termsData2025);
  });

  test('falls back to closest available year when future data missing', () => {
    expect(getTermsDataForYear(2026)).toBe(termsData2025);
  });

  test('falls back to earliest available year when requesting earlier data', () => {
    expect(getTermsDataForYear(2024)).toBe(termsData2025);
  });

  test('uses nearest prior year from custom map/years list', () => {
    const dataMap = {
      2027: ['term data 2027'],
      2030: ['term data 2030'],
    };
    const years = [2027, 2030];
    expect(getTermsDataForYear(2029, dataMap, years)).toEqual(dataMap[2027]);
  });

  test('falls back to smallest year when all years are in the future', () => {
    const dataMap = {
      2027: ['term data 2027'],
      2030: ['term data 2030'],
    };
    const years = [2027, 2030];
    expect(getTermsDataForYear(2023, dataMap, years)).toEqual(dataMap[2027]);
  });

  test('throws when no term data files available', () => {
    expect(() => getTermsDataForYear(2025, {}, [])).toThrow(
      'No term data files available',
    );
  });
});

describe('getAvailableTermYears', () => {
  test('returns loaded term years', () => {
    expect(getAvailableTermYears()).toContain(2025);
  });

  test('returns copy of provided years list', () => {
    const years = [2023, 2025];
    const result = getAvailableTermYears(years);
    expect(result).toEqual(years);
    expect(result).not.toBe(years);
  });
});
