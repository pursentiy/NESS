class App {
    constructor() {
        this.transactions = [];
        const appData = this.loadData();
        if (appData) {
            //read data either in LocalStorage or in JSON-file
            this.updateData(appData.transactions);

            //arg 0 - no filter condition / updating total sum and list of transactions 
            // settings = {filterByYear: 2018, filterByMonth: 'Jul'}
            const settings = { filterByYear: undefined, filterByMonth: undefined };
            this.updateView(settings);

            //plotting
            const dataForPlotting = this.analyzeDataforTransactionsCharts();
            settingTransactionsPlot(dataForPlotting);

            //updating select years field
            let yearsTransactionListRaw = this.parseTimestampsFromTransactions(this.readTimestampInTransactions());
            this.updateSelectYearTransactions(this.sortingDateForSelect(yearsTransactionListRaw, undefined));
        }
    }

    loadData() {
        if (localStorage.length) {
            return this.localStorageRead();
        }

        this.APIRead().then(data => {
            this.updateData(data.transactions);
            this.updatelocalStorage();

            const settings = { filterByYear: undefined, filterByMonth: undefined };
            this.updateView(settings);

            //plotting
            const dataForPlotting = this.analyzeDataforTransactionsCharts();
            settingTransactionsPlot(dataForPlotting);

            //updating select years field
            let yearsTransactionListRaw = this.parseTimestampsFromTransactions(this.readTimestampInTransactions());
            this.updateSelectYearTransactions(this.sortingDateForSelect(yearsTransactionListRaw, undefined));
        });
    }

    localStorageRead() {
        return JSON.parse(localStorage.getItem("listData"));
    }

    APIRead() {
        return fetch("https://api.myjson.com/bins/m6c2k").then(response => {
            return response.json();
        });
    }

    updateData(data) {
        this.transactions = data;
    }

    updateView(filterCondition) {
        const filteredData = this.filterTransactions(filterCondition);
        this.renderTotalSum(this.totalSumUpdate(filteredData));
        this.renderTransactions(filteredData);
    }

    filterTransactions(settings) {
        return this.transactions.filter((transaction) => {
            // parsed data for comparing with filter condition 
            const dateInTransaction = this.parseData(transaction.timestamp);
            //filtering by month and year
            if (settings.filterByMonth !== undefined) {
                if (settings.filterByYear == dateInTransaction[2] && settings.filterByMonth == dateInTransaction[0]) {
                    return transaction;
                }
            }//filtering just by year 
            else if (settings.filterByYear !== undefined) {
                if (settings.filterByYear == dateInTransaction[2]) {
                    return transaction;
                }
            }//no filtering conditions  
            else {
                return transaction;
            }
        });
    }

    totalSumUpdate(transactions) {
        let totalSum = 0;
        transactions.forEach(elem =>
            totalSum += elem.value
        );
        return totalSum;
    }

    renderTotalSum(totalSum) {
        const totalSumField = document.getElementById("number");
        let options = {
            useEasing: true,
            useGrouping: false,
            separator: ",",
            decimal: "."
        };
        let c = new CountUp(
            totalSumField,
            +totalSumField.innerText,
            totalSum,
            0,
            1.7,
            options
        );
        c.start();
    }

    transactionsUpdate(data) {
        data.forEach(transaction => this.transactions.push(transaction));
    }

    renderTransactions(dateToRender) {
        const ul = document.getElementById("list");
        ul.innerHTML = '';

        dateToRender.forEach(transaction => 
            new Transaction(transaction)
        )
    }

    parseData(dateToRender) {
        let d = new Date(dateToRender).toString().split(" ");
        return [d[1], d[2], d[3]];
    }

    readInputFields() {
        const categoryField = document.getElementById("category");
        const labelField = document.getElementById("text");
        const valueField = document.getElementById("amount");

        if (
            valueField.value != 0 &&
            this.isValidNumber(valueField.value) &&
            this.correctCategoryInput(valueField.value, categoryField.value)
        ) {
            budget.transactions.push({
                label: labelField.value,
                value: this.roundOffInput(valueField.value),
                category: categoryField.value,
                timestamp: Date.now()
            });
        } else {
            this.setTextAlertWindow("Invalid input!");
            this.renderAlertWindow(1, 0.4, "block");
        }
    }

    correctCategoryInput(value, category) {
        if (category == "savings" || category == "salary") {
            return (value > 0) ? true : false;
        } else {
            return (value < 0) ? true : false;
        }
    }

    settingDefaultSelectOptions(updateYear) {
        const month = document.getElementById("month");
        const year = document.getElementById("year");
        if (updateYear) {
            month[0].selected = month[0].defaultSelected;
            year[0].selected = year[0].defaultSelected;
        } else {
            month[0].selected = month[0].defaultSelected;
        }
    }

    readSelectSortingFields() {
        const labelYear = document.getElementById("year");
        const labelMonth = document.getElementById("month");
        let month = 0;
        if (!labelYear.value) {
            this.setTextAlertWindow("Year is not defined!");
            this.renderAlertWindow(1, 0.4, "block");
        } else {
            return (labelMonth.value.length == 0) ? [labelYear.value] : [labelYear.value, this.convertingMonth(labelMonth.value)[0][1]];
        }
    }

    convertingMonth(monthToConvert) {
        const months = [["1", "Jan"], ["2", "Feb"], ["3", "Mar"], ["4", "Apr"], ["5", "May"], ["6", "Jun"], ["7", "Jul"], ["8", "Aug"], ["9", "Sep"], ["10", "Oct"], ["11", "Nov"], ["12", "Dec"]];

        return months.filter((elem, index) => {
            if (!isNaN(+monthToConvert)) {
                if (monthToConvert == elem[0]) return elem[1];
            } else {
                if (monthToConvert == elem[1]) return elem[0];
            }
        });
    }

    updatelocalStorage() {
        localStorage.setItem("listData", JSON.stringify(budget));
    }

    roundOffInput(numberToCheck) {
        let number = +numberToCheck;
        if (numberToCheck.indexOf(".") != -1) {
            return parseFloat(number.toFixed(1));
        } else {
            return parseFloat(number);
        }
    }

    isValidNumber(numberToCheck) {
        return isNaN(+numberToCheck / 2) ? false : true;
    }

    clearTransactions() {

        this.renderTotalSum(0);
        localStorage.removeItem("listData");
        this.transactions = [];
        $("#list").empty();
    }

    removeTransaction(index) {
        this.transactions.splice(index, 1);
    }

    readTimestampInTransactions() {
        return this.transactions.map(transaction => transaction.timestamp);
    }

    parseTimestampsFromTransactions(rowDate) {
        let parsedDate = [[], []];
        rowDate.forEach(timestamp => {
            let date = new Date(timestamp);
            parsedDate[0].push(date.getFullYear())
            parsedDate[1].push(date.getMonth() + 1);
        });
        return parsedDate
    }

    sortingDateForSelect(DateArr, monthsSorting) {
        if (!monthsSorting) {
            return _.uniq(DateArr[0]);
        } else {
            let monthArr = [];
            DateArr[1].forEach((month, index) => {
                if(+monthsSorting == DateArr[0][index] ){
                    monthArr.push(month);
                } 
            });
            return _.uniq(monthArr);
        }
    }

    updateSelectMonthsTransactions(unicMonths) {
        const month = document.getElementById("month");
        let monthNumber = 0;
        monthNumber = this.convertingMonth(unicMonths)[0][1];
        unicMonths.forEach(monthInsert => {
            month.options[month.options.length] = new Option(
                monthNumber.toString(),
                monthInsert[1]
            );
        });
    }

    updateSelectYearTransactions(uniqYears) {
        const year = document.getElementById("year");
        let yearsInserted = [];
            yearsInserted.push(year.options[0].innerText);
            $("#year option:not(:first)").remove();
        uniqYears.forEach(yearInsert => {
            if (yearsInserted.indexOf(yearInsert) == -1) {
                year.options[year.options.length] = new Option(yearInsert, yearInsert);
            }
        });
    }

    analyzeDataforTransactionsCharts(sortingYear) {
        let data;
        if (sortingYear === undefined) {
            data = this.transactions;
        } else {
            data = sortingYear;
        }
        //detecting only value of expenses and category. That parametres we'll use for plotting
        let arrCat = data.map(transaction => transaction.category);
        let arrCatUniq = _.uniq(arrCat);

        let arrVal = arrCatUniq.map(category => {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            return data
                .map(transaction => {
                    return transaction.category == category && transaction.value < 0
                        ? -1 * transaction.value
                        : 0;
                })
                .reduce(reducer);
        });
        let transactionsChartData = [arrVal, arrCatUniq];
        return transactionsChartData;
    }

    renderAlertWindow(windowOpacity, overlayOpacity, elementsCondition) {
        const window = document.getElementsByClassName("window");
        const overlay = document.getElementsByClassName("overlay");
        $(window[0]).css("display", elementsCondition);
        setTimeout(() => {
            $(window[0]).css("opacity", windowOpacity);
        }, 250);
        $(overlay[0]).css("display", elementsCondition);
        setTimeout(() => {
            $(overlay[0]).css("opacity", overlayOpacity);
        }, 200);
    }

    setTextAlertWindow(textToRender) {
        const textWindow = document.getElementById("textWindow");
        textWindow.innerHTML = textToRender;
    }
}

console.log("test")