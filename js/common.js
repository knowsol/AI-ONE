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

/* Start: 프라이머리 색상 선택(설정) */
(function initPrimaryPicker(document) {
    "use strict";

    var STORAGE_KEY = "aione-primary";
    var DEFAULT = "#163A5F";
    // 선택 가능한 프라이머리 색상 10종
    var PRESETS = [
        "#163A5F", "#0B74DC", "#1D4ED8", "#4F46E5", "#7C3AED",
        "#0F766E", "#059669", "#0E7490", "#B45309", "#334155",
    ];

    function hexToRgb(hex) {
        var h = hex.replace("#", "");
        return [
            parseInt(h.slice(0, 2), 16),
            parseInt(h.slice(2, 4), 16),
            parseInt(h.slice(4, 6), 16),
        ];
    }

    function toHex(n) {
        var v = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return v.length === 1 ? "0" + v : v;
    }

    // target(0=검정, 255=흰색)과 ratio만큼 섞어 deep/soft 파생색 생성
    function mix(hex, target, ratio) {
        var c = hexToRgb(hex);
        return (
            "#" +
            toHex(c[0] + (target - c[0]) * ratio) +
            toHex(c[1] + (target - c[1]) * ratio) +
            toHex(c[2] + (target - c[2]) * ratio)
        );
    }

    function applyPrimary(hex) {
        var s = document.documentElement.style;
        s.setProperty("--primary", hex);
        s.setProperty("--primary-deep", mix(hex, 0, 0.3)); // 30% 어둡게(hover)
        s.setProperty("--primary-soft", mix(hex, 255, 0.9)); // 90% 밝게(연한 배경)
    }

    function readSaved() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function save(hex) {
        try {
            localStorage.setItem(STORAGE_KEY, hex);
        } catch (e) {
            /* localStorage 불가 환경 무시 */
        }
    }

    function init() {
        var settingsBtn = document.getElementById("settingsBtn");
        if (!settingsBtn) return;

        var pop = document.createElement("div");
        pop.className = "color-popover";
        pop.hidden = true;

        var title = document.createElement("div");
        title.className = "color-popover-title";
        title.textContent = "프라이머리 색상";

        var grid = document.createElement("div");
        grid.className = "color-grid";

        pop.appendChild(title);
        pop.appendChild(grid);

        var swatches = {};

        function markActive(hex) {
            var key = (hex || DEFAULT).toUpperCase();
            Object.keys(swatches).forEach(function (k) {
                swatches[k].classList.toggle("active", k === key);
            });
        }

        PRESETS.forEach(function (color) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "color-swatch";
            btn.style.background = color;
            btn.title = color;
            btn.setAttribute("aria-label", "프라이머리 " + color);
            btn.addEventListener("click", function () {
                applyPrimary(color);
                save(color);
                markActive(color);
            });
            swatches[color.toUpperCase()] = btn;
            grid.appendChild(btn);
        });

        document.body.appendChild(pop);

        // 저장된 색 복원
        var saved = readSaved();
        if (saved) applyPrimary(saved);
        markActive(saved);

        // 설정 버튼으로 토글 / 바깥 클릭·ESC로 닫기
        settingsBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            pop.hidden = !pop.hidden;
        });
        document.addEventListener("click", function (e) {
            if (!pop.hidden && !pop.contains(e.target) && !settingsBtn.contains(e.target)) {
                pop.hidden = true;
            }
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") pop.hidden = true;
        });
    }

    init();
})(document);
/* //End: 프라이머리 색상 선택(설정) */
