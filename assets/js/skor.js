

const getUrlParameter = (sParam) => {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};

const hitungSkor = async() => {
  let skor = {
    twk : 0,
    tiu : 0,
    tkp : 0
  }
  let paket = getUrlParameter('paket')
  let res = await fetch(`./assets/paketFree/${paket}.json`)
  let dataSoal = await res.json()
  let arrJawaban = JSON.parse(localStorage.getItem('jawaban'))

  for(i = 0; i < arrJawaban.length; i++) {
    if(i < 30) { // twk sampe nomor 30
      if(arrJawaban[i] == dataSoal[i].kunci) { // jika jawaban == kunci
        skor.twk += 5
      }
    }

    if(i >= 30 && i < 65 ) { // tiu 31 - 65
      if(arrJawaban[i] == dataSoal[i].kunci) {
        skor.tiu += 5
      }
    }

    if(i >= 65) {
      let indexOpsi = dataSoal[i].opsi.indexOf(arrJawaban[i])
      let skorTemp = dataSoal[i].kunci[indexOpsi]

      skor.tkp += skorTemp
    }
  }

  showSkor(skor)

}

const showSkor = (skor) => {
  let {twk, tiu, tkp} = skor
  let passGrade = {
    twk : 65,
    tiu : 80,
    tkp : 166
  }
  let ket = {
    lolos : `<span class="badge bg-primary">Lolos nilai <i>passing grade</i></span>`,
    gagal : `<span class="badge bg-danger">Tidak lolos <i>passing grade</i></span>`
  }
  $('#skor-twk').text(twk)
  $('#skor-tiu').text(tiu)
  $('#skor-tkp').text(tkp)
  $('#total-skor').text( twk + tiu + tkp )
  $('#ket-twk').html(twk > passGrade.twk ?  ket.lolos : ket.gagal)
  $('#ket-tiu').html(tiu > passGrade.tiu ?  ket.lolos : ket.gagal)
  $('#ket-tkp').html(tkp > passGrade.tkp ?  ket.lolos : ket.gagal)

  if(tiu > passGrade.tiu && twk > passGrade.twk && tkp > passGrade.tkp) {
    $('#keterangan-lolos')
      .addClass('text-primary')
      .html(`Selamat, anda <strong>lolos</strong> ke tahap selanjutnya!`)
  } else {
    $('#keterangan-lolos')
      .addClass('text-danger')
      .html(`Maaf, anda <strong>tidak lolos</strong> ke tahap selanjutnya!`)
  }
}

window.onload = () => {
  hitungSkor()
}
