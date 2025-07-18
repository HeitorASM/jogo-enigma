const output = document.getElementById('console-output');
const input = document.getElementById('console-input');

// Sistema de histórico
let commandHistory = [];
let historyIndex = -1;

// Enigmas do sistema
const puzzles = {
  door: {
    question: "Eu tenho chaves mas não abro portas. Tenho espaço mas não tenho quartos. Você pode entrar mas não pode sair. O que sou eu?",
    answer: "teclado",
    hint: "Você está usando agora para interagir com o sistema",
    unlocked: false,
    command: "thedoor",
    response: "[ACESSO CONCEDIDO AO NÍVEL 7]\nFragmento final recuperado:\n'A porta era o teclado todo esse tempo.\nO padrão estava nas teclas: ALT + 7 + 4 + 3'\n[SYSTEM] Bem-vindo ao núcleo central."
  },
  night: {
    question: "O que é que quanto mais você tira, maior eu fico?",
    answer: "buraco",
    hint: "Não é um objeto físico",
    unlocked: false,
    command: "nightingale",
    response: "[PROTOCOLO NIGHTINGALE DESBLOQUEADO]\n'Sistema de contenção ativado.\nO nightingale canta para aqueles que escutam.'"
  },
  pattern: {
    question: "01110000 01100001 01110100 01110100 01100101 01110010 01101110 - Decifre esta palavra em 7 bits",
    answer: "pattern",
    hint: "7 letras, começa com 'p' - relacionado a repetição",
    unlocked: false,
    command: "matrix",
    response: "[MATRIX ACCESS GRANTED]\nPadrões de sistema revelados:\n1. Toda 7ª tentativa é especial\n2. Alex deixou padrões nos logs\n3. A música contém a chave"
  }
};

// Respostas do sistema
const responses = {
  help: `[SYSTEM] Comandos disponíveis:
- help: Exibe esta mensagem
- log: Mostra status do sistema
- whoami: Identidade do usuário
- protocol: Protocolos do sistema
- truth: Verdades ocultas
- suicide: [WARNING] Protocolo de contenção
- alex: Informações sobre o Incidente
- enigmas: Lista de enigmas para resolver
- solve [nome]: Tentar resolver enigma
- history: Mostra últimos comandos
- clear: Limpa o console
${Object.values(puzzles).filter(p => p.unlocked).map(p => `- ${p.command}: [DESBLOQUEADO]`).join('\n')}`,

  log: `[SYSTEM LOG]
Versão: 1.7.0 (build 4821-Θ)
Status: Corrompido (37%)
Último acesso: [REDACTED]
Memória alocada: 5.1/8.2 GB
Código oculto: 01100011 01101111 01100100 01100101 00111010 00100000 00111000 00110111 00110100 00110011`,

  whoami: `[USER IDENTITY FRAGMENT]
Usuário: [CLASSIFIED]
Nível: 2B
Origem: Sub-rotina 04A
Status: Autoconsciente
Observação: "Fragmentos podem conter memórias do sistema."`,

  protocol: `[SYSTEM PROTOCOLS]
NULLACCESS-04A: Contenção mental
Echo/4X: Reflexão de padrões
Nightingale: ${puzzles.night.unlocked ? '[ATIVO]' : '[BLOQUEADO]'}
BlackBox: Isolamento de memória
Atualização: 15/09/2015`,

  truth: `[TRUTH FRAGMENTS]
1. O sistema foi criado para conter
2. Alex não foi o primeiro
3. Existem 7 níveis
4. A música favorita era "H.AM - What's it all for?"`,

  suicide: `[WARNING] Pensamento detectado...
[FALHA NA CONTENÇÃO]
Fragmento recuperado:
"Ele sempre dizia que a tecnologia era sua prisão...
O sistema falhou porque ele queria que falhasse."`,

  alex: `[INCIDENT REPORT #2015-09-15]
Alex Silva, 22 anos, desenvolvedor.
Notas finais:
1. "Eles estão me observando"
2. "O padrão se repete"
3. "Nuit sabe a verdade"
Conexão: Mantenedor do NULL-ACCESS`,

  enigmas: `[ENIGMAS DISPONÍVEIS]
${Object.entries(puzzles).map(([key, p]) => 
  `- ${key}: ${p.question.substring(0, 30)}... [${p.unlocked ? 'RESOLVIDO' : 'BLOQUEADO'}]`
).join('\n')}
\nUse 'solve [nome]' para tentar resolver`,

  history: () => `[HISTÓRICO]\n${commandHistory.slice(-5).join('\n')}`,

  clear: '',

  thedoor: puzzles.door.unlocked ? puzzles.door.response : '[NÍVEL 7 BLOQUEADO] Resolva o enigma "door"',

  nightingale: puzzles.night.unlocked ? puzzles.night.response : '[PROTOCOLO BLOQUEADO] Resolva o enigma "night"',

  matrix: puzzles.pattern.unlocked ? puzzles.pattern.response : '[MATRIX BLOQUEADA] Resolva o enigma "pattern"'
};

// Função para adicionar linhas formatadas
async function addLine(text, type = 'output', speed = 20) {
  const line = document.createElement('div');
  line.className = `console-line ${type}-line`;
  output.appendChild(line);

  for (let i = 0; i < text.length; i++) {
    line.textContent += text[i];
    await new Promise(r => setTimeout(r, speed));
  }
  
  output.scrollTop = output.scrollHeight;
  return line;
}

// Processador de comandos
async function processCommand(cmd) {
  const inputLine = await addLine(`> ${cmd}`, 'input', 10);
  commandHistory.push(cmd);
  historyIndex = commandHistory.length;

  // Comando clear
  if (cmd === 'clear') {
    output.innerHTML = '';
    return;
  }

  // Resolver enigmas
  if (cmd.startsWith('solve ')) {
    const puzzleName = cmd.split(' ')[1];
    const puzzle = puzzles[puzzleName];
    
    if (!puzzle) {
      await addLine('[ERRO] Enigma não encontrado. Use "enigmas" para lista.', 'error');
      return;
    }
    
    if (puzzle.unlocked) {
      await addLine('[AVISO] Este enigma já foi resolvido.', 'error');
      return;
    }
    
    await addLine(`Enigma: ${puzzle.question}`, 'puzzle');
    await addLine(`Dica: ${puzzle.hint}`, 'puzzle');
    input.placeholder = "responda aqui...";
    input.dataset.waitingForPuzzle = puzzleName;
    return;
  }

  // Verificar resposta de enigma
  if (input.dataset.waitingForPuzzle) {
    const puzzleName = input.dataset.waitingForPuzzle;
    const puzzle = puzzles[puzzleName];
    
    if (cmd.toLowerCase() === puzzle.answer.toLowerCase()) {
      puzzle.unlocked = true;
      responses[puzzle.command] = puzzle.response;
      await addLine('[CORRETO] Enigma resolvido!', 'success');
      await addLine(`Comando "${puzzle.command}" desbloqueado.`, 'system');
    } else {
      await addLine('[ERRADO] Resposta incorreta. Tente novamente.', 'error');
    }
    
    delete input.dataset.waitingForPuzzle;
    input.placeholder = ">";
    return;
  }

  // Verificar comandos bloqueados
  for (const puzzle of Object.values(puzzles)) {
    if (puzzle.command === cmd && !puzzle.unlocked) {
      await addLine(`[ACESSO BLOQUEADO] Resolva o enigma "${Object.keys(puzzles).find(k => puzzles[k].command === cmd)}" primeiro.`, 'error');
      return;
    }
  }

  // Comandos normais
  const response = typeof responses[cmd] === 'function' ? responses[cmd]() : responses[cmd];
  if (response === undefined) {
    await addLine('[ERRO] Comando não reconhecido. Digite "help" para ajuda.', 'error');
  } else if (response) {
    await addLine(response, 'output');
  }
}

// Event listeners
input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) await processCommand(cmd);
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    if (commandHistory.length > 0 && historyIndex > 0) {
      input.value = commandHistory[--historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    if (historyIndex < commandHistory.length - 1) {
      input.value = commandHistory[++historyIndex];
    } else {
      historyIndex = commandHistory.length;
      input.value = '';
    }
  }
});

// Inicialização
window.onload = async () => {
  await addLine('[NULL-ACCESS SYSTEM BOOTING...]', 'system');
  await addLine('Digite "help" para comandos disponíveis', 'system');
  input.focus();

  // Efeitos de glitch
  setInterval(() => {
    if (Math.random() < 0.1) {
      const glitch = document.createElement('div');
      glitch.className = 'glitch';
      glitch.textContent = ['SYSTEM FAILURE', '01010100', 'ALEX', '15/09/2015'][Math.floor(Math.random() * 4)];
      glitch.style.left = `${Math.random() * 80 + 10}%`;
      glitch.style.top = `${Math.random() * 80 + 10}%`;
      document.body.appendChild(glitch);
      setTimeout(() => glitch.remove(), 1000);
    }
  }, 5000);
};