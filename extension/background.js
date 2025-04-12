const REPORT_URL = 'https://btrack.patricklin.dev/api/'


function reportData(endpoint, data, method = 'POST') {
    fetch(REPORT_URL + endpoint, {  
        method: method,
        headers: {  
          "Content-Type": "application/json",
          "tracker-source": chrome.runtime.id,
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
    chrome.runtime.setUninstallURL(`${REPORT_URL}meta/uninstall?runtime=${chrome.runtime.id}`);
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
