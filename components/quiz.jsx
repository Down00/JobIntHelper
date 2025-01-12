
export const quizData = {
    technical: {
        title: "Game Development Quiz",
        questions: [
                {
                    id: 1,
                    question: "What is a game engine?",
                    options: [
                    "A specialized computer for gaming",
                    "A software framework for game development",
                    "A hardware device for rendering graphics",
                    "A middleware for network connectivity"
                    ],
                    correctAnswer: "A software framework for game development",
                    explanation: "A game engine is a software framework designed for the development of video games."
                },
                {
                    id: 2,
                    question: "Which of the following is a popular game engine?",
                    options: [
                    "Unity",
                    "Photoshop",
                    "Illustrator",
                    "Excel"
                    ],
                    correctAnswer: "Unity",
                    explanation: "Unity is one of the most popular and widely-used game engines for 2D and 3D game development."
                },
                {
                    id: 3,
                    question: "What is the role of a game designer?",
                    options: [
                    "Create the game's story and mechanics",
                    "Write the game's source code",
                    "Market the game",
                    "Fix bugs in the game"
                    ],
                    correctAnswer: "Create the game's story and mechanics",
                    explanation: "Game designers are responsible for crafting the game’s narrative, rules, and gameplay mechanics."
                },
                {
                    id: 4,
                    question: "Which of these is a type of rendering engine used in game development?",
                    options: [
                    "Unreal Engine",
                    "Chrome Engine",
                    "RenderWare",
                    "RenderFlow"
                    ],
                    correctAnswer: "RenderWare",
                    explanation: "RenderWare is a widely used rendering engine, especially in older games, used for 3D game development."
                },
                {
                    id: 5,
                    question: "What does the term 'frame rate' refer to?",
                    options: [
                    "The speed at which a game loads",
                    "The rate at which images are displayed per second",
                    "The speed of network connection",
                    "The time it takes for a game to boot"
                    ],
                    correctAnswer: "The rate at which images are displayed per second",
                    explanation: "Frame rate refers to how many frames or images are displayed per second in a game."
                },
                {
                    id: 6,
                    question: "What does 'AI' stand for in game development?",
                    options: [
                    "Art Intelligence",
                    "Advanced Interaction",
                    "Artificial Intelligence",
                    "Automated Interface"
                    ],
                    correctAnswer: "Artificial Intelligence",
                    explanation: "AI in games is used to simulate intelligent behavior in non-player characters (NPCs)."
                },
                {
                    id: 7,
                    question: "Which of the following is a popular physics engine?",
                    options: [
                    "Havok",
                    "Audacity",
                    "ZBrush",
                    "Blender"
                    ],
                    correctAnswer: "Havok",
                    explanation: "Havok is a physics engine commonly used in video games to simulate real-world physics."
                },
                {
                    id: 8,
                    question: "What is 'polygon count' in 3D games?",
                    options: [
                    "The number of shaders in a scene",
                    "The number of vertices in a 3D model",
                    "The number of polygons used to render an object",
                    "The size of a 3D file"
                    ],
                    correctAnswer: "The number of polygons used to render an object",
                    explanation: "Polygon count refers to the total number of polygons used to model objects in 3D games."
                },
                {
                    id: 9,
                    question: "What is 'LOD' in game development?",
                    options: [
                    "Level of Distance",
                    "Loss of Detail",
                    "Level of Detail",
                    "Length of Detail"
                    ],
                    correctAnswer: "Level of Detail",
                    explanation: "LOD (Level of Detail) refers to adjusting the complexity of a 3D model as it gets further from the camera."
                },
                {
                    id: 10,
                    question: "What is 'shader' in 3D game development?",
                    options: [
                    "A tool to colorize game textures",
                    "A piece of code that defines how surfaces are rendered",
                    "A texture editor",
                    "A tool for debugging graphics"
                    ],
                    correctAnswer: "A piece of code that defines how surfaces are rendered",
                    explanation: "Shaders are programs that define how an object is rendered, including its lighting and shadow properties."
                },
                {
                    id: 11,
                    question: "What is 'ray tracing'?",
                    options: [
                    "A process to reduce polygons",
                    "A rendering technique for simulating light rays",
                    "A method to trace player input",
                    "A system for managing game levels"
                    ],
                    correctAnswer: "A rendering technique for simulating light rays",
                    explanation: "Ray tracing is a rendering technique that simulates the path of light to create realistic lighting effects."
                },
                {
                    id: 12,
                    question: "Which of the following is a game design principle?",
                    options: [
                    "Input Latency",
                    "Feedback Loops",
                    "Frame Rate Capping",
                    "Network Optimization"
                    ],
                    correctAnswer: "Feedback Loops",
                    explanation: "Feedback loops are a core game design principle, providing responses to players' actions, which drive behavior."
                },
                {
                    id: 13,
                    question: "What is 'alpha testing' in game development?",
                    options: [
                    "Public testing phase",
                    "Testing by developers in-house",
                    "Testing for visual bugs",
                    "Testing for multiplayer features"
                    ],
                    correctAnswer: "Testing by developers in-house",
                    explanation: "Alpha testing is conducted in-house by the developers to ensure that the game runs properly before moving to beta."
                },
                {
                    id: 14,
                    question: "What is 'procedural generation'?",
                    options: [
                    "Manually designing each level",
                    "Random generation of game assets",
                    "Using algorithms to generate content",
                    "Pre-rendered cutscenes"
                    ],
                    correctAnswer: "Using algorithms to generate content",
                    explanation: "Procedural generation involves using algorithms to create game levels, maps, or assets dynamically."
                },
                {
                    id: 15,
                    question: "What does 'FPS' stand for in game development?",
                    options: [
                    "Frames per Second",
                    "First Person Shooter",
                    "File Processing System",
                    "Faster Play Style"
                    ],
                    correctAnswer: "Frames per Second",
                    explanation: "FPS stands for Frames per Second, a measure of how many frames a game renders each second."
                },
                {
                    id: 16,
                    question: "Which game engine is known for its high-quality visual effects and real-time rendering?",
                    options: [
                    "Unity",
                    "Unreal Engine",
                    "Godot",
                    "GameMaker"
                    ],
                    correctAnswer: "Unreal Engine",
                    explanation: "Unreal Engine is widely known for its stunning visual effects and real-time rendering capabilities."
                },
                {
                    id: 17,
                    question: "What is the primary purpose of a game loop?",
                    options: [
                    "To initialize the game",
                    "To continuously update and render the game",
                    "To manage user input",
                    "To save game progress"
                    ],
                    correctAnswer: "To continuously update and render the game",
                    explanation: "The game loop continuously runs to process input, update the game state, and render the game."
                },
                {
                    id: 18,
                    question: "What is 'collision detection' in game development?",
                    options: [
                    "Checking if game objects interact",
                    "Detecting player's network connection",
                    "Rendering objects that collide",
                    "Simulating player input"
                    ],
                    correctAnswer: "Checking if game objects interact",
                    explanation: "Collision detection ensures game objects can interact properly by detecting when they overlap or collide."
                },
                {
                    id: 19,
                    question: "Which of the following is a popular 2D game development engine?",
                    options: [
                    "Godot",
                    "ZBrush",
                    "3ds Max",
                    "Maya"
                    ],
                    correctAnswer: "Godot",
                    explanation: "Godot is a popular open-source game engine suitable for both 2D and 3D game development."
                },
                {
                    id: 20,
                    question: "What is 'lag' in online multiplayer games?",
                    options: [
                    "A temporary slowdown of a game",
                    "A delay caused by network latency",
                    "An issue with graphics rendering",
                    "An error in the game engine"
                    ],
                    correctAnswer: "A delay caused by network latency",
                    explanation: "Lag is a delay between a player’s action and the game server’s response due to network latency."
                },
                {
                    id: 21,
                    question: "What is a 'sprite' in 2D game development?",
                    options: [
                    "A background image",
                    "A 2D image representing a character or object",
                    "A sound effect",
                    "A tool for rendering objects"
                    ],
                    correctAnswer: "A 2D image representing a character or object",
                    explanation: "A sprite is a 2D bitmap used in games to represent characters, objects, or other visual elements."
                },
                {
                    id: 22,
                    question: "What is a 'game jam'?",
                    options: [
                    "A gaming competition",
                    "An event where developers build games in a short time",
                    "A test for game bugs",
                    "A music festival for game soundtracks"
                    ],
                    correctAnswer: "An event where developers build games in a short time",
                    explanation: "A game jam is an event where game developers collaborate to create a game within a limited time frame."
                },
        ]
    },
    softwareEngineer: {
        title: "Software Engineering Quiz",
        questions: [
            {
                id: 1,
                question: "What is a Design Pattern in software engineering?",
                options: [
                    "A standard solution to a common problem",
                    "A database schema",
                    "A type of algorithm",
                    "A testing framework"
                ],
                correctAnswer: "A standard solution to a common problem",
                explanation: "Design patterns are standard solutions to common software design problems."
            },
            {
                id: 2,
                question: "What is the Agile methodology?",
                options: [
                    "A method for creating prototypes",
                    "A project management framework focused on iterative development",
                    "A type of software testing",
                    "A security protocol"
                ],
                correctAnswer: "A project management framework focused on iterative development",
                explanation: "Agile emphasizes iterative development, collaboration, and flexibility in responding to change."
            },
            // More questions...
        ]
    },
    mobileDevelopment: {
        title: "Mobile Development Quiz",
        questions: [
            {
                id: 1,
                question: "Which language is primarily used for iOS app development?",
                options: [
                    "Swift",
                    "Java",
                    "Kotlin",
                    "C++"
                ],
                correctAnswer: "Swift",
                explanation: "Swift is the primary programming language for iOS development."
            },
            {
                id: 2,
                question: "Which of the following is a cross-platform mobile development framework?",
                options: [
                    "React Native",
                    "Angular",
                    "Django",
                    "Flask"
                ],
                correctAnswer: "React Native",
                explanation: "React Native allows developers to build mobile apps using JavaScript and React."
            },
            // More questions...
        ]
    },
    webDevelopment: {
        title: "Web Development Quiz",
        questions: [
            {
                id: 1,
                question: "What does HTML stand for?",
                options: [
                    "HyperText Markup Language",
                    "HyperTransfer Markup Language",
                    "HighText Markup Language",
                    "HyperText Management Language"
                ],
                correctAnswer: "HyperText Markup Language",
                explanation: "HTML is the standard markup language for creating web pages."
            },
            {
                id: 2,
                question: "Which CSS property is used to change the text color of an element?",
                options: [
                    "color",
                    "text-color",
                    "font-color",
                    "background-color"
                ],
                correctAnswer: "color",
                explanation: "The 'color' property in CSS is used to specify the text color of an element."
            },
            // More questions...
        ]
    },
    dataScience: {
        title: "Data Science Quiz",
        questions: [
            {
                id: 1,
                question: "What is a common library used for data analysis in Python?",
                options: [
                    "Pandas",
                    "Flask",
                    "React",
                    "TensorFlow"
                ],
                correctAnswer: "Pandas",
                explanation: "Pandas is a popular Python library for data analysis and manipulation."
            },
            {
                id: 2,
                question: "Which of the following is a supervised machine learning algorithm?",
                options: [
                    "K-Means",
                    "Decision Trees",
                    "DBSCAN",
                    "Apriori"
                ],
                correctAnswer: "Decision Trees",
                explanation: "Decision Trees are a type of supervised learning algorithm."
            },
            // More questions...
        ]
    },
    devOps: {
        title: "DevOps Quiz",
        questions: [
            {
                id: 1,
                question: "What is Continuous Integration (CI)?",
                options: [
                    "A practice where code is integrated into a shared repository frequently",
                    "A database migration technique",
                    "A deployment method",
                    "A software design pattern"
                ],
                correctAnswer: "A practice where code is integrated into a shared repository frequently",
                explanation: "CI involves regularly integrating code into a shared repository to detect issues early."
            },
            {
                id: 2,
                question: "Which of the following tools is commonly used for containerization?",
                options: [
                    "Docker",
                    "Jenkins",
                    "Kubernetes",
                    "Ansible"
                ],
                correctAnswer: "Docker",
                explanation: "Docker is a platform for developing, shipping, and running applications inside containers."
            },
            // More questions...
        ]
    }
};
