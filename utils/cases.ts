export const camelToKebab = (str: string): string => str
  .split('')
  .map((letter, idx) => (
    letter.toUpperCase() === letter && /[a-zа-яё]/i.test(letter)
      ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
      : letter)).join('');
