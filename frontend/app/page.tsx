"use client";

import { Container, Stack, Typography } from "@mui/material";
import { AccountsNeededCalculator } from "./components/Calculators/AccountsNeededCalculator";
import { ProfitOverTimeCalculator } from "./components/Calculators/ProfitOverTimeCalculator";

export default function Home() {
  return (
    <Container>
      <Typography variant="h1">RuneSuite</Typography>
      <Stack spacing={2}>
        <AccountsNeededCalculator />
        <ProfitOverTimeCalculator />
      </Stack>
    </Container>
  );
}
