// app/index.jsx
import React from 'react';
import HomeScreen from './HomeScreen';
import BetslipGenerator from './betslip';
import { useAccessGuard } from '../../components/useAccessGuard';

export default function Index() {
  
  return <HomeScreen />;
}