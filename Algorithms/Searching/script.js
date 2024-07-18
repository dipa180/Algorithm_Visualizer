let heights = [];
let bars = [];
let barValues = [];

let barSlider = document.getElementById('barSlider');
let n = barSlider.value;
let speedSlider = document.getElementById('speedSlider');
let delay = 375 - speedSlider.value;

let container = document.getElementById('container');
let width = container.offsetWidth;
let height = container.offsetHeight;
let lineWidth = width / n - 1;

let isStopped = true;
let isPaused = false;
let isGenerated = true;
let isSearched = false;

// stack implementation.
class Stack {
  constructor() {
    this.arr = [];
    this.top = -1;
  }
  push(element) {
    this.top++;
    this.arr.push(element);
  }
  isEmpty() {
    return this.top == -1;
  }
  pop() {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.arr.pop();
    }
  }
}

// get random value between min and max;
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate random heights of the bar and create div element of the bar.
function generateRandomArray() {
  isGenerated = true;
  isSearched = false;
  isStopped = true;
  isPaused = false;
  n = barSlider.value;
  lineWidth = width / n - 1;
  container.innerHTML = '';
  heights = [];
  bars = [];
  barValues = [];

  for (let i = 0; i < n; i++) {
    heights[i] = parseInt(getRandomValue(1, height));
    bars.push(document.createElement('div'));
    bars[i].style.width = `${lineWidth}px`;
    bars[i].style.height = `${heights[i]}px`;
    bars[i].style.transform = `translate(${i * lineWidth + i}px)`;
    bars[i].style.backgroundColor = 'white';
    bars[i].className = 'bar';
    container.appendChild(bars[i]);

    if (n <= 80) {
      barValues.push(document.createElement('div'));
      barValues[i].innerHTML = heights[i];
      barValues[i].style.marginBottom = `${heights[i] + 1}px`;
      barValues[i].style.transform = `translate(${i * lineWidth + i}px)`;
      barValues[i].className = 'barValue';
      container.appendChild(barValues[i]);
    }
  }

  document.querySelector("#searchingVal").value = '';
  document.querySelector(".index").innerHTML = '';
  document.querySelector(".step").innerHTML = '';
}
generateRandomArray();

// if the window width changes then update the width value
function updateBarsOnResize() {
  width = container.offsetWidth;
  lineWidth = width / n - 1;
  for (let i = 0; i < n; i++) {
    bars[i].style.width = `${lineWidth}px`;
    bars[i].style.transform = `translate(${i * lineWidth + i}px)`;
    if (n <= 80) {
      barValues[i].style.transform = `translate(${i * lineWidth + i}px)`;
    }
  }
}
window.addEventListener('resize', updateBarsOnResize);

// Draw bars with their new Updated heights.
function draw(coloredBars, colors) {
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    for (let j = 0; j < coloredBars.length; j++) {
      if (i == coloredBars[j]) {
        bars[i].style.backgroundColor = colors[j];
        break;
      }
    }
  }
}

// to put delay between visualization.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Disable bar and generate button during sorting
function disableInput() {
  barSlider.disabled = true;
  document.getElementById('generateButton').disabled = true;
  document.querySelector("#searchingVal").disabled = true;
}

function enableInput() {
  barSlider.disabled = false;
  document.getElementById('generateButton').disabled = false;
  document.querySelector("#searchingVal").disabled = false;
}

async function linearSearch() {
  let searchValue = parseInt(document.querySelector("#searchingVal").value);
  let stepCount = 0;

  for (let i = 0; i < n; i++) {
    if (isPaused) {
      await sleep(100);
      i--;
      continue;
    }

    if (isStopped) return;

    stepCount++;
    draw([i], ['red']);

    if (heights[i] == searchValue) {
      document.querySelector(".index").innerHTML = i;
      document.querySelector(".step").innerHTML = stepCount;
      draw([i], ['lime']);
      isStopped = true;
      enableInput();
      return;
    }

    await sleep(delay);
  }

  document.querySelector(".index").innerHTML = "Not found";
  document.querySelector(".step").innerHTML = stepCount;
  isStopped = true;
  enableInput();
}

async function binarySearch() {
  let searchValue = parseInt(document.querySelector("#searchingVal").value);
  heights.sort((a, b) => a - b);
  bars.sort((a, b) => parseInt(a.style.height) - parseInt(b.style.height));

  let left = 0;
  let right = n - 1;
  let stepCount = 0;

  while (left <= right) {
    if (isPaused) {
      await sleep(100);
      continue;
    }

    if (isStopped) return;

    stepCount++;
    let mid = Math.floor((left + right) / 2);

    draw([left, mid, right], ['blue', 'red', 'blue']);

    if (heights[mid] == searchValue) {
      document.querySelector(".index").innerHTML = mid;
      document.querySelector(".step").innerHTML = stepCount;
      draw([mid], ['lime']);
      isStopped = true;
      enableInput();
      return;
    }

    if (heights[mid] < searchValue) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }

    await sleep(delay);
  }

  document.querySelector(".index").innerHTML = "Not found";
  document.querySelector(".step").innerHTML = stepCount;
  isStopped = true;
  enableInput();
}

barSlider.oninput = () => {
  document.querySelector('.sliderValue').innerHTML = `Bars: ${barSlider.value}`;
  generateRandomArray();
};
speedSlider.oninput = () => {
  delay = 375 - speedSlider.value;
};

document.getElementById('generateButton').addEventListener('click', function() {
  generateRandomArray();
  const description = document.querySelector('#description');
  description.style.display = 'none';
  const section = document.querySelector('#fullbody');
  section.style.height = '100vh';
  document.querySelector("#searchingVal").value = '';
  document.querySelector(".index").innerHTML = '';
  document.querySelector(".step").innerHTML = '';
});

document.getElementById('searchButton').addEventListener('click', () => {
  type = document.getElementById('sort_type').value;

  if (!isStopped) return;

  if (isSearched || !isGenerated) generateRandomArray();

  isGenerated = false;
  isPaused = false;
  isStopped = false;

  disableInput();

  if (type == 'linear') {
    linearSearch();
  } else if (type == 'binary') {
    binarySearch();
  }
});

document.getElementById('stopButton').addEventListener('click', () => {
  isStopped = true;
  isPaused = false;
  document.getElementById('pauseButton').innerHTML = 'Pause';
  if (!isGenerated && !isSearched) generateRandomArray();
  enableInput();
  document.querySelector(".index").innerHTML = '';
  document.querySelector(".step").innerHTML = '';
  document.querySelector("#searchingVal").value = '';
  const description = document.querySelector('#description');
  description.style.display = 'none';
  const section = document.querySelector('#fullbody');
  section.style.height = '100vh';
});

document.getElementById('pauseButton').addEventListener('click', () => {
  if (!isStopped) {
    if (isPaused) {
      document.getElementById('pauseButton').innerHTML = 'Pause';
      isPaused = false;
    } else {
      document.getElementById('pauseButton').innerHTML = 'Resume';
      isPaused = true;
    }
  }
});

document.getElementById("descriptionButton").addEventListener("click", function() {
  const sortType = document.getElementById("sort_type").value;
  let descriptionURL = '';

  switch(sortType) {
    case 'linear':
      descriptionURL = 'linearSearch.html';
      break;
    case 'binary':
      descriptionURL = 'binarySearch.html';
      break;
    default:
      alert('Please select a searching algorithm');
      return;
  }

  window.open(descriptionURL, '_blank');
});
