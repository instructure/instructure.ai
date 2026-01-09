const hideRightSideWrapper: () => void = () => {
  window.parent.postMessage(
    {
      subject: "lti.hideRightSideWrapper",
    },
    "*",
  );
};
export default hideRightSideWrapper;
