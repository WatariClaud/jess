var token = localStorage.getItem('token');
if(!token) window.location.href = './login.html';

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

function find_tickets() {

    var parkingDivActive = document.getElementById('park-container-active');

    var parkingDivInactive = document.getElementById('park-container-inactive');

    var parkingTitleActive = document.getElementById('active-tickets');

    var parkingTitleInactive = document.getElementById('inactive-tickets');

    var apiUrl = 'https://jess-parking-app.herokuapp.com/api/tickets/user_tickets.php';

    var data = {
        url: apiUrl,
        method: 'GET',
        headers: {
            'Authorization': token
        }
    };

    axios(data)
    .then((result) => {
        var tickets = result.data.data;

        if(result.data.Message) {
            if(result.data.Message.includes('No tickets') || tickets.length < 1) {
                parkingDivActive.classList.add('hidden');
                parkingDivInactive.innerHTML = `
                <h3>Your tickets</h3>
                <div style = "margin-top: 150px;"></div>
                <h4>Check back later. There are no available tickets at the moment</h4>`;
            }
        } else {
            for(var i = 0; i < tickets.length; i++) {

                if(tickets[i].status === 'active') {

                    parkingTitleActive.classList.remove('hidden');

                    parkingTitleActive.textContent = 'Your active tickets';

                    parkingDivActive.innerHTML += `
                        <div class="park-content">
                            <h5>Ticket id:&emsp;<span class = "park-span">${tickets[i].id}</span></h5>
                            <h5>Location:&emsp;<span class = "park-span">${tickets[i].spaceid}</span></h5>
                            <h5>Status:&emsp;<span class = "park-span">${tickets[i].status}</span></h5>
                            <h5>Date issued:&emsp;<span class = "park-span">${tickets[i].datecreated}</span></h5>
                            <h5>Amount Due:&emsp;<span class = "park-span">KES. ${tickets[i].amount}</span></h5>
                            <h5>Date Due:&emsp;<span class = "park-span">${tickets[i].datepaid}</span></h5>
                            <button class = "btn amt amount-${tickets[i].amount}" id = 'btn-${tickets[i].id}'>Pay Ticket </button>
                        </div>
                    `;
                } else {
            
                    parkingTitleInactive.classList.remove('hidden');

                    parkingTitleInactive.textContent = 'Your ticket log';
                    
                    parkingDivInactive.innerHTML += `
                        <div class="park-content">
                            <h5>Ticket id:&emsp;<span class = "park-span">${tickets[i].id}</span></h5>
                            <h5>Location:&emsp;<span class = "park-span">${tickets[i].spaceid}</span></h5>
                            <h5>Status:&emsp;<span class = "park-span">${tickets[i].status}</span></h5>
                            <h5>Date issued:&emsp;<span class = "park-span">${tickets[i].datecreated}</span></h5>
                            <h5>Date paid:&emsp;<span class = "park-span">${tickets[i].datepaid}</span></h5>
                            <h5>Amount:&emsp;<span class = "park-span">KES. ${tickets[i].amount}</span></h5>
                        </div>
                    `;
                }
            }
        }
        pay_ticket();
    })
    .catch((e) => {
        console.log(e);
    });
};

var buttons = document.getElementsByClassName('btn');


function pay_ticket() {
    setTimeout(() => {
        for(var i = 0; i < buttons.length; i ++) {
    
            buttons[i].onclick = function(e) {
                e.preventDefault();
    
                var ticket_id = e.target.id.split('-')[1];
    
                var apiUrl = 'https://jess-parking-app.herokuapp.com/api/tickets/pay_ticket.php?id='+ticket_id;
                                
                var amounts = document.getElementsByClassName('amt');

                var amount = 0;

                for(var i = 0; i < amounts.length; i ++) {
                    console.log(amounts[i].className.split('-')[1]);
                    amount = amounts[i].className.split('-')[1];
                }
    
                var data = {
                    url: apiUrl,
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    data: {
                        amount: amount,
                        datepaid:new Date().getFullYear() + '/' + new Date().getMonth() +  '/' + new Date().getDate() + ' : ' + new Date().getHours() + ':' + new Date().getMinutes()
                    }
                };
    
                axios(data)
                .then((result) => {
                    console.log(result);
                    alert(result.data.Message || result.data.Error);
    
                    window.location.reload();
                })
                .catch((e) => {
                    console.log(e);
                });
            }
        }
    }, 2000);
};

find_tickets();
