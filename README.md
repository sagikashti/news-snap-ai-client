# NewsSnapAI Client

A modern React + TypeScript web application that provides AI-powered article summarization. Users can input any article URL and receive instant summaries with key insights and keywords.

## 🚀 Features

- **URL Validation**: Real-time validation using Zod schemas
- **AI Summarization**: Get concise summaries of any article
- **Key Insights**: Extract important points and keywords
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Responsive Design**: Mobile-first design with modern UI
- **Loading States**: Beautiful skeleton loaders for better UX
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: ARIA labels and semantic HTML
- **Type Safety**: Full TypeScript coverage

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS Variables with theme support
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── app/                # Redux store setup
│   ├── store.ts        # Store configuration
│   └── hooks.ts        # Typed Redux hooks
├── components/         # Reusable UI components
│   ├── UrlForm.tsx     # URL input form
│   ├── SummaryDisplay.tsx
│   ├── LoadingSkeleton.tsx
│   ├── ErrorBoundary.tsx
│   ├── ThemeToggle.tsx
│   └── SummaryPage.tsx # Main page component
├── features/           # Feature-based Redux slices
│   ├── summary/        # Summary state management
│   └── theme/          # Theme state management
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── services/           # API layer
│   ├── api.ts          # Axios configuration
│   └── summaryService.ts
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── config.ts           # App configuration
└── App.tsx             # Main app component
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd NewsSnapAI/NewsSnapAIClient
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
# Create .env file with:
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=NewsSnapAI Client
VITE_APP_VERSION=1.0.0
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - Check TypeScript types

## 🎨 Styling

The application uses CSS Variables for theming with support for:

- Light and dark themes
- Responsive design (mobile-first)
- Modern CSS features (Grid, Flexbox)
- Smooth transitions and animations
- Loading skeleton animations

## 🧪 Testing

Tests are written using Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

### API Integration

The app expects a backend API with the following endpoints:

- `POST /api/summarize` - Summarize article from URL
- `GET /api/health` - Health check

Expected request/response format:

```typescript
// Request
{
  "url": "https://example.com/article"
}

// Response
{
  "success": true,
  "data": {
    "summary": "Article summary...",
    "title": "Article Title",
    "keywords": ["keyword1", "keyword2"],
    "insights": ["insight1", "insight2"],
    "originalUrl": "https://example.com/article",
    "processedAt": "2024-01-01T00:00:00Z",
    "wordCount": 150,
    "readingTime": 1
  }
}
```

## 🚀 Deployment

1. Build the application:

```bash
npm run build
```

2. The `dist` folder contains the production build ready for deployment.

3. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related

- [NewsSnapAI Server](../NewsSnapAIServer) - Backend API for article processing
