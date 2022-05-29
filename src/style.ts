export const style = (strings: string[], ...values: string[]) => {

    const stylesheet = new CSSStyleSheet;

    stylesheet.replaceSync(
        values.reduce((css, value, index) => css + value + strings[index + 1], strings[0])
    );

    return stylesheet;

};