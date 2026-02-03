const ESP_IP = "http://192.168.1.123"; // ← ret til din ESP IP

function sendDMX(channel, value) {
  const url = `${ESP_IP}/dmx?ch=${channel}&val=${value}`;
  fetch(url).catch(err => console.error(err));
}

function testChannels145_148() {
  const channels = [145, 146, 147, 148];

  // tænd alle
  channels.forEach(ch => sendDMX(ch, 255));

  // sluk efter 2 sek
  setTimeout(() => {
    channels.forEach(ch => sendDMX(ch, 0));
  }, 2000);
}
