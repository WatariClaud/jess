var token = localStorage.getItem('token');
if(!token) window.location.href = './login.html';

(function find_user_data() {

    var user_ = document.getElementById('user_');

    var apiUrl = 'https://jess-production.up.railway.app/api/users/get_single.php';

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

    var apiUrl = 'https://jess-production.up.railway.app/api/tickets/user_tickets.php';

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
        show_modal();
    })
    .catch((e) => {
        console.log(e);
    });
};

var buttons = document.getElementsByClassName('btn');


function show_modal() {
    for(var i = 0; i < buttons.length; i ++) {
    
        buttons[i].onclick = function(e) {
            e.preventDefault();

            const modal = document.getElementById('modal');

            modal.classList.remove('hidden');

            modal.innerHTML = `
                
                <div class="modal-content">
                <span id="hide">X</span>
                <h2>Pay with</h2>
                <ul>
                    <li>
                        <input type="radio" id="mpesa" name="payment" value="mpesa">
                        <label for="html"><img src="../assets/images/mpesa.jpg" alt="" class = 'icon'> MPesa</label>
                    </li>
                    <li>
                        <input type="radio" id="kcb" name="payment" value="kcb">
                        <label for="html"><img src="../assets/images/kcb.png" alt="" class = 'icon'> KCB</label>
                    </li>
                    <li>
                        <input type="radio" id="visa" name="payment" value="visa">
                        <label for="html"><img src="../assets/images/visa.png" alt="" class = 'icon'> Visa</label>
                    </li>
                    <li>
                        <input type="radio" id="equity" name="payment" value="equity">
                        <label for="html"><img src="../assets/images/equity.png" alt="" class = 'icon'> Equity</label>
                    </li>
                    <li>
                        <input type="radio" id="mastercard" name="payment" value="mastercard">
                        <label for="html"><img src="../assets/images//mastercard.png" alt="" class = 'icon'> Mastercard</label>
                    </li>
                    <li>
                        <input type="radio" id="airtel" name="payment" value="airtel">
                        <label for="html"><img src="../assets/images/airtel.png" alt="" class = 'icon'> Airtel</label>
                    </li>
                </ul>
                &ensp;<button class = "p-btn" id = '${e.target.id.split('-')[1]}'>Submit Payment</button>
            </div>
            `;

        pay_ticket();
        }
    }
};

function pay_ticket() {
    const submissions =  document.getElementsByClassName('p-btn')[0];

    console.log(submissions);

    submissions.onclick = function(e) {
        
        e.preventDefault();
        let htmlNodes = document.getElementsByName('payment');
        let radioButtonsArray = Array.from(htmlNodes);
            
        let valueChecked = '';
            
        let isAnyRadioButtonChecked = radioButtonsArray.some(element =>{
            element.checked ? valueChecked = element.value : valueChecked = null;
                return element.checked;
        });
        console.log(isAnyRadioButtonChecked);
        !isAnyRadioButtonChecked
        ?
            alert('You must select one payment method')
        :
            (function show_modal() {
                var ticket_id = e.target.id;
                
                var apiUrl = 'https://jess-production.up.railway.app/api/tickets/pay_ticket.php?id='+ticket_id;
                                            
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
                    result.data = [result.data];
                    var msg = Object.values(result.data)[0];
                    var token = Object.values(msg)[1];
                    console.log(msg);

                    alert(typeof(msg) === 'string' ? msg : Object.values(msg)[0]);
                
                    window.location.reload();
                })
                .catch((e) => {
                    console.log(e);
                });
            })();
        console.log(e.target.id);
    }
};

find_tickets();

const menu_toggle = document.getElementById('menu');

const menu_item = document.getElementById('menu-container');

menu_toggle.addEventListener('click', () => {
    menu_item.classList.contains('hidden') ? menu_item.classList.remove('hidden') : menu_item.classList.add('hidden');
});
