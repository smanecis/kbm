const user =
    JSON.parse(localStorage.getItem('user'));

if (!user) {
    location.href = 'login.html';
}

document.getElementById('namaPetugas')
.innerHTML = `Selamat Datang,<br>${user.nama}`;

loadDashboard();

async function loadDashboard() {

    const today =
        new Date().toLocaleDateString(
            'id-ID',
            {
                weekday:'long',
                day:'2-digit',
                month:'long',
                year:'numeric'
            }
        );

    document.getElementById('tanggal')
        .innerText = today;

    const { data: kelas } =
        await supabaseClient
        .from('kelas')
        .select('nama_kelas')
        .eq('id', user.kelas_id)
        .single();

    if (kelas) {
        document.getElementById(
            'kelasPetugas'
        ).innerText =
        `Petugas ${kelas.nama_kelas}`;
    }

    const { count: jumlahSiswa } =
        await supabaseClient
        .from('siswa')
        .select('*',
            { count:'exact', head:true }
        )
        .eq('kelas_id',
            user.kelas_id);

    document.getElementById(
        'jumlahSiswa'
    ).innerText =
    jumlahSiswa || 0;

    const hariIni =
        new Date()
        .toISOString()
        .slice(0,10);

    const { count: jumlahAbsen } =
        await supabaseClient
        .from('absensi')
        .select('*',
            { count:'exact', head:true }
        )
        .eq('tanggal', hariIni)
        .eq('petugas_id', user.id);

    document.getElementById(
        'jumlahAbsen'
    ).innerText =
    jumlahAbsen || 0;
}

function logout() {
    localStorage.removeItem('user');
    location.href = 'login.html';
}
