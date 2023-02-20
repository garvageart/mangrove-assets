export function MinutesToMs (minutes) {
    return minutes * 60000;
}

/* Methods for caching images
Original code author: Ashley Sheridan
https://www.ashleysheridan.co.uk/blog/Using+Local+Storage+to+Cache+Images 
 */
export const cacheMethods = {
    write: (itemKey, itemMetadata = { current_time, photo_date }, itemData) => {
        try {
            let JSONData = JSON.stringify({
                metadata: itemMetadata,
                data: itemData
            });

            localStorage.setItem(itemKey, JSONData);
            return true;
        } catch (err) {
            return false;
        }
    },
    read: (itemKey) => {
        try {
            let JSONDataString = localStorage.getItem(itemKey);
            let cachedData = JSON.parse(JSONDataString);

            return cachedData;
        } catch (err) {
            return null;
        }
    },
    expire: (imageSources) => {
        let itemCount = imageSources.length;
        let currentTime = new Date();
        let maxAge = MinutesToMs(10);

        for (let i = 0; i < itemCount; i++) {
            let imageURL = imageSources[i];
            let itemKey = localStorage.key(imageURL);
            let itemData = localStorage.getItem(itemKey);

            try {
                let parsedData = JSON.parse(itemData);
                let itemCacheTime = new Date(parsedData.metadata.current_time);
                let timeDifference = currentTime.valueOf() - itemCacheTime.valueOf();

                if (timeDifference > maxAge) {
                    localStorage.removeItem(itemKey);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
};