(function initDraftPage(document, common) {
  "use strict";

  const { downloadText } = common;

  /* Start: 답변서 보기 및 다운로드 */
  function initDraftTools() {
    const draftPaper = document.getElementById("draftPaper");
    const zoomPercent = document.getElementById("zoomPercent");
    let zoom = 100;

    function applyZoom() {
      draftPaper.style.transformOrigin = "top center";
      draftPaper.style.transform = `scale(${zoom / 100})`;
      draftPaper.style.marginBottom = `${Math.max(0, draftPaper.offsetHeight * (zoom / 100 - 1))}px`;
      zoomPercent.textContent = `${zoom}%`;
    }

    function downloadDraft() {
      const content = draftPaper.innerText.replace(/\n{3,}/g, "\n\n").trim();
      downloadText(content, "국회_답변서_초안.txt");
    }

    document.getElementById("zoomOut").addEventListener("click", () => {
      zoom = Math.max(10, zoom - 10);
      applyZoom();
    });

    document.getElementById("zoomIn").addEventListener("click", () => {
      zoom = Math.min(400, zoom + 10);
      applyZoom();
    });

    // 오른쪽 끝 버튼: 배율 100%로 초기화
    document.getElementById("fitBtn").addEventListener("click", () => {
      zoom = 100;
      applyZoom();
    });

    // 캔버스에서 Ctrl + 휠: 문서 확대/축소 (브라우저 페이지 확대는 막음)
    const draftScroll = document.getElementById("draftScroll");
    if (draftScroll) {
      draftScroll.addEventListener(
        "wheel",
        (event) => {
          if (!event.ctrlKey) return;
          event.preventDefault();
          zoom = Math.max(10, Math.min(400, zoom + (event.deltaY < 0 ? 10 : -10)));
          applyZoom();
        },
        { passive: false },
      );
    }

    document
      .getElementById("draftDownloadBtn")
      .addEventListener("click", downloadDraft);
  }
  /* //End: 답변서 보기 및 다운로드 */

  /* Start: AI 채팅 */
  function initChat() {
    const chatBody = document.getElementById("chatBody");
    const chatInput = document.getElementById("chatInput");
    const sendButton = document.getElementById("sendBtn");

    function getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    }

    function appendMessage(type, text) {
      const message = document.createElement("li");
      const time = document.createElement("span");

      message.className = `msg ${type}`;
      message.textContent = text;
      time.className = "msg-time";
      time.textContent = getCurrentTime();
      message.append(time);
      chatBody.appendChild(message);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // AI 응답 대기 중 로딩(타이핑) 인디케이터
    function showLoading() {
      const loading = document.createElement("li");
      loading.className = "msg ai msg-loading";
      loading.setAttribute("aria-label", "AI가 답변을 작성 중입니다");
      loading.innerHTML =
        '<span class="typing"><span></span><span></span><span></span></span>';
      chatBody.appendChild(loading);
      chatBody.scrollTop = chatBody.scrollHeight;
      return loading;
    }

    // AI 답변: 최종 폭을 미리 잡고(투명 고스트) 그 위에 어절 단위로 타이핑
    function typeMessage(text) {
      const message = document.createElement("li");
      message.className = "msg ai msg-typing";

      const wrap = document.createElement("span");
      wrap.className = "type-wrap";
      const ghost = document.createElement("span");
      ghost.className = "type-ghost";
      ghost.textContent = text; // 전체 문장으로 최종 크기 고정(리플로우 방지)
      const live = document.createElement("span");
      live.className = "type-live";
      wrap.append(ghost, live);
      message.appendChild(wrap);
      chatBody.appendChild(message);

      const time = document.createElement("span");
      time.className = "msg-time";
      time.textContent = getCurrentTime();

      const tokens = text.match(/\S+\s*/g) || [text]; // 어절(단어+공백) 단위
      let i = 0;
      const timer = window.setInterval(() => {
        i += 1;
        live.textContent = tokens.slice(0, i).join("");
        chatBody.scrollTop = chatBody.scrollHeight;
        if (i >= tokens.length) {
          window.clearInterval(timer);
          message.classList.remove("msg-typing");
          message.textContent = text; // 고스트/오버레이 정리 후 일반 텍스트로
          message.append(time); // 완료 후 시간(호버 노출) 부착
        }
      }, 50);
    }

    function sendChat() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage("user", text);
      chatInput.value = "";

      const loading = showLoading();
      window.setTimeout(() => {
        loading.remove();
        typeMessage(
          "요청하신 내용을 초안에 반영할 수 있도록 문단 구조와 근거 표현을 정리했습니다. 필요한 경우 선택 문단을 표 형식으로 재구성해드릴 수 있습니다.",
        );
      }, 800);
    }

    sendButton.addEventListener("click", sendChat);
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") sendChat();
    });
  }
  /* //End: AI 채팅 */

  initDraftTools();
  initChat();
})(document, window.AIOneCommon);
