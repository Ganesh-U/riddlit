import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "riddlit";

// Sample puzzles with hints
const samplePuzzles = [
  // Riddles (30)
  {
    question: "What has keys but no locks, space but no room, and you can enter but not go inside?",
    answer: "keyboard",
    hint: "You're using one right now to type",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question:
      "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
    answer: "echo",
    hint: "Think about sounds bouncing back",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hint: "Think about walking",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    hint: "Found on mail",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question:
      "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    hint: "Used for navigation",
    category: "Riddle",
    difficulty: "Hard",
  },
  {
    question: "What gets wet while drying?",
    answer: "towel",
    hint: "Found in bathrooms",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What can run but never walks, has a mouth but never talks?",
    answer: "river",
    hint: "A body of water",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What has a head and tail but no body?",
    answer: "coin",
    hint: "Used as currency",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What goes up but never comes down?",
    answer: "age",
    hint: "Happens every year",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What has hands but cannot clap?",
    answer: "clock",
    hint: "Tells time",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What has a neck but no head?",
    answer: "bottle",
    hint: "Holds liquids",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What has an eye but cannot see?",
    answer: "needle",
    hint: "Used for sewing",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What can you break without touching it?",
    answer: "promise",
    hint: "Something you make to others",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What has many teeth but cannot bite?",
    answer: "comb",
    hint: "Used for hair",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What can fill a room but takes up no space?",
    answer: "light",
    hint: "Comes from the sun or bulbs",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What has a face and two hands but no arms or legs?",
    answer: "clock",
    hint: "Found on walls",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What goes through cities and fields but never moves?",
    answer: "road",
    hint: "Cars drive on it",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What can you catch but not throw?",
    answer: "cold",
    hint: "An illness",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What has a thumb and four fingers but is not alive?",
    answer: "glove",
    hint: "Worn on hands",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What begins with T, ends with T, and has T in it?",
    answer: "teapot",
    hint: "Used for brewing",
    category: "Riddle",
    difficulty: "Hard",
  },
  {
    question: "What has words but never speaks?",
    answer: "book",
    hint: "You read it",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What can you hold without touching?",
    answer: "breath",
    hint: "Something you do to stay alive",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What gets bigger the more you take away?",
    answer: "hole",
    hint: "Dig and it grows",
    category: "Riddle",
    difficulty: "Hard",
  },
  {
    question: "What has a bed but never sleeps?",
    answer: "river",
    hint: "Flows with water",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What has legs but doesn't walk?",
    answer: "table",
    hint: "Furniture",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What is always in front of you but can't be seen?",
    answer: "future",
    hint: "Time related",
    category: "Riddle",
    difficulty: "Hard",
  },
  {
    question: "What can you serve but never eat?",
    answer: "tennis ball",
    hint: "Used in sports",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What has a ring but no finger?",
    answer: "telephone",
    hint: "Makes a ringing sound",
    category: "Riddle",
    difficulty: "Medium",
  },
  {
    question: "What goes around the house but never moves?",
    answer: "fence",
    hint: "Marks property boundary",
    category: "Riddle",
    difficulty: "Easy",
  },
  {
    question: "What belongs to you but others use it more?",
    answer: "name",
    hint: "People call you by it",
    category: "Riddle",
    difficulty: "Medium",
  },

  // Logic (30)
  {
    question:
      "If you have me, you want to share me. If you share me, you no longer have me. What am I?",
    answer: "secret",
    hint: "Something confidential",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "A farmer has 17 sheep. All but 9 die. How many are left?",
    answer: "9",
    hint: "Read carefully - 'all but 9'",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
    answer: "m",
    hint: "Look at the letters",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "What comes once in a year, twice in a week, but never in a day?",
    answer: "e",
    hint: "Count the letter 'e'",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "If there are 3 apples and you take away 2, how many do you have?",
    answer: "2",
    hint: "You took them",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question: "What five-letter word becomes shorter when you add two letters to it?",
    answer: "short",
    hint: "Think about the word 'shorter'",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question:
      "What word in the English language does the following: the first two letters signify a male, the first three letters signify a female, the first four letters signify a great, while the entire word signifies a great woman?",
    answer: "heroine",
    hint: "HE, HER, HERO...",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question:
      "A man is looking at a photograph of someone. His friend asks who it is. The man replies, 'Brothers and sisters, I have none. But that man's father is my father's son.' Who is in the photograph?",
    answer: "son",
    hint: "My father's son is me",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "What can you hold in your left hand but not in your right?",
    answer: "right elbow",
    hint: "Think about body parts",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "What disappears as soon as you say its name?",
    answer: "silence",
    hint: "The opposite of noise",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question:
      "A doctor gives you three pills and tells you to take one every half hour. How long will the pills last?",
    answer: "1 hour",
    hint: "Take pill 1 at 0:00, pill 2 at 0:30, pill 3 at 1:00",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question:
      "You see a boat filled with people. It has not sunk, but when you look again you don't see a single person. Why?",
    answer: "all married",
    hint: "They're not single",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "A man dies of old age on his 25th birthday. How is this possible?",
    answer: "leap year",
    hint: "Born on February 29th",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question:
      "You walk into a room with a match. Inside are a kerosene lamp, a candle, and a fireplace. Which do you light first?",
    answer: "match",
    hint: "You need it to light the others",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question:
      "What is black when you buy it, red when you use it, and gray when you throw it away?",
    answer: "charcoal",
    hint: "Used for grilling",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question:
      "What is seen in the middle of March and April but can't be seen at the beginning or end of either month?",
    answer: "r",
    hint: "Look at the letters",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "What is full of holes but still holds water?",
    answer: "sponge",
    hint: "Used for cleaning",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question:
      "Two fathers and two sons go fishing. Each catches one fish. They bring home 3 fish. How?",
    answer: "grandfather",
    hint: "Three generations: grandfather, father, son",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "What building has the most stories?",
    answer: "library",
    hint: "Think about books",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "What can point in every direction but can't reach the destination?",
    answer: "finger",
    hint: "Part of your hand",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question: "What gets wetter the more it dries?",
    answer: "towel",
    hint: "Used after shower",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question: "What month has 28 days?",
    answer: "all",
    hint: "Every month has at least 28",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question: "What starts with E, ends with E, but only contains one letter?",
    answer: "envelope",
    hint: "Holds mail",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "What is always coming but never arrives?",
    answer: "tomorrow",
    hint: "Time related",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "What can travel faster than light?",
    answer: "thought",
    hint: "Mental process",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question:
      "A woman shoots her husband, then holds him underwater for 5 minutes. Next, she hangs him. Right after, they enjoy a lovely dinner. How?",
    answer: "photograph",
    hint: "She's a photographer",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "What invention lets you look right through a wall?",
    answer: "window",
    hint: "Made of glass",
    category: "Logic",
    difficulty: "Easy",
  },
  {
    question: "What is at the end of a rainbow?",
    answer: "w",
    hint: "Look at the letters in 'rainbow'",
    category: "Logic",
    difficulty: "Hard",
  },
  {
    question: "What can run but has no legs?",
    answer: "nose",
    hint: "When you have a cold",
    category: "Logic",
    difficulty: "Medium",
  },
  {
    question: "What kind of coat is always wet when you put it on?",
    answer: "paint",
    hint: "Not clothing",
    category: "Logic",
    difficulty: "Medium",
  },

  // Math (25)
  {
    question: "What is 47 × 23?",
    answer: "1081",
    hint: "Use long multiplication",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question: "What is 15% of 200?",
    answer: "30",
    hint: "15/100 × 200",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "If x + 5 = 12, what is x?",
    answer: "7",
    hint: "Subtract 5 from both sides",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is the square root of 144?",
    answer: "12",
    hint: "12 × 12 = ?",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 8 squared?",
    answer: "64",
    hint: "8 × 8",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "If a triangle has angles of 60° and 60°, what is the third angle?",
    answer: "60",
    hint: "Triangle angles sum to 180°",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question: "What is 25% of 80?",
    answer: "20",
    hint: "1/4 of 80",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What comes next in the sequence: 2, 4, 8, 16, __?",
    answer: "32",
    hint: "Each number doubles",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question:
      "If 5 cats can catch 5 mice in 5 minutes, how many cats does it take to catch 100 mice in 100 minutes?",
    answer: "5",
    hint: "Rate stays the same",
    category: "Math",
    difficulty: "Hard",
  },
  {
    question: "What is 12 × 12?",
    answer: "144",
    hint: "Think of dozens",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 20% of 150?",
    answer: "30",
    hint: "20/100 × 150",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is the next prime number after 7?",
    answer: "11",
    hint: "Only divisible by 1 and itself",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question: "If 2x = 16, what is x?",
    answer: "8",
    hint: "Divide both sides by 2",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is the sum of angles in a triangle?",
    answer: "180",
    hint: "Always the same for any triangle",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 7 × 8?",
    answer: "56",
    hint: "Seven eights",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 100 divided by 4?",
    answer: "25",
    hint: "How many quarters in 100",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 9 × 9?",
    answer: "81",
    hint: "Nine nines",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "If a dozen eggs cost $3, how much does one egg cost?",
    answer: "0.25",
    hint: "Divide by 12",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question: "What is the perimeter of a square with side length 5?",
    answer: "20",
    hint: "Add all four sides",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 10 cubed?",
    answer: "1000",
    hint: "10 × 10 × 10",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question: "What is half of 88?",
    answer: "44",
    hint: "Divide by 2",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "How many sides does a hexagon have?",
    answer: "6",
    hint: "Hex means six",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is 13 + 17?",
    answer: "30",
    hint: "Simple addition",
    category: "Math",
    difficulty: "Easy",
  },
  {
    question: "What is the cube root of 27?",
    answer: "3",
    hint: "3 × 3 × 3",
    category: "Math",
    difficulty: "Medium",
  },
  {
    question: "What is 50% of 200?",
    answer: "100",
    hint: "Half of 200",
    category: "Math",
    difficulty: "Easy",
  },

  // Trivia (25)
  {
    question: "What is the capital of France?",
    answer: "paris",
    hint: "Known as the City of Light",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "Who wrote Romeo and Juliet?",
    answer: "shakespeare",
    hint: "Famous English playwright",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the largest planet in our solar system?",
    answer: "jupiter",
    hint: "Named after a Roman god",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "How many continents are there?",
    answer: "7",
    hint: "Africa, Asia, Europe...",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the smallest prime number?",
    answer: "2",
    hint: "It's even",
    category: "Trivia",
    difficulty: "Medium",
  },
  {
    question: "In what year did World War II end?",
    answer: "1945",
    hint: "Mid 1940s",
    category: "Trivia",
    difficulty: "Medium",
  },
  {
    question: "What is the chemical symbol for gold?",
    answer: "au",
    hint: "From Latin 'aurum'",
    category: "Trivia",
    difficulty: "Hard",
  },
  {
    question: "How many bones are in the adult human body?",
    answer: "206",
    hint: "Over 200",
    category: "Trivia",
    difficulty: "Hard",
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "da vinci",
    hint: "Leonardo...",
    category: "Trivia",
    difficulty: "Medium",
  },
  {
    question: "What is the fastest land animal?",
    answer: "cheetah",
    hint: "Big cat, spotted",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the capital of Japan?",
    answer: "tokyo",
    hint: "Largest city in Japan",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is H2O?",
    answer: "water",
    hint: "You drink it",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "How many states are in the USA?",
    answer: "50",
    hint: "Fifty states",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the tallest mountain in the world?",
    answer: "everest",
    hint: "Mount...",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "Who was the first president of the United States?",
    answer: "washington",
    hint: "George...",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "pacific",
    hint: "Between Asia and Americas",
    category: "Trivia",
    difficulty: "Medium",
  },
  {
    question: "What planet is known as the Red Planet?",
    answer: "mars",
    hint: "Named after Roman god of war",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "How many days are in a leap year?",
    answer: "366",
    hint: "One more than usual",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the capital of Australia?",
    answer: "canberra",
    hint: "Not Sydney or Melbourne",
    category: "Trivia",
    difficulty: "Hard",
  },
  {
    question: "Who invented the telephone?",
    answer: "bell",
    hint: "Alexander Graham...",
    category: "Trivia",
    difficulty: "Medium",
  },
  {
    question: "What is the smallest country in the world?",
    answer: "vatican",
    hint: "Inside Rome",
    category: "Trivia",
    difficulty: "Hard",
  },
  {
    question: "How many strings does a standard guitar have?",
    answer: "6",
    hint: "Less than 10",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What is the freezing point of water in Celsius?",
    answer: "0",
    hint: "Zero degrees",
    category: "Trivia",
    difficulty: "Easy",
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    answer: "carbon dioxide",
    hint: "CO2",
    category: "Trivia",
    difficulty: "Medium",
  },
  {
    question: "How many players are on a soccer team?",
    answer: "11",
    hint: "Eleven players",
    category: "Trivia",
    difficulty: "Easy",
  },
];

// Generate usernames
function generateUsername() {
  const prefixes = [
    "brain",
    "puzzle",
    "riddle",
    "think",
    "smart",
    "genius",
    "logic",
    "wise",
    "clever",
    "quick",
    "mind",
    "quiz",
    "test",
    "solve",
  ];
  const suffixes = [
    "master",
    "king",
    "queen",
    "pro",
    "expert",
    "wizard",
    "ninja",
    "guru",
    "fan",
    "lover",
    "geek",
    "nerd",
    "ace",
    "star",
  ];
  const num = Math.floor(Math.random() * 999);
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${
    suffixes[Math.floor(Math.random() * suffixes.length)]
  }${num}`;
}

// Random date within last 30 days
function randomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("puzzles").deleteMany({});
    await db.collection("submissions").deleteMany({});
    await db.collection("comments").deleteMany({});

    // Create users
    console.log("👥 Creating users...");
    const users = [];
    for (let i = 0; i < 50; i++) {
      users.push({
        username: generateUsername(),
        password: "password123", // Simple password for all seeded users
        created_at: randomDate(),
        puzzle_count: 0,
        solve_count: 0,
      });
    }
    await db.collection("users").insertMany(users);
    console.log(`✅ Created ${users.length} users`);

    // Create puzzles
    console.log("🧩 Creating puzzles...");
    const puzzles = samplePuzzles.map((puzzle) => ({
      ...puzzle,
      creator_username: users[Math.floor(Math.random() * users.length)].username,
      total_attempts: 0,
      successful_solves: 0,
      likes: 0,
      dislikes: 0,
      created_date: randomDate(),
    }));
    const puzzleResult = await db.collection("puzzles").insertMany(puzzles);
    const puzzleIds = Object.values(puzzleResult.insertedIds);
    console.log(`✅ Created ${puzzles.length} puzzles`);

    // Create submissions
    console.log("📝 Creating submissions...");
    const submissions = [];
    for (let i = 0; i < 1200; i++) {
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const isCorrect = Math.random() > 0.35;

      submissions.push({
        puzzle_id: puzzleIds[puzzles.indexOf(puzzle)].toString(),
        solver_username: user.username,
        submitted_answer: isCorrect ? puzzle.answer : "wrong answer",
        is_correct: isCorrect,
        submission_time: randomDate(),
      });
    }
    await db.collection("submissions").insertMany(submissions);
    console.log(`✅ Created ${submissions.length} submissions`);

    // Create votes (likes and dislikes)
    console.log("👍 Creating votes...");
    const votes = [];
    for (let i = 0; i < 500; i++) {
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const voteType = Math.random() > 0.35 ? "like" : "dislike"; // 65% likes, 35% dislikes

      // Avoid duplicate votes from same user on same puzzle
      const existingVote = votes.find(
        (v) =>
          v.puzzle_id === puzzleIds[puzzles.indexOf(puzzle)].toString() &&
          v.voter_username === user.username
      );

      if (!existingVote) {
        votes.push({
          puzzle_id: puzzleIds[puzzles.indexOf(puzzle)].toString(),
          voter_username: user.username,
          vote_type: voteType,
          voted_at: randomDate(),
        });
      }
    }
    await db.collection("votes").insertMany(votes);
    console.log(`✅ Created ${votes.length} votes`);

    // Update puzzle stats
    console.log("📊 Updating puzzle stats...");
    for (const puzzleId of puzzleIds) {
      const puzzleSubmissions = submissions.filter((s) => s.puzzle_id === puzzleId.toString());
      const correctSubmissions = puzzleSubmissions.filter((s) => s.is_correct);

      const puzzleVotes = votes.filter((v) => v.puzzle_id === puzzleId.toString());
      const likesCount = puzzleVotes.filter((v) => v.vote_type === "like").length;
      const dislikesCount = puzzleVotes.filter((v) => v.vote_type === "dislike").length;

      await db.collection("puzzles").updateOne(
        { _id: puzzleId },
        {
          $set: {
            total_attempts: puzzleSubmissions.length,
            successful_solves: correctSubmissions.length,
            likes: likesCount,
            dislikes: dislikesCount,
          },
        }
      );
    }
    console.log("✅ Updated puzzle stats");

    // Update user stats
    console.log("👤 Updating user stats...");
    for (const user of users) {
      const userPuzzles = puzzles.filter((p) => p.creator_username === user.username);
      const userSubmissions = submissions.filter(
        (s) => s.solver_username === user.username && s.is_correct
      );

      await db.collection("users").updateOne(
        { username: user.username },
        {
          $set: {
            puzzle_count: userPuzzles.length,
            solve_count: userSubmissions.length,
          },
        }
      );
    }
    console.log("✅ Updated user stats");

    // Create comments
    console.log("💬 Creating comments...");
    const comments = [];
    const commentTexts = [
      "Great puzzle! Really enjoyed this one.",
      "This was tricky! Took me a while.",
      "Loved this challenge!",
      "Fantastic riddle!",
      "Nice one! Very clever.",
      "This stumped me for a bit!",
      "Excellent brain teaser!",
      "Well crafted puzzle!",
      "This was fun to solve!",
      "Creative question!",
    ];

    for (let i = 0; i < 200; i++) {
      comments.push({
        puzzle_id: puzzleIds[Math.floor(Math.random() * puzzleIds.length)].toString(),
        commenter_username: users[Math.floor(Math.random() * users.length)].username,
        text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        created_at: randomDate(),
      });
    }
    await db.collection("comments").insertMany(comments);
    console.log(`✅ Created ${comments.length} comments`);

    // Summary
    const totalRecords =
      users.length + puzzles.length + submissions.length + votes.length + comments.length;
    console.log("\n🎉 SEEDING COMPLETE!");
    console.log("═══════════════════════════════");
    console.log(`👥 Users:       ${users.length}`);
    console.log(`🧩 Puzzles:     ${puzzles.length}`);
    console.log(`📝 Submissions: ${submissions.length}`);
    console.log(`👍 Votes:       ${votes.length}`);
    console.log(`💬 Comments:    ${comments.length}`);
    console.log("═══════════════════════════════");
    console.log(`📊 Total Records: ${totalRecords}`);
    console.log("═══════════════════════════════\n");
    console.log("🚀 You can now start the server with: npm run dev");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await client.close();
    console.log("👋 Disconnected from MongoDB");
  }
}

seedDatabase();
