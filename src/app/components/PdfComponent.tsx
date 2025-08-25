// app/components/PdfDocument.tsx
"use client";

import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { DashboardData } from '@/types/types'; // Certifique-se que o caminho está correto

// --- ESTILOS APRIMORADOS PARA O RELATÓRIO COMPLETO ---
const styles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155', // slate-700
    lineHeight: 1.5,
  },
  h1: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 15, textAlign: 'center' },
  h2: { fontSize: 16, fontWeight: 'bold', color: '#1E40AF', marginBottom: 10, marginTop: 20, borderBottom: '1px solid #93C5FD', paddingBottom: 3 },
  h3: { fontSize: 12, fontWeight: 'bold', color: '#1e293b', marginBottom: 6, marginTop: 12 },
  h4: { fontSize: 10, fontWeight: 'bold', color: '#475569', marginBottom: 4, marginTop: 8 },
  text: { marginBottom: 5 },
  italic: { fontStyle: 'italic', color: '#475569' },
  section: { marginBottom: 15 },
  listItem: { flexDirection: 'row', marginBottom: 3 },
  bullet: { width: 10, fontSize: 10 },
  listItemText: { flex: 1 },
  footer: { position: 'absolute', bottom: 25, left: 35, right: 35, textAlign: 'center', fontSize: 8, color: 'grey' },
  chartImage: { marginTop: 10, marginBottom: 10, width: '75%', alignSelf: 'center' },
  card: { backgroundColor: '#F8FAFC', borderLeft: '3px solid #3B82F6', padding: 10, marginVertical: 5, borderRadius: 3 },
  bold: { fontWeight: 'bold' },
});


interface PdfProps {
  data: DashboardData;
  radarChartImage?: string;
  barChartImage?: string;
}

export const PdfDocument = ({ data, radarChartImage, barChartImage }: PdfProps) => {
  // Se não houver dados, retorna um documento vazio para evitar erros
  if (!data) return <Document />; 

  const { perfilNatural, perfilAdaptado, analiseGrafico, introducao, conclusao, scores } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Relatório de Análise Comportamental</Text>
        <Text style={styles.text}>{introducao}</Text>

        {/* --- ANÁLISE DO PERFIL NATURAL --- */}
        <View style={styles.section}>
          <Text style={styles.h2}>{perfilNatural.titulo}: Sua Essência</Text>
          {radarChartImage && <Image style={styles.chartImage} src={radarChartImage} />}
          <Text style={styles.italic}>{perfilNatural.descricaoGeral}</Text>

          <Text style={styles.h3}>Exposição de Características</Text>
          <View style={styles.card}>
              <Text><Text style={styles.bold}>Características Marcantes:</Text> {perfilNatural.exposicaoCaracteristicas.marcantes}</Text>
              <Text><Text style={styles.bold}>Necessidade Principal:</Text> {perfilNatural.exposicaoCaracteristicas.necessidade}</Text>
              <Text><Text style={styles.bold}>Emoção:</Text> {perfilNatural.exposicaoCaracteristicas.emocaoMedo.emocao}</Text>
              <Text><Text style={styles.bold}>Medo:</Text> {perfilNatural.exposicaoCaracteristicas.emocaoMedo.medo}</Text>
              <Text style={styles.bold}>Habilidades:</Text>
              {perfilNatural.exposicaoCaracteristicas.habilidades.map(h => (
                <View key={h} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>{h}</Text></View>
              ))}
          </View>
          
          <Text style={styles.h3}>Pontos Fortes e Oportunidades de Crescimento</Text>
          <Text style={styles.h4}>Emoções</Text>
          <Text><Text style={styles.bold}>Fortes:</Text> {perfilNatural.pontosFortes.emocoes.join(', ')}</Text>
          <Text><Text style={styles.bold}>A Melhorar:</Text> {perfilNatural.pontosMelhorar.emocoes.join(', ')}</Text>
          
          <Text style={styles.h4}>Relacionamentos</Text>
          <Text><Text style={styles.bold}>Fortes:</Text> {perfilNatural.pontosFortes.relacionamentos.join(', ')}</Text>
          <Text><Text style={styles.bold}>A Melhorar:</Text> {perfilNatural.pontosMelhorar.relacionamentos.join(', ')}</Text>

          <Text style={styles.h4}>Atividades</Text>
          <Text><Text style={styles.bold}>Fortes:</Text> {perfilNatural.pontosFortes.atividades.join(', ')}</Text>
          <Text><Text style={styles.bold}>A Melhorar:</Text> {perfilNatural.pontosMelhorar.atividades.join(', ')}</Text>

          <Text style={styles.h3}>Pontos de Melhoria Acionáveis</Text>
           {perfilNatural.pontosMelhoriaAcionaveis.map(p => (
              <View key={p} style={styles.listItem}><Text style={styles.bullet}>•</Text><Text style={styles.listItemText}>{p}</Text></View>
            ))}
        </View>

        {/* --- ANÁLISE DO GRÁFICO (NOVA PÁGINA) --- */}
        <View style={styles.section} break>
          <Text style={styles.h2}>Análise da Forma do Gráfico</Text>
          <View style={styles.card}>
            <Text><Text style={styles.bold}>Padrão do Gráfico:</Text> {analiseGrafico.tipo}</Text>
            <Text>{analiseGrafico.descricao}</Text>
          </View>
          <View style={styles.card}>
            <Text><Text style={styles.bold}>Comportamento sob Stress:</Text> {analiseGrafico.sobStress}</Text>
          </View>
          <View style={styles.card}>
            <Text><Text style={styles.bold}>Zona de Risco:</Text> {analiseGrafico.zonaDeRisco}</Text>
          </View>
        </View>

        {/* --- ANÁLISE DO PERFIL ADAPTADO --- */}
        <View style={styles.section}>
          <Text style={styles.h2}>Perfil Adaptado: Ajustes ao Meio</Text>
          {barChartImage && <Image style={styles.chartImage} src={barChartImage} />}
          
          <Text style={styles.h3}>Exigências do Meio</Text>
          {perfilAdaptado.exigenciasDoMeio.map(e => (
            <View key={e.fator} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}><Text style={styles.bold}>{e.fator} ({e.movimento}):</Text> {e.descricao}</Text>
            </View>
          ))}

          <Text style={styles.h3}>Análise das Mudanças</Text>
          {perfilAdaptado.analiseDasMudancas.map((mudanca, index) => (
            <View key={index} style={{marginTop: 5}}>
              <Text style={styles.bold}>{mudanca.titulo}</Text>
              {mudanca.causas.map(causa => (
                <View key={causa} style={styles.listItem}><Text style={styles.bullet}>-</Text><Text style={styles.listItemText}>{causa}</Text></View>
              ))}
            </View>
          ))}
        </View>

        <Text style={{...styles.text, ...styles.italic, marginTop: 20}}>{conclusao}</Text>
        <Text style={styles.footer}>Relatório gerado em {new Date().toLocaleDateString('pt-BR')} | Analista Comportamental: Dra. Soraia Félix</Text>
      </Page>
    </Document>
  );
};