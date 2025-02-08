// 設備データを保存する配列
let equipmentData = JSON.parse(localStorage.getItem("equipmentData")) || [];

// 設備を登録
function registerEquipment() {
    let name = document.getElementById("equipment-name").value;
    let model = document.getElementById("model-number").value;
    let purchaseDate = document.getElementById("purchase-date").value;
    let warrantyDate = document.getElementById("warranty-date").value;
    let nextInspectionDate = document.getElementById("next-inspection-date").value;
    let inspectionStatus = document.getElementById("inspection-status").value;
    let notes = document.getElementById("notes").value;

    if (!name || !model || !purchaseDate || !warrantyDate || !nextInspectionDate) {
        alert("すべての項目を入力してください");
        return;
    }

    let newEquipment = { name, model, purchaseDate, warrantyDate, nextInspectionDate, inspectionStatus, notes };
    equipmentData.push(newEquipment);
    localStorage.setItem("equipmentData", JSON.stringify(equipmentData));

    alert("設備が登録されました");
}

// 設備リストを表示
function displayEquipmentList() {
    let list = document.getElementById("equipment-list");
    if (!list) return;

    // デバッグ用ログ
    console.log("現在の設備データ:", equipmentData);

    list.innerHTML = "";

    if (equipmentData.length === 0) {
        list.innerHTML = "<p>登録された設備がありません。</p>";
        return;
    }

    equipmentData.forEach((equipment) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${equipment.name} (${equipment.model})</strong><br>
            設備名 ${equipment.purchaseDate} | 場所 ${equipment.warrantyDate}<br>
            <span style="color: ${equipment.inspectionStatus === 'あり' ? 'red' : 'green'}">
                異常: ${equipment.inspectionStatus}
            </span><br>
            次回点検日: ${equipment.nextInspectionDate}<br>
            備考: ${equipment.notes}
        `;
        list.appendChild(li);
    });
}

// 通知機能
function checkInspectionNotifications() {
    let today = new Date().toISOString().split("T")[0];

    equipmentData.forEach((equipment) => {
        if (equipment.nextInspectionDate === today) {
            if (Notification.permission === "granted") {
                new Notification("点検リマインダー", {
                    body: `設備「${equipment.name}」の点検日です！`,
                    icon: "https://www.example.com/icon.png", // 任意でアイコンを設定
                    tag: "inspection-reminder"
                });
            }
        }
    });
}

// 通知を許可する
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("通知の許可がされました");
            } else {
                console.log("通知の許可がされませんでした");
            }
        });
    }
}

// ページ読み込み時にリストを表示
document.addEventListener("DOMContentLoaded", () => {
    displayEquipmentList();
    requestNotificationPermission(); // 通知の許可をリクエスト

    checkInspectionNotifications(); // 次回点検日の通知をチェック
});
