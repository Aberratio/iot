const notificationBtn = document.getElementById("enable");

if (
  Notification.permission === "denied" ||
  Notification.permission === "default"
) {
  notificationBtn.style.display = "block";
} else {
  notificationBtn.style.display = "none";
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

    // 1. create get request /notifications
    // 2. if response.errorCode === 200 => nic się nie dzieje
    // 3. else if response.errorCode === jakiś inny (jaki?) => const notificationMessage (to jest tablica stringów) = response.payload
    // 3a. createNotification w pętli dla każdego stringa z powyższej tablicy (oczywiście po sprawdzeniu ifa z perrmision)

    if (Notification.permission === "granted") {
      createNotification(
        "tutaj będzie string z tablicy wiadomości otrzymanych getem z serwera"
      );
    }
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
  setInterval(checkStates, 10000); //co ile czasu wysyłamy geta?
};
