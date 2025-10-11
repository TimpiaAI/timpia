document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Cache ---
    const dom = {
        chatApp: document.getElementById('chat-app'),
        themeToggleButton: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        pages: {
            home: document.getElementById('home-page'),
            chat: document.getElementById('chat-page'),
            help: document.getElementById('help-page'),
        },
        navButtons: {
            home: document.getElementById('nav-home'),
            chat: document.getElementById('nav-chat'),
            help: document.getElementById('nav-help'),
            activeNavIndicator: document.getElementById('active-nav-indicator'),
        },
        greeting: document.getElementById('greeting'),
        questionButtons: document.querySelectorAll('.question-button'),
        chatContainer: document.getElementById('chat-container'),
        chatForm: document.getElementById('chat-form'),
        chatInput: document.getElementById('chat-input'),
        sendButton: document.getElementById('send-button'),
        typingIndicator: document.getElementById('typing-indicator'),
        faqContainer: document.getElementById('faq-container'),
        clearChatButton: document.getElementById('clear-chat'),
    };

    // --- State Management ---
    const state = {
        activePage: 'home',
        sessionId: null,
        messages: [],
        isLoading: false,
        theme: 'light',
    };

    // --- Constants ---
    const WEBHOOK_URL = 'https://n8n-mui5.onrender.com/webhook/timpiachat'; 
    const FAQ_DATA = [
        { q: "Ce soluții de irigații oferiți?", a: "Oferim o gamă completă de soluții, de la sisteme de picurare pentru culturi horticole la pivoți și rampe de irigat pentru culturi extinse. Toate sistemele noastre pot fi integrate cu senzori de umiditate pentru automatizare." },
        { q: "Cum funcționează monitorizarea prin drone?", a: "Dronele noastre echipate cu camere multispectrale survolează culturile și colectează date despre starea de sănătate a plantelor (NDVI). Aceste date sunt procesate de AI pentru a genera hărți de vigoare care indică zonele cu probleme." },
        { q: "Ce este un RAG Chatbot și cum mă ajută?", a: "Este un AI avansat care răspunde folosind STRICT informațiile din documentele și baza de date a companiei. Pentru Genesis Agro, acest lucru înseamnă că poate oferi recomandări de fertilizare sau tratamente exact pe baza specificațiilor produselor și a bunelor practici agricole." },
        { q: "Cât de repede se poate implementa o soluție?", a: "Procesul este rapid. De obicei, un chatbot sau un sistem de monitorizare poate fi funcțional în mai puțin de 2 săptămâni, incluzând aici și perioada de personalizare și antrenare pe datele specifice fermei dumneavoastră." },
    ];
    const GREETINGS = {
        morning: "Bună dimineața",
        afternoon: "Bună ziua",
        evening: "Bună seara",
    };
    const SUGGESTED_QUESTIONS = [
        "Ce preț are monitorizarea pentru 50ha de grâu?",
        "Cum pot optimiza consumul de apă?",
        "Oferiți consultanță pentru fertilizare?",
        "Ce diferențiază Genesis Agro?",
    ];

    // --- Core Functions ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return GREETINGS.morning;
        if (hour < 18) return GREETINGS.afternoon;
        return GREETINGS.evening;
    };

    const updateUIForPage = (pageId) => {
        Object.values(dom.pages).forEach(page => page.classList.remove('active', 'entering-left', 'entering-right', 'exiting-left', 'exiting-right'));

        if (state.activePage !== pageId) {
            const oldPage = dom.pages[state.activePage];
            const newPage = dom.pages[pageId];
            
            const direction = (['home', 'chat', 'help'].indexOf(pageId) > ['home', 'chat', 'help'].indexOf(state.activePage)) ? 'right' : 'left';
            
            if (oldPage) {
                oldPage.classList.add(direction === 'right' ? 'exiting-left' : 'exiting-right');
            }
            if (newPage) {
                newPage.classList.add('active', direction === 'right' ? 'entering-right' : 'entering-left');
            }
        }
        
        state.activePage = pageId;
        updateNavIndicator();
    };
    
    const updateNavIndicator = () => {
        const activeButton = dom.navButtons[state.activePage];
        if (activeButton && dom.navButtons.activeNavIndicator) {
            dom.navButtons.activeNavIndicator.style.left = `${activeButton.offsetLeft}px`;
            dom.navButtons.activeNavIndicator.style.width = `${activeButton.offsetWidth}px`;
        }
    };

    const addMessage = (sender, text) => {
        const message = { id: Date.now() + Math.random(), sender, text };
        state.messages.push(message);
        renderMessages();
        saveHistory();
    };
    
    const renderMessages = () => {
        dom.chatContainer.innerHTML = '';
        state.messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = `message message-${msg.sender}`;
            messageEl.innerHTML = `<div class="message-bubble">${msg.text.replace(/\n/g, '<br>')}</div>`;
            dom.chatContainer.appendChild(messageEl);
        });
        dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;
    };

    const saveHistory = () => {
        try {
            localStorage.setItem(`genesis-chat-history-${state.sessionId}`, JSON.stringify(state.messages));
        } catch(e) { console.error("Could not save history to localStorage", e); }
    };

    const loadHistory = () => {
        try {
            const history = localStorage.getItem(`genesis-chat-history-${state.sessionId}`);
            if (history) {
                state.messages = JSON.parse(history);
                if (state.messages.length > 0) {
                    renderMessages();
                    updateUIForPage('chat');
                }
            }
        } catch(e) { console.error("Could not load history from localStorage", e); }
    };

    const sendMessage = async (text) => {
        if (!text.trim() || state.isLoading) return;

        state.isLoading = true;
        dom.sendButton.disabled = true;
        dom.typingIndicator.style.display = 'flex';

        addMessage('user', text);
        
        try {
            // Simulating API call for demo
            await new Promise(res => setTimeout(res, 1500));
            const botReply = `Am primit mesajul: "${text}". Un consultant vă va contacta în cel mai scurt timp pentru a discuta detaliile.`;
            addMessage('bot', botReply);

        } catch (error) {
            console.error('Webhook error:', error);
            addMessage('bot', 'Ne pare rău, a apărut o eroare. Vă rugăm să reveniți mai târziu.');
        } finally {
            state.isLoading = false;
            dom.sendButton.disabled = false;
            dom.typingIndicator.style.display = 'none';
        }
    };

    const clearConversation = () => {
        state.messages = [];
        try {
            localStorage.removeItem(`genesis-chat-history-${state.sessionId}`);
        } catch (e) { console.error("Could not clear history from localStorage", e); }
        renderMessages();
        updateUIForPage('home');
    };
    
    // --- Theme Management ---
    const applyTheme = (theme) => {
        state.theme = theme;
        dom.chatApp.classList.remove('light', 'dark');
        dom.chatApp.classList.add(theme);
        dom.themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        try {
            localStorage.setItem('genesis-chat-theme', theme);
        } catch(e) { console.error("Could not save theme to localStorage", e); }
    };

    const toggleTheme = () => {
        applyTheme(state.theme === 'light' ? 'dark' : 'light');
    };

    // --- Initialization ---
    const init = () => {
        // Initialize greeting
        dom.greeting.textContent = getGreeting();

        // Populate suggested questions
        const questionsContainer = document.getElementById('question-suggestions');
        questionsContainer.innerHTML = '';
        SUGGESTED_QUESTIONS.forEach(q => {
            const button = document.createElement('button');
            button.className = 'question-button';
            button.textContent = q;
            button.onclick = () => {
                dom.chatInput.value = q;
                sendMessage(q);
                updateUIForPage('chat');
            };
            questionsContainer.appendChild(button);
        });

        // Populate FAQs
        dom.faqContainer.innerHTML = '';
        FAQ_DATA.forEach((faq, index) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            item.innerHTML = `
                <button class="faq-question">
                    <span>${faq.q}</span>
                    <span class="material-symbols-outlined expand-icon">expand_more</span>
                </button>
                <div class="faq-answer">
                    <p>${faq.a}</p>
                </div>
            `;
            dom.faqContainer.appendChild(item);
        });

        // Add event listeners for FAQs
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.parentElement;
                item.classList.toggle('open');
            });
        });

        // Initialize session and load history
        try {
            state.sessionId = localStorage.getItem('genesis-chat-session') || `session_${Date.now()}`;
            localStorage.setItem('genesis-chat-session', state.sessionId);
        } catch(e) { 
            state.sessionId = `session_${Date.now()}`;
            console.error("Could not access localStorage for session", e);
        }
        loadHistory();

        // Initialize theme
        let savedTheme;
        try {
            savedTheme = localStorage.getItem('genesis-chat-theme');
        } catch (e) { console.error("Could not access localStorage for theme", e); }
        
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }
        
        // --- Event Listeners ---
        Object.keys(dom.navButtons).forEach(key => {
            if (key !== 'activeNavIndicator' && dom.navButtons[key]) {
                dom.navButtons[key].addEventListener('click', () => updateUIForPage(key));
            }
        });
        
        dom.themeToggleButton.addEventListener('click', toggleTheme);
        dom.clearChatButton.addEventListener('click', clearConversation);

        dom.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage(dom.chatInput.value);
            dom.chatInput.value = '';
        });

        dom.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                dom.chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        });

        // Initial UI setup
        updateUIForPage(state.messages.length > 0 ? 'chat' : 'home');
        window.addEventListener('resize', updateNavIndicator);
    };

    init();
});
