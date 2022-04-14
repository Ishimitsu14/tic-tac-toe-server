export const camelToKebab = (str: string): string => {
    return str.split('').map((letter, idx) => {
        return letter.toUpperCase() === letter && /[a-zа-яё]/i.test(letter)
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
    }).join('');
};
