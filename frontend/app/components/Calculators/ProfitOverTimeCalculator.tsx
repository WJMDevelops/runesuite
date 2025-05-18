import { Box, Stack, styled, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

export const ProfitOverTimeCalculator: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [daysToBuy, setDaysToBuy] = useState<number>(0);

  const calculateProfitOverMonths = (months: number) => {
    if (daysToBuy === 0) return 0;
    let profit = salePrice - purchasePrice;
    if (salePrice > 100) profit = profit - salePrice / 100;
    const days = months * 30;

    return (days / daysToBuy) * profit * volume;
  };

  return (
    <Box
      sx={{ padding: "16px", backgroundColor: "white", borderRadius: "8px" }}
    >
      <Header variant="h2">Profit over time</Header>
      <Stack direction="row" spacing={1}>
        <TextField
          id="purchase-price-input"
          label="Purchase Price"
          variant="outlined"
          type="number"
          value={purchasePrice}
          onChange={(e) =>
            setPurchasePrice(parseInt(e.currentTarget.value) || 0)
          }
        />
        <TextField
          id="sale-price-input"
          label="Sale Price"
          variant="outlined"
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(parseInt(e.currentTarget.value) || 0)}
        />
        <TextField
          id="volume-input"
          label="Purchase Volume"
          variant="outlined"
          type="number"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.currentTarget.value) || 0)}
        />
        <TextField
          id="days-to-buy-input"
          label="Days needed to purchase volume"
          variant="outlined"
          type="number"
          value={daysToBuy}
          onChange={(e) => setDaysToBuy(parseFloat(e.currentTarget.value) || 0)}
        />
      </Stack>
      <Header variant="h3">Profit After 3 Months</Header>
      <Typography fontFamily="monospace" fontSize={35}>
        {calculateProfitOverMonths(3)}
      </Typography>
    </Box>
  );
};

const Header = styled(Typography)({
  marginBottom: "16px",
});
