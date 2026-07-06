loadKelas();

async function loadKelas() {

    const { data, error } =
        await supabaseClient
        .from('kelas')
        .select('*')
        .order('nama_kelas');

    if (error) {
        console.log(error);
        return;
    }

    let html = "";

    data.forEach((k, i) => {
        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${k.nama_kelas}</td>
            <td>
                <button
                    class="btnHapus"
                    onclick="hapusKelas(${k.id})">
                    Hapus
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("dataKelas")
        .innerHTML = html;
}

async function tambahKelas() {

    const nama =
        document.getElementById("namaKelas").value;

    if (nama === "") {
        alert("Nama kelas harus diisi");
        return;
    }

    const { error } =
        await supabaseClient
        .from('kelas')
        .insert({
            nama_kelas: nama
        });

    if (error) {
        alert(error.message);
        return;
    }

    document.getElementById("namaKelas").value = "";

    loadKelas();
}

async function hapusKelas(id) {

    if (!confirm("Hapus kelas ini?")) return;

    await supabaseClient
        .from('kelas')
        .delete()
        .eq('id', id);

    loadKelas();
}
