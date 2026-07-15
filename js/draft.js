(function initDraftPage(document, common) {
  "use strict";

  const { downloadText } = common;

  function initDraftTools() {
    const draftPaper = document.getElementById("draftPaper");
    const zoomPercent = document.getElementById("zoomPercent");
    let zoom = 100;

    function applyZoom() {
      draftPaper.style.transformOrigin = "top center";
      draftPaper.style.transform = `scale(${zoom / 100})`;
      draftPaper.style.marginBottom = `${34 + (zoom - 100) * 3}px`;
      zoomPercent.textContent = `${zoom}%`;
    }

    function downloadDraft() {
      const content = draftPaper.innerText.replace(/\n{3,}/g, "\n\n").trim();
      downloadText(content, "국회_답변서_초안.txt");
    }

    document.getElementById("zoomOut").addEventListener("click", () => {
      zoom = Math.max(80, zoom - 10);
      applyZoom();
    });

    document.getElementById("zoomIn").addEventListener("click", () => {
      zoom = Math.min(130, zoom + 10);
      applyZoom();
    });

    document.getElementById("fitBtn").addEventListener("click", () => {
      zoom = 100;
      applyZoom();
    });

    document
      .getElementById("generateDraftBtn")
      .addEventListener("click", downloadDraft);
    document
      .getElementById("draftDownloadBtn")
      .addEventListener("click", downloadDraft);
  }

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
      message.append("\n", time);
      chatBody.appendChild(message);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendChat() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage("user", text);
      chatInput.value = "";

      window.setTimeout(() => {
        appendMessage(
          "ai",
          "요청하신 내용을 초안에 반영할 수 있도록 문단 구조와 근거 표현을 정리했습니다. 필요한 경우 선택 문단을 표 형식으로 재구성해드릴 수 있습니다.",
        );
      }, 260);
    }

    sendButton.addEventListener("click", sendChat);
    chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") sendChat();
    });
  }

  initDraftTools();
  initChat();
})(document, window.AIOneCommon);
