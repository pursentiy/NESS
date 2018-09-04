const swtichButton = document.getElementById('pageSwitcher');
const editList = document.getElementById('editList');

//circle bars settings
const input = document.getElementById('text');
const amount = document.getElementById('amount');
const bar = new RadialProgress(document.getElementById("bar"), { progress: 0.1, colorFg: "#fff", colorBg: "#23c7b8", thick: 5, fixedTextSize: 0, noPercentage: true });
bar.setIndeterminate(false);
bar.setValue(0);


const barAmount = new RadialProgress(document.getElementById("barAmount"), { progress: 0.1, colorFg: "#fff", colorBg: "#23c7b8", thick: 5, fixedTextSize: 0, noPercentage: true });
barAmount.setIndeterminate(false);
barAmount.setValue(0);

//circle bars input value
amount.addEventListener("keydown", (e) => {
  setTimeout(() => {
    barAmount.setValue((amount.value.length) / 10);
  }, 100);
  if (e.which != 8 && amount.value.length > 10) {
    e.preventDefault(); //stop character from entering input
  }
}, false);


input.addEventListener("keydown", (e) => {
  // @TODO : finish correct input
  setTimeout(() => {
    bar.setValue((input.value.length) / 14);
  }, 100)
}, false);

setTimeout(() => {
  $('.list').css('padding', '0');
}, 10);

let clickCheck = true;
//function for cards transition
$('body').click(function (e) {
  const target = $(e.target);
  const elementBeneath = target[0].parentElement.children[1];

  const cardsListAbove = document.getElementsByClassName('translate');
  if (cardsListAbove.length > 0 && clickCheck) Transaction.Click().off(cardsListAbove[0]);

  //delete transaction from list
  if (target.hasClass('delete')) {
    Transaction.Click().removeTransaction(e);
  }

  if (target.hasClass('appear')) {
    const parentLi = target[0].parentElement;
    //$('#list li .delete').removeClass('appear');
    target[0].classList.remove('appear');
    target[0].classList.add('disapperar');
    setTimeout(() => {
      parentLi.remove();
    }, 850)
    parentLi.classList.add('liFloat');
  }

  if (target.hasClass("above") && clickCheck && !$('#list li .delete').hasClass('appear')) {
    clickCheck = false;
    Transaction.Click().transaction(target[0]);
    setTimeout(() => {
      clickCheck = true;
    }, 600)
  };
});

swtichButton.onclick = () => {
  const secToFlow = document.getElementById('flowUpSection');
  $(secToFlow).toggleClass('transformUp');
}

var cardsList = [];

//All list of cards on the page
var cards = () =>
  cardsList = document.getElementsByClassName('above');

let flagOpen = false;
$(document).on('scroll', function () {
  if ($(this).scrollTop() >= $('.balanceInfo').position().top + $(".balanceInfo").outerHeight(true) && !flagOpen) {
    flagOpen = true;
    $('.FakeBalanceInfo').css('display', 'block');
    $('.balanceInfo').addClass('flow');
    $('.tongue').addClass('tongueDown');
  }
  else if ($(this).scrollTop() <= $(".FakeBalanceInfo").outerHeight(true) + $(".canvasWrapper").outerHeight(true) && flagOpen) {
    $('.FakeBalanceInfo').css('display', 'none');
    $('.tongue .arrow svg').removeClass('rotated');
    $('.balanceInfo').removeClass('flow');
    $('.balanceInfo').removeClass('transition');
    $('.tongue').removeClass('tongueDown');
    flagOpen = false;
    $('.balanceInfo').removeClass('flowDown');
  }
})

$('.tongue').click(function (e) {

  $('.balanceInfo').addClass('transition');
  $('.balanceInfo').toggleClass('flowDown');
  $('.tongue .arrow svg').toggleClass('rotated');
  if ($('.balanceInfo').hasClass('flowDown')) {
    $('.tongue').css('box-shadow', 'none');
  }
  else {
    $('.tongue').css('box-shadow', '1px 0px 6px 0px rgba(0,0,0,0.25)');
  }
});


$(editList).click((e) => {
  Transaction.Click().editList();
})


//smooth li appearing
$('.list #list').addClass('listAnimationSlideUp');

setTimeout(() => {
  $('.list #list').removeClass('listAnimationSlideUp');
}, 500)


