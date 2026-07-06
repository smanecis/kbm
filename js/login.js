async function login() {

    const username =
        document.getElementById('username')
        .value
        .trim();

    const password =
        document.getElementById('password')
        .value
        .trim();

    if (username === '' || password === '') {
        alert('Username dan password harus diisi.');
        return;
    }

    const { data, error } =
        await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

    if (error || !data) {
        alert('Username atau password salah.');
        return;
    }

    // Simpan data user yang login
    localStorage.setItem(
        'user',
        JSON.stringify(data)
    );

    // Arahkan sesuai role
    if (data.role === 'admin') {
        window.location.href =
            'dashboard.html';
    }
    else if (data.role === 'petugas') {
        window.location.href =
            'dashboard-petugas.html';
    }
    else if (data.role === 'guru') {
        window.location.href =
            'dashboard-guru.html';
    }
    else {
        alert('Role user tidak dikenali.');
        localStorage.removeItem('user');
    }
}
