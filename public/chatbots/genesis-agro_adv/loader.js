
(function() {
    const CLIENT_NAME = 'agro2'; // This should be updated for each client
    const IFRAME_URL = `https://timpia.ro/chatbots/${CLIENT_NAME}/index.html`;

    let iframeVisible = false;
    let fabButton = null;
    let chatIframe = null;

    function createFab() {
        const fab = document.createElement('div');
        fab.id = 'timpia-chat-fab';
        fab.style.position = 'fixed';
        fab.style.bottom = '20px';
        fab.style.right = '20px';
        fab.style.width = '60px';
        fab.style.height = '60px';
        fab.style.borderRadius = '50%';
        fab.style.backgroundColor = '#2563eb';
        fab.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
        fab.style.cursor = 'pointer';
        fab.style.display = 'flex';
        fab.style.alignItems = 'center';
        fab.style.justifyContent = 'center';
        fab.style.zIndex = '99998';
        fab.style.transition = 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
        fab.style.transform = 'scale(0)';
        fab.style.opacity = '0';

        fab.innerHTML = `
            <div id="timpia-fab-sonar" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #2563eb; opacity: 0.5; transform: scale(1); animation: sonar-wave 2s infinite ease-out;"></div>
            <svg id="timpia-fab-icon-chat" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 32px; height: 32px; position: absolute; opacity: 1; transform: scale(1); transition: all 0.2s ease-out;">
                <path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clip-rule="evenodd"></path>
            </svg>
            <svg id="timpia-fab-icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" style="width: 28px; height: 28px; position: absolute; opacity: 0; transform: scale(0.7) rotate(-45deg); transition: all 0.2s ease-out;">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd"></path>
            </svg>
        `;
        document.body.appendChild(fab);
        fabButton = fab;

        setTimeout(() => {
            fab.style.transform = 'scale(1)';
            fab.style.opacity = '1';
        }, 300); // Delay appearance
    }

    function createIframe() {
        const iframe = document.createElement('iframe');
        iframe.id = 'timpia-chat-iframe';
        iframe.src = IFRAME_URL;
        iframe.style.position = 'fixed';
        iframe.style.bottom = '90px';
        iframe.style.right = '20px';
        iframe.style.width = 'min(400px, calc(100vw - 40px))';
        iframe.style.height = 'min(700px, calc(100vh - 110px))';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '30px';
        iframe.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        iframe.style.opacity = '0';
        iframe.style.transform = 'translateY(20px) scale(0.95)';
        iframe.style.transition = 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        iframe.style.pointerEvents = 'none';
        iframe.style.zIndex = '99999';
        
        document.body.appendChild(iframe);
        chatIframe = iframe;
    }

    function toggleChat(visible) {
        if (!fabButton || !chatIframe) return;

        iframeVisible = visible;
        const chatIcon = document.getElementById('timpia-fab-icon-chat');
        const closeIcon = document.getElementById('timpia-fab-icon-close');
        const sonar = document.getElementById('timpia-fab-sonar');

        if (visible) {
            chatIframe.style.opacity = '1';
            chatIframe.style.transform = 'translateY(0) scale(1)';
            chatIframe.style.pointerEvents = 'auto';

            fabButton.style.backgroundColor = '#6b7280';
            sonar.style.display = 'none';
            chatIcon.style.opacity = '0';
            chatIcon.style.transform = 'scale(0.7) rotate(45deg)';
            closeIcon.style.opacity = '1';
            closeIcon.style.transform = 'scale(1) rotate(0)';
        } else {
            chatIframe.style.opacity = '0';
            chatIframe.style.transform = 'translateY(20px) scale(0.95)';
            chatIframe.style.pointerEvents = 'none';

            fabButton.style.backgroundColor = '#2563eb';
            sonar.style.display = 'block';
            chatIcon.style.opacity = '1';
            chatIcon.style.transform = 'scale(1) rotate(0)';
            closeIcon.style.opacity = '0';
            closeIcon.style.transform = 'scale(0.7) rotate(-45deg)';
        }
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sonar-wave {
                0% { transform: scale(0.9); opacity: 0.5; }
                100% { transform: scale(1.6); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function init() {
        if (document.getElementById('timpia-chat-fab')) return; // Already initialized

        injectStyles();
        createFab();
        createIframe();

        fabButton.addEventListener('click', () => toggleChat(!iframeVisible));
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
