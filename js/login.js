async function login() {
  const username =
    document.getElementById('username').value;

  const password =
    document.getElementById('password').value;

  const { data, error } =
    await supabaseClient
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

  if (data) {
    localStorage.setItem(
      'user',
      JSON.stringify(data)
    );

    window.location =
      'dashboard.html';
  } else {
    alert('Username atau password salah');
  }
}
