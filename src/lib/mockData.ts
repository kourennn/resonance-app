export type Member = {
  id: string;
  name: string;
  division: string;
  status: 'Active' | 'Idle';
  role: 'Captain' | 'Vice Captain' | 'Member';
  gender: 'Male' | 'Female' | 'Other';
  rank?: 
    | 'Joker (low-tier)' | 'Joker (mid-tier)' | 'Joker (high-tier)'
    | 'Jack (low-tier)' | 'Jack (mid-tier)' | 'Jack (high-tier)'
    | 'Queen (low-tier)' | 'Queen (mid-tier)' | 'Queen (high-tier)'
    | 'King (low-tier)' | 'King (mid-tier)' | 'King (high-tier)'
    | 'Ace (low-tier)' | 'Ace (mid-tier)' | 'Ace (high-tier)'
    | 'Joker' | 'Jack' | 'Queen' | 'King' | 'Ace' | 'Unranked';
  image?: string;
  last_division_1?: string;
  last_division_2?: string;
  rank_score?: number;
  motto?: string;
  top_characters?: string[];
  birthday?: string;
};

export const members: Member[] = [
  // X laws
  { id: '1', name: 'Raizo', division: 'X laws', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '2', name: 'toshi', division: 'X laws', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '3', name: 'senju', division: 'X laws', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '4', name: 'kuza', division: 'X laws', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '5', name: 'jy', division: 'X laws', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '6', name: 'moxxie', division: 'X laws', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '7', name: 'rain', division: 'X laws', status: 'Active', role: 'Member', gender: 'Female' },

  // Unsullied
  { id: '8', name: 'Luffy', division: 'Unsullied', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '9', name: 'izumi', division: 'Unsullied', status: 'Active', role: 'Vice Captain', gender: 'Female' },
  { id: '10', name: 'evee', division: 'Unsullied', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '11', name: 'hina', division: 'Unsullied', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '12', name: 'magu', division: 'Unsullied', status: 'Active', role: 'Member', gender: 'Female' },

  // δράκων (Drakon)
  { id: '13', name: 'Charm', division: 'δράκων', status: 'Active', role: 'Captain', gender: 'Female' },
  { id: '14', name: 'yosef', division: 'δράκων', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '15', name: 'ino', division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '16', name: 'hyro', division: 'δράκων', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '17', name: 'sae', division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '18', name: 'shira', division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '19', name: 'zora', division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },

  // Phantom Troupes
  { id: '20', name: 'Maxy', division: 'Phantom Troupes', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '21', name: 'pepsi', division: 'Phantom Troupes', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '22', name: 'sean', division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '23', name: 'erentz', division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '24', name: 'yaki', division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '25', name: 'ichi', division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },

  // Ryūjin
  { id: '26', name: 'Katsumi', division: 'Ryūjin', status: 'Active', role: 'Captain', gender: 'Female' },
  { id: '27', name: 'crimezine', division: 'Ryūjin', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '28', name: 'rekussu', division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '29', name: 'haerwie', division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '30', name: 'yunah', division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '31', name: 'josh', division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '32', name: 'meng coser', division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Female' },

  // Charyeok
  { id: '33', name: 'Juzou', division: 'Charyeok', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '34', name: 'jiyo', division: 'Charyeok', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '35', name: 'kazuu', division: 'Charyeok', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '36', name: 'tavasco', division: 'Charyeok', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '37', name: 'jays', division: 'Charyeok', status: 'Active', role: 'Member', gender: 'Male' },

  // Equinox
  { id: '38', name: 'Cao', division: 'Equinox', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '39', name: 'reese', division: 'Equinox', status: 'Active', role: 'Vice Captain', gender: 'Female' },
  { id: '40', name: 'chizu', division: 'Equinox', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '41', name: 'yoru', division: 'Equinox', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '42', name: 'ayu', division: 'Equinox', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '43', name: 'shizen', division: 'Equinox', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '44', name: 'hikari', division: 'Equinox', status: 'Active', role: 'Member', gender: 'Female' },

  // 7th Heaven
  { id: '45', name: 'Muryozaki', division: '7th Heaven', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '46', name: 'katsu', division: '7th Heaven', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '47', name: 'ryuwichi', division: '7th Heaven', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '48', name: 'raku', division: '7th Heaven', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '49', name: 'saviro', division: '7th Heaven', status: 'Active', role: 'Member', gender: 'Male' },

  // Yaoguai's
  { id: '50', name: 'Kentow', division: "Yaoguai's", status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '51', name: 'aki', division: "Yaoguai's", status: 'Active', role: 'Vice Captain', gender: 'Female' },
  { id: '52', name: 'gaddo', division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Male' },
  { id: '53', name: 'trust', division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Male' },
  { id: '54', name: 'kaori', division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Female' },
  { id: '55', name: 'naya', division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Female' },
  { id: '56', name: 'shinya', division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Male' },
];

export const initialDivisions = [
  'X laws',
  'Unsullied',
  'δράκων',
  'Phantom Troupes',
  'Ryūjin',
  'Charyeok',
  'Equinox',
  '7th Heaven',
  "Yaoguai's"
];
