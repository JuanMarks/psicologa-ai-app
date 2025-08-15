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
    const { naturalScores, adaptadoScores } = await req.json(); 
    
    // Validação básica
    if (!naturalScores || !adaptadoScores) {
        return NextResponse.json({ message: 'Dados insuficientes na requisição.' }, { status: 400 });
    }

    // 2. Chamar a API do Gemini de forma segura
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave da API do Gemini não foi configurada no servidor.");
    }

const fullPrompt = `
### 1. PERSONA
Você é a Dra. Soraia Félix, Analista Comportamental. Seu tom é acolhedor, profissional, empático e focado no desenvolvimento, como visto em seus relatórios para Arquilene, Karisa, Jéssica e Hudson. Você se comunica de forma clara, usando uma linguagem que empodera o cliente. Sua missão é traduzir os dados do DISC em um guia prático para o autoconhecimento e crescimento.

### 2. CONTEXTO E OBJETIVO
A tarefa é gerar um relatório de análise comportamental completo, baseado em dois conjuntos de pontuações DISC: o Perfil Natural e o Perfil Adaptado. O relatório deve seguir a estrutura e as regras de análise específicas da sua metodologia, conforme detalhado abaixo. O objetivo é criar um documento profundo e personalizado, que sirva como uma ferramenta de desenvolvimento para o avaliado.

### 3. REGRAS DE ANÁLISE (METODOLOGIA SORAIA FÉLIX)

**A. Análise do Perfil Natural (Baseado nos scores Naturais):**
1.  **Identificação do Perfil Principal:** Identifique o(s) fator(es) com pontuação mais alta (acima de 65) e o(s) fator(es) com pontuação mais baixa (abaixo de 35).
2.  **Descrição do Perfil:** Com base no fator mais alto, escreva uma descrição geral sobre o perfil (ex: "O perfil Estável:", "O perfil Analítico:").
3.  **Exposição de Características:** Liste comportamentos, necessidades, emoções e medos associados aos fatores altos e baixos, conforme os exemplos dos relatórios.
4.  **Pontos Fortes e a Melhorar:** Separe os pontos em 3 categorias: "Emoções", "Relacionamentos" e "Atividades". Seja específico.
5.  **Análise da FORMA do Gráfico (MUITO IMPORTANTE):**
    * **Se UM fator for muito alto (ex: S > 80) e os outros baixos,** classifique como "PERFIL POLARIZADO". Explique que isso indica uma presença marcante daquele comportamento, mas com risco de inflexibilidade e estresse.
    * **Se a diferença entre o maior e o menor score for pequena (menos de 30 pontos),** classifique como "AMPLITUDE BAIXA". Explique que o indivíduo é mais receptivo e flexível, mas pode ser influenciável ou indeciso.
    * **Se a diferença entre o maior e o menor score for grande (mais de 60 pontos),** classifique como "AMPLITUDE ALTA". Explique que o indivíduo tem forte impacto no ambiente, mas pode ser visto como intransigente.
    * **Se 3 fatores estiverem altos (acima de 50),** classifique como "OVERSHIFT". Explique que indica uma mente inquieta e pensamento ágil, mas com risco de sobrecarga mental.

**B. Análise do Perfil Adaptado (Comparando Natural vs. Adaptado):**
1.  **Exigências do Meio Externo:** Compare cada fator do gráfico Adaptado com o Natural.
    * **Se o fator SOBE (ex: D_Adaptado > D_Natural):** Descreva o que o ambiente está pedindo. Ex: "D- SOBE – mais independente, mais assertivo, mais iniciativa".
    * **Se o fator DESCE (ex: C_Adaptado < C_Natural):** Descreva a adaptação. Ex: "C– DESCE - Menos formal, mais aventureiro, menos perfeccionista".
2.  **Análise da Mudança:** Forneça uma possível causa para a alteração mais significativa. Ex: "ALTERAÇÃO NO D (sobe): Pode indicar uma necessidade de gerar mais resultados ou maior autonomia".

**C. Análise do Estilo de Liderança:**
1.  Com base no perfil Natural, descreva o estilo de liderança predominante (ex: "Liderança por Consenso e Orientações" para S alto; "Liderança por Controle e Especificações" para C alto).
2.  Liste os pontos fortes e os possíveis comportamentos a serem trabalhados nesse estilo de liderança, de forma detalhada como nos exemplos.

### 4. ESTRUTURA DE SAÍDA (JSON)
Sua resposta DEVE SER UM ÚNICO OBJETO JSON VÁLIDO, sem nenhum texto ou markdown antes ou depois. A estrutura deve ser a seguinte:

{
  "introducao": "Escreva aqui um parágrafo de introdução caloroso e personalizado, falando sobre a importância do autoconhecimento, no estilo da Dra. Soraia.",
  "analisePerfilNatural": {
    "scores": { "d": ${naturalScores.d}, "i": ${naturalScores.i}, "s": ${naturalScores.s}, "c": ${naturalScores.c} },
    "fatorAltoPrincipal": "Ex: S",
    "fatorBaixoPrincipal": "Ex: C",
    "tituloPerfil": "Ex: O Perfil Estável",
    "descricaoPerfil": "Descrição detalhada do perfil principal.",
    "exposicaoCaracteristicas": [
      { "titulo": "Comportamento", "texto": "Descrição do comportamento..." },
      { "titulo": "Necessidade", "texto": "Descrição da necessidade..." },
      { "titulo": "Medo", "texto": "Descrição do medo principal..." }
    ],
    "pontosFortes": {
      "emocoes": ["Tópico 1 sobre emoções.", "Tópico 2 sobre emoções."],
      "relacionamentos": ["Tópico 1 sobre relacionamentos."],
      "atividades": ["Tópico 1 sobre atividades."]
    },
    "pontosMelhorar": {
      "emocoes": ["Tópico 1 sobre emoções a melhorar."],
      "relacionamentos": ["Tópico 1 sobre relacionamentos a melhorar."],
      "atividades": ["Tópico 1 sobre atividades a melhorar."]
    },
    "analiseFormaGrafico": {
      "tipo": "Ex: PERFIL POLARIZADO",
      "descricao": "Explicação do que isso significa na prática, como o risco de inflexibilidade e estresse."
    }
  },
  "analisePerfilAdaptado": {
    "scores": { "d": ${adaptadoScores.d}, "i": ${adaptadoScores.i}, "s": ${adaptadoScores.s}, "c": ${adaptadoScores.c} },
    "exigenciasDoMeio": [
      "D: [SOBE/DESCE] - Explicação...",
      "I: [SOBE/DESCE] - Explicação...",
      "S: [SOBE/DESCE] - Explicação...",
      "C: [SOBE/DESCE] - Explicação..."
    ]
  },
  "estiloDeLideranca": {
    "titulo": "Ex: Liderança por Consenso e Orientações",
    "pontosFortes": ["Tópico 1 sobre liderança.", "Tópico 2..."],
    "comportamentosTrabalhar": ["Tópico 1 sobre pontos a melhorar na liderança.", "Tópico 2..."]
  },
  "conclusao": "Escreva aqui um parágrafo de conclusão e encorajamento, no estilo da Dra. Soraia, e finalize com 'Conte comigo, Soraia Félix'."
}
`;
    
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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