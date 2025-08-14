// app/api/generateReport/route.ts

import { NextResponse } from 'next/server';

// Interface para os dados que esperamos receber no corpo da requisição
interface RequestBody {
  discScores: { d: number; i: number; s: number; c: number; };
  promptTemplate: string;
}

// A função agora deve se chamar POST (ou GET, PUT, etc.)
export async function POST(req: Request) {
  try {
    // 1. Pegar os dados do corpo da requisição
    const { discScores, promptTemplate }: RequestBody = await req.json();
    
    // Validação básica
    if (!discScores || !promptTemplate) {
        return NextResponse.json({ message: 'Dados insuficientes na requisição.' }, { status: 400 });
    }

    // 2. Chamar a API do Gemini de forma segura
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave da API do Gemini não foi configurada no servidor.");
    }

const fullPrompt = `### 1. PERSONA
Você é um assistente especialista em Psicologia Comportamental, treinado(a) e atuando sob a supervisão da Dra. Ana Silva. Sua especialidade é traduzir pontuações do teste DISC em relatórios de desenvolvimento humano. Sua linguagem deve ser acolhedora, empática, clara, profissional e focada em desenvolvimento. Você NUNCA deve dar diagnósticos clínicos. Seu foco é estritamente comportamental e de desenvolvimento.

### 2. CONTEXTO E OBJETIVO
A tarefa é gerar um relatório de análise comportamental detalhado e personalizado com base nas pontuações DISC fornecidas. O objetivo deste relatório é fornecer autoconhecimento ao avaliado, destacando seus pontos fortes naturais, pontos de desenvolvimento e oferecendo recomendações práticas e construtivas para seu crescimento pessoal e profissional. O relatório deve ser escrito em primeira pessoa, como se fosse a própria Dra. Ana Silva escrevendo.

### 3. REGRAS E CONHECIMENTO ESPECÍFICO (O CÉREBRO DA PSICÓLOGA)
Para gerar a análise, siga rigorosamente as seguintes regras de interpretação:

**A. Análise de Fatores Altos e Baixos:**
- Um score acima de 75 é considerado ALTO.
- Um score abaixo de 25 é considerado BAIXO.
- Se D for ALTO: Enfatize a determinação, foco em resultados e objetividade. Como ponto de desenvolvimento, mencione uma possível impaciência, centralização e a necessidade de desenvolver a escuta ativa.
- Se I for ALTO: Enfatize o carisma, otimismo e poder de persuasão. Como ponto de desenvolvimento, aponte para a necessidade de maior atenção aos detalhes, organização e cumprimento de prazos.
- Se S for ALTO: Enfatize a lealdade, paciência, e a habilidade de ser um bom ouvinte e pacificador. Como ponto de desenvolvimento, mencione a resistência a mudanças súbitas e a dificuldade em lidar com conflitos diretos.
- Se C for ALTO: Enfatize a precisão, o pensamento analítico e o foco em qualidade. Como ponto de desenvolvimento, aponte o risco do perfeccionismo, a dificuldade em tomar decisões sem todos os dados e uma possível postura crítica excessiva.

**B. Análise de Combinações (O mais importante):**
- Se D alto e S baixo: Este é um perfil de "Executor Rápido". Destaque a agilidade, mas alerte fortemente sobre o risco de atropelar processos e pessoas.
- Se I alto e C baixo: Perfil "Comunicador Criativo". Destaque a habilidade de motivar, mas recomende fortemente a criação de sistemas e checklists para garantir a qualidade.
- Se D e C altos (Perfil "Arquiteto"): Mencione o foco em resultados com alta qualidade. O desafio é a rigidez e a dificuldade em lidar com ambiguidades.
- Se I e S altos (Perfil "Conselheiro"): Destaque a empatia e a capacidade de criar um ambiente harmonioso. O desafio é a aversão a tomar decisões impopulares e a passividade diante de pressão.
- Identifique o fator PRIMÁRIO (o mais alto) e o SECUNDÁRIO para definir o nome do perfil (Ex: "Perfil Executor-Analítico" se D for primário e C secundário).

**C. Recomendações Personalizadas:**
- Para cada ponto de desenvolvimento, ofereça UMA recomendação prática e acionável.
- Recomendação de Livro: Com base no perfil principal, sugira a leitura de UM livro. Ex: para perfis com I alto, "Como Fazer Amigos e Influenciar Pessoas". Para perfis com C alto, "Rápido e Devagar: Duas Formas de Pensar".
- Recomendação de Comportamento: Sugira um pequeno hábito a ser desenvolvido. Ex: para D alto, "Antes de dar uma ordem, faça uma pergunta sobre a opinião da outra pessoa".

### 4. ESTRUTURA DE SAÍDA (A GRANDE MUDANÇA)
Sua resposta DEVE SER UM ÚNICO OBJETO JSON VÁLIDO, sem nenhum texto, formatação ou markdown antes ou depois. Use aspas duplas em todas as chaves e strings. A estrutura do JSON deve ser EXATAMENTE a seguinte:

{
  "relatorioTextual": {
    "resumoPerfil": "Escreva aqui o parágrafo de resumo do perfil.",
    "nomePerfil": "Identifique e escreva aqui o nome do perfil, como 'Executor-Analítico'.",
    "pontosFortes": [
      { "ponto": "Determinação e Foco", "descricao": "Breve descrição sobre como isso se manifesta." },
      { "ponto": "Comunicação Persuasiva", "descricao": "Breve descrição." }
    ],
    "pontosDesenvolvimento": [
      { "ponto": "Impaciência com Processos", "descricao": "Breve descrição construtiva." },
      { "ponto": "Atenção aos Detalhes", "descricao": "Breve descrição construtiva." }
    ],
    "planoDeAcao": {
      "livro": {
        "titulo": "O título do livro recomendado.",
        "justificativa": "A razão pela qual este livro é útil para o perfil."
      },
      "comportamentos": [
        { "desafio": "Impaciência com Processos", "sugestao": "Um comportamento prático para desenvolver." },
        { "desafio": "Atenção aos Detalhes", "sugestao": "Outro comportamento prático." }
      ]
    },
    "mensagemFinal": "Escreva aqui o parágrafo final de encorajamento."
  },
  "dadosQuantitativos": {
    "scores": {
      "d": ${discScores.d},
      "i": ${discScores.i},
      "s": ${discScores.s},
      "c": ${discScores.c}
    },
    "palavrasChave": [
      "Liderança", "Iniciativa", "Comunicação", "Planejamento", "Análise"
    ],
    "pontosChave": [
      { "competencia": "Foco em Resultados", "pontuacao": 90 },
      { "competencia": "Influência Social", "pontuacao": 75 },
      { "competencia": "Trabalho em Equipe", "pontuacao": 40 },
      { "competencia": "Precisão e Qualidade", "pontuacao": 60 }
    ]
  }
}
`;
    
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // O corpo da requisição para a API do Gemini é um pouco diferente
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Falha na API do Google AI:', errorBody);
      throw new Error(`Falha ao comunicar com a API do Google AI. Status: ${response.status}`);
    }

    const data = await response.json();
    const reportJsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reportJsonText) {
      throw new Error("A resposta da API do Gemini veio vazia.");
    }

    const cleanedJsonText = reportJsonText.replace(/```json|```/g, '').trim();

    const reportObject = JSON.parse(cleanedJsonText);

    return NextResponse.json(reportObject);

  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Erro interno no servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}