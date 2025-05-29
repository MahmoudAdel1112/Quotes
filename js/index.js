let fetchedData = null; // Ensure fetchedData is accessible globally, or passed around
const quoteElement = document.getElementById("quote"); // Assuming you have these in your HTML
const authorElement = document.getElementById("author"); // Assuming you have these in your HTML

// Configuration for retries
const MAX_RETRIES = 3; // Maximum number of retry attempts
const RETRY_DELAY_MS = 2000; // Delay in milliseconds between retries (e.g., 2 seconds)

async function fetchQuotes(retries = 0) {
  try {
    console.log(
      `Attempting to fetch quotes (attempt ${retries + 1}/${
        MAX_RETRIES + 1
      })...`
    );
    const response = await fetch("https://zenquotes.io/api/quotes");

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      // If response is not OK, throw an error to trigger the catch block
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    fetchedData = await response.json();
    console.log("Quotes fetched successfully!");
    // If successful, you might want to call displayQuote() here
    // displayQuote(); // Uncomment if you want to display a quote immediately after successful fetch
  } catch (error) {
    console.error("Error fetching quotes:", error.message);

    // Check if we still have retries left
    if (retries < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      // Wait for the delay and then call fetchQuotes again with an incremented retry count
      setTimeout(() => {
        fetchQuotes(retries + 1);
      }, RETRY_DELAY_MS);
    } else {
      console.error(
        `Maximum retries (${MAX_RETRIES}) reached. Failed to fetch quotes.`
      );
      // Inform the user about the persistent failure
      if (quoteElement)
        quoteElement.innerText =
          "Failed to load quotes after multiple attempts. Please check your internet connection or try again later.";
      if (authorElement) authorElement.innerText = "";
      // Optionally, you might want to set fetchedData to an empty array
      // to ensure displayQuote handles the 'no data' case gracefully.
      fetchedData = [];
    }
  }
}

let lastRandomNum = -1; // Initialize with a value that won't match any valid index
let secondLastRandomNum = -1; // Initialize with a value that won't match any valid index

function displayQuote() {
  // Add a check to ensure fetchedData is not null/undefined or empty
  if (!fetchedData || fetchedData.length === 0) {
    console.warn("No quotes available to display.");
    quoteElement.innerText = "Failed to load quote. Please try again.";
    authorElement.innerText = "";
    return;
  }

  // Handle cases where there are too few quotes to meet the condition
  if (fetchedData.length < 3) {
    console.warn(
      "Not enough quotes to guarantee non-consecutive display with an intervening quote. Displaying randomly."
    );
    let randomNum = Math.floor(Math.random() * fetchedData.length);
    let randomQuote = fetchedData[randomNum];

    if (randomQuote && randomQuote.q && randomQuote.a) {
      quoteElement.innerText = randomQuote.q;
      authorElement.innerText = randomQuote.a;
    } else {
      console.warn("Invalid quote data received:", randomQuote);
      quoteElement.innerText = "Oops! Something went wrong with the quote.";
      authorElement.innerText = "";
    }
    return; // Exit if not enough quotes
  }

  let newRandomNum;
  do {
    newRandomNum = Math.floor(Math.random() * fetchedData.length);
  } while (
    newRandomNum === lastRandomNum ||
    newRandomNum === secondLastRandomNum
  ); // Ensure new number is not the last or second-last

  // Update history for the next call
  secondLastRandomNum = lastRandomNum;
  lastRandomNum = newRandomNum;

  let randomQuote = fetchedData[newRandomNum];

  // Basic validation for quote and author properties
  if (randomQuote && randomQuote.q && randomQuote.a) {
    quoteElement.innerText = randomQuote.q;
    authorElement.innerText = randomQuote.a;
  } else {
    console.warn("Invalid quote data received:", randomQuote);
    quoteElement.innerText = "Oops! Something went wrong with the quote.";
    authorElement.innerText = "";
  }
}
async function initApp() {
  await fetchQuotes();
  displayQuote();
}
initApp();

/**
 * Make four buttons
 * make every button with specific width and height to form a small rectangle
 * make every button with a bg-img indicating the img corrosponding to it
 * make every btn change the wallpaper
 */
/**
 * initialize a variable
 * use the foorloop to loop over the list ofurls to generate a btn for every index
 */

let btnsArray = [
  "puplic/styles/assets/bright-pop-landscape-design.jpg",
  "puplic/styles/assets/cartoon-style-summer-scene-with-window-view.jpg",
  "puplic/styles/assets/digital-art-isolated-house.jpg",
  "puplic/styles/assets/purple-mountain-landscape.jpg",
];

function displayBackgroundSelectionButtons() {
  const btnsParent = document.querySelector(".btns-parent");
  if (!btnsParent) {
    console.error("Element with class .btns-parent not found!");
    return;
  }

  let buttonsHTML = ""; // Build the HTML string for all buttons

  // Create a button for each image path
  // The CSS classes a0-bg, a1-bg, etc., are assumed to provide the thumbnail
  // for the buttons themselves.
  for (let i = 0; i < btnsArray.length; i++) {
    // Pass the index 'i' to changeBackground function
    // The class `a${i}-bg` is for styling the button itself (from your CSS)
    buttonsHTML += `
      <button 
        onclick='changeParentBackground(${i})' 
        class="bg-btn a${i}-bg" 
        aria-label="Set background ${i + 1}"
        title="Set background ${i + 1}">
      </button>
    `;
  }

  btnsParent.innerHTML = buttonsHTML; // Set innerHTML once after loop
}

function changeParentBackground(imageIndex) {
  const parentDiv = document.querySelector(".parent");
  if (!parentDiv) {
    console.error("Element with class .parent not found!");
    return;
  }

  if (imageIndex >= 0 && imageIndex < btnsArray.length) {
    const imageUrl = btnsArray[imageIndex];
    parentDiv.style.backgroundImage = `url('${imageUrl}')`;
    console.log(`Background changed to: ${imageUrl}`);
  } else {
    console.error("Invalid image index:", imageIndex);
  }
}

displayBackgroundSelectionButtons();

function uploadBg() {
  const fileInput = document.getElementById("file-input");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        document.getElementById(
          "parent"
        ).style.backgroundImage = `url('${imageUrl}')`;
      };
      reader.readAsDataURL(file);
    }
  });
}

uploadBg();

/**
 * make a state so that every time the user clicks on the btn the state gets changed
 */

// let pomodoroState = false;

// function changePomodoroState() {
//   pomodoroState = !pomodoroState;
// }
function changePomodoroDisplay() {
  const PomodoroParent = document.getElementById("pomodoro-parent");
  PomodoroParent.classList.toggle("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("pomodoro-timer");
  const currentPhaseDisplay = document.getElementById("current-phase");
  const pomodoroCountDisplay = document.getElementById("pomodoro-count");

  const startBtn = document.getElementById("start-btn");
  const stopBtn = document.getElementById("stop-btn");
  const resetBtn = document.getElementById("reset-btn");

  // Select Bootstrap nav-links instead of custom buttons
  const workTab = document.getElementById("work-tab");
  const shortBreakTab = document.getElementById("short-break-tab");
  const longBreakTab = document.getElementById("long-break-tab");
  const allTabs = [workTab, shortBreakTab, longBreakTab]; // Array of nav-link elements

  const WORK_DURATION = 25 * 60; // 25 minutes in seconds
  const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes in seconds
  const LONG_BREAK_DURATION = 15 * 60; // 15 minutes in seconds (after 4 pomodoros)
  const POMODOROS_BEFORE_LONG_BREAK = 4; // Number of work sessions before a long break

  let currentPhase = "Timer"; // 'work', 'short-break', 'long-break'
  let timeLeft = WORK_DURATION;
  let timerInterval;
  // let pomodoroCount = 0; // To track how many work sessions completed

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    currentPhaseDisplay.textContent = currentPhase
      .replace("-", " ")
      .toUpperCase();
    // pomodoroCountDisplay.textContent = `Pomodoros Completed: ${pomodoroCount}`;
    highlightActiveTab(); // Call to highlight the active tab
  }

  // Function to highlight the active Bootstrap nav-link
  function highlightActiveTab() {
    allTabs.forEach((tab) => {
      tab.classList.remove("active"); // Remove Bootstrap's 'active' class
      tab.setAttribute("aria-selected", "false"); // Update ARIA for accessibility
    });

    let activeTabElement;
    if (currentPhase === "Timer") {
      activeTabElement = workTab;
    } else if (currentPhase === "short-break") {
      activeTabElement = shortBreakTab;
    } else if (currentPhase === "long-break") {
      activeTabElement = longBreakTab;
    }

    if (activeTabElement) {
      activeTabElement.classList.add("active"); // Add Bootstrap's 'active' class
      activeTabElement.setAttribute("aria-selected", "true"); // Update ARIA
    }
  }

  function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        handlePhaseEnd(); // Automatic transition
      }
    }, 1000); // Update every second
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    currentPhase = "Timer"; // Always reset to work phase
    timeLeft = WORK_DURATION;
    pomodoroCount = 0; // Reset pomodoro count on full reset
    updateDisplay();
  }

  function handlePhaseEnd() {
    if (currentPhase === "Timer") {
      pomodoroCount++;
      if (pomodoroCount % POMODOROS_BEFORE_LONG_BREAK === 0) {
        currentPhase = "long-break";
        timeLeft = LONG_BREAK_DURATION;
        alert("Work session finished! Time for a long break!");
      } else {
        currentPhase = "short-break";
        timeLeft = SHORT_BREAK_DURATION;
        alert("Work session finished! Time for a short break!");
      }
    } else {
      // It's a break
      currentPhase = "Timer";
      timeLeft = WORK_DURATION;
      alert("Break finished! Time to focus!");
    }
    updateDisplay();
    startTimer(); // Automatically start the next phase
  }

  // Function for handling tab clicks
  function switchPhase(phase) {
    stopTimer(); // Stop any running timer
    currentPhase = phase;
    if (phase === "Timer") {
      timeLeft = WORK_DURATION;
    } else if (phase === "short-break") {
      timeLeft = SHORT_BREAK_DURATION;
    } else if (phase === "long-break") {
      timeLeft = LONG_BREAK_DURATION;
    }
    updateDisplay(); // Update display to show new phase and time
  }

  // Initialize display on load
  updateDisplay(); // This will also highlight the initial 'Work' tab

  // Event Listeners for control buttons
  startBtn.addEventListener("click", startTimer);
  stopBtn.addEventListener("click", stopTimer);
  resetBtn.addEventListener("click", resetTimer);

  // Event Listeners for new tabs (now targeting <a> elements)
  workTab.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    switchPhase("Timer");
  });
  shortBreakTab.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    switchPhase("short-break");
  });
  longBreakTab.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    switchPhase("long-break");
  });
});
