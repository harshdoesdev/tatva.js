export const style = (strings, ...values) => {

    const stylesheet = new CSSStyleSheet;

    stylesheet.replaceSync(
        values.reduce((css, value, index) => css + value + strings[index + 1], strings[0])
    );

    return stylesheet;

};