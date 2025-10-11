// SNPAd Advanced Chatbot Widget Loader
// All-in-one script for creating a beautiful, animated chat widget that loads the SNPAd chatbot in an iframe.
// Features: Glassmorphism, fluid animations, attention grabber, and preloader for a seamless experience.

(function () {
  // --- CONFIGURATION ---
  const CHATBOT_URL = "https://timpia.ro/snpad/sn33";
  const BUBBLE_COLOR = "#007BFF"; // Vibrant Blue
  const ATTENTION_GRABBER_TEXT = "Ai o întrebare?";
  const ATTENTION_GRABBER_DELAY = 5000; // 5 seconds
  const WIDGET_LOAD_DELAY = 1000; // 1 second

  // --- SCRIPT STATE ---
  let isWidgetOpen = false;
  let hasBeenOpened = false;

  // --- DOM ELEMENTS ---
  const widgetContainer = document.createElement("div");
  const bubbleButton = document.createElement("button");
  const chatIconContainer = document.createElement("div");
  const chatIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>`;
  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  const iframeContainer = document.createElement("div");
  const iframe = document.createElement("iframe");
  const attentionGrabber = document.createElement("div");
  const preloader = document.createElement("div");

  // --- STYLES ---
  const styles = `
    @keyframes widget-bubble-entry {
        0% { transform: translateY(80px) scale(0.8); opacity: 0; }
        100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes widget-iframe-entry {
        0% { transform: scale(0.1) translateY(20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes widget-iframe-exit {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.1); opacity: 0; }
    }
    @keyframes icon-rotate-in {
        0% { transform: rotate(-90deg) scale(0.5); opacity: 0; }
        100% { transform: rotate(0deg) scale(1); opacity: 1; }
    }
    @keyframes icon-rotate-out {
        0% { transform: rotate(0deg) scale(1); opacity: 1; }
        100% { transform: rotate(90deg) scale(0.5); opacity: 0; }
    }
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 15px 3px ${BUBBLE_COLOR}40, 0 0 5px 1px ${BUBBLE_COLOR}60; }
        50% { box-shadow: 0 0 25px 6px ${BUBBLE_COLOR}70, 0 0 8px 2px ${BUBBLE_COLOR}90; }
    }
    @keyframes grabber-entry {
        0% { opacity: 0; transform: translateX(20px) scale(0.9); }
        100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes preloader-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .snpad-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .snpad-bubble-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${BUBBLE_COLOR};
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        animation: widget-bubble-entry 0.6s ease-out both;
        animation-delay: ${WIDGET_LOAD_DELAY}ms;
    }
    .snpad-bubble-button:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }
    .snpad-bubble-button.idle-glow {
        animation: widget-bubble-entry 0.6s ease-out both, pulse-glow 3s infinite ease-in-out;
        animation-delay: ${WIDGET_LOAD_DELAY}ms, ${WIDGET_LOAD_DELAY + 1000}ms;
    }
    .snpad-icon-container {
        position: relative;
        width: 24px;
        height: 24px;
    }
    .snpad-icon-container > svg {
        position: absolute;
        top: 0;
        left: 0;
        animation-duration: 0.3s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .snpad-attention-grabber {
        position: absolute;
        bottom: 15px;
        right: 80px;
        background-color: #ffffff;
        color: #1a1a1a;
        padding: 8px 14px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        white-space: nowrap;
        opacity: 0;
        animation: grabber-entry 0.5s ease-out forwards;
        animation-delay: ${ATTENTION_GRABBER_DELAY}ms;
        pointer-events: none;
    }
    .snpad-attention-grabber::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        border: 6px solid transparent;
        border-left-color: #ffffff;
    }
    .snpad-iframe-container {
        position: absolute;
        bottom: 90px;
        right: 0;
        width: 350px;
        height: 600px;
        max-height: 80vh;
        max-width: 90vw;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        background-color: #111827; /* Dark background to cover during load */
        border: 1px solid rgba(255, 255, 255, 0.1);
        transform-origin: bottom right;
        display: none; /* Initially hidden */
        animation-duration: 0.5s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .snpad-iframe-container.open {
        display: block;
        animation-name: widget-iframe-entry;
    }
     .snpad-iframe-container.closing {
        animation-name: widget-iframe-exit;
    }
    .snpad-iframe-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
        transition: opacity 0.3s ease-in;
        opacity: 0; /* Hidden until loaded */
    }
    .snpad-iframe-container iframe.loaded {
        opacity: 1;
    }
    .snpad-preloader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.2);
        border-top-color: ${BUBBLE_COLOR};
        border-radius: 50%;
        animation: preloader-spin 1s linear infinite;
        z-index: 1;
        transition: opacity 0.3s ease-out;
        opacity: 1;
    }
     .snpad-preloader.hidden {
        opacity: 0;
    }
  `;

  // --- FUNCTIONS ---
  function injectStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }

  function toggleWidget() {
    isWidgetOpen = !isWidgetOpen;

    if (isWidgetOpen) {
      // Open widget
      iframeContainer.classList.remove("closing");
      iframeContainer.classList.add("open");
      chatIconContainer.innerHTML = closeIcon;
      document.querySelector(".snpad-icon-container svg")?.style.setProperty("animation-name", "icon-rotate-in");
      attentionGrabber.style.display = 'none';

      if (!hasBeenOpened) {
        iframe.src = CHATBOT_URL;
        hasBeenOpened = true;
      }
    } else {
      // Close widget
      iframeContainer.classList.add("closing");
      chatIconContainer.innerHTML = chatIcon;
      document.querySelector(".snpad-icon-container svg")?.style.setProperty("animation-name", "icon-rotate-in");
      
       // Wait for animation to finish before hiding
      setTimeout(() => {
        if (!isWidgetOpen) { // Check state again in case it was re-opened quickly
          iframeContainer.classList.remove("open");
        }
      }, 500); // Must match animation duration
    }
  }

  // --- INITIALIZATION ---
  function initializeWidget() {
    // Inject styles
    injectStyles();

    // Setup bubble button
    bubbleButton.className = "snpad-bubble-button idle-glow";
    bubbleButton.setAttribute("aria-label", "Deschide chat");
    bubbleButton.setAttribute("role", "button");
    bubbleButton.setAttribute("tabindex", "0");
    chatIconContainer.className = "snpad-icon-container";
    chatIconContainer.innerHTML = chatIcon;
    bubbleButton.appendChild(chatIconContainer);
    bubbleButton.addEventListener("click", toggleWidget);

    // Setup attention grabber
    attentionGrabber.className = "snpad-attention-grabber";
    attentionGrabber.textContent = ATTENTION_GRABBER_TEXT;

    // Setup iframe container and preloader
    iframeContainer.className = "snpad-iframe-container";
    preloader.className = "snpad-preloader";
    
    // Logic for hiding preloader when iframe loads
    iframe.addEventListener('load', () => {
        preloader.classList.add('hidden');
        iframe.classList.add('loaded');
    });

    iframeContainer.appendChild(preloader);
    iframeContainer.appendChild(iframe);
    
    // Append to body
    widgetContainer.className = "snpad-widget-container";
    widgetContainer.appendChild(attentionGrabber);
    widgetContainer.appendChild(bubbleButton);
    widgetContainer.appendChild(iframeContainer);
    
    document.body.appendChild(widgetContainer);

     // Hide attention grabber after first open
    bubbleButton.addEventListener('click', () => {
        if(attentionGrabber.parentNode) {
            attentionGrabber.parentNode.removeChild(attentionGrabber);
        }
    }, { once: true });
  }

  // Delay initialization slightly to ensure page is ready
  if (document.readyState === 'complete') {
    setTimeout(initializeWidget, WIDGET_LOAD_DELAY);
  } else {
    window.addEventListener('load', () => setTimeout(initializeWidget, WIDGET_LOAD_DELAY));
  }
})();
