// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from 'vitest';
import { main, refresh } from '../src/js/index';

test('exports', () => {
  expect(typeof main).toEqual('function');
  expect(typeof refresh).toEqual('function');
});
