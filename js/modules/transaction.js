class Transaction {
  constructor(data) {
    const category = this.setCategory(data.category);
    const label = this.setLabel(data.label);
    const date = this.parseTimestamp(data.timestamp);
    this.renderElement(category, label, date, data.value);
  }

  renderElement(category, label, date, value) {
    const ul = document.getElementById("list");
    ul.innerHTML += `<li>
    <div class='above'>
        <span class=${category}></span>
        <div class="table">
        <span>${label[0]}</span>
        <span>${date[1]} ${date[0]} ${date[2]}</span>
        </div>
        <span>${value}</span>
    </div>
    <div class='under'>
        <span class='fullLabel'>${label[1]}</span>
    </div>
    <div class="delete"></div>
</li>`;
  }

  setCategory(category) {
    return category.length == 0 ? "unknown" : category;
  }

  setLabel(label) {
    let cutedLabel, fullLabel;
    if (label.length == 0) return ["unknown", "label"];
    else if (label.length > 17) {
      cutedLabel = label.slice(0, 14) + "...";
      fullLabel = label;
      return [cutedLabel, fullLabel];
    } else {
      return [label, label];
    }
  }

  parseTimestamp(timestamp) {
    let date = new Date(timestamp).toString().split(" ");
    return [date[1], date[2], date[3]];
  }

  static onClickTransaction(transaction) {
    const underTransaction = transaction.parentElement.children[1];
    transaction.className += " translate";
    if (underTransaction.children[0].innerHTML.length > 38) {
      underTransaction.classList.add("bigInfoOpen");
      underTransaction.style.height = `${this.countCSSProperties(underTransaction.children[0].innerText.length)}px`;
    }
  }

  static offClickTransaction(transaction) {
    transaction.classList.remove('translate');
    const cardsListUnder = document.getElementsByClassName('bigInfoOpen');
    if (cardsListUnder.length > 0) {
      cardsListUnder[0].style.height = '70px';
      cardsListUnder[0].classList.remove('bigInfoOpen');
    }
  }

  static countCSSProperties(transaction) {
    return 70 + 15 * Math.round(transaction / 38);
  }

  static Click() {
    return {
      off: (transaction) => {
        transaction.classList.remove('translate');
        const cardsListUnder = document.getElementsByClassName('bigInfoOpen');
        if (cardsListUnder.length > 0) {
          cardsListUnder[0].style.height = '70px';
          cardsListUnder[0].classList.remove('bigInfoOpen');
        }
      },
      transaction: (transaction) => {
        const underTransaction = transaction.parentElement.children[1];
        transaction.className += " translate";
        if (underTransaction.children[0].innerHTML.length > 38) {
          underTransaction.classList.add("bigInfoOpen");
          underTransaction.style.height = `${this.countCSSProperties(underTransaction.children[0].innerText.length)}px`;
        }
      },
      removeTransaction: (transaction) => {
        const ul = document.getElementById('list');
        const li = transaction.target.parentElement.closest('li');
        let nodes = Array.from(ul.children);
        nodes = Array.from(li.closest('ul').children);
        const index = nodes.indexOf(li);
        budget.removeTransaction(index);
        budget.updatelocalStorage();
        const settings = { filterByYear: undefined, filterByMonth: undefined };
        budget.updateView(settings);

        //plotting
        const dataForPlotting = budget.analyzeDataforTransactionsCharts();
        settingTransactionsPlot(dataForPlotting);

        //updating select years field
        let yearsTransactionListRaw = budget.parseTimestampsFromTransactions(budget.readTimestampInTransactions());
        
        budget.updateSelectYearTransactions(budget.sortingDateForSelect(yearsTransactionListRaw, undefined));
        $('#list li .delete').css('display', 'block');
        $('#list li .delete').addClass('appear');
      },

      editList: () => {
        if ($('#list li .delete').hasClass('appear')) {
          $('#list li .delete').removeClass('appear');
          $('#list li .delete').addClass('disapperar');
          setTimeout(() => {
            $('#list li .delete').css('display', 'none');
          }, 450)
        } else {
          $('#list li .delete').css('display', 'block');
          $('#list li .delete').removeClass('disapperar');
          $('#list li .delete').addClass('appear');
        }
      }
    }
  }

}
