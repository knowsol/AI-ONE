(function initCommon(global, document) {
    "use strict";

    /* Start: 파일 크기 표기 */
    function formatFileSize(bytes) {
        if (!Number.isFinite(bytes)) return "";
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
    }
    /* //End: 파일 크기 표기 */

    /* Start: 텍스트 파일 다운로드 */
    function downloadText(content, filename) {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");

        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    }
    /* //End: 텍스트 파일 다운로드 */

    /* Start: 다운로드 안내 토스트 */
    function showDownloadToast() {
        if (typeof global.Toastify !== "function") return;

        global
            .Toastify({
                text: "파일 다운로드 중입니다.",
                duration: 2000,
                newWindow: false,
                close: true,
                className: "download-toast",
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                onClick: function () {},
            })
            .showToast();
    }

    document.addEventListener(
        "click",
        (event) => {
            if (!(event.target instanceof global.Element)) return;

            const downloadButton = event.target.closest(".download-btn");
            if (downloadButton) showDownloadToast();
        },
        true,
    );
    /* //End: 다운로드 안내 토스트 */

    global.AIOneCommon = Object.freeze({
        downloadText,
        formatFileSize,
    });
})(window, document);
