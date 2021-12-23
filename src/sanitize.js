const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
    "`": "&grave;"
};

const htmlEscapeReg = /[&<>"'`/]/ig;

export const sanitize = str => str.replace(htmlEscapeReg, match => htmlEscapeMap[match]);