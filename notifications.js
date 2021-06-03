class MessageBox {
  constructor(id, option) {
    this.id = id;
    this.option = option;
  }

  show(msg, label = "❌", callback = null) {
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
    let msgboxClose = document.createElement("A");

    if (msgboxArea === null) {
      throw "The Message Box container is not found.";
    }

    msgboxContent.classList.add("msgbox-content");
    msgboxContent.innerText = msg;

    msgboxClose.classList.add("msgbox-close");
    msgboxClose.setAttribute("href", "#");
    msgboxClose.innerText = label;

    msgboxBox.classList.add("msgbox-box");
    msgboxBox.appendChild(msgboxContent);

    if (
      option.hideCloseButton === false ||
      typeof option.hideCloseButton === "undefined"
    ) {
      msgboxBox.appendChild(msgboxClose);
    }

    msgboxArea.appendChild(msgboxBox);

    msgboxClose.addEventListener("click", (evt) => {
      evt.preventDefault();

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
  closeTime: 500000,
  hideCloseButton: false,
});
let msgboxboxPersistent = new MessageBox("#msgbox-area", {
  closeTime: 0,
});
let msgboxNoClose = new MessageBox("#msgbox-area", {
  closeTime: 5000,
  hideCloseButton: true,
});

const notificationBtn = document.getElementById("enable");

if (
  Notification.permission === "denied" ||
  Notification.permission === "default"
) {
  notificationBtn.style.display = "block";
} else {
  notificationBtn.style.display = "none";
}

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
    if (
      Notification.permission === "denied" ||
      Notification.permission === "default"
    ) {
      notificationBtn.style.display = "block";
    } else {
      notificationBtn.style.display = "none";
    }

    httpGetAsync("/notification", (x) => {
      createNotifications(x);
      if (Notification.permission === "granted") {
        //tu powinno być createNotifications()
      }
    });
  }

  function askNotificationPermission() {
    function handlePermission(permission) {
      if (!("permission" in Notification)) {
        Notification.permission = permission;
      }

      if (
        Notification.permission === "denied" ||
        Notification.permission === "default"
      ) {
        notificationBtn.style.display = "block";
      } else {
        notificationBtn.style.display = "none";
      }
    }

    if (!"Notification" in window) {
      console.log("This browser does not support notifications.");
    } else {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then((permission) => {
          handlePermission(permission);
        });
      } else {
        Notification.requestPermission(function (permission) {
          handlePermission(permission);
        });
      }
    }
  }

  function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }

    return true;
  }

  notificationBtn.addEventListener("click", askNotificationPermission);

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
      msgboxbox.show(obj.notification[i].message);
      createNotification(obj.notification[i].message);
    }
    //msgboxbox.show(obj.notification[0].message, null);
    //msgboxNoClose.show(obj.notification[1].message);
    // msgboxboxPersistent.show(obj.notification[1].message);
    //createNotification(obj.notification[0].message);
    //createNotification(obj.notification[1].message);
  }
  setInterval(checkStates, 10000); //co ile czasu wysyłamy geta?
};
