function main() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "data.json", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                let data = JSON.parse(rawFile.responseText);
                console.log(data);
                setDataOnChart(data);
            }
        }
    }
    rawFile.send(null);
}

function setDataOnChart(data) {
    let chart = document.querySelector(".chart");
    let chartBars = chart.children;

    for (let i = 0; i < chartBars.length; i++) {
        let currentBar = chartBars[i].children[0];
        let dataDay = data[i].day;
        if (dataDay == chartBars[i].children[1].innerHTML) {
            setHeightOfBar(data, i, currentBar);

            // Add special class if the bar is the bar representing the current day
            let currentDay = getDay();
            if (currentDay == dataDay) {
                currentBar.classList.add("today-bar");
            }

            // Add the tooltip to each bar
            createTooltip(chartBars[i], currentBar, chartBars[i].children[1], data[i].amount);
        }
    }
}

function setHeightOfBar(data, index, barNode) {
    let maximumValue = 0;
    for (let j = 0; j < data.length; j++) {
        let amount = data[j].amount;
        if (maximumValue < amount) {
            maximumValue = amount;
        }
    }

    let heightFactor = data[index].amount / maximumValue;
    let heightOfBar = 100 * heightFactor;
    barNode.style.height = "" + heightOfBar + "%";
}

function getDay() {
    let date = new Date();
    let dayInt =  date.getDay();
    switch (dayInt) {
        case 0:
            return "sun";
        case 1:
            return "mon";
        case 2:
            return "tue";
        case 3:
            return "wed";
        case 4:
            return "thu";
        case 5:
            return "fri";
        case 6:
            return "sat";
    }
}

function createTooltip(chartBarDay, bar, day, amount) {
    // Compute offset
    let barTextOffsetInPx = Number(getComputedStyle(day).height.slice(0, -2));
    let barTextmarginTop = Number(getComputedStyle(day).marginTop.slice(0, -2));
    let barOffsetInPx = Number(getComputedStyle(bar).height.slice(0, -2));
    // Compute total offset and add the offset from the top of the bar at the end
    let totalOffset = barTextOffsetInPx + barTextmarginTop + barOffsetInPx + 4;

    let tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.style.bottom = "" + totalOffset + "px";
    tooltip.innerHTML = "$" + amount;
    chartBarDay.appendChild(tooltip);
}

main();