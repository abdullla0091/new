# Character AI Clone

A Next.js application for chatting with various characters with different personalities. Features include custom characters, multilingual support, and 3D visualization using Three.js.

## Features

- Chat with various predefined characters
- Create and customize your own characters
- Kurdish and English language support
- Character favorites system
- Dark/light mode
- 3D visualization of characters using Three.js

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Radix UI components
- Three.js with React Three Fiber
- Local storage for persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Log in to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel
```

### Method 2: Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure your project settings
6. Click "Deploy"

## Three.js Integration

The application includes 3D visualizations powered by Three.js. To modify or extend the 3D scenes:

1. Edit the `components/ThreeScene.tsx` file
2. Add more 3D models or effects using @react-three/fiber and @react-three/drei
3. Custom 3D models can be added to the `public/models` directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
