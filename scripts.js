async function addPlaceToStorage(id) {
    // Add id to local storage
    var fetchedData = await fetchData(id);
    simpleStorage.set(id, fetchedData);
}

async function evaluateThisPlace(id) {
    // If id not in local storage, add it to local storage.
    if (!simpleStorage.hasKey(id)) {
        await addPlaceToStorage(id);
    }
}

async function fetchData(locid) {
    // Collects data from .json-file and retrieves data of requested id
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        var relevantData;
        json.forEach(element => {
            console.log(element.latlng)
            if (element.latlng === locid) {
                console.log(element.latlng)
                relevantData = element.desc;
            }
        });
    } catch (error) {
        console.error(error.message);
    };
    return relevantData
}

function addMarkersToMap() {
    // Adds found locations as map pin markers
    var localKeys = simpleStorage.index();
    localKeys.forEach(key => {
        var locationData = simpleStorage.get(key);
        var keyArray = key.split("-");
        var latlngArray = ["60." + keyArray[0], "18." + keyArray[1]];
        var marker = L.marker(latlngArray);
        var link = "<a href='data/" + key + ".html'>" + locationData + "</a>"
        marker.bindPopup(link);
        foundLayer.addLayer(marker);
    });
}

async function addHeatmapToMap() {
    // Adds not found locations to heatmap
    var localKeys = simpleStorage.index();
    try {
        const response = await fetch("data/data.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        json.forEach(element => {
            if (!localKeys.includes(element.latlng)) {
                var keyArray = element.latlng.split("-");
                heatmapLayer.addData({
                    lat: parseFloat("60." + keyArray[0]),
                    lng: parseFloat("18." + keyArray[1]),
                    count: 1
                });
            }
        });
    } catch (error) {
        console.error(error.message);
    }
}

async function addHexmapToMap() {
    // Adds not found locations to hexmap
    var localKeys = simpleStorage.index();
    try {
        var hexData = [];
        const response = await fetch("data/data.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        json.forEach(element => {
            if (!localKeys.includes(element.latlng)) {
                var keyArray = element.latlng.split("-");
                hexData.push([parseFloat("18." + keyArray[1]), parseFloat("60." + keyArray[0])]);
            }
        });
        hexLayer.data(hexData).addTo(lfmap);
    } catch (error) {
        console.error(error.message);
    }
}

function flushData() {
    // DANGEROUS, removes all data
    simpleStorage.flush();
}

async function enumerateAllLocations() {
    // Counts the number of locations in csv file.
    try {
        const response = await fetch("data/data.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        return json.length;
    } catch (error) {
        console.error(error.message);
    }
}

function enumerateFoundLocations() {
    // Counts number of found locations.
    return simpleStorage.index().length;
}