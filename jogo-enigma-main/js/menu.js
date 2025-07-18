let currentSelected = 0;
const menuItems = document.querySelectorAll('.menu-options li');

function selectMenuItem(index) {
  menuItems.forEach(item => item.classList.remove('selected'));
  menuItems[index].classList.add('selected');
  currentSelected = index;
}

function startGame() {

  document.body.style.animation = "fadeOut 1.0s forwards";
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

function handleMenuNavigation(e) {
  if (e.key === 'ArrowDown') {
    currentSelected = (currentSelected + 1) % menuItems.length;
    selectMenuItem(currentSelected);
  } else if (e.key === 'ArrowUp') {
    currentSelected = (currentSelected - 1 + menuItems.length) % menuItems.length;
    selectMenuItem(currentSelected);
  } else if (e.key === 'Enter' && currentSelected >= 0) {
    menuItems[currentSelected].click();
  }
}

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

function checkKonamiCode(e) {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateKonamiMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
}

function activateKonamiMode() {
  document.body.style.backgroundColor = '#ff00ff';
  document.querySelector('.glitch-title').textContent = "S3RUM: KONAMI MODE";
  
  // Muda todas as cores para rosa
  document.querySelectorAll('*').forEach(el => {
    el.style.color = '#ff00ff';
    el.style.borderColor = '#ff00ff';
  });
  
  setTimeout(() => {
    document.body.style.backgroundColor = '#000';
    document.querySelector('.glitch-title').textContent = "S3RUM: NULLACCESS";
    document.querySelectorAll('*').forEach(el => {
      el.style.color = '';
      el.style.borderColor = '';
    });
  }, 5000);
}

// Easter egg - clique secreto
function addSecretEasterEgg() {
  const secret = document.createElement('div');
  secret.className = 'secret-text';
  secret.textContent = 'Você está sendo observado';
  secret.onclick = () => {
    alert('Você não deveria ter clicado aqui...');
    document.body.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      document.body.style.transform = '';
    }, 2000);
  };
  document.body.appendChild(secret);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {

  selectMenuItem(0);
  
  // Adiciona navegação por teclado
  document.addEventListener('keydown', handleMenuNavigation);
  
  // Adiciona detector do código Konami
  document.addEventListener('keydown', checkKonamiCode);
  
  // Adiciona easter egg secreto
  addSecretEasterEgg();
  
  // Easter egg - título clicável
  const title = document.querySelector('.glitch-title');
  title.addEventListener('click', () => {
    title.textContent = title.textContent === "S3RUM: NULLACCESS" 
      ? "S3RUM: SYSTEM FAILURE" 
      : "S3RUM: NULLACCESS";
  });
  
  // Easter egg - clique triplo
  let clickCount = 0;
  let clickTimer;
  document.addEventListener('click', () => {
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 500);
    
    if (clickCount >= 3) {
      document.body.style.background = 'repeating-linear-gradient(45deg, #000, #000 10px, #0f0 10px, #0f0 20px)';
      setTimeout(() => {
        document.body.style.background = '';
      }, 1000);
      clickCount = 0;
    }
  });
});

// Modifique a função showCredits para deselecionar itens
function showCredits() {
  document.querySelector('.menu-options').classList.add('hidden');
  document.getElementById('credits').classList.remove('hidden');
  menuItems.forEach(item => item.classList.remove('selected'));
}

function backToMenu() {
  document.querySelector('.menu-options').classList.remove('hidden');
  document.getElementById('credits').classList.add('hidden');
}

function exitGame() {
  alert("Você não pode sair de algo que já está dentro de você.");
}

// ------------------------------
// EFEITO MATRIX 
// ------------------------------

const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

function setupMatrix() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const binary = "01";
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = binary[Math.floor(Math.random() * binary.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  setInterval(drawMatrix, 33); // 30fps

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

setupMatrix();

function createRandomGlitch() {
  const glitch = document.createElement('div');
  glitch.className = 'glitch';
  glitch.innerText = getRandomGlitchText();
  glitch.style.position = 'absolute';
  glitch.style.left = `${Math.random() * window.innerWidth}px`;
  glitch.style.top = `${Math.random() * window.innerHeight}px`;
  glitch.style.pointerEvents = 'none';
  glitch.style.zIndex = 9999;
  glitch.style.fontSize = `${12 + Math.random() * 10}px`;

  document.body.appendChild(glitch);

  setTimeout(() => {
    glitch.remove();
  }, 300 + Math.random() * 500);
}

function getRandomGlitchText() {
  const specialMessages = [
    "nagvqrcerffnagf", //rot13
    "qbe",            
    "i once i tried to hang myself....",
    "voce deveria tentar: unlock_null",
    "unlock_null",
    "porque voce tenta?",
    "inutil",
    "cesar +13",
    "?",
    "porque?",
    "A CULPA É SUA",
  ];
  
  const roll = Math.random();
  if (roll < 0.3) {
    // 30% de chance de exibir uma das mensagens sigmas
    return specialMessages[Math.floor(Math.random() * specialMessages.length)];
  } else {
    // 70% de chance de mostrar símbolos glitch AIIII QUE MEDA UIIIIIIII ULAALA AIIIIIIII
    const chars = '█▓▒░▌▐■□◇◆○●◎☠☢☣∆◊øØ'.split('');
    let text = '';
    const length = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < length; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
    return text;
  }
}

function startGlitchLoop() {
  setInterval(() => {
    const chance = Math.random();
    if (chance < 0.8) { // 80% de chance de gerar glitch a cada ciclo
      const glitchCount = Math.floor(Math.random() * 5) + 1; // 1 a 5 glitches ou uma aginose misteriosa
      for (let i = 0; i < glitchCount; i++) {
        setTimeout(createRandomGlitch, Math.random() * 500);
      }
    }
  }, 3000 + Math.random() * 5000); // a cada 2~5 segundos
}

startGlitchLoop();

