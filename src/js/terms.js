const termModules = import.meta.glob('./terms.*.js', { eager: true });

const termDataEntries = Object.entries(termModules).map(([path, mod]) => {
  const year = Number(path.split('.')[2]);
  return [year, mod.default];
});

const termDataByYear = Object.fromEntries(termDataEntries);

const availableYears = termDataEntries
  .map(([year]) => year)
  .sort((a, b) => a - b);

function getFallbackYear(year, years = availableYears) {
  if (!years.length) {
    return undefined;
  }

  const yearsNotAfterTarget = years.filter((y) => y <= year);
  if (yearsNotAfterTarget.length) {
    return yearsNotAfterTarget[yearsNotAfterTarget.length - 1];
  }

  return years[0];
}

export function getTermsDataForYear(
  year,
  dataMap = termDataByYear,
  years = availableYears,
) {
  const directMatch = dataMap[year];
  if (directMatch) {
    return directMatch;
  }

  const fallbackYear = getFallbackYear(year, years);
  if (fallbackYear === undefined) {
    throw new Error('No term data files available');
  }

  return dataMap[fallbackYear];
}

export function getAvailableTermYears(years = availableYears) {
  return [...years];
}
