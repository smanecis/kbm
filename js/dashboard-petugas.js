const user =
JSON.parse(localStorage.getItem('user'));

if (!user) {
    location.href = 'login.html';
}

document.getElementById('judul')
.innerHTML =
`Selamat Datang ${user.nama}`;

document.getElementById('kelasPetugas')
.innerHTML =
`Petugas Kelas ID : ${user.kelas_id}`;
