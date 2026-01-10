const frameResize: () => void = () => {
  window.parent.postMessage(
    {
      height: document.documentElement.scrollHeight,
      subject: "lti.frameResize",
    },
    "*",
  );
};
export default frameResize;
