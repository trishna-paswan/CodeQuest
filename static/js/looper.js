document.addEventListener("DOMContentLoaded", () => {
    // --- DOM ELEMENTS ---
    const track = document.getElementById('track');
    const levelDescription = document.getElementById('level-description');
    const actionBlock = document.getElementById('action-block');
    const loopCountInput = document.getElementById('loop-count');
    const runButton = document.getElementById('run-button');
    const log = document.getElementById('log');

    // --- LEVEL DATA ---
    const levels = [
        { name: "Level 1", description: "Collect the 4 gems!", items: 4, action: "Collect Gem ✨" },
        { name: "Level 2", description: "Clear the 6 space weeds!", items: 6, action: "Zap Weed ⚡" },
        { name: "Level 3", description: "Activate the 3 power conduits!", items: 3, action: "Activate 🔋" },
        { name: "Level 4", description: "Deploy the 5 data probes!", items: 5, action: "Deploy Probe 📡" },
        { name: "Level 5", description: "Mine all 7 asteroids!", items: 7, action: "Mine Asteroid ⛏️" }
    ];
    let currentLevel = 0;
    let isRunning = false;

    // --- GAME LOGIC ---
    function loadLevel() {
        const level = levels[currentLevel];
        levelDescription.textContent = level.description;
        actionBlock.innerHTML = level.action;
        loopCountInput.value = 1;
        log.textContent = 'Set the repeat count and run the loop!';
        log.className = 'text-center font-semibold h-8 text-xl mb-4 text-slate-400';
        runButton.disabled = false;
        drawTrack();
    }

    function drawTrack() {
        track.innerHTML = '';
        const level = levels[currentLevel];

        // Create robot tile
        const robotTile = document.createElement('div');
        robotTile.className = 'tile';
        const robot = document.createElement('div');
        robot.className = 'robot';
        robot.id = 'robot';
        robot.innerHTML = '🤖';
        robotTile.appendChild(robot);
        track.appendChild(robotTile);

        // Create item tiles
        for (let i = 0; i < level.items; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            const item = document.createElement('div');
            item.className = 'item';
            item.id = `item-${i}`;
            item.innerHTML = level.action.split(' ')[1]; // Get the emoji
            tile.appendChild(item);
            track.appendChild(tile);
        }
    }

    async function runLoop() {
        if (isRunning) return;
        isRunning = true;
        runButton.disabled = true;
        log.textContent = 'Running...';
        log.className = 'text-center font-semibold h-8 text-xl mb-4 text-blue-300';

        const robot = document.getElementById('robot');
        const userInput = parseInt(loopCountInput.value, 10);
        const correctCount = levels[currentLevel].items;

        for (let i = 0; i < userInput; i++) {
            if (!isRunning) break;
            
            // Animate robot moving to the item
            const itemElement = document.getElementById(`item-${i}`);
            if (itemElement) {
                const itemPosition = itemElement.parentElement.offsetLeft;
                robot.style.transform = `translateX(${itemPosition}px)`;
                await sleep(500);

                // Animate item collection
                itemElement.classList.add('collected');
                await sleep(200);
            } else {
                // User entered too high a number
                break;
            }
        }

        // Check for win/loss
        if (userInput === correctCount) {
            log.textContent = '🎉 Level Complete!';
            log.className = 'text-center font-semibold h-8 text-xl mb-4 text-green-400';
            setTimeout(() => {
                currentLevel = (currentLevel + 1) % levels.length; // Loop back for now
                loadLevel();
            }, 2000);
        } else {
            log.textContent = `🤔 Not quite! Expected ${correctCount}, got ${userInput}. Try again!`;
            log.className = 'text-center font-semibold h-8 text-xl mb-4 text-yellow-400';
            setTimeout(() => {
                 resetLevel();
            }, 2500);
        }
    }

    function resetLevel() {
        isRunning = false;
        runButton.disabled = false;
        // Redraw track to reset items and robot
        drawTrack();
        log.textContent = 'Set the repeat count and run the loop!';
        log.className = 'text-center font-semibold h-8 text-xl mb-4 text-slate-400';
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
    // --- EVENT LISTENERS & START ---
    runButton.addEventListener('click', runLoop);

    loadLevel();
});
