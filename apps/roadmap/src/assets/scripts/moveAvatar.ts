/**
 * Canvas Theme Editor: moveAvatar
 * Rearranges the global nav structure to put the user avatar at the bottom
 */

const MOVE_AVATAR_ONLY_ONE_CHILD = 1;
const getMoveAvatarCurrentPath = (): string =>
  globalThis.location.pathname + globalThis.location.search + globalThis.location.hash;

(function moveAvatarIIFE(): void {
  let avatarObserver: MutationObserver | undefined = undefined;
  let lastPath = "";

  const moveAvatar = (): void => {
    const firstLi = globalThis.document.querySelector("#menu li:first-child");
    const targetList = globalThis.document.querySelector(
      ".ic-app-header__secondary-navigation > .ic-app-header__menu-list",
    );
    if (firstLi && targetList && targetList.childElementCount === MOVE_AVATAR_ONLY_ONE_CHILD) {
      targetList.appendChild(firstLi);
      if (avatarObserver) {
        avatarObserver.disconnect();
        avatarObserver = undefined;
      }
    }
  };

  const observeAvatar = (): void => {
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

  const onLocationChange = (): void => {
    const pathNow = getMoveAvatarCurrentPath();
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
