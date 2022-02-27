let db;
const request = indexedDB.open("budgettracker", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("enterSpending", {autoIncrement: true});
};
request.onsuccess = function (event) {
    db = event.target.result;
  
    if (navigator.onLine) {
      (searchDatabase);
    }
  };
  
  request.onerror = function (event) {
    console.log("There is an error..." + event.target.errorCode);
  };

function saveRecord(record) {
    const transaction = db.transaction(["enterSpending"], "readwrite");
  
    const store = transaction.objectStore("enterSpending");
  
    store.add(record);
  }
  function searchDatabase() {
    const transaction = db.transaction(["enterSpending"], "readwrite");
  
    const store = transaction.objectStore("enterSpending");
  
    const getAll = store.getAll();
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
          fetch("/api/transaction", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
          })
          .then((response) => response.json())
          .then((serverResponse) => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
            const transaction = db.transaction(["enterSpending"], "readwrite");
            const store = transaction.objectStore("enterSpending");
            store.clear();
  
            alert("Spending tracking has been submitted.");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }
  window.addEventListener("online", searchDatabase);