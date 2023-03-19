const PRIMARY = {
  lighter: "#BC5CFF",
  light: "#ffda4e",
  main: "#a749ff",
  dark: "#A340FF",
  darker: "#9B30FF",
  contrastText: "#000",
  rgbColor: [255, 215, 64],
  text: "#ffa000"
};

const SECONDARY = {
  lighter: "#6190fb",
  light: "#4a81fa",
  main: "#A1FF49",
  dark: "#1a57e0",
  darker: "#174ec7",
  contrastText: "#fff",
  rgbColor: [29, 97, 249],
  borderButton: "#ffb300"
};

const INFO = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#1890FF",
  dark: "#0C53B7",
  darker: "#04297A",
  contrastText: "#fff",
  rgbColor: [24, 144, 255],
};

const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
  contrastText: "#fff",
  rgbColor: [84, 214, 44],
};

const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFC107",
  dark: "#B78103",
  darker: "#7A4F01",
  contrastText: "#fff",
  rgbColor: [255, 193, 7],
};

const ERROR = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#FF4842",
  dark: "#B72136",
  darker: "#7A0C2E",
  contrastText: "#fff",
  rgbColor: [255, 72, 66],
};

const palette = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
};

export default palette;
