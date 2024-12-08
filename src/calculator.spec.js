import { calculatePrice } from './calculator.js';
import { expect, describe, test } from 'vitest'

describe('calculatePrice', () => {
  test('solo bundle', () => {
    expect(calculatePrice({
      solo: true,
      credits: 2,
      machines: [{ cores: 1, floating: false }], // 1 node
    })).toEqual({
      credits: 1000,
      nodes: 300,
      total: 700,
      discount: 600,
      bundle: expect.objectContaining({ name: 'Solo Bundle' }),
    });
  });

  test('no discount', () => {
    expect(calculatePrice({
      solo: false,
      credits: 1,
      machines: [{ cores: 1, floating: true }], // 1 floating node
    })).toEqual({
      credits: 500,
      nodes: 600,
      total: 1100,
      discount: 0,
      bundle: null,
    });
  });

  test('team bundle', () => {
    expect(calculatePrice({
      solo: false,
      credits: 3,
      machines: [{ cores: 15 * 32, floating: false }], // 15 nodes
    })).toEqual({
      credits: 1500,
      nodes: 4500,
      total: 4500,
      discount: 1500,
      bundle: expect.objectContaining({ name: 'Team Bundle' }),
    });
  });

  test('team bundle + 500', () => {
    expect(calculatePrice({
      solo: false,
      credits: 5,
      machines: [{ cores: 15 * 32, floating: false }], // 15 nodes
    })).toEqual({
      credits: 2500,
      nodes: 4500,
      total: 5000,
      discount: 2000,
      bundle: expect.objectContaining({ name: 'Team Bundle' }),
    });
  });
});
