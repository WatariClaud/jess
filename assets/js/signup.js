(function signUp() {
    var token = localStorage.getItem('token');

    if(token) window.location.href = './dashboard.html';
    var button = document.getElementById('submit');
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var passwordInput = document.getElementById('password');

    var apiUrl = 'https://a002-105-160-43-36.ngrok.io/jess/api/users/create.php';

    button.onclick = function(e) {
        e.preventDefault();
        var name = nameInput.value;
        var phone = phoneInput.value;
        var password = passwordInput.value;
        var data = {
            url: apiUrl,
            method: 'POST',
            data: {
                name: name,
                phone: phone,
                password: password
            }
        };

        axios(data)
        .then((result) => {
            console.log(result.data);
            result.data = [result.data];
            var msg = Object.values(result.data)[0];
            var token = Object.values(msg)[1];
            console.log(msg);

            alert(typeof(msg) === 'string' ? msg : Object.values(msg)[0]);

            if(msg.token) {
                localStorage.setItem('token', token);
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 1000);
            }
        })
        .catch((e) => {
            console.log(e);
            if(e.response.Message) alert(e.response.Message);
            if(e.response.Error)  alert(e.response.Error);
        });
    }
})();
