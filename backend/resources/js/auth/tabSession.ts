const ACTIVE_TAB_KEY = "bio-cwt-admin-active-tab";
const TAB_ID_KEY = "bio-cwt-admin-tab-id";
const ACTIVE_TAB_TTL_MS = 30_000;
const HEARTBEAT_INTERVAL_MS = 10_000;

type ActiveTab = {
  id: string;
  touchedAt: number;
};

function getTabId() {
  let tabId = window.sessionStorage.getItem(TAB_ID_KEY);

  if (!tabId) {
    tabId = window.crypto.randomUUID();
    window.sessionStorage.setItem(TAB_ID_KEY, tabId);
  }

  return tabId;
}

function readActiveTab(): ActiveTab | null {
  try {
    const value = window.localStorage.getItem(ACTIVE_TAB_KEY);
    return value ? JSON.parse(value) as ActiveTab : null;
  } catch {
    return null;
  }
}

function writeActiveTab(tabId: string) {
  window.localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify({
    id: tabId,
    touchedAt: Date.now(),
  } satisfies ActiveTab));
}

export function claimCurrentAuthTab() {
  const tabId = getTabId();
  const activeTab = readActiveTab();
  const isStale = activeTab
    ? Date.now() - activeTab.touchedAt > ACTIVE_TAB_TTL_MS
    : true;

  if (activeTab && activeTab.id !== tabId && !isStale) {
    return false;
  }

  writeActiveTab(tabId);
  return true;
}

export function activateCurrentAuthTab() {
  writeActiveTab(getTabId());
}

export function isCurrentAuthTabActive() {
  return readActiveTab()?.id === getTabId();
}

export function releaseCurrentAuthTab() {
  const activeTab = readActiveTab();

  if (activeTab?.id === getTabId()) {
    window.localStorage.removeItem(ACTIVE_TAB_KEY);
  }
}

export function startAuthTabHeartbeat() {
  const tabId = getTabId();
  writeActiveTab(tabId);

  const interval = window.setInterval(() => {
    if (readActiveTab()?.id === tabId) {
      writeActiveTab(tabId);
    }
  }, HEARTBEAT_INTERVAL_MS);

  return () => window.clearInterval(interval);
}

export function subscribeToAuthTabChanges(onInactive: () => void) {
  const tabId = getTabId();
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== ACTIVE_TAB_KEY) return;

    const activeTab = readActiveTab();
    if (!activeTab || activeTab.id !== tabId) {
      onInactive();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
