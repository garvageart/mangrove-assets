/* MIT License;

Copyright (C) 2023 lesis.online

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files(the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR;
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER;
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE;
SOFTWARE. */

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

export function readAndParseCMSData () {
    const imageSources = [...document.getElementsByClassName("w-json")].map(element => {
        const jsonText = JSON.parse(element.innerHTML);
        const imageURL = jsonText.items[0].url;

        return imageURL;
    });
    const imageDates = [...document.querySelectorAll('[data-cms="image-date"]')].map(element => element.innerText);
    const imageCount = imageSources.length;

    const imageMetadata = [];
    imageSources.forEach((source, SI) => {
        const imageDate = imageDates[SI];

        imageMetadata.push({
            imageSource: source,
            imageDate
        });
    });

    const collectionWrappers = [...document.getElementsByClassName("collection-list-wrapper")];

    /* Remove the Webflow CMS Collection Wrappers once all the data has been used */
    collectionWrappers.forEach(collection => collection.remove());

    return {
        imageMetadata,
        metadata: {
            itemCount: imageCount
        }
    };
}