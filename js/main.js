const budget = new App();

const addField = document.getElementById("add");
addField.onclick = () => {
  budget.readInputFields();
  budget.updatelocalStorage();

  //arg 0 - no filter condition / updating total sum and list of transactions
  const settings = { filterByYear: undefined, filterByMonth: undefined };
  budget.updateView(settings);

  //plotting
  const dataForPlotting = budget.analyzeDataforTransactionsCharts();
  settingTransactionsPlot(dataForPlotting);

  //updating select years field
  const yearsTransactionListRaw = budget.parseTimestampsFromTransactions(
    budget.readTimestampInTransactions()
  );
  budget.updateSelectYearTransactions(
    budget.sortingDateForSelect(yearsTransactionListRaw, undefined)
  );

  //setting value of inputs circle bars to zero
  bar.setValue(0);

  input.value = "";
};

const year = document.getElementById("year");
year.onchange = () => {
  if (year.value.length != 0) {
    const date = budget.readSelectSortingFields();

    //removing all options in months
    $("#month option:not(:first)").remove();

    //updating Select months options
    const yearsTransactionListRaw = budget.parseTimestampsFromTransactions(
      budget.readTimestampInTransactions()
    );
    budget.updateSelectMonthsTransactions(
      budget.sortingDateForSelect(yearsTransactionListRaw, date[0])
    );

    // updating total sum and list of transactions
    const settings = { filterByYear: date[0] };
    budget.updateView(settings);



    //updating plot with filter statements
    let dataForPlottingFiltered = budget.filterTransactions(date[0]);
    settingTransactionsPlot(budget.analyzeDataforTransactionsCharts(dataForPlottingFiltered));
  } else {
    //reseting months options
    $("#month option:not(:first)").remove();
    budget.settingDefaultSelectOptions(true);
    const settings = { filterByYear: undefined, filterByMonth: undefined };
    budget.updateView(settings);

    //updating plot
    const dataForPlotting = budget.analyzeDataforTransactionsCharts();
    settingTransactionsPlot(dataForPlotting);
  }
};

const month = document.getElementById("month");
month.onchange = () => {
  if (month.value.length != 0) {
    const date = budget.readSelectSortingFields();

    //updating total sum and list of transactions
    const settings = { filterByYear: date[0], filterByMonth: date[1] };
    budget.updateView(settings);

    //updating plot with filter statements
    let dataForPlottingFiltered = budget.filterTransactions([date[0], date[1]]);
    settingTransactionsPlot(
      budget.analyzeDataforTransactionsCharts(dataForPlottingFiltered)
    );
  } else {
    const year = document.getElementById("year");
    budget.settingDefaultSelectOptions(false);

    const settings = { filterByYear: year.value };
    budget.updateView(settings);

    let date = budget.readSelectSortingFields();

    //updating plot with filter statements
    let dataForPlottingFiltered = budget.filterTransactions(date[0]);
    settingTransactionsPlot(budget.analyzeDataforTransactionsCharts(dataForPlottingFiltered));
  }
};

const closeAlertWindow = document.getElementById("closeAlert");
closeAlertWindow.onclick = () => {
  const window = document.getElementsByClassName("window");
  const overlay = document.getElementsByClassName("overlay");
  $(window[0]).css("opacity", "0");
  setTimeout(() => {
    $(window[0]).css("display", "none");
  }, 250);

  $(overlay[0]).css("opacity", "0");
  setTimeout(() => {
    $(overlay[0]).css("display", "none");
  }, 200);
};

const clearTransactions = document.getElementById("clear");
clearTransactions.onclick = () => {
  $(".list #list").addClass("listAnimationSlideDown");
  setTimeout(() => {
    const section = document.getElementsByClassName("list");
    $(section[0]).css("height", `${section[0].clientHeight}px`);
    setTimeout(() => {
      $(".list #list").removeClass("listAnimationSlideDown");
    }, 300);
    $(".list #list").addClass("listAnimationSlideUp");

    setTimeout(() => {
      $(".list #list").removeClass("listAnimationSlideUp");
    }, 500);
    budget.clearTransactions();
    budget.loadData();
    setTimeout(() => {
      $(section[0]).css("height", `auto`);
    }, 1000);
  }, 500);
};

