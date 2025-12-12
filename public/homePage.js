"use strict"
const logout = new LogoutButton();
logout.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    })
}


ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data)
    }
})

const rates = new RatesBoard();

function getStock() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(response.data)
        }
    })
}

getStock()
setInterval(getStock, 60000);



const moneyM = new MoneyManager();
moneyM.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyM.setMessage(response.success, `Операция прошла успешно! Баланс пополнен на ${data.amount} ${data.currency} `);
        } else {
            moneyM.setMessage(response.error, `К сожалению, не удалось пополнить Ваш баланс. Ошибка: ${response.error}`);
        }
    })
}


moneyM.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyM.setMessage(response.success, `Конвертация прошла успешно! ${data.fromCurrency} конвертированы в ${data.targetCurrency} `);
        } else {
            moneyM.setMessage(response.error, `К сожалению, не удалось конвертировать денежные средства. Ошибка: ${response.error}`);
        }
    })
}

moneyM.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyM.setMessage(response.success, `Перевод ${data.amount} ${data.currency} в  ${data.to} выполнен!`);
        } else {
            moneyM.setMessage(response.error, `К сожалению, не удалось перевести денежные средства. Ошибка: ${response.error}`);
        }
        moneyM
    })
}


const favourite = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
        favourite.clearTable();
        favourite.fillTable(response.data);
        moneyM.updateUsersList(response.data)
    }

})

favourite.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favourite.clearTable();
            favourite.fillTable(response.data);
            moneyM.updateUsersList(response.data)
            moneyM.setMessage(response.success, `${data.name} был успешно добавлен в список избранных`);
        } else {
            moneyM.setMessage(response.error, `К сожалению, не удалось добавить ${data.name} в список избранных. Ошибка: ${response.error}`);
        }
    })
}

favourite.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favourite.clearTable();
            favourite.fillTable(response.data);
            moneyM.updateUsersList(response.data)
            moneyM.setMessage(response.success, `Пользователь ${data} был удален из списка избранных`);
        } else {
            moneyM.setMessage(response.error, `К сожалению, не удалось удалить пользователя ${data} из списка избранных. Ошибка: ${response.error}`);
        }
    })
} 

