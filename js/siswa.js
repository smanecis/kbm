let semuaSiswa = [];

loadKelas();
loadSiswa();

async function loadKelas() {

    const { data } =
        await supabaseClient
        .from('kelas')
        .select('*')
        .order('nama_kelas');

    let html = "";

    data.forEach(k => {
        html += `
        <option value="${k.id}">
            ${k.nama_kelas}
        </option>
        `;
    });

    document.getElementById('kelas')
        .innerHTML = html;
}

async function loadSiswa() {

    const { data, error } =
        await supabaseClient
        .from('siswa')
        .select(`
            *,
            kelas (
                nama_kelas
            )
        `)
        .order('nama');

    if (error) {
        console.log(error);
        return;
    }

    semuaSiswa = data;

    tampilkan(data);
}

function tampilkan(data){

    let html = "";

    data.forEach((s, i) => {

        html += `
        <tr>
            <td>${i+1}</td>
            <td>${s.nis ?? ''}</td>
            <td>${s.nama}</td>
            <td>${s.kelas?.nama_kelas ?? '-'}</td>
            <td>
                <button
                class="btnHapus"
                onclick="hapusSiswa(${s.id})">
                Hapus
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById('dataSiswa')
        .innerHTML = html;
}

async function tambahSiswa() {

    const nis =
        document.getElementById('nis').value;

    const nama =
        document.getElementById('nama').value;

    const kelas =
        document.getElementById('kelas').value;

    if (nama === "") {
        alert("Nama siswa harus diisi");
        return;
    }

    const { error } =
        await supabaseClient
        .from('siswa')
        .insert({
            nis,
            nama,
            kelas_id: kelas
        });

    if (error) {
        alert(error.message);
        return;
    }

    document.getElementById('nis').value = "";
    document.getElementById('nama').value = "";

    loadSiswa();
}

async function hapusSiswa(id) {

    if (!confirm('Hapus siswa?'))
        return;

    await supabaseClient
        .from('siswa')
        .delete()
        .eq('id', id);

    loadSiswa();
}

function cariSiswa(){

    const keyword =
        document.getElementById('cari')
        .value
        .toLowerCase();

    const hasil =
        semuaSiswa.filter(s =>
            s.nama.toLowerCase()
            .includes(keyword)
        );

    tampilkan(hasil);
}
