export interface Profile {
  id: string;
  name: string;
  age: number;
  profession: string;
  sex: 'male' | 'female';
  location: string;
  description: string;
  image: string;
  kindOfPartner: string;
}

export interface Message {
  id: string;
  roomId: string;
  sender: 'user' | 'partner' | 'psychologist';
  text: string;
  timestamp: string;
  isVoice?: boolean;
  voiceUrl?: string;
  voiceDuration?: string;
  isEncrypted?: boolean;
}

export interface ChatRoom {
  id: string;
  participantId: string; // profile id or 'psychologist'
  participantName: string;
  participantImage: string;
  participantProfession?: string;
  isPsychologist?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isUnlocked: boolean;
  messages: Message[];
}

export interface MembershipPackage {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  isMarriage: boolean;
  sex: 'male' | 'female';
}

export interface UserRegistration {
  name: string;
  profession: string;
  sex: 'male' | 'female';
  ageRange: string;
  kindOfPartner: string;
  selectedPackageId: string;
  transactionId: string;
  receiptName?: string;
  receiptData?: string; // base64 representation of receipt screenshot
  isVerified: boolean;
}
