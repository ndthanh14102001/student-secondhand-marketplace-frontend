const popUpContainer = {
  "& .MuiDialog-paper": {
    overflowY: "visible",
    padding: {
      xs: "1rem",
      sm: "1rem 1rem",
    },
    minWidth: {
      xs: "90%",
      sm: "500px",
    },
    borderRadius: "var(--border-radius-6)",
  }
};
const popupIcon = {
  display: "flex",
  justifyContent: "center",
  "& .MuiSvgIcon-root": {
    width: "140px",
    height: "140px",
  }
};
const popupTitle = (type) => {
  return {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    color: (theme) => theme.palette[type].main
  };
};
const popupContent = {
  textAlign: "center",
  fontSize: "1.2rem"
};
const popupActions = {
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  },
  justifyContent: "center",
  "&>:not(:first-of-type)": {
    marginLeft: {
      xs: 0,
      sm: "1rem"
    },
  },
  "& .MuiButtonBase-root": {
    textTransform: "uppercase",
    fontSize: "1rem",
    fontWeight: "bold",
    width: "100%",
  },
  "& .MuiButtonBase-root:not(:last-child)": {
    marginBottom: {
      xs: "1rem",
      sm: 0
    },
  }
};
export {
  popUpContainer,
  popupIcon,
  popupTitle,
  popupContent,
  popupActions,
};
