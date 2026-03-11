export type Member = {
  id: string;
  name: string;
  range: string;
  specialties: string[];
  division: string;
  status: 'Active' | 'Idle';
  role: 'Captain' | 'Vice Captain' | 'Member';
  gender: 'Male' | 'Female' | 'Other';
  image?: string;
};

export const members: Member[] = [
  // X laws
  { id: '1', name: 'Raizo', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '2', name: 'toshi', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '3', name: 'senju', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '4', name: 'kuza', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '5', name: 'jy', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '6', name: 'moxxie', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '7', name: 'rain', range: 'Unknown', specialties: [], division: 'X laws', status: 'Active', role: 'Member', gender: 'Female' },

  // Unsullied
  { id: '8', name: 'Luffy', range: 'Unknown', specialties: [], division: 'Unsullied', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '9', name: 'izumi', range: 'Unknown', specialties: [], division: 'Unsullied', status: 'Active', role: 'Vice Captain', gender: 'Female' },
  { id: '10', name: 'evee', range: 'Unknown', specialties: [], division: 'Unsullied', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '11', name: 'hina', range: 'Unknown', specialties: [], division: 'Unsullied', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '12', name: 'magu', range: 'Unknown', specialties: [], division: 'Unsullied', status: 'Active', role: 'Member', gender: 'Female' },

  // δράκων (Drakon)
  { id: '13', name: 'Charm', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Captain', gender: 'Female' },
  { id: '14', name: 'yosef', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '15', name: 'ino', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '16', name: 'hyro', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '17', name: 'sae', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '18', name: 'shira', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '19', name: 'zora', range: 'Unknown', specialties: [], division: 'δράκων', status: 'Active', role: 'Member', gender: 'Female' },

  // Phantom Troupes
  { id: '20', name: 'Maxy', range: 'Unknown', specialties: [], division: 'Phantom Troupes', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '21', name: 'pepsi', range: 'Unknown', specialties: [], division: 'Phantom Troupes', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '22', name: 'sean', range: 'Unknown', specialties: [], division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '23', name: 'erentz', range: 'Unknown', specialties: [], division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '24', name: 'yaki', range: 'Unknown', specialties: [], division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '25', name: 'ichi', range: 'Unknown', specialties: [], division: 'Phantom Troupes', status: 'Active', role: 'Member', gender: 'Male' },

  // Ryūjin
  { id: '26', name: 'Katsumi', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Captain', gender: 'Female' },
  { id: '27', name: 'crimezine', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '28', name: 'rekussu', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '29', name: 'haerwie', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '30', name: 'yunah', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '31', name: 'josh', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '32', name: 'meng coser', range: 'Unknown', specialties: [], division: 'Ryūjin', status: 'Active', role: 'Member', gender: 'Female' },

  // Charyeok
  { id: '33', name: 'Juzou', range: 'Unknown', specialties: [], division: 'Charyeok', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '34', name: 'jiyo', range: 'Unknown', specialties: [], division: 'Charyeok', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '35', name: 'kazuu', range: 'Unknown', specialties: [], division: 'Charyeok', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '36', name: 'tavasco', range: 'Unknown', specialties: [], division: 'Charyeok', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '37', name: 'jays', range: 'Unknown', specialties: [], division: 'Charyeok', status: 'Active', role: 'Member', gender: 'Male' },

  // Okinawa
  { id: '38', name: 'Cao', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '39', name: 'reese', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Vice Captain', gender: 'Female' },
  { id: '40', name: 'chizu', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '41', name: 'yoru', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '42', name: 'ayu', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Member', gender: 'Female' },
  { id: '43', name: 'shizen', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '44', name: 'hikari', range: 'Unknown', specialties: [], division: 'Okinawa', status: 'Active', role: 'Member', gender: 'Female' },

  // 7th Heaven
  { id: '45', name: 'Muryozaki', range: 'Unknown', specialties: [], division: '7th Heaven', status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '46', name: 'katsu', range: 'Unknown', specialties: [], division: '7th Heaven', status: 'Active', role: 'Vice Captain', gender: 'Male' },
  { id: '47', name: 'ryuwichi', range: 'Unknown', specialties: [], division: '7th Heaven', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '48', name: 'raku', range: 'Unknown', specialties: [], division: '7th Heaven', status: 'Active', role: 'Member', gender: 'Male' },
  { id: '49', name: 'saviro', range: 'Unknown', specialties: [], division: '7th Heaven', status: 'Active', role: 'Member', gender: 'Male' },

  // Yaoguai's
  { id: '50', name: 'Kentow', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Captain', gender: 'Male' },
  { id: '51', name: 'aki', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Vice Captain', gender: 'Female' },
  { id: '52', name: 'gaddo', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Male' },
  { id: '53', name: 'trust', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Male' },
  { id: '54', name: 'kaori', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Female' },
  { id: '55', name: 'naya', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Female' },
  { id: '56', name: 'shinya', range: 'Unknown', specialties: [], division: "Yaoguai's", status: 'Active', role: 'Member', gender: 'Male' },
];

export const initialDivisions = [
  'X laws',
  'Unsullied',
  'δράκων',
  'Phantom Troupes',
  'Ryūjin',
  'Charyeok',
  'Okinawa',
  '7th Heaven',
  "Yaoguai's"
];
