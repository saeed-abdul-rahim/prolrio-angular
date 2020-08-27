export default function toTitleCase(str: string) {
    return str.split(' ').map(([firstChar, ...rest]) => firstChar.toUpperCase() + rest.join('').toLowerCase()).join(' ');
}
