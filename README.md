# Siphyr

A modern, responsive chat application built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX**: Clean, intuitive interface with smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💬 **Real-time Chat**: Direct messaging between users with Socket.IO
- 🔄 **Live Updates**: Messages appear instantly without page refresh
- 🎯 **User Selection**: Easy user selection from a sidebar
- ⌨️ **Keyboard Support**: Send messages with Enter key
- 🎭 **Beautiful Components**: Custom message bubbles and loading states

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Chat.tsx        # Main chat interface
│   ├── Sidebar.tsx     # User selection sidebar
│   ├── MessageBubble.tsx # Individual message component
│   └── LoadingSpinner.tsx # Loading indicator
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.css           # Global styles and Tailwind imports
└── main.tsx            # Application entry point
```

## Components

### Chat Component
The main chat interface that handles:
- Message display and input
- Real-time message updates
- User selection state
- Socket.IO communication

### Sidebar Component
Responsive sidebar for:
- User selection
- Mobile-friendly navigation
- Loading states

### MessageBubble Component
Individual message display with:
- Sent/received styling
- Timestamp formatting
- Smooth animations

## Styling

The application uses Tailwind CSS with custom components defined in `index.css`:

- `.chat-bubble` - Message bubble styles
- `.input-field` - Input field styling
- `.btn-primary` - Primary button styles
- `.btn-secondary` - Secondary button styles

## Backend Integration

The frontend expects a backend server with:
- `/users` endpoint - Returns available users
- `/messages` endpoint - Returns messages for a user
- Socket.IO events for real-time messaging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier-compatible formatting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Ensure responsive design works on mobile
4. Test with the backend server

## License

This project is part of the Siphyr chat application.
