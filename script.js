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
                    statistics: {
                        0: "42% of men choose this end urinal when the bathroom is empty.",
                        1: "3% of men choose this urinal when the bathroom is empty.",
                        2: "8% of men choose the middle urinal when the bathroom is empty.",
                        3: "4% of men choose this urinal when the bathroom is empty.",
                        4: "43% of men choose this end urinal when the bathroom is empty."
                    }
                },
                {
                    description: "There's one person at the far left urinal.",
                    occupiedUrinals: [0],
                    statistics: {
                        1: "5% of men choose the urinal next to another person when alternatives are available.",
                        2: "12% of men choose this urinal to maintain some distance.",
                        3: "18% of men choose this urinal for better spacing.",
                        4: "65% of men choose the furthest urinal from another person."
                    }
                },
                {
                    description: "There are people at both end urinals.",
                    occupiedUrinals: [0, 4],
                    statistics: {
                        1: "15% of men choose this urinal, staying closer to one side.",
                        2: "70% of men choose the middle urinal for maximum spacing.",
                        3: "15% of men choose this urinal, staying closer to one side."
                    }
                },
                {
                    description: "There are people at the first and middle urinal.",
                    occupiedUrinals: [0, 2],
                    statistics: {
                        1: "8% of men choose to be between two occupied urinals.",
                        3: "22% of men choose this urinal.",
                        4: "70% of men choose the furthest possible urinal."
                    }
                },
                {
                    description: "The bathroom is crowded with only urinals 1 and 3 available.",
                    occupiedUrinals: [0, 2, 4],
                    statistics: {
                        1: "52% of men choose this urinal in this situation.",
                        3: "48% of men choose this urinal in this situation."
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
                    statistics: {
                        0: "46% of men choose the left end urinal in a small bathroom.",
                        1: "9% of men choose the middle urinal when end urinals are available.",
                        2: "45% of men choose the right end urinal in a small bathroom."
                    }
                },
                {
                    description: "There's someone using the leftmost urinal in this small bathroom.",
                    occupiedUrinals: [0],
                    statistics: {
                        1: "12% of men choose the middle urinal next to an occupied one.",
                        2: "88% of men choose the farthest urinal from the other person."
                    }
                },
                {
                    description: "There's someone at the middle urinal. Really?",
                    occupiedUrinals: [1],
                    statistics: {
                        0: "48% of men choose the left urinal in this situation.",
                        2: "52% of men choose the right urinal in this situation."
                    }
                },
                {
                    description: "There are people at both end urinals in this tiny bathroom.",
                    occupiedUrinals: [0, 2],
                    statistics: {
                        1: "72% of men would use the middle urinal when necessary.",
                        "wait": "28% of men would actually wait or find another bathroom."
                    }
                },
                {
                    description: "You enter and see a very large man using the middle urinal, leaving minimal space on either side.",
                    occupiedUrinals: [1],
                    statistics: {
                        0: "40% of men choose the left end despite the space issue.",
                        2: "44% of men choose the right end despite the space issue.",
                        "wait": "16% of men would wait or find another bathroom."
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
                    statistics: {
                        0: "22% of men choose this corner urinal.",
                        1: "4% of men choose this middle urinal on the top wall.",
                        2: "23% of men choose this corner urinal.",
                        3: "24% of men choose this corner urinal on the bottom wall.",
                        4: "5% of men choose this middle urinal on the bottom wall.",
                        5: "22% of men choose this corner urinal on the bottom wall."
                    }
                },
                {
                    description: "There's someone using a urinal on the left wall (top row).",
                    occupiedUrinals: [1], // Middle of top row
                    statistics: {
                        0: "12% of men choose this urinal on the same wall.",
                        2: "14% of men choose this urinal on the same wall.",
                        3: "28% of men choose this urinal on the opposite wall.",
                        4: "19% of men choose this urinal on the opposite wall.",
                        5: "27% of men choose this urinal on the opposite wall."
                    }
                },
                {
                    description: "There are people using urinals on both walls, facing each other.",
                    occupiedUrinals: [1, 4], // Middle of each row
                    statistics: {
                        0: "26% of men choose this corner to avoid face-to-face scenarios.",
                        2: "28% of men choose this corner to avoid face-to-face scenarios.",
                        3: "24% of men choose this corner to avoid face-to-face scenarios.",
                        5: "22% of men choose this corner to avoid face-to-face scenarios."
                    }
                },
                {
                    description: "The bathroom is busy with four people using corner urinals.",
                    occupiedUrinals: [0, 2, 3, 5], // All corners taken
                    statistics: {
                        1: "52% of men choose this middle urinal on the top wall.",
                        4: "48% of men choose this middle urinal on the bottom wall."
                    }
                },
                {
                    description: "You enter and see a group of friends chatting while using urinals on the same wall.",
                    occupiedUrinals: [0, 1, 2], // Entire top row
                    statistics: {
                        3: "34% of men choose this urinal on the opposite wall.",
                        4: "32% of men choose this urinal on the opposite wall.",
                        5: "34% of men choose this urinal on the opposite wall."
                    }
                }
            ]
        }
    ];

    // Initialize the game
    function initGame() {
        scenariosCompleted = 0;
        currentLevel = 1;
        usedScenarioIndices = [];
        
        totalScenariosElement.textContent = scenariosPerLevel * levels.length;
        updateLevelDisplay();
        
        // Set up event listener for next button
        nextButton.removeEventListener('click', initGame);
        nextButton.addEventListener('click', handleNextButton);
        
        // Set up urinals for all levels
        levels.forEach((level, levelIndex) => {
            const levelNumber = levelIndex + 1;
            const container = document.getElementById(`level-${levelNumber}`);
            
            // Get all urinals for this level
            const urinals = container.querySelectorAll('.urinal');
            
            // Add click event listeners
            urinals.forEach((urinal, index) => {
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
            loadNextScenario();
        } else if (scenariosCompleted >= scenariosPerLevel * levels.length) {
            // Game completed
            resultText.textContent = `Game completed! You've seen how your choices compare to others.`;
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
        
        // Update statistics displays for this scenario
        updateStatisticsDisplays();
        
        // Hide the next button until a choice is made
        nextButton.style.display = 'none';
        nextButton.textContent = 'Next Scenario';
        selectedUrinal = null;
    }
    
    // Update the statistics shown on hover for all urinals
    function updateStatisticsDisplays() {
        const urinalContainer = document.getElementById(`level-${currentLevel}`);
        const urinals = urinalContainer.querySelectorAll('.urinal');
        
        urinals.forEach((urinal, index) => {
            const statsDisplay = urinal.querySelector('.stats-display');
            if (statsDisplay) {
                // Get percentage from the current scenario
                if (currentScenario.statistics[index]) {
                    const statText = currentScenario.statistics[index];
                    const percentage = statText.match(/(\d+)%/);
                    if (percentage && percentage[1]) {
                        statsDisplay.textContent = percentage[1] + '%';
                        
                        // Color code based on popularity
                        const percent = parseInt(percentage[1]);
                        if (percent > 60) {
                            statsDisplay.style.backgroundColor = 'rgba(76, 175, 80, 0.9)'; // Green for popular
                        } else if (percent > 30) {
                            statsDisplay.style.backgroundColor = 'rgba(255, 193, 7, 0.9)'; // Amber for medium
                        } else if (percent > 10) {
                            statsDisplay.style.backgroundColor = 'rgba(255, 152, 0, 0.9)'; // Orange for less common
                        } else {
                            statsDisplay.style.backgroundColor = 'rgba(244, 67, 54, 0.9)'; // Red for rare
                        }
                    } else {
                        statsDisplay.textContent = '< 1%';
                        statsDisplay.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
                    }
                } else {
                    statsDisplay.textContent = '< 1%';
                    statsDisplay.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
                }
                
                // Hide stats for occupied urinals
                if (currentScenario.occupiedUrinals.includes(index)) {
                    statsDisplay.style.display = 'none';
                } else {
                    statsDisplay.style.display = 'block';
                }
            }
        });
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
        
        // Show statistics for the choice rather than right/wrong feedback
        let statistic = currentScenario.statistics[index];
        if (!statistic && currentScenario.statistics["wait"]) {
            // If no specific statistic for this urinal but a "wait" option exists
            statistic = "You made an unconventional choice. " + currentScenario.statistics["wait"];
        }
        
        if (statistic) {
            resultText.textContent = statistic;
            
            // Extract percentage from statistic if present
            const percentage = statistic.match(/(\d+)%/);
            if (percentage && percentage[1]) {
                const percent = parseInt(percentage[1]);
                // Color code the result based on how common the choice is
                if (percent > 60) {
                    resultText.style.color = '#4CAF50'; // Green for very common
                } else if (percent > 30) {
                    resultText.style.color = '#FF9800'; // Orange for fairly common
                } else if (percent > 10) {
                    resultText.style.color = '#FF5722'; // Deep orange for uncommon
                } else {
                    resultText.style.color = '#F44336'; // Red for rare
                }
            } else {
                resultText.style.color = '#333'; // Default color
            }
        } else {
            resultText.textContent = "Very few men would choose this urinal in this situation.";
            resultText.style.color = '#F44336'; // Red for very rare choices
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