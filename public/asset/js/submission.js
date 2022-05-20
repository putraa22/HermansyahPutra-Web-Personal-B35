const emailReceiver = 'hermansyahputra0418@gmail.com'


function submitForm() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let subject = document.getElementById('subject').value;
    let pesan = document.getElementById('pesan').value;

    if (name == '') {
        alert('Tolong isi namanya dulu ya..');
    }
    if (email == '') {
        alert('Email wajib diisi...');
    }
    if (phone == '') {
        alert('Masukkan Nomor Handphone');
    }
    if (subject == '') {
        alert('Silahkan pilih salah satu..');
    }

    if (pesan == '') {
        alert('Tolong masukkan pesan anda..');
    }

    let a = document.createElement('a');
    a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo, Perkenalkan Nama saya ${name}. Saya ingin mengetahui ${subject}, ${pesan} terimakasih`;
    a.click();



}