const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
    "`": "&grave;"
};

const htmlEscapeReg: RegExp = /[&<>"'`/]/ig;

export const sanitize = (str: string): string => 
    str.replace(htmlEscapeReg, match => htmlEscapeMap[match]);