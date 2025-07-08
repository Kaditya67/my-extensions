// Auto-skip ads
setInterval(() => {
    const skipBtn = document.querySelector('.ytp-ad-skip-button');
    if (skipBtn) {
        skipBtn.click();
        console.log("⏩ Skipped ad");
    }
}, 500);

// Auto-mute during ads
setInterval(() => {
    const adShowing = document.querySelector('.ad-showing');
    const video = document.querySelector('video');
    if (video) {
        video.muted = !!adShowing;
        if (adShowing) {
            console.log("🔇 Muted during ad");
        } else {
            console.log("🔊 Unmuted after ad");
        }
    }
}, 200);
