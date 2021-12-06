var btn = document.getElementById('logout');

btn.onclick= function() {
    localStorage.removeItem('token');
    window.location.reload();
};