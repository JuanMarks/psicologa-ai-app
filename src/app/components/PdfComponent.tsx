// app/components/PdfDocument.tsx
"use client";

import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Image } from '@react-pdf/renderer';
// import { DashboardData } from '../../types'; // IMPORTANTE: use seu arquivo de tipos central

// Se quiser usar uma fonte específica, como a do Tailwind
// Font.register({ family: 'Inter', src: '/path/to/inter.ttf' });

interface DiscScores {
	d: number;
	i: number;
	s: number;
	c: number;
}

interface DashboardData {
  introducao: string;
  analisePerfilNatural: {
    scores: DiscScores;
    fatorAltoPrincipal: string;
    fatorBaixoPrincipal: string;
    tituloPerfil: string;
    descricaoPerfil: string;
    exposicaoCaracteristicas: Array<{
      titulo: string;
      texto: string;
    }>;
    pontosFortes: {
      emocoes: string[];
      relacionamentos: string[];
      atividades: string[];
    };
    pontosMelhorar: {
      emocoes: string[];
      relacionamentos: string[];
      atividades: string[];
    };
    analiseFormaGrafico: {
      tipo: string;
      descricao: string;
    };
  };
  analisePerfilAdaptado: {
    scores: DiscScores;
    exigenciasDoMeio: string[];
  };
  estiloDeLideranca: {
    titulo: string;
    pontosFortes: string[];
    comportamentosTrabalhar: string[];
  };
  conclusao: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica', // Fonte padrão
    fontSize: 11,
    color: '#334155', // slate-700
  },
  h1: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  h2: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 8, marginTop: 16, borderBottom: '2px solid #e2e8f0', paddingBottom: 4 },
  h3: { fontSize: 14, fontWeight: 'bold', color: '#475569', marginBottom: 5, marginTop: 10 },
  text: { marginBottom: 5, lineHeight: 1.5 },
  section: { marginBottom: 15 },
  listItem: { marginLeft: 10, marginBottom: 3 },
  conclusion: { marginTop: 20, fontStyle: 'italic' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 9, color: 'grey' },
  chartImage: {
    marginTop: 15,
    marginBottom: 15,
    width: '80%',
    alignSelf: 'center',
  },
});

interface PdfProps {
  data: DashboardData;
  radarChartImage?: string;
  barChartImage: string;
}

export const PdfDocument = ({ data, radarChartImage, barChartImage }: PdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>Relatório de Análise Comportamental</Text>
      <Text style={styles.text}>{data.introducao}</Text>

      <View style={styles.section}>
        <Text style={styles.h2}>Análise do Perfil Natural</Text>
        {/* 3. Renderize a imagem do gráfico de radar se ela existir */}
        {radarChartImage && <Image style={styles.chartImage} src={{ uri: radarChartImage }} />}
        <Text style={styles.h3}>{data.analisePerfilNatural.tituloPerfil}</Text>
        <Text style={styles.text}>{data.analisePerfilNatural.descricaoPerfil}</Text>
        
        <Text style={styles.h3}>Análise da Forma do Gráfico: {data.analisePerfilNatural.analiseFormaGrafico.tipo}</Text>
        <Text style={styles.text}>{data.analisePerfilNatural.analiseFormaGrafico.descricao}</Text>

        <Text style={styles.h3}>Pontos Fortes</Text>
        {data.analisePerfilNatural.pontosFortes.atividades.map(p => <Text key={p} style={styles.listItem}>• {p}</Text>)}

        <Text style={styles.h3}>Pontos a Melhorar</Text>
        {data.analisePerfilNatural.pontosMelhorar.atividades.map(p => <Text key={p} style={styles.listItem}>• {p}</Text>)}
      </View>

      <View style={styles.section}>
        <Text style={styles.h2}>Análise do Perfil Adaptado</Text>
        {/* 3. Renderize a imagem do gráfico de barras se ela existir */}
        {barChartImage && <Image style={styles.chartImage} src={{ uri: barChartImage }} />}
        <Text style={styles.h3}>Exigências do Meio</Text>
        {data.analisePerfilAdaptado.exigenciasDoMeio.map(e => <Text key={e} style={styles.listItem}>• {e}</Text>)}
      </View>

       <View style={styles.section}>
        <Text style={styles.h2}>Estilo de Liderança: {data.estiloDeLideranca.titulo}</Text>
        <Text style={styles.h3}>Pontos Fortes na Liderança</Text>
        {data.estiloDeLideranca.pontosFortes.map(p => <Text key={p} style={styles.listItem}>• {p}</Text>)}

        <Text style={styles.h3}>Comportamentos a Trabalhar</Text>
        {data.estiloDeLideranca.comportamentosTrabalhar.map(p => <Text key={p} style={styles.listItem}>• {p}</Text>)}
      </View>

      <Text style={styles.conclusion}>{data.conclusao}</Text>
      <Text style={styles.footer}>Relatório gerado em {new Date().toLocaleDateString('pt-BR')} por Dra. Soraia Félix</Text>
    </Page>
  </Document>
);