// app/constants/betslipData.js
import { dummyMatches } from './dummyData';

// Generate odds based on predictions (realistic conversion)
const generateOddsFromPredictions = (match, predictionType) => {
  const baseOdds = {
    homeWin: (100 / match.predictions.homeWin).toFixed(2),
    draw: (100 / match.predictions.draw).toFixed(2),
    awayWin: (100 / match.predictions.awayWin).toFixed(2),
    over25: (100 / match.predictions.over25Goals).toFixed(2),
    under25: (100 / match.predictions.under25Goals).toFixed(2),
    bttsYes: (100 / match.predictions.bttsYes).toFixed(2),
    bttsNo: (100 / match.predictions.bttsNo).toFixed(2),
  };
  
  return parseFloat(baseOdds[predictionType] || 1.5);
};

// Generate a selection for a match
const generateSelection = (match) => {
  const predictionTypes = ['homeWin', 'draw', 'awayWin', 'over25', 'under25', 'bttsYes', 'bttsNo'];
  const predictionType = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];
  
  let predictionText = '';
  let odd = generateOddsFromPredictions(match, predictionType);
  
  switch(predictionType) {
    case 'homeWin':
      predictionText = `${match.team1.name} to Win`;
      break;
    case 'awayWin':
      predictionText = `${match.team2.name} to Win`;
      break;
    case 'draw':
      predictionText = 'Draw';
      break;
    case 'over25':
      predictionText = 'Over 2.5 Goals';
      break;
    case 'under25':
      predictionText = 'Under 2.5 Goals';
      break;
    case 'bttsYes':
      predictionText = 'Both Teams to Score';
      break;
    case 'bttsNo':
      predictionText = 'Clean Sheet';
      break;
  }
  
  return {
    matchId: match.id,
    team1: match.team1.name,
    team2: match.team2.name,
    league: match.league,
    prediction: predictionText,
    odd: odd,
    confidence: match.predictions.confidence,
    matchTime: `${match.date} ${match.time}`,
    status: match.status,
    type: predictionType,
  };
};

// Generate betslips based on target odd
export const generateBetslips = (targetOdd) => {
  if (!dummyMatches || dummyMatches.length < 2) return [];
  
  const betslips = [];
  const usedCombinations = new Set();
  
  // Try to generate 3 different betslips
  for (let attempt = 0; attempt < 20 && betslips.length < 3; attempt++) {
    // Random number of matches (2-4)
    const matchCount = Math.floor(Math.random() * 3) + 2;
    
    // Select random matches
    const selectedMatches = [...dummyMatches]
      .sort(() => Math.random() - 0.5)
      .slice(0, matchCount);
    
    // Generate selections for each match
    const selections = selectedMatches.map(match => generateSelection(match));
    
    // Calculate total odd
    const totalOdd = selections.reduce((acc, selection) => acc * selection.odd, 1);
    
    // Check if total odd is within acceptable range (15% tolerance)
    const tolerance = 0.15;
    if (Math.abs(totalOdd - targetOdd) / targetOdd > tolerance) {
      continue; // Try another combination
    }
    
    // Calculate AI confidence (weighted average)
    const aiConfidence = Math.round(
      selections.reduce((acc, selection, index) => 
        acc + (selection.confidence * Math.pow(0.95, index)), 0
      ) / selections.reduce((acc, _, index) => acc + Math.pow(0.95, index), 0)
    );
    
    // Calculate success rate based on confidence and number of selections
    const successRate = Math.min(95, Math.round(
      aiConfidence * Math.pow(0.92, selections.length - 1)
    ));
    
    // Create combination key to avoid duplicates
    const combinationKey = selections
      .map(s => `${s.matchId}-${s.type}`)
      .sort()
      .join('|');
    
    if (usedCombinations.has(combinationKey)) {
      continue;
    }
    usedCombinations.add(combinationKey);
    
    // Calculate potential return for $10 stake
    const potentialReturn = 10 * totalOdd;
    
    betslips.push({
      id: `betslip-${betslips.length + 1}-${Date.now()}`,
      selections,
      totalOdd: parseFloat(totalOdd.toFixed(2)),
      aiConfidence,
      successRate,
      potentialReturn: parseFloat(potentialReturn.toFixed(2)),
      stake: 10,
      timestamp: new Date().toISOString(),
      matchCount: selections.length,
    });
  }
  
  // Sort by closeness to target odd
  return betslips.sort((a, b) => 
    Math.abs(a.totalOdd - targetOdd) - Math.abs(b.totalOdd - targetOdd)
  );
};

// Example betslips for when the screen loads
export const exampleBetslips = [
  {
    id: 'betslip-example-1',
    selections: [
      {
        matchId: '1',
        team1: 'PSG',
        team2: 'Bayern Munich',
        league: 'Champions League',
        prediction: 'Over 2.5 Goals',
        odd: 1.85,
        confidence: 78,
        matchTime: '2024-10-22 20:00',
        status: 'LIVE',
        type: 'over25',
      },
      {
        matchId: '2',
        team1: 'Real Madrid',
        team2: 'FC Barcelona',
        league: 'La Liga',
        prediction: 'Both Teams to Score',
        odd: 1.65,
        confidence: 82,
        matchTime: '2024-10-22 21:00',
        status: 'UPCOMING',
        type: 'bttsYes',
      },
    ],
    totalOdd: 3.05,
    aiConfidence: 80,
    successRate: 72,
    potentialReturn: 30.50,
    stake: 10,
    timestamp: '2024-10-22T10:30:00Z',
    matchCount: 2,
  },
  {
    id: 'betslip-example-2',
    selections: [
      {
        matchId: '3',
        team1: 'Manchester City',
        team2: 'Liverpool',
        league: 'Premier League',
        prediction: 'Manchester City to Win',
        odd: 2.10,
        confidence: 85,
        matchTime: '2024-10-23 19:30',
        status: 'UPCOMING',
        type: 'homeWin',
      },
      {
        matchId: '4',
        team1: 'Inter Milan',
        team2: 'AC Milan',
        league: 'Serie A',
        prediction: 'Draw',
        odd: 3.40,
        confidence: 76,
        matchTime: '2024-10-23 20:45',
        status: 'UPCOMING',
        type: 'draw',
      },
      {
        matchId: '5',
        team1: 'Borussia Dortmund',
        team2: 'RB Leipzig',
        league: 'Bundesliga',
        prediction: 'Over 2.5 Goals',
        odd: 1.70,
        confidence: 73,
        matchTime: '2024-10-24 19:30',
        status: 'UPCOMING',
        type: 'over25',
      },
    ],
    totalOdd: 12.14,
    aiConfidence: 78,
    successRate: 68,
    potentialReturn: 121.40,
    stake: 10,
    timestamp: '2024-10-22T10:35:00Z',
    matchCount: 3,
  },
];

export default {
  generateBetslips,
  exampleBetslips,
};