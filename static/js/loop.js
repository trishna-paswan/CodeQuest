document.addEventListener("DOMContentLoaded", () => {
    // --- DOM ELEMENTS ---
    const track = document.getElementById('game-track');
    const robot = document.getElementById('robot');
    const toolbox = document.getElementById('toolbox');
    const workspace = document.getElementById('workspace');
    const log = document.getElementById('log');
    const levelName = document.getElementById('level-name');
    const levelDescription = document.getElementById('level-description');
    const blockLimitDiv = document.getElementById('block-limit');
    const runButton = document.getElementById('run-button');
    const resetButton = document.getElementById('reset-button');

    // --- GAME DATA ---
    const levels = [
        { name: "Level 1 : Repetition", description: "Turn on all the lights. Do you see a pattern?", track: [0, 0], available: ['move', 'light'], blockLimit: 4 },
        { name: "Level 2 : The Loop", description: "That was tedious. Use the `repeat` block to do it faster!", track: [0, 0, 0, 0], available: ['move', 'light', 'repeat'], blockLimit: 3 },
        { name: "Level 3 : A Gap in the Path", description: "A broken light! You'll need to move past it.", track: [0, 0, 1, 0, 0], available: ['move', 'light', 'repeat'], blockLimit: 5 },
        { name: "Level 4 : Efficiency", description: "This path is long. A manual solution is now disabled.", track: [0,0,0,0,0,0,0], available: ['move', 'light', 'repeat'], blockLimit: 3, forceLoop: true },
        { name: "Level 5 : The Final Challenge", description: "Use everything you've learned to solve this final puzzle.", track: [0, 0, 1, 0, 0, 1, 0, 0], available: ['move', 'light', 'repeat'], blockLimit: 7 },
    ];
    let currentLevel = 0;
    let program = [];
    let isRunning = false;
    let lightStates = [];

    // --- BLOCK DEFINITIONS ---
    const blockDefs = {
        'move': { text: 'move forward →', type: 'action' },
        'light': { text: 'turn on light 💡', type: 'action' },
        'repeat': { text: 'repeat N times', type: 'loop', hasInput: true, default: 2 },
    };

    // --- INITIALIZATION ---
    function init() {
        const level = levels[currentLevel];
        levelName.textContent = level.name;
        levelDescription.textContent = level.description;
        lightStates = level.track.map(() => false);
        program = [];
        
        drawTrack();
        drawToolbox();
        drawWorkspace();

        log.textContent = 'Build your program!';
        log.className = 'text-center font-semibold h-8 text-xl mb-4 text-slate-400';
        runButton.disabled = false;
        resetButton.disabled = false;
    }

    // --- DRAWING FUNCTIONS ---
    function drawTrack() {
        track.innerHTML = ''; // Clear previous track
        track.appendChild(robot); // Re-add robot
        robot.style.left = '10px'; // Reset robot position
        
        const level = levels[currentLevel];
        level.track.forEach((tileType, index) => {
            const tile = document.createElement('div');
            tile.className = 'track-tile';
            tile.id = `tile-${index}`;
            const bulb = document.createElement('div');
            bulb.className = 'light-bulb';
            bulb.id = `bulb-${index}`;
            bulb.innerHTML = '💡';

            if (tileType === 1) { // Broken tile
                tile.classList.add('broken-tile');
                bulb.innerHTML = '💥';
            }
            tile.appendChild(bulb);
            track.appendChild(tile);
        });
    }

    function drawToolbox() {
        toolbox.innerHTML = '';
        const level = levels[currentLevel];
        level.available.forEach(key => {
            const def = blockDefs[key];
            const blockEl = createBlockElement(key);
            blockEl.addEventListener('click', () => addBlock(key));
            toolbox.appendChild(blockEl);
        });
    }

    function drawWorkspace() {
        workspace.innerHTML = '';
        const level = levels[currentLevel];
        blockLimitDiv.innerHTML = `Blocks: ${program.length} / ${level.blockLimit || '∞'}`;
        if(level.blockLimit && program.length > level.blockLimit) {
            blockLimitDiv.classList.add('text-red-500', 'font-bold');
        } else {
            blockLimitDiv.classList.remove('text-red-500', 'font-bold');
        }

        program.forEach((block, index) => {
            const blockEl = createBlockElement(block.command, false);
            if(block.command === 'repeat') {
                const input = blockEl.querySelector('input');
                input.value = block.count;
                input.addEventListener('change', () => {
                    block.count = parseInt(input.value, 10);
                });
                const nested = blockEl.querySelector('.nested-workspace');
                block.children.forEach(childBlock => {
                     const childEl = createBlockElement(childBlock.command, true);
                     nested.appendChild(childEl);
                });
            }
            workspace.appendChild(blockEl);
        });
    }

    function createBlockElement(command, isNested) {
        const def = blockDefs[command];
        const block = document.createElement('div');
        block.className = `block ${def.type} ${isNested ? 'scale-90' : ''}`;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = def.text;
        block.appendChild(textSpan);

        if (def.hasInput) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = def.default;
            input.min = 1;
            input.max = 20;
            input.className = 'w-16 ml-2 bg-black/50 rounded text-center font-bold text-lg';
            input.onclick = e => e.stopPropagation();
            block.appendChild(input);
        }
        if (def.type === 'loop') {
             const nested = document.createElement('div');
             nested.className = 'nested-workspace p-2 mt-2';
             block.appendChild(nested);
        }
        return block;
    }

    // --- GAME LOGIC ---
    function addBlock(command) {
        if(isRunning) return;
        const def = blockDefs[command];
        const newBlock = { command };
        if(def.type === 'loop') {
            newBlock.children = [{command: 'move'}, {command: 'light'}]; // Default children
            newBlock.count = def.default;
        }
        program.push(newBlock);
        drawWorkspace();
    }
    
    async function runProgram() {
        if(isRunning) return;

        const level = levels[currentLevel];
        if(level.blockLimit && program.length > level.blockLimit) {
            log.textContent = '❌ Too many blocks!';
            log.className = 'text-center font-semibold h-8 text-xl mb-4 text-red-500';
            return;
        }
        if(level.forceLoop && !program.some(b => b.command === 'repeat')) {
            log.textContent = '❌ You must use a loop for this level!';
            log.className = 'text-center font-semibold h-8 text-xl mb-4 text-red-500';
            return;
        }

        isRunning = true;
        runButton.disabled = true;
        resetButton.disabled = true;
        log.textContent = 'Running...';
        log.className = 'text-center font-semibold h-8 text-xl mb-4 text-blue-300';
        
        let robotPos = 0; // 0 is start tile, 1 is first light tile, etc.
        lightStates = level.track.map(() => false);

        await executeSequence(program, robotPos);
        checkWinState();
    }

    async function executeSequence(sequence, robotPos) {
        let currentPos = robotPos;
        for (const block of sequence) {
            if(!isRunning) break;
            if (block.command === 'repeat') {
                for(let i=0; i<block.count; i++) {
                    if(!isRunning) break;
                    // This is a simplified execution model for this game
                    // It executes all children for each repeat iteration
                    let tempPos = currentPos;
                    for(const child of block.children) {
                        tempPos = await executeSingleCommand(child.command, tempPos);
                        if(tempPos === -1) break; // Error occurred
                    }
                    if(tempPos === -1) { currentPos = -1; break; }
                    currentPos = tempPos;
                }
            } else {
                currentPos = await executeSingleCommand(block.command, currentPos);
            }
             if(currentPos === -1) break; // Stop execution on error
        }
        return currentPos;
    }

    async function executeSingleCommand(command, position) {
        if (command === 'move') {
            const newPos = position + 1;
            if(newPos > levels[currentLevel].track.length) {
                log.textContent = '❌ Robot went off the path!';
                isRunning = false; return -1;
            }
            robot.style.left = `${10 + newPos * 96}px`;
            await sleep(500);
            return newPos;
        }
        if (command === 'light') {
            const tileIndex = position - 1;
            if(tileIndex < 0 || levels[currentLevel].track[tileIndex] === 1) {
                log.textContent = '❌ Cannot light a broken tile or start position!';
                isRunning = false; return -1;
            }
            const bulb = document.getElementById(`bulb-${tileIndex}`);
            if(bulb && !lightStates[tileIndex]) {
                bulb.classList.add('on');
                lightStates[tileIndex] = true;
            }
            await sleep(300);
            return position;
        }
        return position;
    }

    function checkWinState() {
        const correct = lightStates.every((state, i) => levels[currentLevel].track[i] === 1 || state === true);
        
        if (correct) {
            log.textContent = '🎉 You used a loop!';
            log.className = 'text-center font-semibold h-8 text-xl mb-4 text-green-400';
            const starRating = 3 - (program.length - levels[currentLevel].blockLimit);
            if (levels[currentLevel].blockLimit && program.length <= levels[currentLevel].blockLimit) {
                log.textContent += ` ⭐⭐⭐`;
            } else {
                 log.textContent += ` ⭐`;
            }

            setTimeout(() => {
                currentLevel = (currentLevel + 1);
                if(currentLevel >= levels.length) {
                    log.textContent = '🏆 You are a Loop Master!';
                    log.className = 'text-center font-semibold h-8 text-xl mb-4 text-amber-300';
                } else {
                    init();
                }
            }, 3000);
        } else if (isRunning) { // If it wasn't stopped by an error
             log.textContent = '🤔 Not all lights are on. Try again!';
             log.className = 'text-center font-semibold h-8 text-xl mb-4 text-yellow-400';
        }

        isRunning = false;
        runButton.disabled = false;
        resetButton.disabled = false;
    }
    
    function resetProgram() {
        program = [];
        drawWorkspace();
        drawTrack();
        log.textContent = 'Build your program!';
        log.className = 'text-center font-semibold h-8 text-xl mb-4 text-slate-400';
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    runButton.addEventListener('click', runProgram);
    resetButton.addEventListener('click', resetProgram);
    
    init();
});