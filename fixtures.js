const fixtures = [

  /* =============================
     60 LED PAR (Ali-lamper)
     ============================= */

  {
    id: "par_front_left",
    name: "60 LED PAR – Front Left",
    type: "par_rgb_master",
    address: 1,
    position: "front_left",
    channels: {
      master: 1,
      red: 2,
      green: 3,
      blue: 4,
      strobe: 5,
      effect: 6,
      speed: 7
    },
    role: ["wash", "background"]
  },

  {
    id: "par_front_right",
    name: "60 LED PAR – Front Right",
    type: "par_rgb_master",
    address: 17,
    position: "front_right",
    channels: {
      master: 1,
      red: 2,
      green: 3,
      blue: 4,
      strobe: 5,
      effect: 6,
      speed: 7
    },
    role: ["wash", "background"]
  },

  {
    id: "par_back_left",
    name: "60 LED PAR – Back Left (Vault)",
    type: "par_rgb_master",
    address: 33,
    position: "back_left",
    channels: {
      master: 1,
      red: 2,
      green: 3,
      blue: 4,
      strobe: 5,
      effect: 6,
      speed: 7
    },
    role: ["wash", "background"]
  },

  {
    id: "par_back_right",
    name: "60 LED PAR – Back Right (Vault)",
    type: "par_rgb_master",
    address: 49,
    position: "back_right",
    channels: {
      master: 1,
      red: 2,
      green: 3,
      blue: 4,
      strobe: 5,
      effect: 6,
      speed: 7
    },
    role: ["wash", "background"]
  },

  /* =============================
     Moving Heads – 7x12W
     ============================= */

  {
    id: "mh_left",
    name: "Moving Head – Left (Arch)",
    type: "moving_head_rgbw",
    address: 65,
    position: "arch_left",
    channels: {
      pan: 1,
      pan_fine: 2,
      tilt: 3,
      tilt_fine: 4,
      speed: 5,
      dimmer: 6,
      strobe: 7,
      color_macro: 8,
      macro_speed: 9,
      red: 10,
      green: 11,
      blue: 12,
      white: 13,
      reset: 14
    },
    role: ["movement", "accent"]
  },

  {
    id: "mh_right",
    name: "Moving Head – Right (Arch)",
    type: "moving_head_rgbw",
    address: 81,
    position: "arch_right",
    channels: {
      pan: 1,
      pan_fine: 2,
      tilt: 3,
      tilt_fine: 4,
      speed: 5,
      dimmer: 6,
      strobe: 7,
      color_macro: 8,
      macro_speed: 9,
      red: 10,
      green: 11,
      blue: 12,
      white: 13,
      reset: 14
    },
    role: ["movement", "accent"]
  },

  /* =============================
     Battery LED PAR – RGBWAUV
     ============================= */

  {
    id: "bat_front_left",
    name: "Battery PAR – Front Left",
    type: "par_rgbwauv",
    address: 97,
    position: "side_front_left",
    channels: {
      red: 1,
      green: 2,
      blue: 3,
      white: 4,
      amber: 5,
      uv: 6
    },
    role: ["accent"]
  },

  {
    id: "bat_back_left",
    name: "Battery PAR – Back Left",
    type: "par_rgbwauv",
    address: 113,
    position: "back_left",
    channels: {
      red: 1,
      green: 2,
      blue: 3,
      white: 4,
      amber: 5,
      uv: 6
    },
    role: ["accent"]
  },

  {
    id: "bat_back_right",
    name: "Battery PAR – Back Right",
    type: "par_rgbwauv",
    address: 129,
    position: "back_right",
    channels: {
      red: 1,
      green: 2,
      blue: 3,
      white: 4,
      amber: 5,
      uv: 6
    },
    role: ["accent"]
  },

  {
    id: "bat_front_right",
    name: "Battery PAR – Front Right",
    type: "par_rgbwauv",
    address: 145,
    position: "side_front_right",
    channels: {
      red: 1,
      green: 2,
      blue: 3,
      white: 4,
      amber: 5,
      uv: 6
    },
    role: ["accent"]
  },

  /* =============================
     White Front PAR – CW / WW
     ============================= */

  {
    id: "front_white_right",
    name: "Front White – Right",
    type: "front_white",
    address: 161,
    position: "front_right",
    channels: {
      cold_white: 1,
      warm_white: 2
    },
    role: ["front"]
  },

  {
    id: "front_white_left",
    name: "Front White – Left",
    type: "front_white",
    address: 177,
    position: "front_left",
    channels: {
      cold_white: 1,
      warm_white: 2
    },
    role: ["front"]
  }

];