var blockedTrackers = document.getElementById('blockedTrackers')

chrome.storage.local.get(["currentTab"], (result) => {
    console.log("Value currently is " + result.currentTab);
    chrome.runtime.sendMessage({
        message: "popup_to_background",
    })
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg === "loadtab") {
            console.log("Load tab")
            trackers = request.data.content.join('\n');
            numberTrackers = request.data.content.length.toString();
            displayText = numberTrackers.concat(" total trackers blocked\n\n", trackers);
            blockedTrackers.textContent = displayText;
        }
    }
);