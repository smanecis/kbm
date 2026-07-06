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

async function importExcel() {

    const file =
        document.getElementById('fileExcel')
        .files[0];

    if (!file) {
        alert('Pilih file Excel.');
        return;
    }

    const reader =
        new FileReader();

    reader.onload =
    async function(e){

        const data =
            new Uint8Array(
                e.target.result
            );

        const workbook =
            XLSX.read(data,{
                type:'array'
            });

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        const rows =
            XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            alert('File kosong.');
            return;
        }

        let dataImport = [];

        for (const row of rows) {

            const namaKelas =
                row.kelas?.toString().trim();

            const { data: kelas } =
                await supabaseClient
                .from('kelas')
                .select('id')
                .eq(
                    'nama_kelas',
                    namaKelas
                )
                .single();

            if (!kelas) {
                continue;
            }

            dataImport.push({
                nis: row.nis?.toString(),
                nama: row.nama,
                kelas_id: kelas.id
            });
        }

        if (dataImport.length === 0) {
            alert(
              'Tidak ada data yang bisa diimport.'
            );
            return;
        }

        const { error } =
            await supabaseClient
            .from('siswa')
            .insert(dataImport);

        if (error) {
            alert(error.message);
            return;
        }

        alert(
          dataImport.length +
          ' siswa berhasil diimport.'
        );

        loadSiswa();
    };

    reader.readAsArrayBuffer(file);
}

function downloadTemplate(){

    const data = [
        {
            nis:'24001',
            nama:'Ahmad Fauzan',
            kelas:'X IPA 1'
        }
    ];

    const ws =
        XLSX.utils.json_to_sheet(data);

    const wb =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        'Siswa'
    );

    XLSX.writeFile(
        wb,
        'template_siswa.xlsx'
    );
}
