const sendHeight = () => {
  const frameHeight = document.body.scrollHeight < 800 ? 800 : document.body.scrollHeight;
  window.parent.postMessage(
    {
      height: frameHeight,
      source: "roadmap",
      type: "setHeight",
    },
    "*",
  );
};
export default sendHeight;
