document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const levelDisplay = document.getElementById('level-display');
    const scenarioDescription = document.getElementById('scenario-description');
    const resultText = document.getElementById('result-text');
    const nextButton = document.getElementById('next-btn');
    const scoreElement = document.getElementById('score');
    const totalScenariosElement = document.getElementById('total-scenarios');
    const levelProgressElement = document.getElementById('level-progress');
    
    // Level containers
    const levelContainers = [
        document.getElementById('level-1'),
        document.getElementById('level-2'),
        document.getElementById('level-3')
    ];

    // Game state
    let currentLevel = 1;
    let currentScenario = null;
    let usedScenarioIndices = [];
    let score = 0;
    let selectedUrinal = null;
    let scenariosPerLevel = 5;
    let scenariosCompleted = 0;
    
    // Define the levels and their scenarios
    const levels = [
        // Level 1: Basic 5-urinal row
        {
            urinalCount: 5,
            scenarios: [
                {
                    description: "The bathroom is completely empty.",
                    occupiedUrinals: [],
                    correctUrinalChoices: [0, 4], // First or last is usually best when empty
                    feedback: {
                        correct: "Good choice! When the bathroom is empty, picking an end urinal is proper etiquette.",
                        incorrect: "Not the best choice. When a bathroom is empty, it's best to pick an end urinal to maximize spacing for future users."
                    }
                },
                {
                    description: "There's one person at the far left urinal.",
                    occupiedUrinals: [0],
                    correctUrinalChoices: [4], // Far right is best
                    feedback: {
                        correct: "Perfect! You chose the urinal farthest away from the other person.",
                        incorrect: "Awkward! You should choose the urinal farthest from others when possible."
                    }
                },
                {
                    description: "There are people at both end urinals.",
                    occupiedUrinals: [0, 4],
                    correctUrinalChoices: [2], // Middle is best to maintain spacing
                    feedback: {
                        correct: "Good job! The middle urinal provides maximum distance from both occupied urinals.",
                        incorrect: "You broke the urinal gap rule! Always try to keep at least one urinal between you and others."
                    }
                },
                {
                    description: "There are people at the first and middle urinal.",
                    occupiedUrinals: [0, 2],
                    correctUrinalChoices: [4], // Far right is best
                    feedback: {
                        correct: "Well done! You picked the most distant option.",
                        incorrect: "Poor choice! You should pick the urinal that maximizes your distance from others."
                    }
                },
                {
                    description: "The bathroom is crowded with only one urinal left, right between two occupied ones.",
                    occupiedUrinals: [0, 2, 4],
                    correctUrinalChoices: [1, 3], // No great options, but have to pick one
                    feedback: {
                        correct: "Not ideal, but sometimes you have no choice in a crowded bathroom!",
                        incorrect: "You tried to use an occupied urinal! That would be... problematic."
                    }
                }
            ]
        },
        
        // Level 2: 3-urinal compact bathroom
        {
            urinalCount: 3,
            scenarios: [
                {
                    description: "You enter a small bathroom with 3 urinals. All are empty.",
                    occupiedUrinals: [],
                    correctUrinalChoices: [0, 2], // Ends are still best
                    feedback: {
                        correct: "Good choice! Even in a small bathroom, end urinals are the way to go.",
                        incorrect: "The middle urinal should be your last choice when others are empty."
                    }
                },
                {
                    description: "There's someone using the leftmost urinal in this small bathroom.",
                    occupiedUrinals: [0],
                    correctUrinalChoices: [2], // Right is best
                    feedback: {
                        correct: "Good! Maximum distance is maintained.",
                        incorrect: "Too close for comfort! Always maximize distance."
                    }
                },
                {
                    description: "There's someone at the middle urinal. Really?",
                    occupiedUrinals: [1],
                    correctUrinalChoices: [0, 2], // Either end works
                    feedback: {
                        correct: "Good choice dealing with an awkward situation!",
                        incorrect: "You can't use an occupied urinal!"
                    }
                },
                {
                    description: "There are people at both end urinals in this tiny bathroom.",
                    occupiedUrinals: [0, 2],
                    correctUrinalChoices: [1], // No choice but middle
                    feedback: {
                        correct: "Sometimes there's no perfect option, but you made the best of it.",
                        incorrect: "You can't use an occupied urinal!"
                    }
                },
                {
                    description: "You enter and see a very large man using the middle urinal, leaving minimal space on either side.",
                    occupiedUrinals: [1],
                    correctUrinalChoices: [0, 2], // Either end
                    feedback: {
                        correct: "Personal space is at a premium here, but you managed!",
                        incorrect: "You can't share a urinal with someone else!"
                    }
                }
            ]
        },
        
        // Level 3: Two rows of urinals on opposite walls
        {
            urinalCount: 6, // 3 on each wall
            scenarios: [
                {
                    description: "You enter a fancy bathroom with urinals on opposite walls. All are empty.",
                    occupiedUrinals: [],
                    correctUrinalChoices: [0, 2, 3, 5], // Any corner urinal is good
                    feedback: {
                        correct: "Corner urinals are a good choice when the bathroom is empty!",
                        incorrect: "Corner urinals offer the most privacy in an empty bathroom."
                    }
                },
                {
                    description: "There's someone using a urinal on the left wall (top row).",
                    occupiedUrinals: [1], // Middle of top row
                    correctUrinalChoices: [3, 4, 5], // Opposite wall is best
                    feedback: {
                        correct: "Good! Using the opposite wall provides maximum privacy.",
                        incorrect: "Using the opposite wall would have been more appropriate."
                    }
                },
                {
                    description: "There are people using urinals on both walls, facing each other.",
                    occupiedUrinals: [1, 4], // Middle of each row
                    correctUrinalChoices: [0, 2, 3, 5], // Corners are best
                    feedback: {
                        correct: "Corner urinals are best to avoid awkward face-to-face situations!",
                        incorrect: "That creates an awkward face-to-face situation with another user."
                    }
                },
                {
                    description: "The bathroom is busy with four people using corner urinals.",
                    occupiedUrinals: [0, 2, 3, 5], // All corners taken
                    correctUrinalChoices: [1, 4], // Middle spots are only options
                    feedback: {
                        correct: "Not ideal, but you made the best choice available!",
                        incorrect: "You can't use an occupied urinal!"
                    }
                },
                {
                    description: "You enter and see a group of friends chatting while using urinals on the same wall.",
                    occupiedUrinals: [0, 1, 2], // Entire top row
                    correctUrinalChoices: [3, 4, 5], // Bottom row options
                    feedback: {
                        correct: "Good choice to use the opposite wall from the group!",
                        incorrect: "You'd rather not join that conversation, would you?"
                    }
                }
            ]
        }
    ];

    // Initialize the game
    function initGame() {
        score = 0;
        scenariosCompleted = 0;
        currentLevel = 1;
        usedScenarioIndices = [];
        
        scoreElement.textContent = score;
        totalScenariosElement.textContent = scenariosPerLevel * levels.length;
        updateLevelDisplay();
        
        // Set up event listener for next button
        nextButton.addEventListener('click', handleNextButton);
        
        // Set up urinals for all levels
        levels.forEach((level, levelIndex) => {
            const levelNumber = levelIndex + 1;
            const container = document.getElementById(`level-${levelNumber}`);
            
            // Get all urinals for this level
            const urinals = container.querySelectorAll('.urinal');
            
            // Add click event listeners
            urinals.forEach((urinal, index) => {
                const urinaId = urinal.id;
                urinal.addEventListener('click', () => handleUrinalClick(levelNumber, index));
            });
        });
        
        // Load the first scenario
        loadNextScenario();
    }
    
    // Update level display in UI
    function updateLevelDisplay() {
        levelDisplay.textContent = currentLevel;
        levelProgressElement.textContent = 
            `Completed ${scenariosCompleted} of ${scenariosPerLevel * levels.length} scenarios`;
        
        // Hide all level containers
        levelContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Show current level container
        document.getElementById(`level-${currentLevel}`).style.display = 'block';
    }

    // Handle the next button click
    function handleNextButton() {
        scenariosCompleted++;
        
        // Check if we need to advance to the next level
        if (scenariosCompleted % scenariosPerLevel === 0 && currentLevel < levels.length) {
            currentLevel++;
            updateLevelDisplay();
            resultText.textContent = `Level ${currentLevel} - New bathroom layout! The challenge increases...`;
            resultText.style.color = '#4CAF50';
            nextButton.textContent = 'Start Level';
        } else if (scenariosCompleted >= scenariosPerLevel * levels.length) {
            // Game completed
            resultText.textContent = `Game completed! Final score: ${score} out of ${scenariosPerLevel * levels.length}`;
            resultText.style.color = '#4CAF50';
            nextButton.textContent = 'Play Again';
            nextButton.removeEventListener('click', handleNextButton);
            nextButton.addEventListener('click', initGame);
        } else {
            // Regular next scenario
            loadNextScenario();
        }
    }

    // Load a new scenario
    function loadNextScenario() {
        const levelData = levels[currentLevel - 1];
        
        // Reset all urinals in the current level
        const urinalContainer = document.getElementById(`level-${currentLevel}`);
        const urinals = urinalContainer.querySelectorAll('.urinal');
        
        urinals.forEach(urinal => {
            urinal.classList.remove('occupied', 'selected');
            urinal.style.pointerEvents = 'auto';
        });
        
        resultText.textContent = '';
        
        // Make sure we don't repeat scenarios within a level
        let availableIndices = Array.from(
            { length: levelData.scenarios.length }, 
            (_, i) => i
        ).filter(i => !usedScenarioIndices.includes(i));
        
        // If all scenarios have been used, reset
        if (availableIndices.length === 0) {
            usedScenarioIndices = [];
            availableIndices = Array.from({ length: levelData.scenarios.length }, (_, i) => i);
        }
        
        // Get a random scenario from available ones
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const scenarioIndex = availableIndices[randomIndex];
        
        // Mark this scenario as used
        usedScenarioIndices.push(scenarioIndex);
        
        currentScenario = levelData.scenarios[scenarioIndex];
        
        // Set the scenario description
        scenarioDescription.textContent = currentScenario.description;
        
        // Mark occupied urinals
        currentScenario.occupiedUrinals.forEach(index => {
            urinals[index].classList.add('occupied');
            urinals[index].style.pointerEvents = 'none';
        });
        
        // Hide the next button until a choice is made
        nextButton.style.display = 'none';
        nextButton.textContent = 'Next Scenario';
        selectedUrinal = null;
    }

    // Handle urinal selection
    function handleUrinalClick(level, index) {
        if (level !== currentLevel) return;
        
        const urinalContainer = document.getElementById(`level-${currentLevel}`);
        const urinals = urinalContainer.querySelectorAll('.urinal');
        
        if (selectedUrinal !== null || currentScenario.occupiedUrinals.includes(index)) {
            return;
        }
        
        selectedUrinal = index;
        urinals[index].classList.add('selected');
        
        // Check if the choice is correct
        const isCorrect = currentScenario.correctUrinalChoices.includes(index);
        
        if (isCorrect) {
            score++;
            scoreElement.textContent = score;
            resultText.textContent = currentScenario.feedback.correct;
            resultText.style.color = 'green';
        } else {
            resultText.textContent = currentScenario.feedback.incorrect;
            resultText.style.color = 'red';
        }
        
        // Disable further clicks on urinals for this round
        urinals.forEach(urinal => {
            urinal.style.pointerEvents = 'none';
        });
        
        // Show the next button
        nextButton.style.display = 'inline-block';
    }

    // Start the game
    initGame();
}); 