const user =
JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location = 'login.html';
}

document.getElementById('namaAdmin')
.innerHTML =
`Selamat Datang, ${user.nama}`;
    
function logout() {
    localStorage.removeItem('user');
    window.location = 'login.html';
}
