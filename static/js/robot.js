document.addEventListener("DOMContentLoaded", () => {

  const programs = [

    /* ---------------- EASY ---------------- */
    
    {
      title: "Simple IF",
      code: [
        "1  int x = 5;",
        "2  if (x > 3)",
        "3      printf(\"Hello\");",
        "4  printf(\"Bye\");"
      ],
      order: [0,1,2,3],
      explain: [
        "Variable x is assigned value 5",
        "Condition x > 3 is checked → TRUE",
        "Hello is printed",
        "Bye is printed (outside if)"
      ]
    },
    
    {
      title: "IF - ELSE",
      code: [
        "1  int x = 2;",
        "2  if (x > 5)",
        "3      printf(\"A\");",
        "4  else",
        "5      printf(\"B\");",
        "6  printf(\"End\");"
      ],
      order: [0,1,4,5],
      explain: [
        "x initialized to 2",
        "Condition checked → FALSE",
        "Else block executes",
        "End always prints"
      ]
    },
    
    /* ---------------- LOOPS ---------------- */
    
    {
      title: "FOR Loop",
      code: [
        "1  for(int i=1;i<=2;i++)",
        "2      printf(\"Hi\");",
        "3  printf(\"Done\");"
      ],
      order: [0,1,0,1,0,2],
      explain: [
        "Loop initialization + condition",
        "Hi printed (i=1)",
        "Loop update + condition",
        "Hi printed (i=2)",
        "Condition fails",
        "Done printed"
      ]
    },
    
    {
      title: "WHILE Loop",
      code: [
        "1  int i = 1;",
        "2  while(i <= 2)",
        "3  {",
        "4      printf(\"Hello\");",
        "5      i++;",
        "6  }",
        "7  printf(\"End\");"
      ],
      order: [0,1,3,4,1,3,4,1,6],
      explain: [
        "i initialized to 1",
        "Condition checked → TRUE",
        "Hello printed",
        "i incremented",
        "Condition checked again",
        "Hello printed again",
        "i incremented",
        "Condition checked → FALSE",
        "End printed"
      ]
    },
    
    {
      title: "DO-WHILE Loop",
      code: [
        "1  int i = 5;",
        "2  do {",
        "3      printf(\"Hi\");",
        "4  } while(i < 3);",
        "5  printf(\"End\");"
      ],
      order: [0,2,3,4],
      explain: [
        "i initialized",
        "Do block runs at least once",
        "Condition checked → FALSE",
        "End printed"
      ]
    },
    
    /* ---------------- CONTROL JUMPS ---------------- */
    
    {
      title: "BREAK in Loop",
      code: [
        "1  for(int i=1;i<=3;i++)",
        "2  {",
        "3      if(i == 2)",
        "4          break;",
        "5      printf(\"%d\", i);",
        "6  }",
        "7  printf(\"End\");"
      ],
      order: [0,2,4,0,2,3,6],
      explain: [
        "Loop starts (i=1)",
        "If condition checked → FALSE",
        "1 printed",
        "Loop repeats (i=2)",
        "If condition checked → TRUE",
        "Break exits loop",
        "End printed"
      ]
    },
    
    /* ---------------- MEDIUM ---------------- */
    
    {
      title: "Nested IF",
      code: [
        "1  int x = 10;",
        "2  if(x > 5)",
        "3      if(x < 20)",
        "4          printf(\"Yes\");",
        "5  printf(\"Done\");"
      ],
      order: [0,1,2,3,4],
      explain: [
        "x initialized",
        "Outer if TRUE",
        "Inner if TRUE",
        "Yes printed",
        "Done printed"
      ]
    },
    
    {
      title: "CONTINUE Statement",
      code: [
        "1  for(int i=1;i<=3;i++)",
        "2  {",
        "3      if(i == 2)",
        "4          continue;",
        "5      printf(\"%d\", i);",
        "6  }",
        "7  printf(\"End\");"
      ],
      order: [0,2,4,0,2,3,0,2,4,6],
      explain: [
        "Loop starts (i=1)",
        "If checked → FALSE",
        "1 printed",
        "Loop repeats (i=2)",
        "If checked → TRUE",
        "Continue skips print",
        "Loop repeats (i=3)",
        "If checked → FALSE",
        "3 printed",
        "End printed"
      ]
    }
    
    ];
    

  let pIndex = 0;
  let step = 0;

  const codeEl = document.getElementById("code");
  const choicesEl = document.getElementById("choices");
  const explainEl = document.getElementById("explanation");
  const statusEl = document.getElementById("status");

  function loadProgram() {
    const p = programs[pIndex];
    step = 0;

    codeEl.innerHTML = "";
    choicesEl.innerHTML = "";
    statusEl.textContent = "";
    explainEl.innerHTML = `<div class="prose prose-invert"><p>Select a line to begin and see how the program flows.</p></div>`;

    // Show code
    p.code.forEach(line => {
      const div = document.createElement("div");
      div.textContent = line;
      div.className = "line-code"; // This will have transition for bg-color
      codeEl.appendChild(div);
    });

    // Shuffle execution order choices
    const shuffled = [...p.order].sort(() => Math.random() - 0.5);

    shuffled.forEach(num => {
      const li = document.createElement("li");
      li.textContent = `Line ${num + 1}`; // Display as 1-based
      li.className =
        "cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-lg transition text-center font-medium";
      li.onclick = () => check(num, li);
      choicesEl.appendChild(li);
    });
  }


  function check(selected, el) {
    const p = programs[pIndex];
    const correct = p.order[step];

    if (selected === correct) {

      el.classList.remove("bg-white/5", "hover:bg-white/10", "border-white/10");
      el.classList.add("bg-teal-500/30", "border-teal-400", "text-white", "font-bold");
      el.style.pointerEvents = "none";

      // Highlight correct line in code
      const codeLines = codeEl.children;
      if (codeLines[correct]) {
        // Reset previous highlights on other lines
        for(let i = 0; i < codeLines.length; i++) {
            codeLines[i].style.backgroundColor = 'transparent';
        }
        codeLines[correct].style.backgroundColor = 'rgba(45, 212, 191, 0.2)'; // teal-400 with 20% opacity
        codeLines[correct].style.borderRadius = '4px';
      }

      // Generate execution flow
      const flow = p.order
        .slice(0, step + 1)
        .map(n => n + 1)
        .join(" → ");

      explainEl.innerHTML = `
        <div class="prose prose-invert">
          <p class="font-semibold text-lg text-slate-200">Step Explanation:</p>
          <p class="text-slate-300">${p.explain[step]}</p>
          <div class="text-blue-300 text-sm mt-4 pt-4 border-t border-white/10">
            <p class="font-semibold">Execution Flow:</p>
            <code>${flow}</code>
          </div>
        </div>
      `;

      step++;
      statusEl.textContent = "✅ Correct!";
      statusEl.className = "text-teal-300 text-center font-semibold";

      if (step === p.order.length) {
        statusEl.textContent = "🎉 Flawless Execution!";
        statusEl.className = "text-teal-300 text-center font-bold text-xl";
      }

    } else {
      statusEl.textContent = `❌ Wrong! Expected Line ${correct + 1}`;
      statusEl.className = "text-red-400 text-center font-semibold";
      el.classList.add("animate-shake", "border-red-500");
      setTimeout(() => el.classList.remove("animate-shake", "border-red-500"), 600);
    }
  }
  
  

  window.nextProgram = function () {
    pIndex = (pIndex + 1) % programs.length;
    loadProgram();
  };

  loadProgram();
});
