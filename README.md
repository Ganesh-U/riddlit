# Riddlit - Brain Teaser Challenge Platform

A community-driven puzzle platform where users create and solve brain teasers, riddles, logic puzzles, and trivia questions. Built as a full-stack web application with social features including voting, comments, and competitive leaderboards.

## Objective

This project demonstrates full-stack web development skills through a complete CRUD application. It showcases user authentication, database design with multiple collections, RESTful API development, client-side rendering, and complex user interaction patterns. The platform encourages daily engagement through solve streak tracking and provides creators with detailed analytics on puzzle performance.

## Screenshots

### Browse Puzzles - Main Feed

![Browse Puzzles](screenshots/browse_puzzles.png)
_Filter puzzles by category and difficulty with real-time search_

### Puzzle Detail - Solve Interface

![Puzzle Solving](screenshots/puzzle_detail.png)
_Submit answers with instant feedback and community voting_

### Create Puzzle

![Create Puzzle](screenshots/create_puzzle.png)
_Intuitive form for puzzle creation with category and difficulty selection_

### Leaderboard

![Leaderboard](screenshots/leaderboard.png)
_Community rankings showing top solvers and puzzle creators_

### My Puzzles Dashboard

![My Puzzles](screenshots/my_puzzles.png)
_Manage your created puzzles with statistics and edit capabilities_

### Dark Mode

![Dark Mode](screenshots/dark_mode.png)
_Toggle between light and dark themes for comfortable viewing_

## Technology Requirements

### Core Technologies

- **Backend:** Node.js v16+ with Express.js framework
- **Database:** MongoDB with native driver (no Mongoose)
- **Frontend:** Vanilla JavaScript (ES6 Modules)
- **Authentication:** Express-session for session-based auth
- **Styling:** Custom CSS3 with responsive design

### Development Tools

- **ESLint:** JavaScript linting and code quality
- **Prettier:** Code formatting and consistency
- **Docker:** MongoDB containerization (recommended)
- **Git:** Version control with clear commit history

### Browser Support

- Modern browsers supporting ES6+ features
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile-responsive design for all screen sizes

## Installation & Usage

### Prerequisites

- Node.js v16 or higher
- MongoDB (local installation or Docker)
- Git for version control
- Modern web browser

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/riddlit.git
cd riddlit

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your configuration:
# - MONGODB_URI=mongodb://localhost:27017
# - SESSION_SECRET=your-secret-key
# - PORT=3000

# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Seed the database with sample data (creates 1000+ records)
node scripts/seed-data.js

# Start the development server
npm start

# Open browser
# Navigate to http://localhost:3000
```

### Development Commands

```bash
# Start server with auto-reload
npm run dev

# Run ESLint for code quality
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Seed database
npm run seed
```

### Project Structure

```
riddlit/
├── public/                      # Frontend files
│   ├── css/                    # Stylesheets
│   │   ├── auth.css           # Login/register styling
│   │   ├── base.css           # Base styles and variables
│   │   ├── components.css     # Reusable UI components
│   │   ├── dark-mode.css      # Dark theme styles
│   │   ├── layout.css         # Page layout structure
│   │   ├── modal.css          # Modal overlays
│   │   ├── puzzle-card.css    # Puzzle card styling
│   │   └── sidebar.css        # Navigation sidebar
│   ├── js/                    # JavaScript ES6 Modules
│   │   ├── api/
│   │   │   └── client.js      # API communication layer
│   │   ├── components/
│   │   │   └── puzzleCard.js  # Reusable puzzle card
│   │   ├── pages/
│   │   │   ├── index.js       # Browse puzzles logic
│   │   │   ├── leaderboard.js # Rankings display
│   │   │   ├── my-puzzles.js  # Puzzle management
│   │   │   └── my-stats.js    # User statistics
│   │   └── utils/
│   │       ├── auth.js        # Authentication handling
│   │       ├── darkMode.js    # Theme switching
│   │       ├── helpers.js     # Utility functions
│   │       └── toasts.js      # Notifications
│   ├── favicon.svg            # Site icon
│   ├── index.html             # Browse puzzles page
│   ├── leaderboard.html       # Community rankings
│   ├── login.html             # User login
│   ├── my-puzzles.html        # Puzzle creator dashboard
│   ├── my-stats.html          # User statistics
│   └── register.html          # User registration
├── src/                        # Backend files
│   ├── db/
│   │   └── connection.js      # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/                # API endpoints
│   │   ├── commentRoutes.js   # Comment CRUD operations
│   │   ├── puzzleRoutes.js    # Puzzle CRUD operations
│   │   ├── submissionRoutes.js # Answer submission
│   │   ├── userRoutes.js      # User authentication
│   │   └── voteRoutes.js      # Voting system
│   └── server.js              # Express server setup
├── scripts/
│   └── seed-data.js           # Database seeding script
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── .prettierrc.json           # Prettier configuration
├── eslint.config.js           # ESLint configuration
├── package.json               # Project dependencies
├── Riddlit_Design_Document.pdf # Design documentation
└── README.md                  # This file
```

## Key Features

### User Authentication

- **Registration System:** Secure account creation with username/password
- **Session Management:** Express-session for persistent login state
- **Protected Routes:** Middleware-based authentication for secure endpoints
- **Profile Management:** View personal statistics and puzzle history

### Puzzle Management (Ganesh)

- **Create Puzzles:** Form with question, answer, hint, category, and difficulty
- **Edit/Delete:** Full ownership controls for puzzle creators
- **Categories:** Riddle, Logic, Math, Trivia
- **Difficulty Levels:** Easy, Medium, Hard with visual indicators
- **Statistics Tracking:** View attempts, solve rate, and popularity

### Puzzle Solving (Vignesh)

- **Browse Interface:** Filter by category and difficulty
- **Answer Submission:** Instant feedback on correctness
- **Solve Tracking:** Personal history of attempted puzzles
- **Streak System:** Track consecutive days of solving
- **Success Rate:** Calculate personal solving statistics

### Community Features (Vignesh)

- **Voting System:** Thumbs up/down on puzzle quality
- **Comments:** Discuss solutions and provide hints
- **Leaderboard:** Rankings for top solvers and creators
- **Community Stats:** View overall platform engagement
- **Popular Puzzles:** Discover trending challenges

### User Interface

- **Dark Mode:** Toggle between light and dark themes
- **Responsive Design:** Mobile-first responsive layout
- **Toast Notifications:** Real-time user feedback
- **Loading States:** Clear indicators during async operations
- **Sidebar Navigation:** Intuitive page navigation
- **Modal Overlays:** Clean popup interfaces

### Creative Features Highlighted

- **Instagram-style Feed:** Scrollable puzzle cards with voting
- **Instant Validation:** Real-time answer checking with feedback
- **Streak Tracking:** Gamification through daily solve streaks
- **Dynamic Statistics:** Real-time updates on puzzle performance
- **Social Interaction:** Comments and voting for community engagement

## Database Collections

### Users Collection (Ganesh)

```javascript
{
  _id: ObjectId,
  username: String,
  password: String,
  created_at: Date,
  puzzle_count: Number,
  solve_count: Number
}
```

### Puzzles Collection (Ganesh)

```javascript
{
  _id: ObjectId,
  question: String,
  answer: String,
  hint: String,
  category: String,
  difficulty: String,
  creator_username: String,
  total_attempts: Number,
  successful_solves: Number,
  likes: Number,
  dislikes: Number,
  created_date: Date
}
```

### Submissions Collection (Vignesh)

```javascript
{
  _id: ObjectId,
  puzzle_id: String,
  solver_username: String,
  submitted_answer: String,
  is_correct: Boolean,
  submission_time: Date
}
```

### Comments Collection (Vignesh)

```javascript
{
  _id: ObjectId,
  puzzle_id: String,
  commenter_username: String,
  text: String,
  created_at: Date
}
```

### Votes Collection (Vignesh)

```javascript
{
  _id: ObjectId,
  puzzle_id: String,
  voter_username: String,
  vote_type: String, // "like" or "dislike"
  voted_at: Date
}
```

## Authors

**Ganesh Umasankar**  
MS Computer Science Student  
Northeastern University, Boston, MA

- **Email:** umasankar.g@northeastern.edu
- **LinkedIn:** [ganesh-umasankar-87a3371b4](https://www.linkedin.com/in/ganesh-umasankar-87a3371b4/)
- **GitHub:** [Ganesh-U](https://github.com/Ganesh-U)

**Vignesh Pakkam Saravanan**  
MS Computer Science Student  
Northeastern University, Boston, MA

- **Email:** pakkamsaravanan.v@northeastern.edu
- **LinkedIn:** [Add LinkedIn]
- **GitHub:** [Add GitHub]

## Academic Reference

**Course:** CS 5610 - Web Development  
**Institution:** Northeastern University  
**Semester:** Fall 2024  
**Course Website:** [Professor's Course Page]

## Documentation & Resources

### Project Documentation

- **Design Document:** [Riddlit_Design_Document.pdf](Riddlit_Design_Document.pdf)
- **Video Demo:** [Demo Video Link - Add YouTube link]
- **Live Website:** [Deployment URL - Add Render/Railway link]
- **Source Code:** [GitHub Repository](https://github.com/YOUR_USERNAME/riddlit)

### Technical Resources

- **API Documentation:** RESTful endpoints with Express routes
- **Database Schema:** MongoDB collections with native driver
- **ESLint Config:** Class-standard linting configuration
- **Security:** Environment variables for secrets, session-based auth

## Academic Compliance

### Course Requirements Met

- ✅ **Vanilla JavaScript:** ES6 modules with no React or frameworks
- ✅ **Node + Express:** Backend server with proper routing
- ✅ **MongoDB Native Driver:** No Mongoose usage
- ✅ **No Template Engines:** Client-side rendering only
- ✅ **Session Authentication:** Express-session implementation
- ✅ **Multiple Collections:** 5 collections with full CRUD
- ✅ **Modular Code:** ES6 modules organization
- ✅ **ESLint:** Zero errors with proper configuration
- ✅ **Prettier:** Consistent code formatting
- ✅ **Deployment:** Public server hosting
- ✅ **1000+ Records:** Seed data script provided
- ✅ **Work Division:** Clear attribution in commits

### Work Distribution

#### Ganesh Umasankar

- User authentication system (registration, login, session management)
- User routes and authentication middleware
- Puzzle creation and management (full CRUD operations)
- Puzzle routes and database operations
- Database schema design and connection setup
- Server configuration with Express and middleware
- Seed data generation script (1000+ records)
- Login/register pages and authentication UI
- My puzzles dashboard with edit/delete functionality

#### Vignesh Pakkam Saravanan

- Puzzle browsing and filtering interface
- Answer submission and validation system
- Submission routes and history tracking
- Comments system (create, read, delete)
- Comment routes and UI components
- Voting functionality (likes/dislikes)
- Vote routes and duplicate prevention
- Leaderboard and user statistics display
- Personal submission history page
- Dark mode implementation with proper contrast
- Toast notification system for user feedback
- Helper utilities and UI components
- Base CSS and design system variables

## Use of Generative AI

**This project contains a mix of original work and AI-assisted development.**

### AI Tools Used

- **Claude (Anthropic):** Version 4 Sonnet
- **ChatGPT (OpenAI):** GPT-4
- **GitHub Copilot:** Code completion and suggestions

### Specific AI Assistance

1. **Seed Data Generation:** AI-generated 100+ diverse puzzles across all categories (Riddles, Logic, Math, Trivia) with varying difficulty levels to populate the database with realistic content
2. **Debugging Support:** AI assistance with MongoDB query optimization and session management issues
3. **CSS Troubleshooting:** Help resolving dark mode text visibility and responsive design issues
4. **Documentation:** Assistance with README structure and technical documentation formatting
5. **Code Optimization:** Suggestions for improving API error handling and client-side rendering performance
6. **Design Patterns:** Guidance on modular JavaScript architecture and ES6 module organization

### Example Prompts Used

- "Generate 100+ diverse brain teasers, riddles, logic puzzles, math problems, and trivia questions with answers and hints across Easy, Medium, and Hard difficulty levels"
- "Debug this MongoDB aggregation query for calculating user statistics with solve counts and streaks"
- "Review this Express route for security vulnerabilities and suggest improvements"
- "How can I improve dark mode contrast for better text visibility across all components?"
- "Create comprehensive README documentation following academic portfolio format with all required sections"

### Original Work

- Complete application architecture and design decisions
- User interface design and user experience flow
- Database schema design and relationships
- All business logic and feature implementation
- Integration of all components into cohesive application
- Testing and debugging of complete system

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Ganesh Umasankar & Vignesh Pakkam Saravanan for CS 5610 Web Development**
