"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedFileFormats = exports.VIDEO_WRITE_STATUS = void 0;
/**
 * @ignore
 * @enum VIDEO_WRITE_STATUS
 */
var VIDEO_WRITE_STATUS;
(function (VIDEO_WRITE_STATUS) {
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["NOT_STARTED"] = 0] = "NOT_STARTED";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["IN_PROGRESS"] = 1] = "IN_PROGRESS";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["COMPLETED"] = 2] = "COMPLETED";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["ERROR"] = 3] = "ERROR";
})(VIDEO_WRITE_STATUS || (exports.VIDEO_WRITE_STATUS = VIDEO_WRITE_STATUS = {}));
/**
 * @description supported video format for recording.
 * @example
 *  recording.start('./video.mp4');
 *  recording.start('./video.mov');
 *  recording.start('./video.webm');
 *  recording.start('./video.avi');
 */
var SupportedFileFormats;
(function (SupportedFileFormats) {
    SupportedFileFormats["MP4"] = "mp4";
    SupportedFileFormats["MOV"] = "mov";
    SupportedFileFormats["AVI"] = "avi";
    SupportedFileFormats["WEBM"] = "webm";
})(SupportedFileFormats || (exports.SupportedFileFormats = SupportedFileFormats = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtVHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3BhZ2VWaWRlb1N0cmVhbVR5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILElBQVksa0JBS1g7QUFMRCxXQUFZLGtCQUFrQjtJQUM1Qix5RUFBYSxDQUFBO0lBQ2IseUVBQWEsQ0FBQTtJQUNiLHFFQUFXLENBQUE7SUFDWCw2REFBTyxDQUFBO0FBQ1QsQ0FBQyxFQUxXLGtCQUFrQixrQ0FBbEIsa0JBQWtCLFFBSzdCO0FBOElEOzs7Ozs7O0dBT0c7QUFDSCxJQUFZLG9CQUtYO0FBTEQsV0FBWSxvQkFBb0I7SUFDOUIsbUNBQVcsQ0FBQTtJQUNYLG1DQUFXLENBQUE7SUFDWCxtQ0FBVyxDQUFBO0lBQ1gscUNBQWEsQ0FBQTtBQUNmLENBQUMsRUFMVyxvQkFBb0Isb0NBQXBCLG9CQUFvQixRQUsvQiJ9