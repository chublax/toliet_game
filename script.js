document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const urinals = document.querySelectorAll('.urinal');
    const scenarioDescription = document.getElementById('scenario-description');
    const resultText = document.getElementById('result-text');
    const nextButton = document.getElementById('next-btn');
    const scoreElement = document.getElementById('score');

    // Game state
    let currentScenario = null;
    let score = 0;
    let selectedUrinal = null;
    
    // Scenarios
    const scenarios = [
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
    ];

    // Initialize the game
    function initGame() {
        score = 0;
        scoreElement.textContent = score;
        loadNextScenario();
        nextButton.addEventListener('click', loadNextScenario);
        urinals.forEach((urinal, index) => {
            urinal.addEventListener('click', () => handleUrinalClick(index));
        });
    }

    // Load a new scenario
    function loadNextScenario() {
        // Reset the urinals
        urinals.forEach(urinal => {
            urinal.classList.remove('occupied', 'selected');
        });
        
        resultText.textContent = '';
        
        // Get a random scenario
        const randomIndex = Math.floor(Math.random() * scenarios.length);
        currentScenario = scenarios[randomIndex];
        
        // Set the scenario description
        scenarioDescription.textContent = currentScenario.description;
        
        // Mark occupied urinals
        currentScenario.occupiedUrinals.forEach(index => {
            urinals[index].classList.add('occupied');
        });
        
        // Enable clicking on unoccupied urinals
        urinals.forEach((urinal, index) => {
            if (!currentScenario.occupiedUrinals.includes(index)) {
                urinal.style.pointerEvents = 'auto';
            } else {
                urinal.style.pointerEvents = 'none';
            }
        });
        
        // Hide the next button until a choice is made
        nextButton.style.display = 'none';
        selectedUrinal = null;
    }

    // Handle urinal selection
    function handleUrinalClick(index) {
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