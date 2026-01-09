const frameResize: () => void = () => {
  window.parent.postMessage(
    {
      height: document.body.scrollHeight,
      subject: "lti.frameResize",
    },
    "*",
  );
};
export default frameResize;
