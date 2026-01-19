// // app/constants/dummyData.js
// export const dummyMatches = [
//   {
//     id: '1',
//     league: 'Champions League',
//     leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/1200px-UEFA_Champions_League_logo_2.svg.png',
//     matchDay: 'Match day 2',
//     date: '2024-10-22',
//     time: '20:00',
//     status: 'LIVE',
//     team1: {
//       name: 'PSG',
//       shortName: 'PSG',
//       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
//       score: 2,
//       form: 'W-W-D-W-L'
//     },
//     team2: {
//       name: 'Bayern Munich',
//       shortName: 'BAY',
//       logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
//       score: 2,
//       form: 'W-L-W-W-D'
//     },
//     currentTime: '1ST HALF 39\'',
//     venue: 'Parc des Princes',
    
//     // Prediction statistics
//     predictions: {
//       homeWin: 35,
//       draw: 30,
//       awayWin: 35,
//       over25Goals: 65,
//       under25Goals: 35,
//       bttsYes: 72,
//       bttsNo: 28,
//       cleanSheetHome: 40,
//       cleanSheetAway: 45,
//       mostLikelyScore: '2-1',
//       confidence: 78, // AI confidence percentage
//     },
    
//     aiInsights: [
//       'PSG have won 80% of home matches this season',
//       'Bayern missing key defenders Upamecano and De Ligt',
//       'Last 5 H2H: 3 wins for Bayern, 2 draws',
//       'Expected xG: PSG 2.1 - 1.8 Bayern',
//     ],
    
//     recentForm: {
//       home: ['W', 'W', 'D', 'W', 'L'],
//       away: ['W', 'L', 'W', 'W', 'D']
//     },
    
//     isTopEvent: true,
//   },
//   {
//     id: '2',
//     league: 'La Liga',
//     leagueLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/LaLiga_Santander_logo_%282020%29.svg/2560px-LaLiga_Santander_logo_%282020%29.svg.png',
//     matchDay: 'Match day 8',
//     date: '2024-10-22',
//     time: '21:00',
//     status: 'UPCOMING',
//     team1: {
//       name: 'Real Madrid',
//       shortName: 'RMA',
//       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
//       score: null,
//       form: 'W-W-W-D-W'
//     },
//     team2: {
//       name: 'FC Barcelona',
//       shortName: 'BAR',
//       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
//       score: null,
//       form: 'W-D-W-W-L'
//     },
//     currentTime: null,
//     venue: 'Santiago Bernabéu',
    
//     predictions: {
//       homeWin: 45,
//       draw: 30,
//       awayWin: 25,
//       over25Goals: 55,
//       under25Goals: 45,
//       bttsYes: 68,
//       bttsNo: 32,
//       cleanSheetHome: 35,
//       cleanSheetAway: 20,
//       mostLikelyScore: '2-1',
//       confidence: 82,
//     },
    
//     aiInsights: [
//       'El Clásico - High intensity match expected',
//       'Real Madrid unbeaten in last 10 home games',
//       'Barcelona struggling with away form (2 wins in last 5)',
//       'Key battle: Vinicius Jr vs Araujo',
//     ],
    
//     recentForm: {
//       home: ['W', 'W', 'W', 'D', 'W'],
//       away: ['W', 'D', 'W', 'W', 'L']
//     },
    
//     isTopEvent: true,
//   },
//   {
//     id: '3',
//     league: 'Premier League',
//     leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo_%282007%29.svg/1200px-Premier_League_Logo_%282007%29.svg.png',
//     matchDay: 'Match day 9',
//     date: '2024-10-23',
//     time: '19:30',
//     status: 'UPCOMING',
//     team1: {
//       name: 'Manchester City',
//       shortName: 'MCI',
//       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
//       score: null,
//       form: 'W-W-D-W-W'
//     },
//     team2: {
//       name: 'Liverpool',
//       shortName: 'LIV',
//       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png',
//       score: null,
//       form: 'W-W-W-L-D'
//     },
//     currentTime: null,
//     venue: 'Etihad Stadium',
    
//     predictions: {
//       homeWin: 48,
//       draw: 28,
//       awayWin: 24,
//       over25Goals: 70,
//       under25Goals: 30,
//       bttsYes: 75,
//       bttsNo: 25,
//       cleanSheetHome: 32,
//       cleanSheetAway: 25,
//       mostLikelyScore: '2-2',
//       confidence: 85,
//     },
    
//     aiInsights: [
//       'Top of the table clash',
//       'City have won 15 consecutive home matches',
//       'Liverpool best away record this season',
//       'Both teams score in last 5 meetings',
//     ],
    
//     recentForm: {
//       home: ['W', 'W', 'D', 'W', 'W'],
//       away: ['W', 'W', 'W', 'L', 'D']
//     },
    
//     isTopEvent: true,
//   },
//   {
//     id: '4',
//     league: 'Serie A',
//     leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Serie_A_logo_%282019%29.svg/1200px-Serie_A_logo_%282019%29.svg.png',
//     matchDay: 'Match day 7',
//     date: '2024-10-23',
//     time: '20:45',
//     status: 'UPCOMING',
//     team1: {
//       name: 'Inter Milan',
//       shortName: 'INT',
//       logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png',
//       score: null,
//       form: 'W-D-W-W-W'
//     },
//     team2: {
//       name: 'AC Milan',
//       shortName: 'MIL',
//       logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/1200px-Logo_of_AC_Milan.svg.png',
//       score: null,
//       form: 'W-L-W-D-W'
//     },
//     currentTime: null,
//     venue: 'San Siro',
    
//     predictions: {
//       homeWin: 40,
//       draw: 35,
//       awayWin: 25,
//       over25Goals: 50,
//       under25Goals: 50,
//       bttsYes: 65,
//       bttsNo: 35,
//       cleanSheetHome: 38,
//       cleanSheetAway: 30,
//       mostLikelyScore: '1-1',
//       confidence: 76,
//     },
    
//     aiInsights: [
//       'Derby della Madonnina',
//       'Inter unbeaten in last 8 matches',
//       'Milan strong in big games this season',
//       'Close encounter expected',
//     ],
    
//     recentForm: {
//       home: ['W', 'D', 'W', 'W', 'W'],
//       away: ['W', 'L', 'W', 'D', 'W']
//     },
    
//     isTopEvent: false,
//   },
//   {
//     id: '5',
//     league: 'Bundesliga',
//     leagueLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1200px-Bundesliga_logo_%282017%29.svg.png',
//     matchDay: 'Match day 6',
//     date: '2024-10-24',
//     time: '19:30',
//     status: 'UPCOMING',
//     team1: {
//       name: 'Borussia Dortmund',
//       shortName: 'BVB',
//       logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/1200px-Borussia_Dortmund_logo.svg.png',
//       score: null,
//       form: 'W-L-D-W-W'
//     },
//     team2: {
//       name: 'RB Leipzig',
//       shortName: 'RBL',
//       logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/1200px-RB_Leipzig_2014_logo.svg.png',
//       score: null,
//       form: 'W-W-L-D-W'
//     },
//     currentTime: null,
//     venue: 'Signal Iduna Park',
    
//     predictions: {
//       homeWin: 42,
//       draw: 33,
//       awayWin: 25,
//       over25Goals: 68,
//       under25Goals: 32,
//       bttsYes: 78,
//       bttsNo: 22,
//       cleanSheetHome: 28,
//       cleanSheetAway: 22,
//       mostLikelyScore: '2-1',
//       confidence: 73,
//     },
    
//     aiInsights: [
//       'High-scoring match expected',
//       'Dortmund strong at home (4 wins, 1 draw)',
//       'Leipzig best attacking record in league',
//       'Last meeting: Dortmund 3-2 Leipzig',
//     ],
    
//     recentForm: {
//       home: ['W', 'L', 'D', 'W', 'W'],
//       away: ['W', 'W', 'L', 'D', 'W']
//     },
    
//     isTopEvent: false,
//   },
// ];

// // Get top events for carousel
// export const topEvents = dummyMatches.filter(match => match.isTopEvent);

// // Get all matches for list
// export const allMatches = dummyMatches;

// // League data for filtering
// export const leagues = [
//   { id: 'all', name: 'All Leagues' },
//   { id: 'ucl', name: 'Champions League' },
//   { id: 'pl', name: 'Premier League' },
//   { id: 'laliga', name: 'La Liga' },
//   { id: 'seriea', name: 'Serie A' },
//   { id: 'bundesliga', name: 'Bundesliga' },
// ];

// export default {
//   dummyMatches,
//   topEvents,
//   allMatches,
//   leagues,
// };

// frontend/app/constants/dummyData.js

// Numeric IDs must match API-Football league IDs
export const leagues = [
  { id: 39, name: 'Premier League' },
  { id: 78, name: 'Champions League' },
  { id: 140, name: 'La Liga' },
  { id: 61, name: 'Ligue 1' },
  { id: 135, name: 'Bundesliga' },
  { id: 2, name: 'Serie A' },
  { id: 3, name: 'Eredivisie' },
];
