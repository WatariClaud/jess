var token = localStorage.getItem('token');
if(!token) window.location.href = '../login.html';

(function find_user_data() {

    var user_ = document.getElementById('user_');

    var apiUrl = 'https://jess-parking-app.herokuapp.com/api/users/get_single.php';

    var data = {
        url: apiUrl,
        method: 'GET',
        headers: {
            'Authorization': token
        },
    };

    axios(data)
    .then((result) => {
        user_.textContent = result.data.name;
    })
    .catch((error) => {
        console.log(error.response);
    });

})()

function add_parking(e) {

    e.preventDefault();

    var name = document.getElementById('name');

    var spots = document.getElementById('number');

    var price = document.getElementById('price');

    name = name.value;
    spots = spots.value;
    price = price.value;

    var apiUrl = 'https://jess-parking-app.herokuapp.com/api/parking/add_space.php';

    var data = {
        url: apiUrl,
        method: 'POST',
        headers: {
            'Authorization': token
        },
        data: {
            space: name,
            spots: spots,
            priceperspot: price
        }
    };
    console.log(data.data);

    axios(data)
    .then((result) => {
       console.log(result.data);

       alert(result.data.Message);
    })
    .catch((e) => {
        console.log(e);
    });
};

var button = document.getElementById('submit');

button.addEventListener('click', add_parking);

const menu_toggle = document.getElementById('menu');

const menu_item = document.getElementById('menu-container');

menu_toggle.addEventListener('click', () => {
    menu_item.classList.contains('hidden') ? menu_item.classList.remove('hidden') : menu_item.classList.add('hidden');
});
