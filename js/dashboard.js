'use strict';

const dashSearchInput = elemByID("dash-search-input"),
    dashSalesButton = elemByID("dash-sales"),
    dashDownloadsButton = elemByID("dash-downloads"),
    dashRevenueButton = elemByID("dash-revenue"),
    dashVerifyButton = elemByID("dash-verify"),
    dashSettingsButton = elemByID("dash-settings");

const dashCards = elemQuerySelectorAll("#dash-cards [id^='dash-']");

dashSearchInput.addEventListener("input", () => {
    SearchCards();
});

dashSalesButton.addEventListener("click", () => {
    OpenSales();
});

dashDownloadsButton.addEventListener("click", () => {
    OpenDownloads();
});

dashRevenueButton.addEventListener("click", () => {
    OpenRevenue();
});

dashVerifyButton.addEventListener("click", () => {
    OpenVerification();
});

dashSettingsButton.addEventListener("click", () => {
    OpenSettings();
});

function OpenDashboard() {
    if (dashboardButton.classList.contains("active"))
        return;

    dashSearchInput.value = "";

    SetActiveButton(dashboardButton);
    SetActiveSection(dashboardSection);
}

function SearchCards() {
    if (dashCards == null || dashCards.length <= 0)
        return;

    let term = dashSearchInput.value.toLowerCase();

    if (term === "") {
        dashCards.forEach((elem) => {
            elem.style.display = "block";
        });
    } else {
        dashCards.forEach((elem) => {
            if (elem.textContent.toLowerCase().includes(term))
                elem.style.display = "block";
            else
                elem.style.display = "none";
        });
    }
}

function CheckMonthsData(value) {
    if (value == null || value[currentMonthsKey] == null || value[lastRefresh] == null)
        return;

    let preDate = new Date(value[currentMonthsKey]);
    let curDate = new Date();

    if (preDate.getMonth() < curDate.getMonth() && (curDate.getTime() - value[lastRefresh]) >= 3600000)
        xhrRequest(links().months, UpdateMonthsData, "Refreshing months data");
}

function UpdateMonthsData() {
    let data = JSON.parse(xhr.responseText);

    SaveData(currentMonthsKey, InsertCharacter(data.periods[0].value, 4, "-"));
    SaveData(lastRefresh, Date.now());

    SendMessage({
        command: "restart"
    });
}