import {
  Box,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export const AccountsNeededCalculator: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [buyLimit, setBuyLimit] = useState<number>(0);
  const [numOfBuyLimits, setNumOfBuyLimits] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);

  const calculateAccountsNeeded = () => {
    const pricePerAcc = purchasePrice * buyLimit * numOfBuyLimits;
    return Math.ceil(budget / pricePerAcc) || 0;
  };

  return (
    <Box
      sx={{ padding: "16px", backgroundColor: "white", borderRadius: "8px" }}
    >
      <Header variant="h2">
        Accounts Needed
      </Header>
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
          id="buy-limit-input"
          label="Buy Limit"
          variant="outlined"
          type="number"
          value={buyLimit}
          onChange={(e) => setBuyLimit(parseInt(e.currentTarget.value) || 0)}
        />
        <TextField
          id="num-of-buy-limits-input"
          label="# of Buy Limits"
          variant="outlined"
          type="number"
          value={numOfBuyLimits}
          onChange={(e) =>
            setNumOfBuyLimits(parseInt(e.currentTarget.value) || 0)
          }
        />
        <TextField
          id="budget-input"
          label="Budget"
          variant="outlined"
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.currentTarget.value) || 0)}
        />
      </Stack>
      <Header variant="h3">Accounts</Header>
      <Typography fontFamily="monospace" fontSize={35}>{calculateAccountsNeeded()}</Typography>
    </Box>
  );
};

const Header = styled(Typography)({
  marginBottom: "16px",
});
