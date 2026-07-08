const user =
JSON.parse(
    localStorage.getItem('user')
);

if (!user) {
    location.href =
        'login.html';
}

const hariIni =
new Date()
.toISOString()
.slice(0,10);

loadKelas();
loadJurnal();

async function loadKelas(){

    const { data } =
        await supabaseClient
        .from('kelas')
        .select('nama_kelas')
        .eq('id', user.kelas_id)
        .single();

    if (data) {
        document
        .getElementById(
            'kelasPetugas'
        )
        .innerText =
        data.nama_kelas;
    }
}

async function loadJurnal(){

    const { data } =
        await supabaseClient
        .from('jurnal_kelas')
        .select('*')
        .eq('tanggal', hariIni)
        .eq('kelas_id', user.kelas_id)
        .order('jam_ke');

    let html = '';

    data.forEach(j=>{

        html += `
        <tr>
            <td>${j.jam_ke}</td>
            <td>${j.mapel}</td>
            <td>${j.guru}</td>
            <td>${j.jenis_kbm}</td>
        </tr>
        `;
    });

    document
        .getElementById(
            'dataJurnal'
        )
        .innerHTML = html;
}
