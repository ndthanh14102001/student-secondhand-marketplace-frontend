import { Box, TextField } from "@mui/material";

const ProductInfoInput = (props) => {
  return (
    <Box
      sx={{
        marginBottom: "1rem",
      }}
    >
      <TextField
        sx={{
          "& textarea": {
            border: "none",
          },
        }}
        fullWidth
        {...props}
      />
    </Box>
  );
};
export default ProductInfoInput;
