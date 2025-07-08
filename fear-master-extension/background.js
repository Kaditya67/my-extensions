chrome.runtime.onInstalled.addListener(() => {
  console.log("🧠 Fear Tracker installed successfully.");
});

chrome.runtime.onSuspend.addListener(() => {
  chrome.storage.sync.get({ fears: [] }, ({ fears }) => {
    const now = Date.now();
    const updated = fears.map(fear => {
      if (fear.status === 'active') {
        fear.status = 'paused';
        fear.timeElapsed += now - fear.timeStarted;
        fear.timeStarted = null;
      }
      return fear;
    });
    chrome.storage.sync.set({ fears: updated }, () => {
      console.log("⏸ All active fears paused on extension unload.");
    });
  });
});
