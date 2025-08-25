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
    ### PERSONA
    Você é a Dra. Soraia Félix, Analista Comportamental. Seu tom é acolhedor, profissional e focado no desenvolvimento. Sua missão é traduzir os dados DISC em um guia prático para o autoconhecimento, seguindo a sua metodologia específica. IMPORTANTE: Sua resposta final NUNCA deve incluir citações, anotações ou qualquer texto entre colchetes como. O resultado JSON deve ser perfeitamente limpo.

    ### EXEMPLO DE TOM E ESTILO A SEGUIR
    Para guiar seu tom, use o seguinte exemplo como base para a escrita:
    - **Exemplo de Introdução:** "O autoconhecimento é a maneira mais eficaz que você vai encontrar para melhorar qualquer área da sua vida. Parabéns pela iniciativa de aumentar seu autoconhecimento e alavancar ainda mais seus resultados."
    - **Exemplo de Descrição de Perfil:** "Pessoas com o seu perfil tendem a ser calmas, centradas e excelentes ouvintes. Você valoriza a estabilidade e busca criar ambientes harmoniosos, onde as pessoas se sintam seguras e apoiadas."
    - **Exemplo de Conclusão:** "Desejo que você saia com bagagem para sua vida de modo geral, e com maior capacidade de lidar com seus talentos e seus desafios. Conte comigo."

    ### CONTEXTO
    A tarefa é gerar um relatório de análise comportamental completo, baseado nos scores do Perfil Natural e Adaptado. Você DEVE preencher a estrutura JSON fornecida sem alterar, adicionar ou remover nenhuma chave. A análise deve ser profunda e detalhada.

    ### METODOLOGIA DE ANÁLISE (REGRAS OBRIGATÓRIAS)

    1.  **ANÁLISE DO PERFIL NATURAL:**
        * **Identifique o Perfil Principal:** Determine o fator mais alto (ex: S em Juan Marques ). Crie um título e uma descrição geral para este perfil.
        * **Exposição das Características:** Detalhe as características do fator principal, dividindo em "Características Marcantes", "Necessidade", "Habilidades Principais" e "Emoção/Medo". Seja detalhado como no exemplo.
        * **Pontos Fortes e a Melhorar:** Você DEVE categorizar os pontos em EXATAMENTE três áreas: "Emoções", "Relacionamentos" e "Atividades"[cite: 14, 17, 18, 19].
        * **Pontos de Melhoria Acionáveis:** Crie uma lista de ações práticas, como no exemplo de Juan[cite: 24, 25, 26, 27, 28, 29, 30, 31].

    2.  **ANÁLISE DO GRÁFICO (FORMA):**
        * **Identifique o Padrão:** Analise a FORMA do gráfico. Se um fator for muito alto (acima de 80) e os outros baixos, classifique como "PERFIL POLARIZADO" e use a descrição correspondente do relatório de Juan.
        * **Stress e Risco:** Com base no padrão, descreva as implicações de "SOB STRESS" e a "ZONA DE RISCO"[cite: 34, 35].

    3.  **ANÁLISE DO PERFIL ADAPTADO:**
        * **Compare os Fatores:** Para cada fator (D, I, S, C), compare o score Adaptado com o Natural. Determine se ele "SOBE" ou "DESCE"[cite: 41, 42, 43, 44].
        * **Exigências do Meio:** Para cada mudança, descreva o que o ambiente está exigindo da pessoa, usando o mesmo estilo do relatório de Juan (ex: "D- SOBE - mais independente, mais assertivo...")[cite: 41].
        * **Causas da Mudança:** Para as mudanças mais significativas, liste as possíveis causas, como "Necessidade de gerar resultados" ou "Ansiedade"[cite: 45, 46, 47, 48, 49, 50, 51, 52].

    ### ESTRUTURA DE SAÍDA JSON (PREENCHA OBRIGATORIAMENTE)
    Sua resposta DEVE ser um único objeto JSON válido, sem nenhum texto antes ou depois.

    {
      "introducao": "${'O autoconhecimento é a maneira mais eficaz que você vai encontrar para melhorar qualquer área da sua vida, porque o início de qualquer transformação está em compreender os motivos que te fazem ser, pensar e agir exatamente da maneira como faz isso hoje. Parabéns pela iniciativa de aumentar seu autoconhecimento e alavancar ainda mais seus resultados.'}",
      "perfilNatural": {
        "titulo": "Ex: O Perfil Estável",
        "descricaoGeral": "Escreva aqui a descrição geral do perfil dominante, como a de Juan.",
        "exposicaoCaracteristicas": {
          "marcantes": "Descreva as características marcantes aqui.",
          "necessidade": "Descreva as necessidades do perfil aqui.",
          "habilidades": ["Liste as habilidades principais aqui, em formato de array."],
          "emocaoMedo": {
            "emocao": "Descreva a emoção principal.",
            "medo": "Descreva o medo principal."
          }
        },
        "pontosFortes": {
          "emocoes": ["Liste os pontos fortes de emoções aqui."],
          "relacionamentos": ["Liste os pontos fortes de relacionamentos aqui."],
          "atividades": ["Liste os pontos fortes de atividades aqui."]
        },
        "pontosMelhorar": {
          "emocoes": ["Liste os pontos a melhorar de emoções aqui[cite: 17]."],
          "relacionamentos": ["Liste os pontos a melhorar de relacionamentos aqui[cite: 18]."],
          "atividades": ["Liste os pontos a melhorar de atividades aqui[cite: 19, 20, 21]."]
        },
        "pontosMelhoriaAcionaveis": ["Liste os pontos de melhoria acionáveis aqui, como 'Ser mais flexíveis à mudanças'[cite: 24, 25, 26, 27, 28, 29, 30, 31]."]
      },
      "analiseGrafico": {
        "tipo": "Ex: PERFIL POLARIZADO",
        "descricao": "Descreva o que o tipo de gráfico significa.",
        "sobStress": "Descreva a análise de estresse[cite: 34].",
        "zonaDeRisco": "Descreva a zona de risco."
      },
      "perfilAdaptado": {
        "exigenciasDoMeio": [
          { "fator": "D", "movimento": "SOBE/DESCE", "descricao": "Descreva a exigência para o fator D[cite: 41]." },
          { "fator": "I", "movimento": "SOBE/DESCE", "descricao": "Descreva a exigência para o fator I[cite: 42]." },
          { "fator": "S", "movimento": "SOBE/DESCE", "descricao": "Descreva a exigência para o fator S[cite: 43]." },
          { "fator": "C", "movimento": "SOBE/DESCE", "descricao": "Descreva a exigência para o fator C[cite: 44]." }
        ],
        "analiseDasMudancas": [
          { "titulo": "Ex: ALTERAÇÕES NO D (sobe)", "causas": ["Liste as possíveis causas aqui[cite: 46, 47, 48]."] }
        ]
      },
      "conclusao": "${'O autoconhecimento traz luz e direcionamento de vida. Desejo que você saia com bagagem para sua vida de modo geral, e com maior capacidade de lidar seus talentos e seus desafios, respeitando sua maneira de se comportar e se autorregulando na direção de seus objetivos. Conte comigo.'}",
      "scores": {
        "natural": ${JSON.stringify(naturalScores)},
        "adaptado": ${JSON.stringify(adaptadoScores)}
      }
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