"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template = void 0;
const sanitize_js_1 = require("./sanitize.js");
const template = (strings, ...values) => {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = values.reduce((html, value, index) => html + (0, sanitize_js_1.sanitize)(value) + strings[index + 1], strings[0]);
    return tmpl;
};
exports.template = template;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0NBQXlDO0FBRWxDLE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBaUIsRUFBRSxHQUFHLE1BQWdCLEVBQUUsRUFBRTtJQUUvRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWhELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FFMUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUEsc0JBQVEsRUFBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUVuRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBRWIsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDO0FBRWhCLENBQUMsQ0FBQztBQWRXLFFBQUEsUUFBUSxZQWNuQiJ9