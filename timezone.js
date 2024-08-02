// Get current time
let now = dayjs().format();

// Set face status
function isWorkTime(time) {
    return (parseInt(time) >= 10) & (parseInt(time) < 17);
}

function isSleepTime(time) {
    return (parseInt(time) >= 0) & (parseInt(time) < 9);
}

function isFreeTime(time) {
    return (parseInt(time) >= 17) & (parseInt(time) < 24);
}

function setFace(locationHour, faceLocation) {
    if (isFreeTime(locationHour)) {
        document.getElementById(faceLocation).src =
            "images/smile-circle-svgrepo-com.svg";
    } else if (isSleepTime(locationHour)) {
        document.getElementById(faceLocation).src =
            "images/sad-circle-svgrepo-com.svg";
    } else {
        document.getElementById(faceLocation).src =
            "images/expressionless-circle-svgrepo-com.svg";
    }
}

// Update time

function updateTime() {
    now = dayjs().format();
    dayjs.extend(dayjs_plugin_utc);
    dayjs.extend(dayjs_plugin_timezone);
    beijingDate = dayjs().tz("Asia/Shanghai").format("ddd, DD MMM YYYY");
    beijingTime = dayjs().tz("Asia/Shanghai").format("HH:mm");
    beijingHour = dayjs().tz("Asia/Shanghai").format("HH");

    dublinDate = dayjs().tz("Europe/Dublin").format("ddd, DD MMM YYYY");
    dublinTime = dayjs().tz("Europe/Dublin").format("HH:mm");
    dublinHour = dayjs().tz("Europe/Dublin").format("HH");

    // Show date and time
    document.getElementById("beijing_location_date").innerHTML = beijingDate;
    document.getElementById("dublin_location_date").innerHTML = dublinDate;

    document.getElementById("beijing_location_time").innerHTML = beijingTime;
    document.getElementById("dublin_location_time").innerHTML = dublinTime;

    setFace(beijingHour, "face-beijing");
    setFace(dublinHour, "face-dublin");

    //Set slider value
    document.getElementById("tzconv_range").value = dublinHour;

    //Set slider range color
    for (let hour = 0; hour < 24; hour++) {
        if ((hour < 17) & isFreeTime(hour) & isFreeTime(hour + 7)) {
            document.getElementById(`range-${hour}`).style.backgroundColor =
                "#bef264";
        } else if ((hour < 17) & (isSleepTime(hour) | isSleepTime(hour + 7))) {
            document.getElementById(`range-${hour}`).style.backgroundColor =
                "#fda4af";
        } else if ((hour >= 17) & isSleepTime(hour - 17)) {
            document.getElementById(`range-${hour}`).style.backgroundColor =
                "#fda4af";
        } else if (hour == 13) {
            document.getElementById(`range-${hour}`).style.backgroundColor =
                "#bef264";
        } else {
            document.getElementById(`range-${hour}`).style.backgroundColor =
                "#fde047";
        }
    }
}

updateTime();
setInterval(updateTime, 60000);

//Slider action
const input = document.getElementById("tzconv_range");
const value = document.getElementById("value");
input.addEventListener("input", (event) => {
    var selectDublinHour;
    var selectBeijingHour;
    selectDublinHour = event.target.value;
    document.getElementById("beijing_location_date").innerHTML = beijingDate;

    if (event.target.value < 10) {
        document.getElementById("dublin_location_time").innerHTML =
            "0" + event.target.value + ":00";
    } else {
        document.getElementById("dublin_location_time").innerHTML =
            event.target.value + ":00";
    }
    setFace(selectDublinHour, "face-dublin");

    if (event.target.value < 3) {
        document.getElementById("beijing_location_time").innerHTML =
            "0" + parseInt(parseInt(event.target.value) + 7) + ":00";
        selectBeijingHour = parseInt(parseInt(event.target.value) + 7);
    } else if ((event.target.value >= 3) & (event.target.value <= 16)) {
        document.getElementById("beijing_location_time").innerHTML =
            parseInt(parseInt(event.target.value) + 7) + ":00";
        selectBeijingHour = parseInt(parseInt(event.target.value) + 7);
    } else {
        document.getElementById("beijing_location_time").innerHTML =
            "0" + parseInt(parseInt(event.target.value) - 17) + ":00";
        document.getElementById("beijing_location_date").innerHTML = dayjs()
            .add(1, "day")
            .tz("Europe/Dublin")
            .format("ddd, DD MMM YYYY");
        selectBeijingHour = parseInt(parseInt(event.target.value) - 17);
    }
    setFace(selectBeijingHour, "face-beijing");
});
