const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    location.href = 'login.html';
}

const hariIni = new Date().toISOString().slice(0, 10);

let siswa = [];
let statusSiswa = {};

loadData();

async function loadData() {

    // Tanggal
    document.getElementById('tanggal').innerText =
        new Date().toLocaleDateString(
            'id-ID',
            {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        );

    // Nama kelas
    const { data: kelas } =
        await supabaseClient
            .from('kelas')
            .select('nama_kelas')
            .eq('id', user.kelas_id)
            .single();

    if (kelas) {
        document.getElementById('namaKelas')
            .innerText = kelas.nama_kelas;
    }

    // Ambil siswa
    const { data, error } =
        await supabaseClient
            .from('siswa')
            .select('*')
            .eq('kelas_id', user.kelas_id)
            .order('nama');

    if (error) {
        console.log(error);
        return;
    }

    siswa = data || [];

    // Default semua siswa Hadir
    statusSiswa = {};

    siswa.forEach(s => {
        statusSiswa[s.id] = 'Hadir';
    });

    // Ambil absensi hari ini jika sudah ada
    const ids = siswa.map(s => s.id);

    if (ids.length > 0) {

        const {
            data: absenHariIni
        } =
            await supabaseClient
                .from('absensi')
                .select('*')
                .eq('tanggal', hariIni)
                .in('siswa_id', ids);

        if (absenHariIni) {
            absenHariIni.forEach(a => {
                statusSiswa[a.siswa_id] =
                    a.status;
            });
        }
    }

    render();
}

function render() {

    let html = '';

    siswa.forEach(s => {

        const status =
            statusSiswa[s.id];

        const warna =
            'status-' +
            status.toLowerCase();

        html += `
        <div class="siswa-card">

            <div class="nama">
                ${s.nama}
            </div>

            <div class="statusAktif">
                Status :
                <span class="${warna}">
                    ${status.toUpperCase()}
                </span>
            </div>

            <div class="status">

                ${buatButton(
                    s.id,
                    'Hadir',
                    'hadir',
                    status
                )}

                ${buatButton(
                    s.id,
                    'Izin',
                    'izin',
                    status
                )}

                ${buatButton(
                    s.id,
                    'Sakit',
                    'sakit',
                    status
                )}

                ${buatButton(
                    s.id,
                    'Alpha',
                    'alpha',
                    status
                )}

            </div>

        </div>
        `;
    });

    document.getElementById(
        'daftarSiswa'
    ).innerHTML = html;

    updateProgress();
}

function buatButton(
    siswaId,
    value,
    css,
    selected
) {

    const aktif =
        selected === value;

    return `
        <button
            class="
                btnStatus
                ${css}
                ${aktif ? 'selected' : ''}
            "
            onclick="
                pilihStatus(
                    ${siswaId},
                    '${value}'
                )
            ">
            ${aktif ? '✔ ' : ''}
            ${value}
        </button>
    `;
}

function pilihStatus(
    siswaId,
    status
) {
    statusSiswa[siswaId] = status;
    render();
}

function updateProgress() {

    const jumlah =
        Object.keys(statusSiswa).length;

    document.getElementById('progress')
        .innerText =
        `${jumlah} / ${siswa.length}`;
}

async function simpanAbsensi() {

    const dataInsert = [];

    siswa.forEach(s => {

        dataInsert.push({
            tanggal: hariIni,
            siswa_id: s.id,
            status: statusSiswa[s.id],
            petugas_id: user.id
        });

    });

    const { error } =
        await supabaseClient
            .from('absensi')
            .upsert(
                dataInsert,
                {
                    onConflict:
                        'siswa_id,tanggal'
                }
            );

    if (error) {
        console.log(error);
        alert(error.message);
        return;
    }

    alert(
        'Absensi berhasil disimpan.'
    );

    loadData();
}
