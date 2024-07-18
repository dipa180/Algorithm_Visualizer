document.addEventListener('DOMContentLoaded', () => {
    const dynamicTexts = ["My name is Dipanwita Patra", "Currently Pursuing Btech in CSE"]
    let index = 0;
    let charIndex = 0;
    const speed = 100;
    const delay = 1000;
    const dynamicTextElement = document.getElementById('dynamicText');

    function typeWriter() {
        if (charIndex < dynamicTexts[index].length) {
            dynamicTextElement.innerHTML += dynamicTexts[index].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, speed);
        } else {
            setTimeout(() => {
                charIndex = 0;
                dynamicTextElement.innerHTML = "";
                index = (index + 1) % dynamicTexts.length;
                typeWriter();
            }, delay);
        }
    }

    typeWriter();

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.classList.toggle('fa-moon');
        themeToggle.classList.toggle('fa-sun');
    });

    const menuToggle = document.getElementById('menuToggle');
    const menuOptions = document.getElementById('menuOptions');
    menuToggle.addEventListener('click', () => {
        menuOptions.style.display = menuOptions.style.display === 'block' ? 'none' : 'block';
        
        menuToggle.classList.toggle('fa-window-close');
    });

    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !menuOptions.contains(event.target)) {
            menuOptions.style.display = 'none';
        }
    });
});
