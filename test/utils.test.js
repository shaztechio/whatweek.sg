// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from 'vitest';
import { getFirstDateOfTheYear } from '../src/js/utils';

test('getFirstDateOfTheYear', () => {
  const firstDateOfYear = getFirstDateOfTheYear();
  const now = new Date();

  expect(firstDateOfYear.getFullYear()).toEqual(now.getFullYear());
  expect(firstDateOfYear.getDate()).toEqual(1);
  expect(firstDateOfYear.getMonth()).toEqual(0);
});
