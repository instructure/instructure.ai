const hideNavigationMenu: () => void = () => {
  window.parent.postMessage(
    {
      subject: "hideNavigationMenu",
    },
    "*",
  );
};
export default hideNavigationMenu;
