"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = void 0;
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
const sanitize = (str) => str.replace(htmlEscapeReg, match => htmlEscapeMap[match]);
exports.sanitize = sanitize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2FuaXRpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxhQUFhLEdBQUc7SUFDbEIsR0FBRyxFQUFFLE9BQU87SUFDWixHQUFHLEVBQUUsTUFBTTtJQUNYLEdBQUcsRUFBRSxNQUFNO0lBQ1gsR0FBRyxFQUFFLFFBQVE7SUFDYixHQUFHLEVBQUUsUUFBUTtJQUNiLEdBQUcsRUFBRSxRQUFRO0lBQ2IsR0FBRyxFQUFFLFNBQVM7Q0FDakIsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFXLGFBQWEsQ0FBQztBQUVyQyxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQVcsRUFBVSxFQUFFLENBQzVDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFEakQsUUFBQSxRQUFRLFlBQ3lDIn0=