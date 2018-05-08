const url = "https://reqres.in/api/users/";
const pageUrl = "https://reqres.in/api/users?page=";
let page = document.getElementById("pager").value;
let userTable = document.getElementById("userTable");
let picture;
let users = [];

//resets user table without deleting header row -- invoked whenever a new 
//server request is made.
function reset() {
    let rowCount = document.getElementById("userTable").rows.length;
    if (users) {
        for (i = rowCount - 1; i > 0; i--) {
            userTable.deleteRow(i);
        }
    }
    resetImage();
}

function resetImage() {
    if (!users) {

        picture = document.getElementById("picture");
        picture.innerHTML = `
        <h3>Requested image will be displayed upon clicking the GET button. </h3>
        `
    }
}

//plants the 'avatar'(image) of the first user in the users array in html.
function setUserImage(avatar) {
    picture = document.getElementById("picture");
    picture.innerHTML = `<img src=` + avatar + `>`

}

//plants json properties in html table
function setUserTable(user, index) {

    let row = userTable.insertRow(index + 1);
    let i = 0;
    for (key in user) {
        let cell = row.insertCell(i++)
        cell.innerHTML = user[key];
    }
}

/*
Starts the promise chain
    Assuming promises are resolved:
        1) resets table
        2)calls get request from backend
        3)sets user table with the properties of received json, depending on page.
        4)gets id of first user and sends a request for that specific user
        5)plants avatar of user in html.
*/
function startPromiseChain() {
    //1
    reset();
    page = document.getElementById("pager").value;
    //2
    fetch(pageUrl + page)
        .then(r => {
            if (r.ok)
                return r.json();
        })
        .then(json => {
            users = json.data;
            //3
            for (i = 0; i < users.length; i++) {
                let user = users[i];
                setUserTable(user, i);
            }
            //4
            let id = json.data[0].id
            return fetch(url + id)
        })
        .then(response => {
            if (response.ok)
                return response.json();
        })
        .then(json => {
            //5
            setUserImage(json.data.avatar);
        })
        .catch(
            (
                () => {
                    console.log("error in request")
                })

        );

}