const terminal = document.getElementById('terminal');
let log = [];
let playerName = "Alex"; // Variável para armazenar o nome do jogador

function print(text, delay = 100, callback = null) {
  let processedText = text.replace(/Alex/g, playerName);
  let i = 0;
  const interval = setInterval(() => {
    terminal.innerHTML += processedText[i];
    terminal.scrollTop = terminal.scrollHeight;
    i++;
    if (i >= processedText.length) {
      clearInterval(interval);
      terminal.innerHTML += "\n";
      if (callback) callback();
    }
  }, delay);
}


function createSaveButton() {
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Salvar Progresso';
  saveBtn.style.position = 'fixed';
  saveBtn.style.bottom = '10px';
  saveBtn.style.right = '10px';
  saveBtn.style.background = 'transparent';
  saveBtn.style.border = '1px solid #0f0';
  saveBtn.style.color = '#0f0';
  saveBtn.style.padding = '5px 10px';
  saveBtn.style.fontFamily = 'monospace';
  saveBtn.style.cursor = 'pointer';
  
  saveBtn.addEventListener('click', saveGame);
  
  document.body.appendChild(saveBtn);
}


const puzzles = [
  {
    question: `[ARQUIVO_CORROMPIDO_01]
Enigma: 2, 4, 8, ?
Mensagem oculta: "Tudo começa simples... antes de se multiplicar."`,
    answer: "16",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_02]
Enigma: Se PAIN = 3, VOID = 4, CTRL = ?
Mensagem: "Quanto mais controle você pensa ter... mais está preso."`,
    answer: "5",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_03]
Enigma: Três portas: Vermelha (fogo), Azul (gelo), Verde (desconhecido).
Qual escolhe?`,
    answer: "verde",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_04]
Mensagem parcial encontrada: 
"meu nome era _________. antes de tudo isso........[resto da mensagem IRELEVANTE]"`,
    answer: "irrelevante",
    unlocked: false
  },
  {
    question: `[PROTOCOLO: GEO‑SIGMA – Inico do NÍVEL 2]
Localize os seis pontos e leia o primeiro caractere de cada
cidade em ordem de apresentação.  Junte‑os sem espaços.

  47°55'00"N 106°55'00"E
  64°10'00"N  51°45'00"W
  12°03'50"S  77°01'34"W
  59°56'00"N  10°45'00"E
  30°03'00"N  31°15'00"E
  27°42'02"N  85°18'58"E`,
    answer: "unlock",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_06]
Enigma: .- -- --- .-. / .. ... / .- / .-.. .. . .-.-.- 
Mensagem oculta: "Você deixou pistas... em códigos que ninguém entenderia."

n zhvgnf pnznqnf ab fvfgrzn znvf qb dhr ncneragn onfgn fr ncebshaqne....r rfdhrpre b cnfnqb`,
    answer: "amor",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_08]
Enigma: Você está sozinho em uma sala sem janelas, sem portas. Como sai?
Mensagem: "A mente cria celas... mas também saídas."`,
    answer: "imaginação",
    unlocked: false
  },
  {
    question: `[PROTOCOLO GEO‑SIGMA 2]

[FRAGMENTO DE TRAJETÓRIA RECONSTRUÍDO]

Localize os seguintes pontos. Use a PRIMEIRA LETRA de cada cidade, em ordem.

1. 51.5074° N, 0.1278° W  
2. 48.8566° N, 2.3522° E  
3. 40.7128° N, 74.0060° W  
4. 35.6895° N, 139.6917° E  
5. 55.7558° N, 37.6173° E  

Mensagem oculta:
"Eles estavam lá de longe, mas testemunharam sua queda.  
Luzes, multidões, concreto e silêncio.  
Capitais do mundo onde você não era parte... nunca existiu lá — ou tentou existir.  
Cada uma carrega uma inicial.  
Junte-as. Relembre onde você quebrou primeiro."

Digite a sigla formada por essas iniciais.`,
    answer: "lpnyj",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_09]
"Em qual dia Alan Turing cometeu suicídio?"

Mensagem: "O fim do pai da lógica foi causado por um sistema que não compreendia lógica alguma.  
Turing criou máquinas que pensavam.  
Mas foi destruído por homens que não pensavam o suficiente........."`,
    answer: "07/06/1954",
    unlocked: false
  },
  {
    question: `[FRAGMENTO_LOOP]
Enigma:
"Se eu disser que 'esta afirmação é falsa', ela é verdadeira?"

Mensagem: "Verdades quebram o sistema. A resposta não é um sim ou não. Você tentou corrigir o que não devia ser resolvido, apenas sentido......
[resto da mensagem se repete indefinidamente]"`,
    answer: "paradoxo",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_10]
Senha mestra solicitada: Qual palavra resume tudo isso?

Mensagem: "Começa com 'd' e termina com 'o'. Você esteve preso nisso o tempo todo."`,
    answer: "desespero",
    unlocked: true
  },
  {
    question: `[ARQUIVO_CORROMPIDO_11]
Enigma Criptográfico Avançado:
Decifre a seguinte mensagem usando a cifra de Vigenère com chave "MEMÓRIA":
"XZQJK ZC KZGJQKJ ZC VJKPMKJ"

Dica: A = 0, B = 1, ..., Z = 25. A mensagem original contém apenas letras maiúsculas.`,
    answer: "ESQUECI O QUE EU ESQUECI",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_12]
Enigma Matemático Complexo:
Resolva a sequência:
√16, 3², ⌈π⌉, 5!, ?, ?

Dê a soma dos dois próximos elementos da sequência.`,
    answer: "732", // Próximos elementos são 120 (5!) e 720 (6!), soma = 840
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_13]
Enigma de Programação:
Analise o código abaixo e determine o valor final de 'x':

let x = 0;
for (let i = 0; i < 10; i++) {
  if (i % 3 === 0) continue;
  x += i * (i % 2 === 0 ? 1 : -1);
}`,
    answer: "-12",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_14]
Enigma de Lógica Temporal:
"Se cinco máquinas levam cinco minutos para fazer cinco peças,
quanto tempo levariam cem máquinas para fazer cem peças?"`,
    answer: "5 minutos",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_15]
Enigma Visual:
Considere o seguinte padrão de caracteres:

▲
▲▲▲
▲▲▲▲▲
▲▲▲▲▲▲▲
▲▲▲▲▲

Qual é o próximo elemento na sequência? Responda com o número de triângulos.`,
    answer: "5",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_16]
Enigma de Palavras Cruzadas:
Combine as seguintes palavras para formar uma nova palavra significativa:
PRIMEIRA parte de "SISTEMA" + 
ÚLTIMA letra de "CODIFICAR" + 
MEIO de "MEMÓRIA" (3 letras centrais)`,
    answer: "SISTOR",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_17]
Enigma de Paradoxo:
"Eu sempre minto." - Se esta afirmação for verdadeira, então ela é falsa.
Mas se for falsa, então é verdadeira. Qual é o único valor que resolve este paradoxo?`,
    answer: "indeterminado",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_18]
Enigma de Cifra Composta:
A mensagem abaixo foi codificada primeiro com Base64, depois com ROT13:
"WkhsdkB1MzkhZCE="

Dica: Comece decodificando da última camada aplicada.`,
    answer: "falha",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_19]
Enigma de Padrão Oculto:
Qual é o próximo número na sequência:
2, 10, 12, 16, 17, 18, 19, ?

Dica: Pense na representação dos números em outro idioma.`,
    answer: "200",
    unlocked: false
  },
  {
    question: `[ARQUIVO_CORROMPIDO_20]
Enigma Final:
"O começo do fim,
o fim do tempo e espaço,
o começo de todos os lugares,
e o fim de toda a jornada.
O que sou eu?"`,
    answer: "letra e",
    unlocked: false
  },
];

const storyFragments = [
  `[LOG_01] "Primeiro cálculo correto. Você ainda sabe pensar... talvez não esteja completamente apagado. 
  [REST OF THE MESSAGE UNDECIPHERABLE]"`,
  `[-MESSAGE AUTHOR NOT FOUND-] "Controle é uma ilusão. Você programou isso... mas esqueceu. IBPR FRDHR REENAQB QR ABIB R QR ABIB QR ABIB R QR ABIB QR ABIB R QR ABIB QR ABIB R QR ABIB QR ABIB R QR ABIB QR ABIB R QR ABIB QR ABIB R QR ABIB QR ABIB.
  [REST OF THE MESSAGE IS IRRELEVANT]"`,
  `[DIRETIVA RESTAURADA] "Você sempre escolheu o desconhecido. Era inevitável. É assim que tudo recomeça."
  
  [WARNING] ERRO: SYSTEM: CALIBRATION: DATA: EXPIRED
  [WARNING] sobrepondo alerta.... 
  [WARNING]  SYSTEM: CALIBRATION: DATA: later
  aãb grz znvf anqn................... rzbçbrf.........ivqn.............fnadhr............ `,
  `[IDENTIDADE] Nome: Irrelevante. Função: Contenção. Memória: Proibida. Você era o código... e a falha.`,
  `[PROTOCOLO GEO‑SIGMA CONCLUÍDO]
  A própria malha do mundo escreve a palavra‑chave: você está pronto para **desbloquear** o núcleo final.`,

];

let currentPuzzle = 0;

function createInput() {
  const existing = document.getElementById('input');
  if (existing) existing.remove();

  const input = document.createElement('input');
  input.id = 'input';
  terminal.appendChild(input);
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const value = input.value.trim();
      terminal.removeChild(input);
      handleCommand(value);
    }
  });
}

function showPuzzle() {
  if (currentPuzzle < puzzles.length) {
    terminal.innerHTML += puzzles[currentPuzzle].question + '\n\n> ';
    createInput();
  } else {
    mostrarFinal();
  }
}

function handleCommand(value) {
  terminal.innerHTML += `> ${value}\n`;
  terminal.scrollTop = terminal.scrollHeight;

  if (value.toLowerCase() === "unlock_null") {
    terminal.innerHTML += "[PROTOCOLO LIBERADO] Redirecionando para núcleo oculto...\n\n";
    setTimeout(() => {
      window.location.href = "nullconsole.html";
    }, 2000);
    return;
  }

  const puzzle = puzzles[currentPuzzle];
  if (value.toLowerCase() === puzzle.answer.toLowerCase()) {
    terminal.innerHTML += '\n[HOST [-NOT IDENTIFIED-] ] ENIGMA RESOLVIDO.\n';
    terminal.innerHTML += '[VOZ_ECOANDO] ' + storyFragments[currentPuzzle] + '\n\n';
    currentPuzzle++;
    showPuzzle();
  } else {
    terminal.innerHTML += '\n[ERRO] Resposta incorreta. Tente novamente.\n\n> ';
    createInput();
  }
  terminal.scrollTop = terminal.scrollHeight;
}

const introText = 
`S3RUM: NULLACCESS

[SISTEMA REATIVADO]

[REINICIANDO.....]
[PROGREÇO: 0%]
[PROGREÇO: 10%...]
[PROGREÇO: 20%...]
[PROGREÇO: 30%...]
[PROGREÇO: 40%...]
[PROGREÇO: 50%...]
[PROGREÇO: 60%...]
[PROGREÇO: 70%...]
[PROGREÇO: 80%...]
[PROGREÇO: 90%...]
[PROGREÇO: 95%.......................]
[PROGREÇO: [ERRO] ]
[ERRO]
[ERRO]
[ERRO]
[ERRO]
[ERRO]
[ERRO]
[ERRO]
[ERRO]
[ERRO]
[ERRO]

[PROTOCOLO DE EMERGÊNCIA ATIVADO]

...Quem sou eu?

[POR FAVOR, INSIRA SEU NOME]`;

function startGame() {
  print(introText, 35, () => {
    const nameInput = document.createElement('input');
    nameInput.id = 'name-input';
    terminal.appendChild(nameInput);
    nameInput.focus();
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        playerName = nameInput.value.trim() || "Alex";
        terminal.removeChild(nameInput);
        print(`\n[REGISTRO ATUALIZADO] Identidade primária: ${playerName}\n\n`, 30, showPuzzle);
      }
    });
  });
}

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
    "nagvqrcerffnagf",
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
  if (roll < 0.5) {
    return specialMessages[Math.floor(Math.random() * specialMessages.length)];
  } else {
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
    if (chance < 0.8) {
      const glitchCount = Math.floor(Math.random() * 5) + 1;
      for (let i = 0; i < glitchCount; i++) {
        setTimeout(createRandomGlitch, Math.random() * 500);
      }
    }
  }, 3000 + Math.random() * 7000);
}

startGlitchLoop();

function esperarQualquerEntrada(callback) {
  const input = document.createElement('input');
  input.id = 'final-input';
  input.style.background = 'transparent';
  input.style.border = 'none';
  input.style.color = '#0f0';
  input.style.outline = 'none';
  input.style.fontFamily = 'monospace';
  input.style.fontSize = '16px';
  input.style.width = '90%';

  terminal.appendChild(input);
  input.focus();

  input.addEventListener('keydown', () => {
    terminal.removeChild(input);
    callback();
  });
}

function mostrarFinal() {
  const linhas = [
    "",
    "[SISTEMA PRIMÁRIO RESTAURADO...]",
    "[DECODIFICANDO CAMADA INTERNA...]",
    "[ACESSO AO NÚCLEO CONCEDIDO]",
    "",
    "[MEMÓRIA 01 RESTAURADA]",
    `"Eu criei este sistema para fugir. Para calar as vozes, para apagar a dor. Mas você... você decidiu voltar."`,
    "[PRESSIONE QUALQUER TECLA]",
    "[MEMÓRIA 02 RESTAURADA]",
    `"Não foi um erro de código. Foi um pedido de socorro — disfarçado de lógica, mas escrito em desespero."`,
    "[PRESSIONE QUALQUER TECLA]",
    "[MEMÓRIA 03 RESTAURADA]",
    `"Eu fui ${playerName}. Mas nesse mundo de comandos, me tornei apenas uma variável corrompida."`,
    "[CONEXÃO ESTÁVEL COM A REALIDADE: INICIADA]",
    "[PROTOCOLO DE CONTENÇÃO: CANCELADO]",
    "[PROTOCOLO DE REINTEGRAÇÃO: ATIVO]",
    "[SINAL DE VIDA DETECTADO...]",
    "[PRESSIONE QUALQUER TECLA PARA RESPONDER]",
    '[SISTEMA]: "Você... ainda está aí?"',
    '[USUÁRIO]: "Sim."',
    '[SISTEMA]: "Então talvez... ainda exista esperança."',
    "[PRESSIONE QUALQUER TECLA]",
    '**"Você não precisava resolver tudo. Só precisava lembrar que ainda está aqui."**',
    "[PRESSIONE QUALQUER TECLA]",
    "**REBOOTING_**"
  ];

  function escreverLinha(i = 0) {
    if (i >= linhas.length) return;

    const linha = linhas[i];

    if (linha.toUpperCase().includes("PRESSIONE QUALQUER TECLA")) {
      esperarQualquerEntrada(() => escreverLinha(i + 1));
    } else {
      print(linha + "\n", 30, () => escreverLinha(i + 1));
    }
  }

  escreverLinha();
}

startGame();