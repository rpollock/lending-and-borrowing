import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import TestTokenABI from './abis/TestToken.json';
import LendingABI from './abis/LendingContract.json';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeroSection from './components/Hero';
import './App.css';

const TEST_TOKEN_ADDRESS = "0xE447715D68074647A526Af0929Da7acc5A0Ed50d";
const LENDING_CONTRACT_ADDRESS = "0x7452E05D2bF90f83d47727ed008b9909AaF24D2A";

function App() {
  const [account, setAccount] = useState('');
  const [testToken, setTestToken] = useState(null);
  const [lendingContract, setLendingContract] = useState(null);
  
  const [userBalance, setUserBalance] = useState('0');
  const [collateral, setCollateral] = useState('0');
  const [borrowed, setBorrowed] = useState('0');
  const [totalLiquidity, setTotalLiquidity] = useState('0');
  
  const [mintAmount, setMintAmount] = useState('');
  const [approveAmount, setApproveAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const token = new ethers.Contract(TEST_TOKEN_ADDRESS, TestTokenABI, signer);
        const lending = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LendingABI, signer);
        setTestToken(token);
        setLendingContract(lending);
      }
    }
    init();
  }, []);

  const fetchData = useCallback(async () => {
    if (account && testToken && lendingContract) {
      setUserBalance((await testToken.balanceOf(account)).toString());
      setCollateral((await lendingContract.collateral(account)).toString());
      setBorrowed((await lendingContract.borrowed(account)).toString());
      setTotalLiquidity((await lendingContract.totalLiquidity()).toString());
    }
  }, [account, testToken, lendingContract]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleMint() {
    const tx = await testToken.mint(account, ethers.parseUnits(mintAmount));
    await tx.wait();
    fetchData();
  }

  async function handleApprove() {
    const tx = await testToken.approve(LENDING_CONTRACT_ADDRESS, ethers.parseUnits(approveAmount));
    await tx.wait();
  }

  async function handleDeposit() {
    const tx = await lendingContract.deposit(ethers.parseUnits(depositAmount));
    await tx.wait();
    fetchData();
  }

  async function handleWithdraw() {
    const tx = await lendingContract.withdraw(ethers.parseUnits(withdrawAmount));
    await tx.wait();
    fetchData();
  }

  async function handleBorrow() {
    const tx = await lendingContract.borrow(ethers.parseUnits(borrowAmount));
    await tx.wait();
    fetchData();
  }

  async function handleRepay() {
    const tx = await lendingContract.repay(ethers.parseUnits(repayAmount));
    await tx.wait();
    fetchData();
  }

  return (
    <>
  
    <div className='container'>
      <div className='hero'>
        <div className='un-h'>
          <div className='row'>
            <div className='col-md-6 wri'>
              <h1 className='hero-head'>Welcome to the Lending Dapp.</h1>
              <h3 className='hero-h3'>this is an example of basic lending and borrowing functionality</h3>
            </div>
            <div className='col-md-6'> <HeroSection /></div>
          </div>
        </div>
      </div>
    <Container>
      <Typography variant="h3" gutterBottom></Typography>
      
      <Box mb={4}>
        <Typography>Account: {account}</Typography>
        <Typography>Token Balance: {userBalance}</Typography>
        <Typography>Collateral: {collateral}</Typography>
        <Typography>Borrowed: {borrowed}</Typography>
        <Typography>Total Liquidity: {totalLiquidity}</Typography>
        <Typography>Mint tokens, deposit tokens, borrow a tenth of deposited tokens</Typography>
      </Box>
      <div className='row'>
        <div className='col-md-6'>
          <Box mb={4}>
            <TextField label="Mint Amount" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
            <Button variant="contained" onClick={handleMint} className='btn-prim'>Mint Tokens</Button>
          </Box>
        </div>
        <div className='col-md-6'>
          <Box mb={4}>
            <TextField label="Approve Amount" value={approveAmount} onChange={(e) => setApproveAmount(e.target.value)} />
            <Button variant="contained" onClick={handleApprove} className='btn-prim'>Approve</Button>
          </Box>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <Box mb={4}>
            <TextField label="Deposit Amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            <Button variant="contained" onClick={handleDeposit} className='btn-prim'>Deposit</Button>
          </Box>
        </div>
        <div className='col-md-6'>
          <Box mb={4}>
            <TextField label="Withdraw Amount" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
            <Button variant="contained" onClick={handleWithdraw} className='btn-prim'>Withdraw</Button>
          </Box>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <Box mb={4}>
            <TextField label="Borrow Amount" value={borrowAmount} onChange={(e) => setBorrowAmount(e.target.value)} />
            <Button variant="contained" onClick={handleBorrow} className='btn-prim'>Borrow</Button>
          </Box>
        </div>
        <div className='col-md-6'>
          <Box mb={4}>
            <TextField label="Repay Amount" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} />
            <Button variant="contained" onClick={handleRepay} className='btn-prim'>Repay</Button>
          </Box>
        </div>
      </div>
    </Container>
    </div>
    </>
  );
}

export default App;
