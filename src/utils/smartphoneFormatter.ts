export default (value: string): string => {
  const parsedValue = value.replace(/\D/g, '');

  const ddd = parsedValue.slice(0, 2);
  const firstPart = parsedValue.slice(2, 7);
  const lastPart = parsedValue.slice(7, 11);

  if (parsedValue.length <= 2) {
    return parsedValue;
  }

  if (parsedValue.length >= 8) {
    return `(${ddd}) ${firstPart}-${lastPart}`;
  }

  if (parsedValue.length <= 8) {
    return `(${ddd}) ${firstPart}`;
  }

  return `(${ddd}) ${firstPart}-${lastPart}`;
};
