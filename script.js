//Floating single input
const labels = document.querySelectorAll('.simple-input__label')

labels.forEach(label => {
    label.innerHTML = label.innerText
    .split('')
    .map((letter, index) => `<span style="transition-delay:${index * 30}ms">${letter}</span>`)
    .join('')
})

//Quantity input
$(document).ready(function () {
  jQuery('<div class="quantity-input__button-container"><a class="quantity-input__button quantity-input__button-up"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" style="padding-top: 3px" class="button-img--small" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg></a><a class="quantity-input__button quantity-input__button-down"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" style="padding-top: 3px" class="button-img--small" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fff" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg></a></div>').insertAfter('.quantity-input input');
  jQuery('.quantity-input').each(function () {
    var spinner = jQuery(this),
        input = spinner.find('input[type="number"]'),
        buttonUp = spinner.find('.quantity-input__button-up'),
        buttonDown = spinner.find('.quantity-input__button-down'),
        min = input.attr('min'),
        max = input.attr('max');

    buttonUp.click(function () {
      var oldValue = parseFloat(input.val());
      if (oldValue >= max) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue + 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });

    buttonDown.click(function () {
      var oldValue = parseFloat(input.val());
      if (oldValue <= min) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue - 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });

  });
});

//Single Select Drop Down
const selectedAll = document.querySelectorAll(".selected");

selectedAll.forEach((selected) => {
  const optionsContainer = selected.previousElementSibling;

  const optionsList = optionsContainer.querySelectorAll(".option");

  selected.addEventListener("click", () => {
    if (optionsContainer.classList.contains("active")) {
      optionsContainer.classList.remove("active");
    } else {
      let currentActive = document.querySelector(".options-container.active");

      if (currentActive) {
        currentActive.classList.remove("active");
      }

      optionsContainer.classList.add("active");
    }
  });

  optionsList.forEach((o) => {
    o.addEventListener("click", () => {
      const selectedValue = o.querySelector("label").innerHTML;
      selected.innerHTML = '<input type="text" value="' + selectedValue + '" hidden />' + selectedValue;
      optionsContainer.classList.remove("active");
    });
  });
});
