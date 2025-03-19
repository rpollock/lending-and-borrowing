import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material'; // Removed Box


function LendingBorrowing({ account, balances, testToken, lendingContract, fetchData }) {
  const [amounts, setAmounts] = useState({
    mint: '',
    approve: '',
    deposit: '',
    withdraw: '',
    borrow: '',
    repay: '',
  });

  const handleChange = (e) => {
    setAmounts({ ...amounts, [e.target.name]: e.target.value });
  };

  const handleAction = async (action) => {
    try {
      let tx;
      switch (action) {
        case 'mint':
          tx = await testToken.mint(account, ethers.parseUnits(amounts.mint));
          break;
        case 'approve':
          tx = await testToken.approve(lendingContract.target, ethers.parseUnits(amounts.approve));
          break;
        case 'deposit':
          tx = await lendingContract.deposit(ethers.parseUnits(amounts.deposit));
          break;
        case 'withdraw':
          tx = await lendingContract.withdraw(ethers.parseUnits(amounts.withdraw));
          break;
        case 'borrow':
          tx = await lendingContract.borrow(ethers.parseUnits(amounts.borrow));
          break;
        case 'repay':
          tx = await lendingContract.repay(ethers.parseUnits(amounts.repay));
          break;
        default:
          return;
      }
      await tx.wait();
      fetchData();
    } catch (error) {
      console.error(`Error with ${action}:`, error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Account Info */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 2, textAlign: 'center' }}>
          <Typography>Connected Account: {account}</Typography>
          <Typography>Balance: {balances.userBalance} Tokens</Typography>
          <Typography>Collateral: {balances.collateral}</Typography>
          <Typography>Borrowed: {balances.borrowed}</Typography>
          <Typography>Total Liquidity: {balances.totalLiquidity}</Typography>
        </Paper>
      </Grid>

      {/* Actions */}
      {['mint', 'approve', 'deposit', 'withdraw', 'borrow', 'repay'].map((action) => (
        <Grid item xs={12} sm={6} md={4} key={action}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <TextField 
              label={action.charAt(0).toUpperCase() + action.slice(1) + " Amount"} 
              name={action} 
              value={amounts[action]} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            <Button variant="contained" color="primary" fullWidth onClick={() => handleAction(action)}>
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default LendingBorrowing;
