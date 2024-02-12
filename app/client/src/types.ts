export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export interface Message {
  isBot: boolean;
  content: string;
}

export const dfChatHistory: Chat[] = [
  {
    id: '1',
    userId: '1',
    title: 'Coding Assistant',
    messages: [
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at coding.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
    ],
    timestamp: new Date('2024-02-04').getTime(),
  },
  {
    id: '2',
    userId: '1',
    title: 'Learning Languages with Assistant',
    messages: [
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at learning a new language.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at learning a new language.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at learning a new language.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at learning a new language.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at learning a new language.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
      {
        isBot: true,
        content: 'Hello, I am your personal assistant. How can I help you?',
      },
      {
        isBot: false,
        content: 'Hi! Teach me how to be good at learning a new language.',
      },
      {
        isBot: true,
        content: 'Okay, I can do that.',
      },
      {
        isBot: false,
        content: 'Great!',
      },
    ],
    timestamp: new Date('2024-02-05').getTime(),
  },
];
