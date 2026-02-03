const ESP_IP = "192.168.4.1";

function sendDMX(channels) {
  fetch(`http://${ESP_IP}/dmx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      universe: 0,
      channels: channels
    })
  })
  .then(() => console.log("DMX sendt"))
  .catch(err => alert("Kunne ikke sende DMX"));
}

function test() {
  let channels = Array(512).fill(0);

  channels[144] = 255;
  channels[145] = 255;
  channels[146] = 255;
  channels[147] = 255;

  sendDMX(channels);
}
