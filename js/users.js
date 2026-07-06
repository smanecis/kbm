loadKelas();
loadUser();

async function loadKelas(){

    const { data } =
        await supabaseClient
        .from('kelas')
        .select('*')
        .order('nama_kelas');

    let html = `
        <option value="">
        Pilih Kelas
        </option>
    `;

    data.forEach(k=>{
        html += `
        <option value="${k.id}">
            ${k.nama_kelas}
        </option>
        `;
    });

    document
        .getElementById('kelas')
        .innerHTML = html;
}

async function loadUser(){

    const { data } =
        await supabaseClient
        .from('users')
        .select(`
            *,
            kelas (
                nama_kelas
            )
        `)
        .order('nama');

    let html = "";

    data.forEach(u=>{

        html += `
        <tr>
            <td>${u.nama}</td>
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td>
                ${u.kelas?.nama_kelas ?? '-'}
            </td>
            <td>
                <button
                class="btnHapus"
                onclick="hapusUser('${u.id}')">
                Hapus
                </button>
            </td>
        </tr>
        `;
    });

    document
        .getElementById('dataUser')
        .innerHTML = html;
}

async function tambahUser(){

    const nama =
        document.getElementById('nama').value;

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    const kelas =
        document.getElementById('kelas').value;

    if(
        nama==='' ||
        username==='' ||
        password===''
    ){
        alert('Lengkapi data');
        return;
    }

    const { error } =
        await supabaseClient
        .from('users')
        .insert({
            nama,
            username,
            password,
            role:'petugas',
            kelas_id:
                kelas === ''
                ? null
                : kelas
        });

    if(error){
        alert(error.message);
        return;
    }

    alert('User berhasil dibuat');

    document.getElementById('nama').value='';
    document.getElementById('username').value='';
    document.getElementById('password').value='';

    loadUser();
}

async function hapusUser(id){

    if(!confirm('Hapus user?'))
        return;

    await supabaseClient
        .from('users')
        .delete()
        .eq('id', id);

    loadUser();
}
