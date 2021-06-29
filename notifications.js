class MessageBox {
  constructor(id, option) {
    this.id = id;
    this.option = option;
  }

  show(msg, id, label = "❌", callback = null) {
    if (this.id === null || typeof this.id === "undefined") {
      throw "Please set the 'ID' of the message box container.";
    }

    if (msg === "" || typeof msg === "undefined" || msg === null) {
      throw "The 'msg' parameter is empty.";
    }

    if (typeof label === "undefined" || label === null) {
      label = "❌";
    }

    let option = this.option;

    let msgboxArea = document.querySelector(this.id);
    let msgboxBox = document.createElement("DIV");
    let msgboxContent = document.createElement("DIV");
    let msgboxForm = document.createElement("FORM");
    let msgboxClose = document.createElement("BUTTON");
    let msgboxInput = document.createElement("INPUT");

    if (msgboxArea === null) {
      throw "The Message Box container is not found.";
    }

    msgboxContent.classList.add("msgbox-content");
    msgboxContent.innerText = msg;

    msgboxClose.classList.add("msgbox-close");
    msgboxClose.setAttribute("type", "submit");
    msgboxClose.setAttribute("name", "action");
    msgboxClose.setAttribute("value", "close");
    msgboxClose.innerText = label;

    msgboxInput.setAttribute("id", "notif_" + id);
    msgboxInput.setAttribute("value", id);
    msgboxInput.setAttribute("type", "hidden");

    msgboxForm.setAttribute("method", "POST");

    msgboxBox.classList.add("msgbox-box");
    msgboxBox.appendChild(msgboxContent);

    if (
      option.hideCloseButton === false ||
      typeof option.hideCloseButton === "undefined"
    ) {
      msgboxBox.appendChild(msgboxForm);
      msgboxForm.appendChild(msgboxInput);
      msgboxForm.appendChild(msgboxClose);
    }

    msgboxArea.appendChild(msgboxBox);

    msgboxClose.addEventListener("click", (evt) => {
      if (msgboxBox.classList.contains("msgbox-box-hide")) {
        return;
      }

      this.hide(msgboxBox, callback);
    });

    if (option.closeTime > 0) {
      this.msgboxTimeout = setTimeout(() => {
        this.hide(msgboxBox, callback);
      }, option.closeTime);
    }
  }

  hide(msgboxBox, callback) {
    if (msgboxBox !== null) {
      msgboxBox.classList.add("msgbox-box-hide");
    }

    msgboxBox.addEventListener("transitionend", () => {
      if (msgboxBox !== null) {
        msgboxBox.parentNode.removeChild(msgboxBox);
        clearTimeout(this.msgboxTimeout);
        if (callback !== null) {
          callback();
        }
      }
    });
  }
}

let msgboxShowMessage = document.querySelector("#msgboxShowMessage");
let msgboxHiddenClose = document.querySelector("#msgboxHiddenClose");

let msgboxbox = new MessageBox("#msgbox-area", {
  closeTime: 10000,
  hideCloseButton: false,
});
let msgboxboxPersistent = new MessageBox("#msgbox-area", {
  closeTime: 0,
});
let msgboxNoClose = new MessageBox("#msgbox-area", {
  closeTime: 10000,
  hideCloseButton: true,
});

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 208) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}
window.onload = function () {
  function checkStates() {
    httpGetAsync("/notification", (x) => {
      createNotifications(x);
      if (Notification.permission === "granted") {
        //tu powinno być createNotifications()
      }
    });
  }

  function createNotification(message) {
    let img = "/404.jpeg";
    let notification = new Notification("Meteo", {
      body: message,
      icon: img,
    });
  }

  function createNotifications(messages) {
    var obj = JSON.parse(messages);
    for (var i = 0; i < obj.notification.length; i++) {
      console.log(i);
      msgboxbox.show(obj.notification[i].message, i);
      createNotification(obj.notification[i].message);
    }
    //msgboxbox.show(obj.notification[0].message, null);
    //msgboxNoClose.show(obj.notification[1].message);
    // msgboxboxPersistent.show(obj.notification[1].message);
    //createNotification(obj.notification[0].message);
    //createNotification(obj.notification[1].message);
  }
  setInterval(checkStates, 20000);
};
