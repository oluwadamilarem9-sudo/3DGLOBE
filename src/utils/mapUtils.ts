import { Country } from '../types';

export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatArea = (sqKm: number): string => {
  if (sqKm >= 1000000) {
    return (sqKm / 1000000).toFixed(1) + 'M km²';
  } else if (sqKm >= 1000) {
    return (sqKm / 1000).toFixed(1) + 'K km²';
  }
  return sqKm + ' km²';
};

export const formatGDP = (gdp: number): string => {
  if (gdp >= 1000000000000) {
    return '$' + (gdp / 1000000000000).toFixed(2) + 'T';
  } else if (gdp >= 1000000000) {
    return '$' + (gdp / 1000000000).toFixed(2) + 'B';
  } else if (gdp >= 1000000) {
    return '$' + (gdp / 1000000).toFixed(2) + 'M';
  }
  return '$' + gdp.toString();
};
