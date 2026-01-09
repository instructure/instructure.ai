/**
 * Canvas Theme Editor: co-labsRoadmap
 *
 * This script listens for messages from the roadmap iframe and handles
 * communication for roadmap data and dynamic resizing.
 *
 * Features:
 * - Listens for "getRoadmap" messages to return roadmap data from the iframe.
 * - Listens for "setHeight" messages to update the iframe's height dynamically.
 * - Uses a MutationObserver to attach listeners when the roadmap iframe is added to the DOM.
 *
 * Only runs on the "/pages/instructure-roadmap*" path.
 *
 * @version 2026.01.08.00
 */

const path = globalThis.location.pathname;
const matchesRoadmap = /\/pages\/instructure-roadmap(-\d+)?$/.test(path);
const matchesCourse = /^\/courses\/\d+$/.test(path);
const matchesCourseWiki = /^\/courses\/[1-9]\d*\/wiki$/.test(path);

const handleGetRoadmap = (iFrame, _event) => {
  const roadmap = iFrame.getAttribute("data-roadmap");
  if (iFrame.contentWindow) {
    iFrame.contentWindow.postMessage({ value: roadmap }, "*");
  } else {
    console.error("No contentWindow for roadmap iframe");
  }
};

const removeCoursePageElements = () => {
  const selectors = [
    "#courseMenuToggle",
    "#easy_student_view",
    "#breadcrumbs .home",
    ".page-toolbar .page-toolbar-end",
  ];
  let attempts = 0;
  const maxAttempts = 10;
  const delay = 100;
  const removeElementsWithRetry = () => {
    let allRemoved = true;
    selectors.forEach((sel) => {
      const el = globalThis.document.querySelector(sel);
      if (el) {
        el.remove();
      } else {
        allRemoved = false;
      }
    });
    const main = globalThis.document.querySelector("#main");
    if (main?.style) {
      main.style.setProperty("margin", "0");
    }
    if (!allRemoved && attempts < maxAttempts) {
      attempts++;
      setTimeout(removeElementsWithRetry, delay);
    }
  };
  removeElementsWithRetry();
  globalThis.document.body.classList.add("roadmap");
};

if (matchesRoadmap || matchesCourse || matchesCourseWiki) {
  const iframeListenerMap = new WeakMap();
  const handler = (iFrame, event) => {
    if (!event.data) {
      return;
    }
    if (event.data.type === "getRoadmap") {
      handleGetRoadmap(iFrame, event);
    }
  };

  const attachListener = (iFrame) => {
    if (!(iFrame instanceof HTMLIFrameElement)) {
      console.error('Element with id "roadmap" is not an HTMLIFrameElement');
      return;
    }
    if (iframeListenerMap.has(iFrame)) {
      return;
    }
    const boundHandler = (event) => handler(iFrame, event);
    globalThis.addEventListener("message", boundHandler);
    iframeListenerMap.set(iFrame, boundHandler);
  };

  const setupRoadmapIframe = (iFrame, obs) => {
    attachListener(iFrame);
    if (matchesCourse) {
      removeCoursePageElements();
    }
    obs.disconnect();
  };

  const observer = new MutationObserver((_mutations, obs) => {
    const iFrame = globalThis.document.getElementById("roadmap");
    if (iFrame) {
      setupRoadmapIframe(iFrame, obs);
    }
  });

  observer.observe(globalThis.document.body, { childList: true, subtree: true });

  const existing = globalThis.document.getElementById("roadmap");
  if (existing) {
    attachListener(existing);
    observer.disconnect();
  }
}

/**
 * Canvas Theme Editor: moveAvatar
 *
 * Rearranges the global nav structure to put the user avatar at the bottom
 *
 * @version 2026.01.07.00
 *
 */

const ONLY_ONE_CHILD = 1;
const getCurrentPath = () => path + globalThis.location.search + globalThis.location.hash;

(function moveAvatarIIFE() {
  let avatarObserver = undefined;
  let lastPath = "";

  const moveAvatar = () => {
    const firstLi = globalThis.document.querySelector("#menu li:first-child");
    const targetList = globalThis.document.querySelector(
      ".ic-app-header__secondary-navigation > .ic-app-header__menu-list",
    );
    if (firstLi && targetList && targetList.childElementCount === ONLY_ONE_CHILD) {
      targetList.appendChild(firstLi);
      if (avatarObserver) {
        avatarObserver.disconnect();
        avatarObserver = undefined;
      }
    }
  };

  const observeAvatar = () => {
    if (avatarObserver) {
      avatarObserver.disconnect();
      avatarObserver = undefined;
    }
    avatarObserver = new MutationObserver(moveAvatar);
    if (globalThis.document.body) {
      avatarObserver.observe(globalThis.document.body, { childList: true, subtree: true });
    }
    moveAvatar();
  };

  const onLocationChange = () => {
    const pathNow = getCurrentPath();
    if (pathNow !== lastPath) {
      lastPath = pathNow;
      observeAvatar();
    }
  };

  globalThis.addEventListener("popstate", () =>
    globalThis.dispatchEvent(new Event("locationchange")),
  );
  globalThis.addEventListener("locationchange", onLocationChange);

  if (globalThis.document.readyState === "loading") {
    globalThis.document.addEventListener("DOMContentLoaded", onLocationChange, { once: true });
  } else {
    onLocationChange();
  }
})();
