(function () {
    const SCAN_DURATION = 3000; // ms of continuous holding for a full scan

    const scanEl = document.querySelector('.scan');
    const finger = document.getElementById('fingerprint');
    const statusEl = document.getElementById('status');
    const percentEl = document.getElementById('percent');
    const flashEl = document.getElementById('flash');
    const stageScan = document.getElementById('stage-scan');
    const stageNext = document.getElementById('stage-next');

    let progress = 0;
    let holding = false;
    let done = false;
    let lastTime = 0;
    let rafId = null;
    let activePointer = null;

    function render() {
        scanEl.style.setProperty('--p', progress.toFixed(4));
        percentEl.textContent = Math.round(progress * 100);
    }

    function setStatus(text, cls) {
        statusEl.textContent = text;
        statusEl.className = 'status ' + cls;
    }

    function tick(now) {
        if (!holding || done) return;
        progress = Math.min(1, progress + (now - lastTime) / SCAN_DURATION);
        lastTime = now;
        render();
        if (progress >= 1) {
            complete();
        } else {
            rafId = requestAnimationFrame(tick);
        }
    }

    function start(e) {
        if (done || holding) return;
        e.preventDefault();
        holding = true;
        activePointer = e.pointerId;
        try { finger.setPointerCapture(e.pointerId); } catch (_) {}
        scanEl.classList.add('holding');
        setStatus('Scanning...', 'scanning');
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
    }

    function release(e) {
        if (!holding || done) return;
        if (e && e.pointerId !== undefined && e.pointerId !== activePointer) return;
        holding = false;
        activePointer = null;
        cancelAnimationFrame(rafId);
        // Lifted early: reset to the start
        progress = 0;
        render();
        scanEl.classList.remove('holding');
        setStatus('Hold to scan', 'idle');
    }

    function complete() {
        done = true;
        holding = false;
        scanEl.classList.remove('holding');
        setStatus('Scan complete', 'idle');
        statusEl.style.animation = 'none';
        statusEl.style.opacity = 1;
        if (navigator.vibrate) navigator.vibrate(120);

        // Success flash, then fade to the next stage
        flashEl.classList.add('go');
        setTimeout(function () {
            stageScan.classList.remove('active');
            stageNext.classList.add('active');
        }, 500);
    }

    finger.addEventListener('pointerdown', start);
    finger.addEventListener('pointerup', release);
    finger.addEventListener('pointercancel', release);
    finger.addEventListener('lostpointercapture', release);

    // Stop the long-press context menu / text selection on phones
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    render();
})();
