// pages/index.tsx
'use client';
import { useState, FC, Fragment } from 'react';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { Dialog, Transition } from '@headlessui/react';
import { RadarChart } from './components/RadarCharts';
import { useDashboardStore } from '../store/DashboardStore';
import { useRouter } from 'next/navigation';

interface DashboardData {
  relatorioTextual: { 
	resumoPerfil: string;
	nomePerfil: string;
	pontosFortes: { ponto: string; descricao: string; }[];
	pontosDesenvolvimento: { ponto: string; descricao: string; }[];
	planoDeAcao: {
		livro: { titulo: string; justificativa: string; };
		comportamentos: { desafio: string; sugestao: string; }[];
	};
	mensagemFinal: string;
   };
  dadosQuantitativos: {
    scores: { d: number; i: number; s: number; c: number; };
    palavrasChave: string[];
    pontosChave: { competencia: string; pontuacao: number; }[];
  };
}

interface DiscScores {
	d: number;
	i: number;
	s: number;
	c: number;
}
interface ReportDocumentProps {
	text: string;
}
const styles = StyleSheet.create({
	page: { padding: 30 },
	text: { fontFamily: 'Helvetica', fontSize: 12, lineHeight: 1.5 },
});
const ReportDocument: FC<ReportDocumentProps> = ({ text }) => (
	<Document>
		<Page style={styles.page}><Text style={styles.text}>{text}</Text></Page>
	</Document>
);

// --- Componente Principal da Página (com Lógica de Upload) ---
const HomePage: FC = () => {
	const [report, setReport] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	 // Pega a função para salvar os dados na nossa store global
  const setDashboardData = useDashboardStore((state) => state.setDashboardData);
  // Pega os dados da store para sabermos se já foram gerados
  const dashboardData = useDashboardStore((state) => state.dashboardData);
	


	// NOVOS ESTADOS para controlar o arquivo e os scores
	const [fileName, setFileName] = useState<string | null>(null);
	const [discScores, setDiscScores] = useState<DiscScores | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleManualSubmit = (manualScores: DiscScores) => {
		setDiscScores(manualScores);
		setFileName(null); // Limpa o nome do arquivo, pois a entrada foi manual
		setReport('');
		setError(null);
		setIsModalOpen(false); // Fecha o modal
	};

	/**
	 * ESTA É A FUNÇÃO QUE VOCÊ PRECISA ADAPTAR
	 * Ela recebe o conteúdo do arquivo como texto e deve retornar os scores D, I, S, C.
	 * @param fileContent O conteúdo do arquivo lido como uma string.
	 */
	const parseDiscFile = (fileContent: string): DiscScores | null => {
		try {
			// Exemplo 1: Se o arquivo for um texto simples como "D:85, I:70, S:40, C:30"
			const scores: Partial<DiscScores> = {};
			const matches = fileContent.matchAll(/(D|I|S|C):\s*(\d+)/gi);
			for (const match of matches) {
				const key = match[1].toLowerCase() as keyof DiscScores;
				scores[key] = parseInt(match[2], 10);
			}

			if (scores.d && scores.i && scores.s && scores.c) {
				return scores as DiscScores;
			}

			// Exemplo 2: Se o arquivo for um JSON como { "d": 85, "i": 70, ... }
			// const scores = JSON.parse(fileContent);
			// return scores;

			throw new Error("Formato de arquivo não reconhecido ou dados incompletos.");
		} catch (e) {
			console.error("Erro ao parsear o arquivo:", e);
			setError("Não foi possível ler os scores do arquivo. Verifique o formato.");
			return null;
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setFileName(file.name);
		setDiscScores(null); // Limpa scores antigos
		setError(null);
		setReport('');

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			if (content) {
				const parsedScores = parseDiscFile(content);
				if (parsedScores) {
					setDiscScores(parsedScores);
				}
			}
		};
		reader.readAsText(file);
	};

	const handleGenerateReport = async () => {
		if (!discScores) {
			setError("Por favor, carregue um arquivo com os scores do DISC primeiro.");
			return;
		}

		setLoading(true);
		setReport('');
		setError(null);

		const promptTemplate = "Você é uma assistente especialista em psicologia comportamental...";

		try {
			const response = await fetch('/api/generateReport', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ discScores, promptTemplate }),
			});
			if (response.ok) {
				const data: DashboardData = await response.json();
				setDashboardData(data);
			}else if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Ocorreu um erro desconhecido.');
			}
			const successData = await response.json();
			setReport(successData.report);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
				<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl space-y-6">

					<div className="text-center">
						<h1 className="text-3xl font-bold text-slate-800">Gerador de Relatórios DISC</h1>
						<p className="mt-2 text-slate-600">Carregue um arquivo ou insira a pontuação manualmente.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

						{/* ÁREA DE UPLOAD DE ARQUIVO */}
						<div className="space-y-2">
							<label htmlFor="file-upload" className="block text-sm font-medium text-slate-700">
								Arquivo de Avaliação
							</label>
							<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
								<div className="space-y-1 text-center">
									<svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
										<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									<div className="flex text-sm text-slate-600">
										<label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
											<span>Selecione um arquivo</span>
											<input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.json,.csv" />
										</label>
										<p className="pl-1">ou arraste e solte aqui</p>
									</div>
									<p className="text-xs text-slate-500">TXT, JSON, CSV até 1MB</p>
								</div>
							</div>
							{fileName && (
								<div className="text-sm text-slate-700 bg-slate-100 p-2 rounded-md">
									<strong>Arquivo selecionado:</strong> {fileName}
								</div>
							)}
						</div>

						{/* Divisor e Botão Manual */}
						<div className="flex flex-col items-center gap-4">
							<div className="w-full flex items-center">
								<div className="flex-grow border-t border-slate-300"></div>
								<span className="flex-shrink mx-4 text-slate-400 text-sm">OU</span>
								<div className="flex-grow border-t border-slate-300"></div>
							</div>
							<button
								type="button"
								onClick={() => setIsModalOpen(true)}
								className="w-full bg-white border border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
							>
								Inserir Pontuação Manualmente
							</button>
						</div>

					</div>

					{/* Feedback de entrada */}
					{discScores && (
						<div className="text-sm text-center text-green-700 bg-green-100 p-3 rounded-md">
							<p>
								{fileName
									? `Scores carregados do arquivo: ${fileName}`
									: `Scores inseridos manualmente: D: ${discScores.d}, I: ${discScores.i}, S: ${discScores.s}, C: ${discScores.c}`
								}
							</p>
						</div>
					)}

					{/* Botão de Ação Principal */}
					<div className="text-center pt-4">
						<button
							onClick={handleGenerateReport}
							disabled={loading}
							className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Gerando...
								</div>
							) : 'Gerar Relatório'}
						</button>

					</div>

					{/* Botão Dinâmico */}
					<div className="pt-4">
					{!dashboardData ? (
						<button
						onClick={handleGenerateReport}
						disabled={loading}
						className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-slate-400"
						>
						{loading ? 'Gerando Análise...' : 'Gerar Análise'}
						</button>
					) : (
						<button
						onClick={() => router.push('/dashboard')}
						className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-700 transition-colors"
						>
						Ir para o Dashboard
						</button>
					)}
					</div>

					{/* Alerta de Erro */}
					{error && (
						<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
							<p className="font-bold">Erro</p>
							<p>{error}</p>
						</div>
					)}

					{/* Área de Resultado */}
					{/* {report && (
						<div className="space-y-4 pt-4 border-t border-slate-200">
							<h2 className="text-2xl font-semibold text-slate-700">Relatório Gerado:</h2>
							<textarea
								value={report}
								readOnly
								className="w-full h-80 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 text-black"
							/>
							<PDFDownloadLink
								document={<ReportDocument text={report} />}
								fileName="relatorio_disc.pdf"
								className="inline-block bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
							>
								{({ loading: pdfLoading }) => (pdfLoading ? 'Preparando PDF...' : 'Baixar Relatório em PDF')}
							</PDFDownloadLink>
						</div>
					)} */}

					
				</div>
			</main>

			<ModalManualEntry
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleManualSubmit}
			/>
		</>
	);
};

// COMPONENTE SEPARADO PARA O MODAL (para manter o código organizado)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scores: DiscScores) => void;
}

const ModalManualEntry: FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [manualScores, setManualScores] = useState<DiscScores>({ d: 0, i: 0, s: 0, c: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualScores(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(manualScores);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                  Inserir Pontuação DISC
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Inputs para D, I, S, C */}
                  {['d', 'i', 's', 'c'].map((factor) => {
                    const labels: { [key: string]: string } = {
                        d: 'Dominância (D)',
                        i: 'Influência (I)',
                        s: 'Estabilidade (S)',
                        c: 'Conformidade (C)'
                    };
                    return (
                        <div key={factor}>
                          <label htmlFor={factor} className="block text-sm font-medium text-gray-700">{labels[factor]}</label>
                          <input
                            type="number"
                            name={factor}
                            id={factor}
                            value={manualScores[factor as keyof DiscScores]}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                            min="0"
                            max="100"
                            required
                          />
                        </div>
                    );
                  })}

                  <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button type="submit" className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                      Salvar Pontuação
                    </button>
                  </div>
                </form>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
  };

export default HomePage;