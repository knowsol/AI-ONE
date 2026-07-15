(function initClassificationPage(document, common) {
  "use strict";

  const { downloadText, formatFileSize } = common;

  /* Start: 질의 선택 */
  function initQuestionSelection() {
    const questionCards = document.querySelectorAll(".q-card");
    const questionLines = document.querySelectorAll(".question-line");

    questionCards.forEach((card) => {
      card.addEventListener("click", () => {
        const questionId = card.dataset.q;

        questionCards.forEach((item) => {
          const isActive = item === card;
          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        questionLines.forEach((line) => {
          line.classList.toggle("active", line.id === `qline-${questionId}`);
        });

        document.getElementById(`qline-${questionId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    });
  }
  /* //End: 질의 선택 */

  /* Start: 파일 업로드 */
  function extClass(name) {
    const ext = (name.split(".").pop() || "").toLowerCase();
    if (ext === "pdf") return ["pdf", "PDF"];
    if (ext === "hwp" || ext === "hwpx") return ["hwp", "HWP"];
    if (ext === "xlsx") return ["xls", "XLS"];
    return ["hwp", ext ? ext.slice(0, 3).toUpperCase() : "DOC"];
  }

  function createFileCard(file) {
    const [type, label] = extClass(file.name);
    const card = document.createElement("li");
    const icon = document.createElement("span");
    const detail = document.createElement("div");
    const name = document.createElement("span");
    const size = document.createElement("span");
    const removeButton = document.createElement("button");

    card.className = "file-card";
    card.dataset.name = file.name;

    icon.className = `file-icon ${type}`;
    icon.textContent = label;
    icon.setAttribute("aria-hidden", "true");

    detail.className = "file-info";

    name.className = "file-name";
    name.title = file.name;
    name.textContent = file.name;

    size.className = "file-size";
    size.textContent = formatFileSize(file.size);

    removeButton.className = "remove-file";
    removeButton.type = "button";
    removeButton.title = "삭제";
    removeButton.textContent = "×";

    detail.append(name, size);
    card.append(icon, detail, removeButton);

    return card;
  }

  function initFileUpload() {
    const fileInput = document.getElementById("fileInput");
    const dropzone = document.getElementById("dropzone");
    const fileList = document.getElementById("fileList");
    const fileCount = document.getElementById("fileCount");
    const emptyNote = document.getElementById("emptyNote");

    function refreshFileCount() {
      const count = fileList.querySelectorAll(".file-card").length;
      fileCount.textContent = count;
      emptyNote.style.display = count ? "none" : "block";
    }

    function addFiles(files) {
      Array.from(files).forEach((file) => {
        fileList.appendChild(createFileCard(file));
      });
      refreshFileCount();
    }

    fileInput.addEventListener("change", (event) => {
      addFiles(event.target.files);
      fileInput.value = "";
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (event) => {
      addFiles(event.dataTransfer.files);
    });

    fileList.addEventListener("click", (event) => {
      const removeButton = event.target.closest(".remove-file");
      if (!removeButton) return;

      removeButton.closest(".file-card").remove();
      refreshFileCount();
    });

    refreshFileCount();
  }
  /* //End: 파일 업로드 */

  /* Start: 분류 결과 다운로드 */
  function initClassificationDownload() {
    document.getElementById("downloadBtn").addEventListener("click", () => {
      const rows = Array.from(document.querySelectorAll(".q-card")).map(
        (card) => {
          const question = card.querySelector(".q-pill").textContent.trim();
          const text = card.querySelector(".q-text").textContent.trim();
          const owner = card
            .querySelector(".owner-chip")
            .textContent.replace("주관:", "")
            .trim();
          const similarity = card
            .querySelector(".similarity b")
            .textContent.trim();

          return `${question}\t${owner}\t${similarity}\t${text}`;
        },
      );
      const content = [
        "질의ID\t추천실국\t유사도\t질의요약",
        ...rows,
      ].join("\n");

      downloadText(content, "국회질의분류_추천실국_결과.txt");
    });
  }
  /* //End: 분류 결과 다운로드 */

  initQuestionSelection();
  initFileUpload();
  initClassificationDownload();
})(document, window.AIOneCommon);
