var token = localStorage.getItem('token');
if(!token) window.location.href = './login.html';

(function find_user_data() {

    var user_ = document.getElementById('user_');

    var apiUrl = 'https://a002-105-160-43-36.ngrok.io/jess/api/users./get_single.php';

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

function find_parking() {
    var parkingDiv = document.getElementById('park-container');

    var apiUrl = 'https://a002-105-160-43-36.ngrok.io/jess/api/parking/find_available.php';

    var data = {
        url: apiUrl,
        method: 'GET'
    };

    axios(data)
    .then((result) => {
        var parkingSpaces = result.data.data;

        if(result.data.Message) {
            if(result.data.Message.includes('No parking') || parkingSpaces.length < 1) {
                parkingDiv.innerHTML = `
                <h3>Looking for parking?</h3>
                <div style = "margin-top: 150px;"></div>
                <h4>Check back later. There are no available spots at the moment</h4>`;
            }
        } else {

            parkingDiv.innerHTML = `
            <h3>Looking for parking?</h3>
            <h4>Here are a few available spots.</h4>`;
        
            for(var i = 0; i < parkingSpaces.length; i++) {
                parkingDiv.innerHTML += `
                    <div class="park-content">
                        <h5>Space:&emsp;<span class = "park-span">${parkingSpaces[i].space}</span></h5>
                        <h5>Spots available:&emsp;<span class = "park-span">${parkingSpaces[i].spots}</span></h5>
                        <h5>Price per spot:&emsp;<span class = "park-span">KES. ${parkingSpaces[i].priceperspot}</span></h5>
                        <button class = "btn" id = 'btn-${parkingSpaces[i].id}'>Book Now</button>
                    </div>
                `;
            }
        }

        book_spot();

    })
    .catch((e) => {
        console.log(e);
    });
};

find_parking();

var buttons = document.getElementsByClassName('btn');


function book_spot() {
    setTimeout(() => {
        for(var i = 0; i < buttons.length; i ++) {
    
            buttons[i].onclick = function(e) {
                e.preventDefault();
    
                var spot_id = e.target.id.split('-')[1];
    
                var apiUrl = 'https://a002-105-160-43-36.ngrok.io/jess/api/parking/book_space.php?id='+spot_id;

                var twoHours = new Date().getHours() + 2;
    
                var data = {
                    url: apiUrl,
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    data: {
                        date: new Date().getFullYear() + '/' + new Date().getMonth() +  '/' + new Date().getDate() + ' : ' + new Date().getHours() + ':' + new Date().getMinutes(),
                        datedue: new Date().getFullYear() + '/' + new Date().getMonth() +  '/' + new Date().getDate() + ' : ' + twoHours + ':' + new Date().getMinutes()
                    }
                };
    
                axios(data)
                .then((result) => {
                    console.log(result);
                    alert(result.data.Message || result.data.Error);
    
                    find_parking();
                })
                .catch((e) => {
                    console.log(e);
                });
            }
        }
    }, 2000);
};
