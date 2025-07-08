window.getFears = () => {
  return new Promise(resolve => {
    chrome.storage.sync.get({ fears: [] }, data => resolve(data.fears));
  });
};

window.saveFears = (fears) => {
  return new Promise(resolve => {
    chrome.storage.sync.set({ fears }, resolve);
  });
};

window.updateFearById = async (id, updateFn) => {
  const fears = await window.getFears();
  const updated = fears.map(fear => fear.id === id ? updateFn(fear) : fear);
  await window.saveFears(updated);
};

window.deleteFearById = async (id) => {
  const fears = await window.getFears();
  const updated = fears.filter(fear => fear.id !== id);
  await window.saveFears(updated);
};
