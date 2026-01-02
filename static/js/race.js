const races = [
    {
      level: "Level 1: Sum of First 10 Numbers",
      A: `sum = 0
for i = 1 to 10
  sum = sum + i
print(sum)`,
      B: `sum = 0
for i = 1 to 10
  sum = sum + i
  // A small, useless check
  if i % 2 == 0
    pass
print(sum)`,
      output: "55",
      answer: "A",
      correctExplanation: "Correct! Program A is more efficient because it does exactly what's needed. Program B adds an extra, unnecessary 'if' check inside the loop, which runs 10 times without affecting the result. Even small extra steps add up!",
      incorrectExplanation: "Not quite! While both programs give the same answer, Program B includes an extra 'if' check in every loop. This check doesn't change the outcome but adds 10 unnecessary operations, making it slower.",
      timeComplexity: "Both are O(n), but A has a smaller constant factor."
    },
    {
      level: "Level 2: Finding an Element",
      A: `found = false
arr = [2, 5, 8, 10]
for x in arr
  if x == 8
    found = true
print(found)`,
      B: `found = false
arr = [2, 5, 8, 10]
for x in arr
  if x == 8
    found = true
    break
print(found)`,
      output: "true",
      answer: "B",
      correctExplanation: "Excellent! Program B is faster because it uses 'break'. Once it finds the number 8, it immediately stops looping. Program A continues to check the rest of the numbers in the list even after finding the answer.",
      incorrectExplanation: "Close! Program A works, but it's inefficient. It pointlessly checks the number 10 even after it already found 8. Program B is smarter because it stops looping as soon as the answer is found, saving time.",
      timeComplexity: "A is O(n), B has a best-case of O(1)."
    },
    {
      level: "Level 3: String Concatenation",
      A: `str = ""
for i = 1 to 5
  str = str + "x"
print(str)`,
      B: `arr = []
for i = 1 to 5
  arr.append("x")
print("".join(arr))`,
      output: "xxxxx",
      answer: "B",
      correctExplanation: "You got it! In many languages, repeatedly adding to a string (like in A) creates a new string in memory each time, which is slow. Program B builds a list of characters and then joins them all at once, which is much more memory-efficient.",
      incorrectExplanation: "This is a tricky one! It seems like Program A is simpler, but it's actually less efficient. Repeatedly adding to a string is often slower than collecting items in a list and joining them once at the end. This is a common optimization pattern.",
      timeComplexity: "A can be O(n^2), while B is a more efficient O(n)."
    },
    {
      level: "Level 4: Redundant Calculations",
      A: `x = 10
y = x * 2
z = x * 2
print(y + z)`,
      B: `x = 10
y = x * 2
z = y 
print(y + z)`,
      output: "40",
      answer: "B",
      correctExplanation: "That's right! Program A calculates 'x * 2' twice, which is a wasted step. Program B is more efficient because it calculates the value once, stores it in 'y', and then reuses that result for 'z'. Avoid re-doing work the computer has already done.",
      incorrectExplanation: "Almost! Notice that Program A calculates 'x * 2' two separate times. Program B is cleverer—it calculates it once and reuses the result. This saves the computer from doing unnecessary work.",
      timeComplexity: "Both are O(1), but B performs fewer operations."
    },
    {
      level: "Level 5: Accessing List Elements",
      A: `items = [3, 6, 9]
total = 0
for i = 0 to 2
  total = total + items[i]
print(total)`,
      B: `items = [3, 6, 9]
total = 0
length = len(items)
for i = 0 to length - 1
  total = total + items[i]
print(total)`,
      output: "18",
      answer: "A",
      correctExplanation: "Correct! Program A is slightly more direct. Program B adds an extra step to calculate the length of the list and store it in a variable. While modern computers might optimize this, Program A is technically more direct as it uses a known, fixed range.",
      incorrectExplanation: "A good thought, but not quite! In this case, Program B adds an extra step by calculating the list's length first. Since the loop range is already known, Program A is more direct and avoids the extra 'len()' calculation.",
      timeComplexity: "Both O(n), but A avoids an extra function call."
    }
  ];
  
  let current = 0;
  
  function loadRace() {
    const race = races[current];
    const progress = (current / races.length) * 100;
    
    document.getElementById("levelTitle").innerText = race.level;
    document.getElementById("progA").innerText = race.A;
    document.getElementById("progB").innerText = race.B;
    document.getElementById("outputA").innerText = `Output: ${race.output}`;
    document.getElementById("outputB").innerText = `Output: ${race.output}`;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    
    document.getElementById("resultBox").classList.add("hidden");
    
    // Re-enable buttons
    document.querySelectorAll('button').forEach(btn => {
        if(btn.onclick?.toString().includes("checkAnswer")) {
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });
  }
  
  function checkAnswer(choice) {
    const race = races[current];
    const resultText = document.getElementById("resultText");
    const explanation = document.getElementById("explanation");
    const timeComplexity = document.getElementById("timeComplexity");
  
    if (choice === race.answer) {
      resultText.innerText = "✅ Correct! Faster Logic Wins.";
      resultText.className = "text-green-400 font-semibold";
      explanation.innerText = race.correctExplanation;
    } else {
      resultText.innerText = "❌ That's not the most efficient!";
      resultText.className = "text-red-400 font-semibold";
      explanation.innerText = race.incorrectExplanation;
    }
    
    timeComplexity.innerText = race.timeComplexity;
  
    document.getElementById("resultBox").classList.remove("hidden");
    document.getElementById("resultBox").classList.add("animate-fadeInUp");
    
    // Disable buttons
    document.querySelectorAll('button').forEach(btn => {
        if(btn.onclick?.toString().includes("checkAnswer")) {
            btn.disabled = true;
            btn.classList.add("opacity-50", "cursor-not-allowed");
        }
    });
  }
  
  function nextLevel() {
    current++;
    if (current >= races.length) {
      current = 0; // Loop back to the beginning
      alert("🏆 You've completed all the races! You're an efficiency master. The race will now restart.");
    }
    document.getElementById("resultBox").classList.add("hidden");
    document.getElementById("resultBox").classList.remove("animate-fadeInUp");
    loadRace();
  }
  
  loadRace();