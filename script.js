/* ==========================================
   KAEL VON VALDERAS - Interactive Features
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initSnowEffect();
    initBGM();
    initMobileMenu();
    initNavigation();
    initPhoneInterface();
    initGallery();
    initScrollAnimations();
    initImageModal();
    updatePhoneTime();
});

/* ==========================================
   Snow Effect
   ========================================== */
function initSnowEffect() {
    const container = document.getElementById('snowContainer');
    const snowflakes = ['❄', '❅', '❆', '✧', '·'];
    
    function createSnowflake() {
        const flake = document.createElement('span');
        flake.className = 'snowflake';
        flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        flake.style.left = Math.random() * 100 + '%';
        flake.style.fontSize = (Math.random() * 10 + 5) + 'px';
        flake.style.animationDuration = (Math.random() * 10 + 10) + 's';
        flake.style.opacity = Math.random() * 0.7 + 0.3;
        
        container.appendChild(flake);
        
        // Remove after animation
        setTimeout(() => {
            flake.remove();
        }, 20000);
    }
    
    // Create initial snowflakes
    for (let i = 0; i < 30; i++) {
        setTimeout(createSnowflake, Math.random() * 5000);
    }
    
    // Continuously create snowflakes
    setInterval(createSnowflake, 500);
}

/* ==========================================
   BGM Control
   ========================================== */
function initBGM() {
    const bgmToggle = document.getElementById('bgmToggle');
    const bgmAudio = document.getElementById('bgmAudio');
    let isPlaying = false;
    
    bgmToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgmAudio.pause();
            bgmToggle.classList.remove('playing');
        } else {
            bgmAudio.play().catch(e => {
                console.log('Audio playback failed:', e);
            });
            bgmToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

/* ==========================================
   Mobile Menu
   ========================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const sideNav = document.getElementById('sideNav');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        sideNav.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const navLinks = sideNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                sideNav.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sideNav.contains(e.target) && 
            !hamburger.contains(e.target) &&
            sideNav.classList.contains('active')) {
            hamburger.classList.remove('active');
            sideNav.classList.remove('active');
        }
    });
}

/* ==========================================
   Navigation
   ========================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Smooth scroll and active state
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================
   Phone Interface - iOS Style
   ========================================== */
function initPhoneInterface() {
    const lockScreen = document.getElementById('lockScreen');
    const homeScreen = document.getElementById('homeScreen');
    const passcodeDots = document.querySelectorAll('.passcode-dot');
    const keypadBtns = document.querySelectorAll('.keypad-btn');
    
    let enteredPin = '';
    const correctPin = '0218'; // Birthday (February 18)
    
    // Keypad functionality
    keypadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const num = btn.dataset.num;
            
            if (!num) return; // Empty button
            
            if (num === 'delete') {
                enteredPin = enteredPin.slice(0, -1);
            } else if (enteredPin.length < 4) {
                enteredPin += num;
                
                // Auto-check when 4 digits entered
                if (enteredPin.length === 4) {
                    setTimeout(() => {
                        if (enteredPin === correctPin) {
                            unlockPhone();
                        } else {
                            shakePasscode();
                            enteredPin = '';
                        }
                        updatePasscodeDots();
                    }, 150);
                }
            }
            
            updatePasscodeDots();
        });
    });
    
    function updatePasscodeDots() {
        passcodeDots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < enteredPin.length);
        });
    }
    
    function shakePasscode() {
        const passcodeArea = document.querySelector('.lock-passcode');
        passcodeArea.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            passcodeArea.style.animation = '';
        }, 500);
    }
    
    function unlockPhone() {
        lockScreen.classList.remove('active');
        homeScreen.classList.add('active');
    }
    
    // Lock button in dock
    const lockBtn = document.getElementById('phoneLockBtn');
    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            hideAllScreens();
            lockScreen.classList.add('active');
            enteredPin = '';
            updatePasscodeDots();
        });
    }
    
    // App icons on home screen
    const appButtons = document.querySelectorAll('.app[data-app]');
    appButtons.forEach(app => {
        app.addEventListener('click', () => {
            const appName = app.dataset.app;
            openApp(appName);
        });
    });
    
    // Back navigation buttons
    const navBackBtns = document.querySelectorAll('.nav-back');
    navBackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const backTo = btn.dataset.back;
            if (backTo === 'home') {
                hideAllScreens();
                homeScreen.classList.add('active');
            } else if (backTo === 'messages') {
                document.getElementById('messageDetail').classList.remove('active');
                document.getElementById('messagesApp').classList.add('active');
            } else if (backTo === 'notes') {
                document.getElementById('noteDetail').classList.remove('active');
                document.getElementById('notesApp').classList.add('active');
            }
        });
    });
    
    // Message threads (new iOS-style class)
    const messageRows = document.querySelectorAll('.message-row');
    messageRows.forEach(row => {
        row.addEventListener('click', () => {
            const threadId = row.dataset.thread;
            openMessageThread(threadId);
        });
    });
    
    // Note rows (new iOS-style class)
    const noteRows = document.querySelectorAll('.note-row');
    noteRows.forEach(note => {
        note.addEventListener('click', () => {
            const noteId = note.dataset.note;
            openNote(noteId);
        });
    });
    
    // Photo thumbnails in phone
    const photoThumbs = document.querySelectorAll('.photo-thumb');
    photoThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const photoSrc = thumb.dataset.photo;
            if (photoSrc) {
                openPhonePhoto(photoSrc);
            }
        });
    });
}

function hideAllScreens() {
    const allScreens = document.querySelectorAll('.iphone-screen .screen');
    allScreens.forEach(screen => screen.classList.remove('active'));
}

function hideAllApps() {
    // Keep for compatibility - now use hideAllScreens
    hideAllScreens();
}

function openApp(appName) {
    hideAllScreens();
    const appElement = document.getElementById(appName + 'App');
    if (appElement) {
        appElement.classList.add('active');
    }
}

function openPhonePhoto(src) {
    // Simple lightbox for phone photos
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    if (modal && modalImg) {
        modalImg.src = src;
        modal.classList.add('active');
    }
}

function openMessageThread(threadId) {
    const messageContent = document.getElementById('messageContent');
    const threadTitle = document.getElementById('threadTitle');
    
    const messages = {
        commander: {
            title: '제국군 부관',
            content: `
                <div class="message-bubble received">
                    <p>사령관님, 다음 작전 일정이 확정되었습니다.</p>
                    <span class="time">어제 21:30</span>
                </div>
                <div class="message-bubble received">
                    <p>에스텔 왕국 동부 전선 공략입니다.</p>
                    <span class="time">어제 21:31</span>
                </div>
                <div class="message-bubble sent">
                    <p>알겠다. 상세 보고서는 내일 아침에 가져와라.</p>
                    <span class="time">어제 21:45</span>
                </div>
                <div class="message-bubble received">
                    <p>알겠습니다. 그리고... 사령관님.</p>
                    <span class="time">어제 21:46</span>
                </div>
                <div class="message-bubble received">
                    <p>왕국 쪽에서 누군가를 찾으시는 건지요? 병사들 사이에서 소문이...</p>
                    <span class="time">어제 21:47</span>
                </div>
                <div class="message-bubble sent">
                    <p>됐다. 나가봐라.</p>
                    <span class="time">어제 21:47</span>
                </div>
            `
        },
        self: {
            title: '나에게 쓴 메시지',
            content: `
                <div class="message-bubble sent">
                    <p>오늘도 에스텔 근방을 수색했다. 흔적이 없다.</p>
                    <span class="time">3일 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>12년이다. 살아있기는 한 건가.</p>
                    <span class="time">3일 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>아니. 살아있어야 한다. 그래야만 한다.</p>
                    <span class="time">3일 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>목걸이를 만졌다. 조잡하지만... 이것만은 버릴 수 없다.</p>
                    <span class="time">2일 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>꿈을 꿨다. 또 그 꿈이다. 네 손을 놓치는 꿈.</p>
                    <span class="time">어제</span>
                </div>
                <div class="message-bubble sent">
                    <p>기다려. 반드시 찾아갈 테니까.</p>
                    <span class="time">어제</span>
                </div>
            `
        },
        past: {
            title: '보내지 못한 편지들',
            content: `
                <div class="message-bubble sent">
                    <p>{{user}}에게,</p>
                    <p>살아있어? 어디 있어? 무사해?</p>
                    <p>... 이런 말밖에 못 쓰겠다.</p>
                    <span class="time">11년 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>오늘 기사가 됐다. 제국 놈들 밑에서.</p>
                    <p>웃기지? 우리 마을을 불태운 놈들의 칼을 든다.</p>
                    <p>하지만 이래야 너를 찾을 힘이 생긴다.</p>
                    <span class="time">9년 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>사령관이 됐다. 붉은 늑대라고 부른다.</p>
                    <p>피를 많이 봤다. 내 손은 이미 더럽혀졌어.</p>
                    <p>그래도 괜찮아. 너만 찾을 수 있다면.</p>
                    <span class="time">5년 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>에스텔을 공격하라는 명령이 내려왔다.</p>
                    <p>네가 있을지도 모르는 그곳을.</p>
                    <p>이게 기회인지, 저주인지 모르겠다.</p>
                    <span class="time">1년 전</span>
                </div>
                <div class="message-bubble sent">
                    <p>간다. 반드시 널 찾아낸다.</p>
                    <p>그리고 이 전쟁을 끝낸다.</p>
                    <p>우리... 다시 만날 수 있을까?</p>
                    <span class="time">1개월 전</span>
                </div>
            `
        }
    };
    
    if (messages[threadId]) {
        threadTitle.textContent = messages[threadId].title;
        messageContent.innerHTML = messages[threadId].content;
        
        document.getElementById('messagesApp').classList.remove('active');
        document.getElementById('messageDetail').classList.add('active');
    }
}

function openNote(noteId) {
    const noteContent = document.getElementById('noteContent');
    const noteTitle = document.getElementById('noteTitle');
    
    const notes = {
        promise: {
            title: '백년가약',
            content: `
                <p>12년 전, 빈민가의 허름한 다리 위에서.</p>
                <p>네가 조잡한 나무 목걸이를 내 목에 걸어줬지.</p>
                <p>"이거 내가 만든 거야. 부적이래. 지켜줄 거야."</p>
                <p>그때 난 웃었다. 그리고 말했지.</p>
                <p>"그래. 그럼 나도 너 지켜줄게. 백년이든 천년이든."</p>
                <p>...</p>
                <p>바보 같은 약속이었다.</p>
                <p>그 약속을 지키지 못했으니까.</p>
                <p>하지만 아직 끝난 건 아니다.</p>
                <p>널 찾으면... 그때 다시 말할 수 있을까.</p>
                <p>이번엔 정말로 지키겠다고.</p>
            `
        },
        nightmare: {
            title: '매일 밤 꾸는 꿈',
            content: `
                <p>같은 꿈이다. 매일 밤.</p>
                <p>마을이 불타고 있다.</p>
                <p>사람들의 비명. 아이들의 울음소리.</p>
                <p>그 속에서 네 손을 잡고 달렸다.</p>
                <p>하지만 제국군 병사들이 따라왔고,</p>
                <p>나는 선택해야 했다.</p>
                <p>네가 도망칠 시간을 벌기 위해,</p>
                <p>미끼가 되어 놈들 앞으로 뛰어들었다.</p>
                <p>그 순간, 네 손을 놓쳤다.</p>
                <p>네가 "카엘!" 하고 부르는 소리가</p>
                <p>아직도 귓가에 맴돈다.</p>
                <p>...</p>
                <p>그때로 돌아갈 수 있다면,</p>
                <p>이번엔 절대 놓지 않을 텐데.</p>
            `
        },
        necklace: {
            title: '목걸이',
            content: `
                <p>제복 안주머니에 항상 넣고 다닌다.</p>
                <p>조잡하게 깎은 나무 조각.</p>
                <p>끈도 낡아서 거의 끊어질 것 같다.</p>
                <p>하지만 이것만큼은 버릴 수 없다.</p>
                <p>네가 만들어준 거니까.</p>
                <p>세상에서 유일하게 '카엘 리드'였던 시절의 증거.</p>
                <p>전투 전에는 꼭 이걸 만진다.</p>
                <p>부적이라고 했지?</p>
                <p>덕분에 살아남았다. 여기까지 왔다.</p>
                <p>이제 곧 널 찾을 수 있을 거야.</p>
            `
        },
        plan: {
            title: '계획',
            content: `
                <p>에스텔을 공략하라는 명령.</p>
                <p>황제는 이 전쟁으로 대륙 통일을 원한다.</p>
                <p>하지만 나는 다른 목적이 있다.</p>
                <p>1. {{user}}를 찾는다.</p>
                <p>2. 몰래 빼돌린다.</p>
                <p>3. 안전한 곳에 숨긴다.</p>
                <p>4. 전쟁을 끝낸다. 어떻게든.</p>
                <p>5. 그 후에...</p>
                <p>...</p>
                <p>그 후에 어떻게 할지는 모르겠다.</p>
                <p>{{user}}가 원하는 대로 해야지.</p>
                <p>내가 괴물이 됐다는 걸 알면,</p>
                <p>날 증오할지도 모른다.</p>
                <p>그래도 괜찮아.</p>
                <p>살아있다는 것만 확인하면.</p>
            `
        },
        pain: {
            title: '노예 병사 시절',
            content: `
                <p>제국으로 끌려왔을 때,</p>
                <p>나이는 15살이었다.</p>
                <p>노예 병사. 전쟁의 소모품.</p>
                <p>죽지 않으려면 싸워야 했고,</p>
                <p>살아남으려면 죽여야 했다.</p>
                <p>처음 사람을 벤 날,</p>
                <p>밤새 토했다.</p>
                <p>두 번째부터는 아무것도 느끼지 못했다.</p>
                <p>...</p>
                <p>그때마다 목걸이를 만졌다.</p>
                <p>'살아야 한다. 돌아가야 한다.'</p>
                <p>그 생각 하나로 버텼다.</p>
                <p>황제 눈에 띄어 기사가 됐을 때,</p>
                <p>기쁘지 않았다.</p>
                <p>다만 힘이 생겼다는 것에 안도했을 뿐.</p>
                <p>널 찾을 힘이.</p>
            `
        }
    };
    
    if (notes[noteId]) {
        noteTitle.textContent = notes[noteId].title;
        noteContent.innerHTML = notes[noteId].content;
        
        document.getElementById('notesApp').classList.remove('active');
        document.getElementById('noteDetail').classList.add('active');
    }
}

function updatePhoneTime() {
    const lockTime = document.getElementById('lockTime');
    const lockDate = document.getElementById('lockDate');
    const statusTime = document.getElementById('statusTime');
    
    function update() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        
        // Update lock screen time
        if (lockTime) lockTime.textContent = timeStr;
        
        // Update status bar time
        if (statusTime) statusTime.textContent = timeStr;
        
        // Update lock screen date
        if (lockDate) {
            const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
            const month = now.getMonth() + 1;
            const date = now.getDate();
            const day = days[now.getDay()];
            lockDate.textContent = `${month}월 ${date}일 ${day}`;
        }
    }
    
    update();
    setInterval(update, 1000);
}

// Add shake animation to CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

/* ==========================================
   Gallery
   ========================================== */
function initGallery() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const sfwGallery = document.getElementById('sfwGallery');
    const nsfwGallery = document.getElementById('nsfwGallery');
    const nsfwOverlay = document.getElementById('nsfwOverlay');
    const nsfwContent = document.getElementById('nsfwContent');
    const nsfwConfirm = document.getElementById('nsfwConfirm');
    const nsfwCancel = document.getElementById('nsfwCancel');
    
    let nsfwVerified = false;
    
    // Load gallery images
    loadGalleryImages();
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabType = tab.dataset.tab;
            if (tabType === 'sfw') {
                sfwGallery.classList.add('active');
                nsfwGallery.classList.remove('active');
            } else {
                sfwGallery.classList.remove('active');
                nsfwGallery.classList.add('active');
            }
        });
    });
    
    // NSFW verification
    nsfwConfirm.addEventListener('click', () => {
        nsfwVerified = true;
        nsfwOverlay.style.display = 'none';
        nsfwContent.style.display = 'grid';
    });
    
    nsfwCancel.addEventListener('click', () => {
        // Switch back to SFW
        tabs.forEach(t => t.classList.remove('active'));
        tabs[0].classList.add('active');
        sfwGallery.classList.add('active');
        nsfwGallery.classList.remove('active');
    });
}

// Gallery images configuration
// 이미지를 추가하려면 아래 배열에 파일명을 추가하세요
const GALLERY_CONFIG = {
    // SFW (일반) 이미지들 - images/sfw/ 폴더에 넣으세요
    sfw: [
        // 예시: 'image1.png', 'image2.jpg', 'image3.webp'
        // 현재는 썸네일만 포함
    ],
    // NSFW (성인) 이미지들 - images/nsfw/ 폴더에 넣으세요  
    nsfw: [
        // 예시: 'nsfw1.png', 'nsfw2.jpg'
    ]
};

function loadGalleryImages() {
    const sfwGallery = document.getElementById('sfwGallery');
    const nsfwContent = document.getElementById('nsfwContent');
    
    // 기본 썸네일은 이미 HTML에 포함되어 있음
    
    // SFW 이미지 로드
    GALLERY_CONFIG.sfw.forEach(filename => {
        const item = createGalleryItem(`images/sfw/${filename}`);
        sfwGallery.appendChild(item);
    });
    
    // NSFW 이미지 로드
    GALLERY_CONFIG.nsfw.forEach(filename => {
        const item = createGalleryItem(`images/nsfw/${filename}`);
        nsfwContent.appendChild(item);
    });
    
    // NSFW 갤러리가 비어있으면 안내 메시지 표시
    if (GALLERY_CONFIG.nsfw.length === 0) {
        const placeholder = document.createElement('p');
        placeholder.className = 'gallery-placeholder';
        placeholder.style.cssText = 'grid-column: 1/-1; text-align: center; color: #666; padding: 40px; font-style: italic;';
        placeholder.textContent = 'NSFW 이미지가 없습니다. images/nsfw/ 폴더에 이미지를 추가하고 GALLERY_CONFIG.nsfw 배열에 파일명을 등록하세요.';
        nsfwContent.appendChild(placeholder);
    }
}

function createGalleryItem(src) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Gallery Image';
    img.loading = 'lazy';
    img.onerror = function() {
        this.parentElement.style.display = 'none';
    };
    
    div.appendChild(img);
    return div;
}

/* ==========================================
   Scroll Animations
   ========================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.story-card, .detail-block, .greeting-text, .stage'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${(index % 5) * 0.1}s`;
        observer.observe(el);
    });
}

/* ==========================================
   Image Modal
   ========================================== */
function initImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Click on gallery items
    document.addEventListener('click', (e) => {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            const img = galleryItem.querySelector('img');
            if (img) {
                // Get all images in the current gallery
                const gallery = galleryItem.closest('.gallery-grid');
                currentImages = Array.from(gallery.querySelectorAll('.gallery-item img'));
                currentIndex = currentImages.indexOf(img);
                
                openModal(img.src);
            }
        }
    });
    
    function openModal(src) {
        modalImage.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrev() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            modalImage.src = currentImages[currentIndex].src;
        }
    }
    
    function showNext() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            modalImage.src = currentImages[currentIndex].src;
        }
    }
    
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrev);
    modalNext.addEventListener('click', showNext);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

/* ==========================================
   Parallax Effects (Optional Enhancement)
   ========================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

/* ==========================================
   Console Easter Egg
   ========================================== */
console.log(`
%c⚔ KAEL VON VALDERAS ⚔
%c전장의 붉은 늑대

"살아서 돌아가 그 아이를 찾겠다는 일념 하나로, 괴물이 되었다."

비밀번호 힌트: 그의 생일

`, 
'color: #C9A227; font-size: 20px; font-weight: bold;',
'color: #8B0000; font-size: 12px;'
);
