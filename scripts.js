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
    // Collects data from .csv-file and retrieves data of requested id
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
    // Add all found locations to map
    localKeys = simpleStorage.index();
    localKeys.forEach(key => {
        var locationData = simpleStorage.get(key);
        var keyArray = key.split("-");
        var latlngArray = ["60." + keyArray[0], "18." + keyArray[1]];
        var marker = L.marker(latlngArray).addTo(lfmap);
        var link = "<a href='data/" + key + ".html'>" + locationData + "</a>"
        marker.bindPopup(link);
    });
}

function flushData() {
    // DANGEROUS, removes all data
    simpleStorage.flush();
}

async function enumerateAllLocations() {
    // Counts the number of locations in csv file.
    try {
        const target = "data/data.csv";
        const res = await fetch(target);
        const data = await res.text();
        var counter = 0;
        data.split("\n").forEach(element => {
            if (element.length > 1) {
                counter += 1;
            }
        });
    } catch (error) {
        console.log(error);
    }
    return counter;
}

function enumerateFoundLocations() {
    // Counts number of found locations.
    return simpleStorage.index().length;
}