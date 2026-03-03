/**
 * D-Clone Tracker Integration
 * Data courtesy of diablo2.io API
 */

window.DCloneTracker = (function () {
    // Config
    // Use Cloudflare CORS Proxy to bypass Error 1015 / CORS issues
    const API_URL = 'https://d-clone.tomcorn76.workers.dev/';
    const POLL_INTERVAL_MS = 65000; // 65 seconds (must be >= 60s as per API rules)

    // State
    let isInitialized = false;
    let pollTimer = null;
    let nextPollTime = 0;
    let countdownTimer = null;
    let lastKnownProgress = { 1: 0, 2: 0, 3: 0 }; // track by region ID
    let hasAlertedForCurrentHighStage = false;

    // Elements
    let selectLadder, selectHc, selectVer, toggleNotify, statusBox;
    let regionCards = {};

    // Audio Context (created on user interaction)
    let audioCtx = null;

    const progressMessages = [
        "1/6: Terror gazes upon Sanctuary (準備中...)",
        "2/6: Terror approaches Sanctuary (喬丹開始賣出)",
        "3/6: Terror begins to form within Sanctuary (喬丹繼續賣出)",
        "4/6: Terror spreads across Sanctuary (大量喬丹賣出)",
        "5/6: Terror is about to be unleashed upon Sanctuary (即將生狗，請開房等待！)",
        "6/6: Diablo has invaded Sanctuary (已經生狗！)"
    ];

    function init() {
        if (isInitialized) return;

        selectLadder = document.getElementById('dclone-ladder');
        selectHc = document.getElementById('dclone-hc');
        selectVer = document.getElementById('dclone-ver'); /* Added Version Filter */
        toggleNotify = document.getElementById('dclone-notify');
        statusBox = document.getElementById('dclone-status');

        regionCards[1] = document.getElementById('region-1'); // Americas
        regionCards[2] = document.getElementById('region-2'); // Europe
        regionCards[3] = document.getElementById('region-3'); // Asia

        if (!selectLadder || !selectHc || !selectVer || !toggleNotify) return;

        // Event Listeners
        selectLadder.addEventListener('change', handleFilterChange);
        selectHc.addEventListener('change', handleFilterChange);
        selectVer.addEventListener('change', handleFilterChange); /* Added Version Filter Event */
        toggleNotify.addEventListener('change', handleNotifyToggle);

        isInitialized = true;

        // Initial fetch
        fetchData();
    }

    function handleFilterChange() {
        // Reset known progress so we don't alert incorrectly when switching modes
        lastKnownProgress = { 1: 0, 2: 0, 3: 0 };
        hasAlertedForCurrentHighStage = false;

        // Fetch new data immediately when filter changes
        fetchData();
    }

    function handleNotifyToggle() {
        if (toggleNotify.checked) {
            // User opted in, we can initialize AudioContext
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            startPolling();
            showMessage(`已開啟自動更新 (每 65 秒) 且啟用聲音提醒功能。`);

            // Re-check current state immediately for alerts
            checkAndAlert();
        } else {
            stopPolling();
            showMessage(`自動更新與通知已關閉。`);
            statusBox.innerHTML = '';
            statusBox.classList.add('hidden');
        }
    }

    function startPolling() {
        if (pollTimer) clearInterval(pollTimer);
        if (countdownTimer) clearInterval(countdownTimer);

        // Setup initial next poll time
        nextPollTime = Date.now() + POLL_INTERVAL_MS;
        updateCountdownDisplay();

        pollTimer = setInterval(() => {
            fetchData();
            nextPollTime = Date.now() + POLL_INTERVAL_MS;
        }, POLL_INTERVAL_MS);

        countdownTimer = setInterval(updateCountdownDisplay, 1000);
    }

    function stopPolling() {
        if (pollTimer) clearInterval(pollTimer);
        if (countdownTimer) clearInterval(countdownTimer);
        pollTimer = null;
        countdownTimer = null;
    }

    function updateCountdownDisplay() {
        if (!toggleNotify.checked) return;

        const remaining = Math.max(0, Math.floor((nextPollTime - Date.now()) / 1000));
        showMessage(`下次資料更新倒數: ${remaining} 秒`);
    }

    function showMessage(msg) {
        if (!statusBox) return;
        statusBox.textContent = `ℹ️ ${msg}`;
        statusBox.classList.remove('hidden');
    }

    async function fetchData() {
        const ladderParam = selectLadder.value;
        const hcParam = selectHc.value;
        const verParam = selectVer.value; /* Grab version parameter */

        // We don't send region param so we get all 3 regions at once
        const url = `${API_URL}?ladder=${ladderParam}&hc=${hcParam}&ver=${verParam}`;

        regionCards[1].querySelector('.region-msg').textContent = "載入中...";
        regionCards[2].querySelector('.region-msg').textContent = "載入中...";
        regionCards[3].querySelector('.region-msg').textContent = "載入中...";

        try {
            console.log(`[D-Clone] Fetching data from: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                // Handle specific HTTP errors, especially 429 Too Many Requests (Cloudflare 1015)
                if (response.status === 429 || response.status === 403) {
                    throw new Error("RATE_LIMIT");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Expected format is an array of objects
            if (Array.isArray(data)) {
                updateUI(data);
                if (toggleNotify.checked) {
                    checkAndAlert(data);
                }
            } else {
                throw new Error("Invalid format received from API");
            }

        } catch (error) {
            console.error("[D-Clone Tracker Error]", error);

            let errorMsg = "❌ 無法取得最新資料。API可能暫時無法連線。";
            if (error.message === "RATE_LIMIT") {
                errorMsg = "⚠️ 請求過於頻繁 (Error 1015)。請稍後再試。";
                showMessage(`目前遭到網站阻擋 (Error 1015)。請等待一陣子後再試。`);
            } else {
                showMessage(`API 連線錯誤，系統將稍後自動重試。`);
            }

            regionCards[1].querySelector('.region-msg').textContent = errorMsg;
            regionCards[2].querySelector('.region-msg').textContent = errorMsg;
            regionCards[3].querySelector('.region-msg').textContent = errorMsg;
        }
    }

    function updateUI(dataList) {
        // Reset classes
        [1, 2, 3].forEach(id => {
            const card = regionCards[id];
            card.classList.remove('progress-1', 'progress-2', 'progress-3', 'progress-4', 'progress-5', 'progress-6');
            card.querySelector('.val').textContent = '--';
            card.querySelector('.progress-fill').style.width = '0%';
        });

        dataList.forEach(entry => {
            const regionId = parseInt(entry.region);
            const progress = parseInt(entry.progress);

            // Store for background logic
            lastKnownProgress[regionId] = progress;

            if (regionCards[regionId]) {
                const card = regionCards[regionId];
                const msgBox = card.querySelector('.region-msg');
                const valBox = card.querySelector('.val');
                const fillBox = card.querySelector('.progress-fill');

                // Update Progress Text & Bar
                valBox.textContent = progress;
                fillBox.style.width = `${(progress / 6) * 100}%`;

                // Add specific color class
                card.classList.add(`progress-${progress}`);

                // Update Message text
                msgBox.textContent = progressMessages[progress - 1] || "未知的進度狀態";
                if (progress >= 5) {
                    msgBox.style.color = '#ff4444';
                    msgBox.style.fontWeight = 'bold';
                } else if (progress >= 3) {
                    msgBox.style.color = '#ff9800';
                    msgBox.style.fontWeight = 'normal';
                } else {
                    msgBox.style.color = 'var(--text-secondary)';
                    msgBox.style.fontWeight = 'normal';
                }
            }
        });
    }

    function checkAndAlert() {
        let shouldAlert = false;

        // Scan regions for high progress (5 or 6)
        for (let regionId in lastKnownProgress) {
            if (lastKnownProgress[regionId] >= 5) {
                shouldAlert = true;
                break;
            }
        }

        if (shouldAlert && !hasAlertedForCurrentHighStage) {
            playBeepSound();
            hasAlertedForCurrentHighStage = true; // Prevents spamming beep every 65s while it stays at 5/6

            // Also flash the tab if we are not on the D-Clone tab currently
            showBrowserNotification();
        } else if (!shouldAlert) {
            // Reset the flag if it drops back down
            hasAlertedForCurrentHighStage = false;
        }
    }

    function playBeepSound() {
        if (!audioCtx) return;

        console.log("[D-Clone] Triggering sound alert!");

        // Play a short multi-tone "alarm" to catch attention
        const playTone = (freq, type, timeStart, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + timeStart);

            gain.gain.setValueAtTime(0, audioCtx.currentTime + timeStart);
            gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + timeStart + 0.05);
            gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + timeStart + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(audioCtx.currentTime + timeStart);
            osc.stop(audioCtx.currentTime + timeStart + duration);
        };

        // Beep pattern
        playTone(660, 'sine', 0, 0.15); // beep
        playTone(660, 'sine', 0.2, 0.15); // beep
        playTone(880, 'sine', 0.4, 0.4); // BEEEEEEP
    }

    function showBrowserNotification() {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("🚨 D2R 狗隻重生警告", {
                    body: "偵測到有地區進度達到 5 或 6！準備上線賣喬丹或找房了！",
                    icon: "https://diablo2.io/images/favicon.ico"
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                    if (permission === "granted") {
                        showBrowserNotification();
                    }
                });
            }
        }
    }

    return {
        init: init
    };

})();
