export const encodeToHex = (value: string | number) => {
    switch (typeof value) {
        case 'string': return encodeStringToHex(value);
        case 'number': return encodeNumberToHex(value);
        default: throw new Error('Unsupported type');
    }
};

const encodeNumberToHex = (value: number): string => {
    const hexValue = value.toString(16);
    if (hexValue.length % 2) return '0' + hexValue;
    return hexValue;
};

const encodeStringToHex = (str: string): string => {
    let hex, i;

    let result = '';
    for (i=0; i < str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ('000' + hex).slice(-4);
    }

    return result;
};

export const decodeFromHex = (str: string): string => {
    let j;
    const hexes = str.match(/.{1,4}/g) || [];
    let back = '';
    for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
};
