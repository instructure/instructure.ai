/* Canvas Theme Editor: Dynamically resize roadmap iframe to fit content */
window.location.pathname.endsWith('/pages/instructure-roadmap') && (() => {
  console.info('Roadmap iframe resize script loaded');
window.addEventListener('message', (event) => {
  if (event.data && event.data.source === 'roadmap' && event.data.type === 'setHeight') {
    const iFrame = document.getElementById('roadmap');
    if (!iFrame) {
      console.error('Roadmap iframe not found');
      return;
    } 
    if (!(iFrame instanceof HTMLIFrameElement)) {
      console.error('Element with id "roadmap" is not an HTMLIFrameElement');
      return;
    }
    try {
      iFrame.height = event.data.height;
      console.info('Set iframe height to', event.data.height);
    } catch (err) {
      console.error('Failed to set iframe height:', err);
    }
  }
});
})();