document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        activeScreen: 'home-screen',
        theme: 'light',
        messages: [],
        isLoading: false,
        sessionId: null,
    };

    // --- DOM ELEMENT SELECTORS ---
    const elements = {
        chatContainer: document.getElementById('chat-container'),
        screenContainer: document.getElementById('screen-container'),
        screens: document.querySelectorAll('.screen'),
        navButtons: document.querySelectorAll('.nav-button'),
        themeToggle: document.getElementById('theme-toggle'),
        resetChatButton: document.getElementById('reset-chat'),
        questionChips: document.querySelectorAll('.question-chip'),
        messageList: document.getElementById('message-list'),
        chatForm: document.getElementById('chat-form'),
        messageInput: document.getElementById('message-input'),
        sendButton: document.getElementById('send-button'),
        typingIndicator: document.getElementById('typing-indicator'),
        accordionItems: document.querySelectorAll('.accordion-item'),
    };

    // --- WEBHOOK CONFIG ---
    const WEBHOOK_URL = "https://n8n-mui5.onrender.com/webhook/timpiachat";
    const API_KEY = "varza";

    // --- ADVANCED HOME SCREEN ENHANCEMENTS ---
    // Agriculture-themed tips
    const tips = [
        "Verifică prognoza meteo înainte de a planifica irigarea.",
        "Folosește rotația culturilor pentru a menține sănătatea solului.",
        "Monitorizează umiditatea solului pentru a preveni supra-irigarea.",
        "Aplică îngrășăminte în funcție de analizele solului.",
        "Utilizează tehnologii moderne pentru a crește randamentul culturilor."
    ];
    // Suggested questions with icons
    const suggestedQuestions = [
        { icon: 'science', text: 'Ce servicii de consultanță oferiți?', question: 'Ce servicii de consultanță oferiți?' },
        { icon: 'analytics', text: 'Care sunt prețurile pentru analiza solului?', question: 'Care sunt prețurile pentru analiza solului?' },
        { icon: 'support_agent', text: 'Vreau să vorbesc cu un expert.', question: 'Vreau să vorbesc cu un expert.' },
        { icon: 'eco', text: 'Cum pot îmbunătăți fertilitatea solului?', question: 'Cum pot îmbunătăți fertilitatea solului?' },
        { icon: 'water_drop', text: 'Sfaturi pentru irigare eficientă', question: 'Sfaturi pentru irigare eficientă' }
    ];

    // Weather API (Open-Meteo, no key required)
    async function updateWeatherWidget() {
        const weatherInfo = document.getElementById('weather-info');
        if (!weatherInfo) return;
        weatherInfo.textContent = 'Vremea: ...';
        try {
            // Use IP geolocation for city (fallback: Bucharest)
            let lat = 44.4268, lon = 26.1025, city = 'București';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    lat = pos.coords.latitude;
                    lon = pos.coords.longitude;
                    await fetchWeather(lat, lon, weatherInfo);
                }, async () => {
                    await fetchWeather(lat, lon, weatherInfo, city);
                }, {timeout: 4000});
            } else {
                await fetchWeather(lat, lon, weatherInfo, city);
            }
        } catch {
            weatherInfo.textContent = 'Vremea indisponibilă';
        }
    }
    async function fetchWeather(lat, lon, weatherInfo, cityName) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;
        const icon = getWeatherIcon(code);
        weatherInfo.innerHTML = `${icon} ${Math.round(temp)}°C${cityName ? ' - ' + cityName : ''}`;
    }
    function getWeatherIcon(code) {
        // Simple mapping for demo
        if ([0].includes(code)) return '☀️';
        if ([1,2,3].includes(code)) return '⛅';
        if ([45,48].includes(code)) return '🌫️';
        if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌧️';
        if ([71,73,75,77,85,86].includes(code)) return '❄️';
        if ([95,96,99].includes(code)) return '⛈️';
        return '🌡️';
    }

    function updateTipOfTheDay() {
        const tipEl = document.getElementById('tip-of-the-day');
        if (!tipEl) return;
        // Rotate tip daily
        const day = new Date().getDate();
        const tip = tips[day % tips.length];
        tipEl.textContent = `Tipul zilei: ${tip}`;
    }

    function renderSuggestedQuestions() {
        const container = document.getElementById('suggested-questions');
        if (!container) return;
        container.innerHTML = '';
        suggestedQuestions.forEach(q => {
            const btn = document.createElement('button');
            btn.className = 'question-chip';
            btn.setAttribute('data-question', q.question);
            btn.innerHTML = `<span class="material-symbols-outlined">${q.icon}</span><span>${q.text}</span>`;
            btn.addEventListener('click', () => {
                elements.messageInput.value = q.question;
                navigateTo('chat-screen');
                setTimeout(() => handleSendMessage(new Event('submit')), 100);
            });
            container.appendChild(btn);
        });
    }

    function setupQuickActions() {
        const startChat = document.getElementById('start-chat-action');
        const contactExpert = document.getElementById('contact-expert-action');
        const viewHistory = document.getElementById('view-history-action');
        if (startChat) {
            startChat.onclick = () => {
                elements.messageInput.value = '';
                navigateTo('chat-screen');
                elements.messageInput.focus();
            };
        }
        if (contactExpert) {
            contactExpert.onclick = () => {
                elements.messageInput.value = 'Vreau să vorbesc cu un expert.';
                navigateTo('chat-screen');
                setTimeout(() => handleSendMessage(new Event('submit')), 100);
            };
        }
        if (viewHistory) {
            viewHistory.onclick = () => {
                // Scroll to top of chat and show history
                navigateTo('chat-screen');
                setTimeout(() => elements.messageList.scrollTop = 0, 200);
            };
        }
    }

    // --- INITIALIZATION ---
    function init() {
        setupEventListeners();
        loadTheme();
        loadSession();
        updateHomeScreen();
        autoResizeTextarea();
    }

    // --- THEME MANAGEMENT ---
    function loadTheme() {
        try {
            const savedTheme = localStorage.getItem('genesis-agro-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            state.theme = savedTheme || (prefersDark ? 'dark' : 'light');
            applyTheme();
        } catch (e) {
            console.warn("Could not access localStorage. Using default theme.");
            state.theme = 'light';
            applyTheme();
        }
    }

    function applyTheme() {
        document.body.dataset.theme = state.theme;
        if (elements.chatContainer) {
            elements.chatContainer.style.opacity = '1'; // Show after theme is applied to prevent flicker
        }
    }

    function toggleTheme() {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        try {
            localStorage.setItem('genesis-agro-theme', state.theme);
        } catch (e) {
            console.warn("Could not save theme to localStorage.");
        }
        applyTheme();
    }

    // --- SESSION & HISTORY MANAGEMENT ---
    function loadSession() {
        try {
            const savedHistory = localStorage.getItem('genesis-agro-history');
            if (savedHistory) {
                state.messages = JSON.parse(savedHistory);
                renderMessages();
                if (state.messages.length > 0) {
                    navigateTo('chat-screen', true);
                }
            }

            let storedSessionId = localStorage.getItem('genesis-agro-session');
            if (!storedSessionId) {
                storedSessionId = crypto.randomUUID();
                localStorage.setItem('genesis-agro-session', storedSessionId);
            }
            state.sessionId = storedSessionId;
        } catch (e) {
            console.warn("Could not access localStorage for session management.");
            state.sessionId = crypto.randomUUID();
        }
    }

    function saveHistory() {
        try {
            localStorage.setItem('genesis-agro-history', JSON.stringify(state.messages));
        } catch (e) {
            console.warn("Could not save chat history to localStorage.");
        }
    }

    function resetConversation() {
        state.messages = [];
        state.sessionId = crypto.randomUUID();
        try {
            localStorage.removeItem('genesis-agro-history');
            localStorage.setItem('genesis-agro-session', state.sessionId);
        } catch (e) {
            console.warn("Could not clear localStorage.");
        }
        elements.messageList.innerHTML = '';
        navigateTo('home-screen');
    }

    // --- UI & NAVIGATION ---
    function navigateTo(screenId, isSilent = false) {
        if (state.activeScreen === screenId && !isSilent) return;

        state.activeScreen = screenId;
        elements.screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
        elements.navButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.screen === screenId);
        });
    }

    function autoResizeTextarea() {
        const textarea = elements.messageInput;
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        });
    }

    // --- AVATAR IMAGES ---
    const BOT_AVATAR_URL = 'https://i.imgur.com/pUTGdjM.png';
    const USER_AVATAR_URL = 'https://ui-avatars.com/api/?name=User&background=cccccc&color=222222&size=64';
    const POWERED_BY_LOGO = 'https://i.imgur.com/5wZ4s2Y.png';
    const POWERED_BY_LINK = 'https://timpia.ro';

    // --- CHAT LOGIC ---
    function renderMessages() {
        elements.messageList.innerHTML = '';
        state.messages.forEach(msg => {
            appendMessage(msg.sender, msg.text, false, msg.timestamp);
        });
        scrollToBottom();
    }

    function appendMessage(sender, text, animate = true, timestamp = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        // Timestamp
        const msgTime = timestamp ? new Date(timestamp) : new Date();
        const timeStr = msgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // Bubble
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.style.overflow = 'hidden';
        bubble.style.transition = 'max-height 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.2s';
        // View more logic
        const MAX_LENGTH = 350;
        let isLong = text.length > MAX_LENGTH;
        let collapsed = true;
        let fullHtml = formatMarkdown(text);
        let shortHtml = formatMarkdown(text.slice(0, MAX_LENGTH)) + '...';
        let fullHeight = null;
        let shortHeight = null;
        if (isLong) {
            bubble.innerHTML = shortHtml;
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.className = 'view-more-btn';
            viewMoreBtn.textContent = 'Vezi mai mult';
            viewMoreBtn.setAttribute('aria-expanded', 'false');
            viewMoreBtn.onclick = function() {
                // Animate bubble height
                bubble.innerHTML = collapsed ? fullHtml : shortHtml;
                bubble.appendChild(viewMoreBtn);
                bubble.style.maxHeight = '';
                setTimeout(() => {
                    const h = bubble.scrollHeight;
                    bubble.style.maxHeight = h + 'px';
                }, 10);
                viewMoreBtn.textContent = collapsed ? 'Vezi mai puțin' : 'Vezi mai mult';
                viewMoreBtn.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
                viewMoreBtn.classList.toggle('expanded', collapsed);
                collapsed = !collapsed;
            };
            bubble.appendChild(viewMoreBtn);
            // Initial animation state
            setTimeout(() => {
                bubble.style.maxHeight = bubble.scrollHeight + 'px';
            }, 10);
        } else {
            bubble.innerHTML = fullHtml;
        }
        // Avatar (always left)
        let avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.alt = sender === 'bot' ? 'Timpia AI Bot' : 'Tu';
        avatar.src = sender === 'bot' ? BOT_AVATAR_URL : USER_AVATAR_URL;
        // Timestamp element
        const timeEl = document.createElement('div');
        timeEl.className = 'message-timestamp';
        timeEl.textContent = timeStr;
        // Structure: avatar | bubble | timestamp
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        messageDiv.appendChild(timeEl);
        if (!animate) {
            messageDiv.style.animation = 'none';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'none';
        }
        elements.messageList.appendChild(messageDiv);
        scrollToBottom();
    }

    // Update all Genesis Agro logo images to use the AI avatar
    function updateGenesisAgroLogos() {
        const logoImgs = document.querySelectorAll('img.logo, img.logo.large');
        logoImgs.forEach(img => {
            img.src = BOT_AVATAR_URL;
            img.alt = 'Genesis Agro / Timpia AI Logo';
        });
    }
    document.addEventListener('DOMContentLoaded', updateGenesisAgroLogos);

    // --- MARKDOWN FORMATTING ---
    function formatMarkdown(text) {
        // Headings (###, ##, #)
        text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*)$/gm, '<h1>$1</h1>');
        // Blockquotes
        text = text.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
        // Images ![alt](url)
        text = text.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="md-img" loading="lazy">');
        // Links [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="md-link">$1</a>');
        // YouTube embeds (simple): [!yt](https://youtube.com/watch?v=...)
        text = text.replace(/\[!yt\]\((https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]+))\)/g, '<iframe class="md-yt" src="https://www.youtube.com/embed/$3" frameborder="0" allowfullscreen loading="lazy"></iframe>');
        // Code blocks ```code```
        text = text.replace(/```([\s\S]*?)```/g, '<pre class="md-code">$1</pre>');
        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        // Bold/italic
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // New lines
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    // Helper for user initials
    function getUserInitials() {
        const name = localStorage.getItem('genesis-agro-username') || '';
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    }

    // --- PATCH: Store timestamp on send ---
    async function handleSendMessage(event) {
        if (event) event.preventDefault();
        const messageText = elements.messageInput.value.trim();
        if (!messageText || state.isLoading) return;
        state.isLoading = true;
        elements.sendButton.disabled = true;
        const now = new Date().toISOString();
        appendMessage('user', messageText, true, now);
        state.messages.push({ sender: 'user', text: messageText, timestamp: now });
        saveHistory();
        elements.messageInput.value = '';
        elements.messageInput.style.height = 'auto';
        showTypingIndicator(true);
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
                body: JSON.stringify({
                    message: messageText,
                    sessionId: state.sessionId,
                }),
            });
            if (!response.ok) {
                throw new Error(`Server returned an error: ${response.status}`);
            }
            const data = await response.json();
            const botReply = data.reply || "A apărut o eroare. Vă rugăm să reveniți mai târziu.";
            const botTime = new Date().toISOString();
            appendMessage('bot', botReply, true, botTime);
            state.messages.push({ sender: 'bot', text: botReply, timestamp: botTime });
            saveHistory();
        } catch (error) {
            console.error('Webhook Error:', error);
            const errorMessage = "Ne pare rău, a apărut o problemă tehnică. Vă rugăm să încercați din nou.";
            const botTime = new Date().toISOString();
            appendMessage('bot', errorMessage, true, botTime);
            state.messages.push({ sender: 'bot', text: errorMessage, timestamp: botTime });
            saveHistory();
        } finally {
            showTypingIndicator(false);
            state.isLoading = false;
            elements.sendButton.disabled = false;
        }
    }

    // --- POWERED BY TIMPIA ---
    function renderPoweredBy() {
        let powered = document.getElementById('powered-by-timpia');
        if (!powered) {
            powered = document.createElement('div');
            powered.id = 'powered-by-timpia';
            powered.innerHTML = `<a href="${POWERED_BY_LINK}" target="_blank" rel="noopener" class="powered-link"><img src="${POWERED_BY_LOGO}" alt="Timpia Logo" class="powered-logo"/> Powered by timpia ai</a>`;
            powered.className = 'powered-by-timpia';
            elements.chatContainer.appendChild(powered);
        }
    }
    // Call after DOMContentLoaded
    renderPoweredBy();
    
    function showTypingIndicator(show) {
        elements.typingIndicator.classList.toggle('hidden', !show);
        if (show) scrollToBottom();
    }
    
    function scrollToBottom() {
        elements.messageList.scrollTop = elements.messageList.scrollHeight;
    }

    // --- PERSONALIZATION ---
    // function updateGreeting() { ... } // REMOVED

    // --- ENHANCED HOME INIT ---
    function updateHomeScreen() {
        updateTipOfTheDay();
        updateWeatherWidget();
        renderSuggestedQuestions();
        setupQuickActions();
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        elements.navButtons.forEach(button => {
            button.addEventListener('click', () => navigateTo(button.dataset.screen));
        });

        elements.themeToggle.addEventListener('click', toggleTheme);
        elements.resetChatButton.addEventListener('click', resetConversation);

        elements.chatForm.addEventListener('submit', handleSendMessage);
        elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                elements.chatForm.requestSubmit();
            }
        });

        elements.questionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.dataset.question;
                elements.messageInput.value = question;
                navigateTo('chat-screen');
                // Use a small timeout to allow the screen transition to start
                setTimeout(() => handleSendMessage(new Event('submit')), 100);
            });
        });

        elements.accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                elements.accordionItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- RUN INITIALIZATION ---
    init();

    // Connect hero chat form to main chat (MOVED INSIDE MAIN DOMContentLoaded)
    const heroForm = document.querySelector('.hero-chat-form');
    const heroInput = document.querySelector('.hero-chat-input');
    if (heroForm && heroInput) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = heroInput.value.trim();
            if (!msg) return;
            // Switch to chat screen
            navigateTo('chat-screen');
            setTimeout(() => {
                if (elements.messageInput && elements.chatForm) {
                    elements.messageInput.value = msg;
                    elements.messageInput.focus();
                    elements.chatForm.requestSubmit();
                }
                heroInput.value = '';
            }, 300);
        });
    }

    // --- TEST EMBED BUTTON ---
    const testBtn = document.getElementById('test-embed-btn');
    if (testBtn) {
        testBtn.addEventListener('click', function() {
            const imgUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';
            const embedMsg = 'Acesta este un embed de imagine:\n\n![Peisaj Unsplash](' + imgUrl + ')';
            const now = new Date().toISOString();
            appendMessage('bot', embedMsg, true, now);
        });
    }

    // --- ENHANCED FAQ ACCORDION INTERACTIVITY ---
    document.addEventListener('DOMContentLoaded', function() {
        const faqHeaders = document.querySelectorAll('.accordion-header');
        faqHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const item = header.closest('.accordion-item');
                const expanded = header.getAttribute('aria-expanded') === 'true';
                // Close all
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('open');
                    const btn = i.querySelector('.accordion-header');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                // Open if not already
                if (!expanded) {
                    item.classList.add('open');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
            // Keyboard accessibility
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        });
    });
});
