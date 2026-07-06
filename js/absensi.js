const user =
JSON.parse(localStorage.getItem('user'));

let siswa = [];

loadSiswa();

async function loadSiswa(){

    const { data } =
        await supabaseClient
        .from('siswa')
        .select('*')
        .eq('kelas_id', user.kelas_id)
        .order('nama');

    siswa = data;

    let html = "";

    data.forEach((s,i)=>{

        html += `
        <tr>
            <td>${i+1}</td>
            <td>${s.nama}</td>
            <td>
                <select
                id="status_${s.id}">
                    <option value="Hadir">
                        Hadir
                    </option>
                    <option value="Sakit">
                        Sakit
                    </option>
                    <option value="Izin">
                        Izin
                    </option>
                    <option value="Alpha">
                        Alpha
                    </option>
                </select>
            </td>
        </tr>
        `;
    });

    document
        .getElementById('dataSiswa')
        .innerHTML = html;
}

async function simpanAbsensi(){

    const dataInsert = [];

    siswa.forEach(s=>{

        const status =
            document.getElementById(
                `status_${s.id}`
            ).value;

        dataInsert.push({
            tanggal:
                new Date()
                .toISOString()
                .slice(0,10),

            siswa_id:s.id,
            status:status,
            petugas_id:user.id
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

    if(error){
        alert(error.message);
        return;
    }

    alert(
        'Absensi berhasil disimpan'
    );
}
