/**
 * Canvas Theme Editor: co-labsRoadmap
 *
 * This script listens for messages from the roadmap iframe and handles
 * communication for roadmap data and dynamic resizing.
 * Features:
 * - Listens for "getRoadmap" messages to return roadmap data from the iframe.
 * - Listens for "setHeight" messages to update the iframe's height dynamically.
 * - Uses a MutationObserver to attach listeners when the roadmap iframe is added to the DOM.
 * Only runs on the "/pages/instructure-roadmap*" path.
 *
 */

const path = globalThis.location.pathname;
const matchesRoadmap = /\/pages\/instructure-roadmap(-\d+)?$/.test(path);
const matchesCourse = /^\/courses\/\d+$/.test(path);
const matchesCourseWiki = /^\/courses\/[1-9]\d*\/wiki$/.test(path);

const handleGetRoadmap = (iFrame: HTMLIFrameElement, _event: MessageEvent): void => {
  const roadmap = iFrame.getAttribute("data-roadmap");
  if (iFrame.contentWindow) {
    iFrame.contentWindow.postMessage({ value: roadmap }, "*");
  } else {
    console.error("No contentWindow for roadmap iframe");
  }
};

const removeCoursePageElements = (): void => {
  const selectors: string[] = [
    "#courseMenuToggle",
    "#easy_student_view",
    "#breadcrumbs .home",
    ".page-toolbar .page-toolbar-end",
  ];
  let attempts = 0;
  const maxAttempts = 10;
  const delay = 100;
  const removeElementsWithRetry = (): void => {
    let allRemoved = true;
    selectors.forEach((sel: string) => {
      const el = globalThis.document.querySelector(sel);
      if (el) {
        el.remove();
      } else {
        allRemoved = false;
      }
    });
    const main = globalThis.document.querySelector("#main");
    if (main instanceof HTMLElement && main.style) {
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
  const iframeListenerMap = new WeakMap<HTMLIFrameElement, (event: MessageEvent) => void>();
  const handler = (iFrame: HTMLIFrameElement, event: MessageEvent): void => {
    if (!event.data) {
      return;
    }
    if (event.data.type === "getRoadmap") {
      handleGetRoadmap(iFrame, event);
    }
  };

  const attachListener = (iFrame: HTMLIFrameElement): void => {
    if (!(iFrame instanceof HTMLIFrameElement)) {
      console.error('Element with id "roadmap" is not an HTMLIFrameElement');
      return;
    }
    if (iframeListenerMap.has(iFrame)) {
      return;
    }
    const boundHandler = (event: MessageEvent) => handler(iFrame, event);
    globalThis.addEventListener("message", boundHandler);
    iframeListenerMap.set(iFrame, boundHandler);
  };

  const setupRoadmapIframe = (iFrame: HTMLIFrameElement, obs: MutationObserver): void => {
    attachListener(iFrame);
    if (matchesCourse) {
      removeCoursePageElements();
    }
    obs.disconnect();
  };

  const observer: MutationObserver = new MutationObserver(
    (_mutations: MutationRecord[], obs: MutationObserver) => {
      const el = globalThis.document.getElementById("roadmap");
      if (el instanceof HTMLIFrameElement) {
        setupRoadmapIframe(el, obs);
      }
    },
  );

  observer.observe(globalThis.document.body, { childList: true, subtree: true });

  const existing = globalThis.document.getElementById("roadmap");
  if (existing instanceof HTMLIFrameElement) {
    attachListener(existing);
    observer.disconnect();
  }
}
