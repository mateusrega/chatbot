export class ChatBot {
  constructor() {
    this.context = {};
    this.userName = null;
    this.knowledgeBase = {
      programacao: {
        keywords: ['programação', 'programar', 'código', 'código', 'linguagem', 'python', 'javascript', 'java', 'html', 'css'],
        responses: [
          'Programação é a arte de criar soluções através de código! Quer saber sobre alguma linguagem específica?',
          'Aprender programação abre muitas portas! Posso te ajudar com HTML, CSS, JavaScript, Python e mais!',
          'Programação desenvolve lógica e criatividade. Qual área te interessa mais: web, apps ou jogos?'
        ]
      },
      matematica: {
        keywords: ['matemática', 'matematica', 'conta', 'número', 'numero', 'calcular', 'soma', 'multiplicação'],
        responses: [
          'Matemática é fundamental! Precisa de ajuda com algum conceito específico?',
          'Posso te ajudar com matemática! Álgebra, geometria, cálculo... qual área?',
          'Matemática é como um quebra-cabeça divertido! Em que posso ajudar?'
        ]
      },
      ciencias: {
        keywords: ['ciência', 'ciencia', 'física', 'fisica', 'química', 'quimica', 'biologia'],
        responses: [
          'Ciências são fascinantes! Quer saber sobre física, química ou biologia?',
          'O mundo das ciências é incrível! Qual assunto te interessa?',
          'Adoro falar sobre ciências! Sobre o que você quer aprender?'
        ]
      },
      historia: {
        keywords: ['história', 'historia', 'passado', 'guerra', 'civilização', 'civilizacao'],
        responses: [
          'História nos ajuda a entender o presente! Qual período te interessa?',
          'História está cheia de histórias fascinantes! Quer saber sobre qual época?',
          'Conhecer história é conhecer a humanidade! Sobre o que quer conversar?'
        ]
      },
      ingles: {
        keywords: ['inglês', 'ingles', 'english', 'idioma', 'língua'],
        responses: [
          'Aprender inglês abre portas globais! Quer dicas de estudo?',
          'English is very important! Posso te ajudar com gramática, vocabulário ou conversação?',
          'Praticar inglês é essencial hoje em dia! Como posso ajudar?'
        ]
      },
      ajuda: {
        keywords: ['ajuda', 'help', 'não sei', 'nao sei', 'dúvida', 'duvida', 'como', 'o que'],
        responses: [
          'Claro! Posso te ajudar com várias matérias: programação, matemática, ciências, história, inglês e mais!',
          'Estou aqui para ajudar! Pode perguntar sobre qualquer matéria escolar.',
          'Sem problemas! Qual matéria ou assunto você quer estudar?'
        ]
      },
      motivacao: {
        keywords: ['difícil', 'dificil', 'complicado', 'não consigo', 'nao consigo', 'desistir', 'cansado'],
        responses: [
          'Sei que pode ser desafiador, mas você é capaz! Vamos tentar de outro jeito?',
          'Todo aprendizado tem seus desafios, mas você está no caminho certo! Continue tentando!',
          'Não desista! Cada pequeno passo é um progresso. Vamos resolver isso juntos!'
        ]
      }
    };
  }

  generateResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    if (msg.includes('meu nome é') || msg.includes('me chamo') || msg.includes('sou o') || msg.includes('sou a')) {
      const name = this.extractName(msg);
      if (name) {
        this.userName = name;
        return `Prazer em te conhecer, ${name}! Como posso te ajudar hoje?`;
      }
    }

    if (msg.includes('oi') || msg.includes('olá') || msg.includes('ola') || msg.includes('hey')) {
      const greeting = this.userName ? `Olá, ${this.userName}!` : 'Olá!';
      return `${greeting} Sou seu assistente escolar. Posso te ajudar com programação, matemática, ciências, história, inglês e muito mais! 😊`;
    }

    if (msg.includes('tchau') || msg.includes('até') || msg.includes('bye') || msg.includes('adeus')) {
      const farewell = this.userName ? `, ${this.userName}` : '';
      return `Até logo${farewell}! Foi ótimo conversar com você. Volte sempre que precisar! 👋`;
    }

    if (msg.includes('quem é você') || msg.includes('quem e voce') || msg.includes('o que você faz') || msg.includes('o que voce faz')) {
      return 'Sou um assistente virtual educacional criado para ajudar estudantes com suas dúvidas escolares. Posso conversar sobre várias matérias e te motivar nos estudos!';
    }

    if (msg.includes('obrigado') || msg.includes('obrigada') || msg.includes('valeu') || msg.includes('thanks')) {
      return 'Por nada! Estou sempre aqui para ajudar. Precisa de mais alguma coisa? 😊';
    }

    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      for (const keyword of data.keywords) {
        if (msg.includes(keyword)) {
          const response = data.responses[Math.floor(Math.random() * data.responses.length)];
          this.context.lastTopic = category;
          return response;
        }
      }
    }

    if (msg.length < 3) {
      return 'Pode me dar mais detalhes? Assim posso te ajudar melhor!';
    }

    if (msg.includes('?')) {
      return 'Essa é uma ótima pergunta! Para te ajudar melhor, pode me dar mais contexto sobre o tema?';
    }

    const genericResponses = [
      'Interessante! Pode me contar mais sobre isso?',
      'Entendo. Qual matéria está relacionada à sua pergunta?',
      'Estou aqui para ajudar! Sobre qual assunto você quer conversar?',
      'Hmm, não tenho certeza se entendi. Pode reformular de outra forma?',
      'Vamos conversar sobre suas matérias favoritas? Posso ajudar com várias coisas!'
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }

  extractName(message) {
    const patterns = [
      /meu nome (?:é|e) (\w+)/i,
      /me chamo (\w+)/i,
      /sou (?:o|a) (\w+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    }
    return null;
  }
}
