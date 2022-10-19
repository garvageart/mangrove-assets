// Reads the current date and time, and updates the element text if necessary
setInterval(() => {
    const dateObject = new Date();
    const dateString = dateObject.toLocaleString("en-ZA", { dateStyle: "long" });
    const timeString = dateObject.toLocaleString("en-ZA", { timeStyle: "short" });

    const dateText = `${dateString}, ${timeString}`;
    let currentText = document.getElementById("header-date").innerText

    if (currentText !== dateText) {
        currentText = dateText;
    }
}, 1000);