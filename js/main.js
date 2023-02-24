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

// Set the date and time, and update it every second if necessary
setInterval(() => {
    const dateObject = new Date();
    const dateString = dateObject.toLocaleString("en-ZA", { dateStyle: "long" });
    const timeString = dateObject.toLocaleString("en-ZA", { timeStyle: "short" });

    const dateText = `${dateString}, ${timeString}`;
    let currentText = document.getElementById("header-date").innerText = dateText;

    if (currentText !== dateText) {
        currentText = dateText;
    }
}, 1000);

// Reads attributes from collection elements and parses them into an object containing the data
function readAndParseCMSData () {
    const imageSources = [...document.getElementsByClassName("w-json")].map(element => {
        const jsonText = JSON.parse(element.innerHTML);
        const imageURL = jsonText.items[0].url;

        return imageURL;
    });
    const imageDates = [...document.querySelectorAll('[data-cms="image-date"]')].map(element => element.innerText);
    const imageCount = imageSources.length;

    const collectionWrappers = [...document.getElementsByClassName("collection-list-wrapper")];

    /* Remove the Webflow CMS Collection Wrappers once all the data has been used */
    collectionWrappers.forEach(collection => collection.remove());

    return {
        imageSources: imageSources,
        metadata: {
            dates: imageDates,
            itemCount: imageCount
        }
    };
}

if (document.getElementById("slideshow-current_image")) {
    (function createSlideshow () {
        const CMSData = readAndParseCMSData();
        const imageCount = CMSData.metadata.itemCount;

        const imageCountText = document.getElementById("collection-images_num");
        const slideshowImage = document.getElementById("slideshow-current_image");
        const slideshowImageDate = document.getElementById("slideshow-current_image-date");
        const previousText = document.getElementById("slideshow-previous");
        const nextText = document.getElementById("slideshow-next");
        const spinnerGIFUrl = "https://uploads-ssl.webflow.com/620a7487cd108c486bc23aa0/63f7409b6bf4b418dfdc6a33_Rolling-1s-300px.svg";

        document.onreadystatechange = () => {
            slideshowImage.src = spinnerGIFUrl;
        };

        const getImage = (index) => {
            const slideshowPosition = index + 1;
            const imageURL = CMSData.imageSources[index];
            slideshowImage.src = spinnerGIFUrl;
            slideshowImage.onload = () => {
                slideshowImage.src = imageURL;
            };
            slideshowImageDate.innerText = CMSData.metadata.dates[index];
            imageCountText.innerText = `${slideshowPosition}/${imageCount} Images`;
        };

        /** We will initialize the current index of the image array with a random value and
        use that as the initial image on page load
        */
        let currentImageIndex = Math.floor(Math.random() * imageCount);
        getImage(currentImageIndex);

        function nextImage () {
            if (currentImageIndex < imageCount - 1) {
                currentImageIndex++;
            } else {
                currentImageIndex = 0;
            }
            getImage(currentImageIndex);
        }

        function previousImage () {
            if (currentImageIndex > 0) {
                currentImageIndex--;
            } else {
                currentImageIndex = imageCount - 1;
            }
            getImage(currentImageIndex);
        }

        previousText.onclick = () => previousImage();
        nextText.onclick = () => nextImage();

        document.addEventListener("keydown", (ev) => {
            switch (ev.key) {
                case "ArrowRight":
                    nextText.click();
                    break;
                case "ArrowLeft":
                    previousText.click();
                    break;
            }
        });
    }
    )();
}

if (document.getElementById("home_page-category-photography")) {
    (function setHomePageImages () {
        const CMSData = readAndParseCMSData();
        const visualArtsImages = [];
        const photographyImages = [];

        for (const CMSImage of CMSData.imageSources) {
            if (CMSImage.includes("visualartsworks")) {
                visualArtsImages.push(CMSImage);
            } else {
                photographyImages.push(CMSImage);
            }
        }

        const photographyCatElement = document.getElementById("home_page-category-photography");
        const visualArtsCatElement = document.getElementById("home_page-category-visual_arts");

        photographyCatElement.src = photographyImages[Math.floor(Math.random() * photographyImages.length)];
        visualArtsCatElement.src = visualArtsImages[Math.floor(Math.random() * visualArtsImages.length)];
    })();
}

document.getElementById("collection-name").innerHTML = document.getElementsByTagName("title")[0].innerHTML;