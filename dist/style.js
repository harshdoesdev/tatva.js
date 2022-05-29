"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.style = void 0;
const style = (strings, ...values) => {
    const stylesheet = new CSSStyleSheet;
    stylesheet.replaceSync(values.reduce((css, value, index) => css + value + strings[index + 1], strings[0]));
    return stylesheet;
};
exports.style = style;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3R5bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQU8sTUFBTSxLQUFLLEdBQUcsQ0FBQyxPQUFpQixFQUFFLEdBQUcsTUFBZ0IsRUFBRSxFQUFFO0lBRTVELE1BQU0sVUFBVSxHQUFHLElBQUksYUFBYSxDQUFDO0lBRXJDLFVBQVUsQ0FBQyxXQUFXLENBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNyRixDQUFDO0lBRUYsT0FBTyxVQUFVLENBQUM7QUFFdEIsQ0FBQyxDQUFDO0FBVlcsUUFBQSxLQUFLLFNBVWhCIn0=