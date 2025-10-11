document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.getElementById('snpad-chatbot');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const clearChatBtn = document.getElementById('clear-chat');
    const navBtns = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messageList = document.getElementById('message-list');
    const thinkingIndicator = document.getElementById('thinking-indicator');
    const faqList = document.getElementById('faq-list');

    const SESSION_ID_KEY = 'snpad_chat_session_id';
    const HISTORY_KEY = 'snpad_chat_history';
    const THEME_KEY = 'snpad_chat_theme';

    let sessionId = localStorage.getItem(SESSION_ID_KEY) || crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);

    let messages = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    let isLoading = false;

    const faqData = [
        { q: "Ce soluții oferiți pentru agricultură?", a: "Oferim o gamă variată de produse fitosanitare, fertilizanți și semințe adaptate specificului culturilor din România." },
        { q: "Unde găsesc specificațiile tehnice?", a: "Puteți căuta în baza noastră de date direct aici în chat sau puteți naviga secțiunea de produse de pe site-ul nostru." },
        { q: "Oferiți consultanță personalizată?", a: "Da, echipa noastră de experți agronomi este disponibilă pentru a oferi consultanță adaptată nevoilor fermei dumneavoastră." },
        { q: "Cum pot plasa o comandă?", a: "Puteți plasa o comandă prin partenerii noștri distribuitori sau contactând un reprezentant de vânzări din zona dumneavoastră." }
    ];

    // --- Core Functions ---
    const getBotResponse = async (message) => {
        isLoading = true;
        updateThinkingIndicator();
        try {
            // SIMULARE API - Înlocuiește cu un apel real fetch
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
            const responseText = `Am primit mesajul tău: "${message}". Momentan sunt un demo, dar un agent real te va contacta în curând.`;
            return responseText;
        } catch (error) {
            console.error("API Error:", error);
            return "Ne pare rău, a apărut o eroare. Vă rugăm să încercați din nou mai târziu.";
        } finally {
            isLoading = false;
            updateThinkingIndicator();
        }
    };

    const addMessage = (sender, text) => {
        const messageData = { sender, text };
        messages.push(messageData);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
        renderMessages();
    };

    // --- Rendering and UI Updates ---
    const renderMessages = () => {
        messageList.innerHTML = '';
        messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.classList.add('message', msg.sender);
            
            const avatar = document.createElement('div');
            avatar.classList.add('avatar');
            avatar.innerHTML = msg.sender === 'user' 
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

            const bubble = document.createElement('div');
            bubble.classList.add('message-bubble');
            bubble.textContent = msg.text;

            if (msg.sender === 'user') {
                messageEl.appendChild(bubble);
                messageEl.appendChild(avatar);
            } else {
                messageEl.appendChild(avatar);
                messageEl.appendChild(bubble);
            }
            messageList.appendChild(messageEl);
        });
        messageList.scrollTop = messageList.scrollHeight;
    };
    
    const updateThinkingIndicator = () => {
        const particleContainer = thinkingIndicator.querySelector('.particle-container');
        if (isLoading) {
            thinkingIndicator.classList.remove('hidden');
            if(particleContainer.childElementCount === 0) { // Add particles only if they don't exist
                 for (let i = 0; i < 5; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.animationDelay = `${i * 0.4}s`;
                    particle.style.transform = `rotate(${i * 72}deg) translateX(10px) rotate(-${i * 72}deg)`;
                    particleContainer.appendChild(particle);
                }
            }
        } else {
            thinkingIndicator.classList.add('hidden');
            particleContainer.innerHTML = ''; // Clear particles
        }
    };
    
    const switchScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.toggle('hidden', screen.id !== screenId);
        });
        navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.screen === screenId);
        });
    };

    const setupTheme = () => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
            themeIconSun.classList.add('hidden');
            themeIconMoon.classList.remove('hidden');
        } else {
            document.body.classList.remove('dark-theme');
            themeIconSun.classList.remove('hidden');
            themeIconMoon.classList.add('hidden');
        }
    };

    const populateFaq = () => {
        faqData.forEach(faq => {
            const button = document.createElement('button');
            button.className = 'faq-item';
            button.textContent = faq.q;
            button.onclick = () => handleFaqClick(faq.q, faq.a);
            faqList.appendChild(button);
        });
    };

    // --- Event Handlers ---
    const handleFaqClick = (question, answer) => {
        addMessage('user', question);
        switchScreen('chat-screen');
        setTimeout(() => {
            addMessage('bot', answer);
        }, 800);
    };
    
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage || isLoading) return;

        addMessage('user', userMessage);
        switchScreen('chat-screen');
        messageInput.value = '';

        const botResponse = await getBotResponse(userMessage);
        addMessage('bot', botResponse);
    });

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        themeIconSun.classList.toggle('hidden', isDark);
        themeIconMoon.classList.toggle('hidden', !isDark);
    });

    clearChatBtn.addEventListener('click', () => {
        if(confirm("Sunteți sigur că doriți să ștergeți istoricul conversației?")) {
            messages = [];
            localStorage.removeItem(HISTORY_KEY);
            renderMessages();
            switchScreen('welcome-screen');
        }
    });

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
    });

    // --- Initial Load ---
    setupTheme();
    renderMessages();
    populateFaq();

    // After a short delay, show the chatbot
    setTimeout(() => {
        chatbot.classList.remove('hidden');
    }, 500);
});
