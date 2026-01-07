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
 * Only runs on the "/pages/instructure-roadmap" path.
 *
 * @version 2026.01.07.00
 */

const path = globalThis.location.pathname;
const matchesRoadmap = path.endsWith("/pages/instructure-roadmap");
const matchesCourse = /^\/courses\/\d+$/.test(path);
const matchesCourseWiki = /^\/courses\/[1-9]\d*\/wiki$/.test(path);

const handleGetRoadmap = (iFrame, _event) => {
  const roadmap = iFrame.getAttribute("data-roadmap");
  console.log("[themeEditor.js] Roadmap attribute:", roadmap);
  if (iFrame.contentWindow) {
    iFrame.contentWindow.postMessage({ value: roadmap }, "*");
    console.log("[themeEditor.js] Sent roadmap message", {
      value: roadmap,
    });
  } else {
    console.error("No contentWindow for roadmap iframe");
  }
};

const handleLtiGetPageSettings = (iFrame, event) => {
  if (iFrame.contentWindow) {
    iFrame.contentWindow.postMessage(
      {
        pageSettings: event.data.pageSettings,
        subject: "lti.postMessage",
      },
      "*",
    );
    console.log("[themeEditor.js] Sent lti.postMessage", event.data.pageSettings);
  }
};

const handleSetHeight = (iFrame, event) => {
  try {
    iFrame.height = event.data.height;
  } catch (error) {
    console.error("Failed to set iframe height:", error);
  }
};

if (matchesRoadmap || matchesCourse || matchesCourseWiki) {
  console.info("Roadmap script loaded");

  const iframeListenerMap = new WeakMap();

  const handler = (iFrame, event) => {
    if (!event.data) {
      return;
    }
    if (event.data.type === "getRoadmap") {
      handleGetRoadmap(iFrame, event);
    } else if (event.data.subject === "lti.getPageSettings") {
      handleLtiGetPageSettings(iFrame, event);
    } else if (event.data.type === "setHeight") {
      handleSetHeight(iFrame, event);
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

  const observer = new MutationObserver((_mutations, obs) => {
    const DEFAULT_ATTEMPT = 0;
    const ATTEMPT_INCREMENT = 1;
    const iFrame = globalThis.document.getElementById("roadmap");
    if (iFrame) {
      attachListener(iFrame);
      if (matchesCourse) {
        console.info("Setting Roadmap page to full screen");
        const removeElementsWithRetry = (attempt = DEFAULT_ATTEMPT) => {
          const maxAttempts = 10;
          const delay = 100;
          let allRemoved = true;
          const selectors = ["#right-side-wrapper", "#left-side", "#courseMenuToggle"];
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
          if (!allRemoved && attempt < maxAttempts) {
            setTimeout(() => removeElementsWithRetry(attempt + ATTEMPT_INCREMENT), delay);
          }
        };
        removeElementsWithRetry();
      }
      obs.disconnect();
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

const getCurrentPath = () =>
  globalThis.location.pathname + globalThis.location.search + globalThis.location.hash;

const patchHistoryMethods = () => {
  const _pushState = globalThis.history.pushState.bind(globalThis.history);
  globalThis.history.pushState = function pushState(...args) {
    const ret = _pushState.apply(this, args);
    globalThis.dispatchEvent(new Event("locationchange"));
    return ret;
  };

  const _replaceState = globalThis.history.replaceState.bind(globalThis.history);
  globalThis.history.replaceState = function replaceState(...args) {
    const ret = _replaceState.apply(this, args);
    globalThis.dispatchEvent(new Event("locationchange"));
    return ret;
  };
};

(() => {
  let avatarObserver = undefined;
  let lastPath = "";

  const moveAvatar = () => {
    const firstLi = globalThis.document.querySelector("#menu li:first-child");
    const targetList = globalThis.document.querySelector(
      ".ic-app-header__secondary-navigation > .ic-app-header__menu-list",
    );
    if (firstLi && targetList && targetList.childElementCount === ONLY_ONE_CHILD) {
      targetList.appendChild(firstLi);
      disconnectAvatarObserver();
    }
  };

  const disconnectAvatarObserver = () => {
    if (avatarObserver) {
      avatarObserver.disconnect();
      avatarObserver = undefined;
    }
  };

  const startObserverForThisPage = () => {
    disconnectAvatarObserver();
    avatarObserver = new MutationObserver(moveAvatar);
    avatarObserver.observe(globalThis.document.body, { childList: true, subtree: true });
    moveAvatar();
  };

  const onLocationChange = () => {
    const path = getCurrentPath();
    if (path !== lastPath) {
      lastPath = path;
      startObserverForThisPage();
    }
  };

  const setupListeners = () => {
    globalThis.addEventListener("popstate", () =>
      globalThis.dispatchEvent(new Event("locationchange")),
    );
    globalThis.addEventListener("locationchange", onLocationChange);
  };

  const init = () => {
    patchHistoryMethods();
    setupListeners();
    if (globalThis.document.readyState === "loading") {
      globalThis.document.addEventListener("DOMContentLoaded", onLocationChange, {
        once: true,
      });
    } else {
      onLocationChange();
    }
  };

  init();
})();
