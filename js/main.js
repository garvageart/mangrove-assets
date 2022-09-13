// Updates time every second
setInterval(() => {
    const dateObject = new Date();
    const dateString = dateObject.toLocaleString("en-ZA", { dateStyle: "long" });
    const timeString = dateObject.toLocaleString("en-ZA", { timeStyle: "short" });

    const dateText = `${dateString}\n${timeString}`;
    document.getElementById("header-date").innerText = dateText;
}, 1000);

// Hide context menu on images
$(function () {
    $('body').on('contextmenu', 'img', function (e) {
        return false;
    });
});