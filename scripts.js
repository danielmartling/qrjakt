function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function updateCookie(name, addition) {
    oldCookie = readCookie(name);
    createCookie("qrcookie1", oldCookie + addition + "+");
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function cookieExists(name) {
    if (readCookie(name) === null) {
        return false;
    } else {
        return true;
    }
}

function isPlaceInCookie(id) {
    localData = readCookie("qrcookie1").split("+");
    var isInCookie = false;
    localData.forEach(location => {
        if (location.split(",")[0] === id) {
            isInCookie = true;
        }
    });
    return isInCookie
}

async function addPlaceToCookie(id) {
    var fetchedData = await fetchData(id);
    updateCookie("qrcookie1", id+","+fetchedData);
}

async function evaluateThisPlace(id) {
    if (!isPlaceInCookie(id)) {
        await addPlaceToCookie(id);
    }
}

async function fetchData(locid) {
    try {
        const target = "data.csv";
        const res = await fetch(target);
        const data = await res.text();
        var relevantData;
        data.split("\n").forEach(element => {
            row = element.split(",");
            if (row[0] == locid) {
                relevantData = row[1];
            }
        });
    } catch (error) {
        console.log(error);
    }
    return relevantData
}

function addMarkersToMap() {
    localData = readCookie("qrcookie1").split("+");
    localData.forEach(location => {
        if (location.length > 0) {
            var locationData = location.split(",");
        var latlng = locationData[0].split("-");
        var marker = L.marker(
            ["60." + latlng[0], "18." + latlng[1]]
        ).addTo(lfmap);
        var link = "<a href='data/" + locationData[0] + ".html'>" + locationData[1] + "</a>"
        marker.bindPopup(link);
        }
    });
}