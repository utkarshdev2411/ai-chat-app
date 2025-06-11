# AI Storytelling App 📖✨

An interactive storytelling application powered by AI, where users can create and guide immersive narrative adventures. Built with React.js frontend and Node.js/Express backend, featuring AI story generation using Google's Gemini API.

## ✨ Features

### 🎭 Storytelling Features
- **Multiple Scenarios**: Choose from Space Colony, Post-Apocalyptic, Fantasy, Historical, and Cyberpunk settings
- **Character Creation**: Customize your protagonist with name and role
- **Interactive Narrative**: Two interaction modes:
  - **Continue Story**: Let the AI advance the narrative
  - **Custom Actions**: Describe specific actions to influence the story
- **Story Management**: Save, load, and manage multiple ongoing adventures
- **Rich Story Display**: Specially designed UI for immersive storytelling

### 🔐 Core Features
- User authentication (signup/login)
- Session-based story management
- User preferences and avatar customization
- Dark/light theme support
- Responsive design for all devices

## 🛠 Tech Stack

### Frontend
- React 18 with Hooks
- Vite for fast development
- Tailwind CSS for styling
- React Router DOM for navigation
- Axios for API communication

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Google Gemini API for story generation
- bcrypt for secure password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### 1. Environment Setup

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ai-storytelling-app
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-chat-app

# Install all dependencies
npm run install:all

# Seed the database with story scenarios
npm run seed
```

### 3. Start the Application

```bash
# Start both server and client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📊 Implementation Status

### ✅ Completed Features

#### Backend Implementation
- [x] **Story-focused API endpoints** (`/api/stories/*`)
- [x] **Scenario system** with 5 predefined scenarios
- [x] **Enhanced Session model** with story-specific fields:
  - `title`: Adventure name
  - `scenario`: Selected story theme
  - `character`: Protagonist details (name, role)
  - `history`: Message history with input types
- [x] **Gemini API integration** with storytelling-optimized prompts
- [x] **Dual interaction support**: Continue vs Custom Action modes
- [x] **Story CRUD operations**: Create, read, update, delete stories

#### Frontend Implementation
- [x] **StoryPage** (evolved from ChatPage) with storytelling UI
- [x] **ScenarioSelector component** for adventure creation
- [x] **Enhanced MessageInput** with dual-mode support:
  - Continue Story button
  - Custom action text input
- [x] **Story-themed MessageBubble** components:
  - Narrative-style AI responses
  - Action/Continue user inputs with different styling
- [x] **Updated SessionSidebar** for story management
- [x] **SessionContext** updated to use stories API
- [x] **Responsive storytelling UI** with ambient styling

#### Database & Seeding
- [x] **Scenario model** with predefined story templates
- [x] **Seeding script** with 5 complete scenarios:
  - Space Colony
  - Post-Apocalyptic
  - Fantasy Kingdom
  - Historical Adventure
  - Cyberpunk
- [x] **Enhanced story persistence** with full context

## 🔄 API Endpoints

### Stories
- `GET /api/stories/scenarios` - Get all available scenarios
- `GET /api/stories` - Get all user stories
- `POST /api/stories` - Create a new story
- `GET /api/stories/:id` - Get specific story
- `POST /api/stories/:id/action` - Submit action to story
- `PUT /api/stories/:id/title` - Rename a story
- `DELETE /api/stories/:id` - Delete story

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users
- `PUT /api/users/:id/preferences` - Update user preferences

## 🎮 How to Use

### Creating Your First Adventure
1. **Sign up/Login** to your account
2. **Click "New Adventure"** in the sidebar
3. **Choose a scenario** from the available options
4. **Customize your character** with a name and role
5. **Start your story** and begin your adventure!

### Interacting with Stories
- **Continue Story**: Click the purple "Continue Story" button to let the AI advance the narrative
- **Custom Actions**: Type specific actions in the text box and click "Act" to influence the story direction
- **Story Management**: View, rename, or delete your adventures from the sidebar

## 📁 Project Structure

```
ai-storytelling-app/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── MessageBubble.jsx    # Story-themed message display
│   │   │   ├── MessageInput.jsx     # Dual-mode input component
│   │   │   ├── MessageList.jsx      # Story-aware message list
│   │   │   ├── ScenarioSelector.jsx # Adventure creation modal
│   │   │   └── SessionSidebar.jsx   # Story management sidebar
│   │   ├── contexts/           # React contexts
│   │   │   └── SessionContext.jsx   # Updated for stories API
│   │   ├── pages/              # Page components
│   │   │   └── ChatPage.jsx         # Renamed to StoryPage internally
│   │   └── assets/             # Static assets
│   └── package.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   └── session.js           # Story management logic
│   │   ├── models/             # MongoDB models
│   │   │   ├── Session.js           # Enhanced for storytelling
│   │   │   └── Scenario.js          # Story scenario templates
│   │   ├── routes/             # API routes
│   │   │   └── stories.js           # Story-focused endpoints
│   │   ├── seed/               # Database seeding
│   │   │   └── scenarios.js         # Scenario data and seeding
│   │   ├── utils/              # Utility functions
│   │   │   └── gemini.js            # AI story generation
│   │   └── ...
│   └── package.json
├── package.json                # Root package configuration
├── start.sh                    # Development startup script
└── README.md
```

## 🎨 UI Design Features

- **Storytelling-focused interface** with narrative-style message bubbles
- **Ambient color scheme** using purple/amber themes for immersion
- **Scenario-based customization** with thematic elements
- **Responsive design** that works on desktop, tablet, and mobile
- **Dark/light mode support** for comfortable reading

## 🚀 Next Steps & Enhancement Ideas

- **Visual themes** per scenario (background images, color schemes)
- **Character portraits** and visual customization
- **Story branching** with choice-based narratives
- **Export functionality** for completed adventures
- **Community features** for sharing stories
- **Advanced AI parameters** for different writing styles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎭 Ready to embark on your storytelling adventure? Start your journey today!**

