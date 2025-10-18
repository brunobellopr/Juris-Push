import { Processo, AtualizacaoProcesso, ProcessoInput, AtualizacaoInput, ParteProcesso } from './types'

// Simulador de partes do processo
export const gerarPartesDemo = (): ParteProcesso[] => {
  const nomes = [
    'João Silva Santos', 'Maria Oliveira Costa', 'Pedro Almeida Souza', 'Ana Carolina Lima',
    'Carlos Eduardo Ferreira', 'Juliana Rodrigues Pereira', 'Roberto Carlos Nascimento',
    'Fernanda Cristina Barbosa', 'Marcos Antonio Ribeiro', 'Patrícia Mendes Araújo',
    'Ricardo Henrique Gomes', 'Luciana Aparecida Martins', 'André Luiz Cardoso',
    'Camila Fernandes Silva', 'Bruno César Alves', 'Renata Cristiane Moura'
  ]
  
  const empresas = [
    'Banco do Brasil S.A.', 'Caixa Econômica Federal', 'Bradesco S.A.',
    'Itaú Unibanco S.A.', 'Santander Brasil S.A.', 'VIVO S.A.',
    'Claro S.A.', 'TIM S.A.', 'Magazine Luiza S.A.', 'Casas Bahia Comercial Ltda.',
    'Lojas Americanas S.A.', 'Via Varejo S.A.', 'Mercado Livre Brasil Ltda.',
    'Amazon Serviços de Varejo do Brasil Ltda.', 'Google Brasil Internet Ltda.',
    'Meta Plataformas de Tecnologia Ltda.'
  ]
  
  const advogados = [
    'Dr. José Carlos Advocacia', 'Dra. Maria Fernanda Jurídico',
    'Dr. Paulo Roberto Consultoria', 'Dra. Ana Beatriz Direito',
    'Dr. Ricardo Henrique Advocacia', 'Dra. Juliana Santos Jurídico',
    'Dr. Carlos Eduardo Direito', 'Dra. Patrícia Lima Advocacia'
  ]
  
  const partes: ParteProcesso[] = []
  
  // Sempre ter pelo menos um autor
  const nomeAutor = Math.random() > 0.3 ? 
    nomes[Math.floor(Math.random() * nomes.length)] : 
    empresas[Math.floor(Math.random() * empresas.length)]
  
  partes.push({
    nome: nomeAutor,
    tipo: 'autor',
    documento: nomeAutor.includes('S.A.') || nomeAutor.includes('Ltda.') ? 
      `${Math.floor(Math.random() * 90000000) + 10000000}/0001-${Math.floor(Math.random() * 90) + 10}` :
      `${Math.floor(Math.random() * 900000000) + 100000000}-${Math.floor(Math.random() * 90) + 10}`,
    advogado: advogados[Math.floor(Math.random() * advogados.length)]
  })
  
  // Sempre ter pelo menos um réu
  const nomeReu = Math.random() > 0.5 ? 
    empresas[Math.floor(Math.random() * empresas.length)] :
    nomes[Math.floor(Math.random() * nomes.length)]
  
  partes.push({
    nome: nomeReu,
    tipo: 'reu',
    documento: nomeReu.includes('S.A.') || nomeReu.includes('Ltda.') ? 
      `${Math.floor(Math.random() * 90000000) + 10000000}/0001-${Math.floor(Math.random() * 90) + 10}` :
      `${Math.floor(Math.random() * 900000000) + 100000000}-${Math.floor(Math.random() * 90) + 10}`,
    advogado: advogados[Math.floor(Math.random() * advogados.length)]
  })
  
  // Às vezes adicionar terceiros
  if (Math.random() > 0.7) {
    const nomeTerceiro = nomes[Math.floor(Math.random() * nomes.length)]
    partes.push({
      nome: nomeTerceiro,
      tipo: 'terceiro',
      documento: `${Math.floor(Math.random() * 900000000) + 100000000}-${Math.floor(Math.random() * 90) + 10}`,
      advogado: advogados[Math.floor(Math.random() * advogados.length)]
    })
  }
  
  return partes
}

// Simulador de conteúdos de atualização
export const gerarConteudoAtualizacao = (): AtualizacaoProcesso => {
  const tipos: Array<'movimentacao' | 'decisao' | 'despacho' | 'sentenca'> = ['movimentacao', 'decisao', 'despacho', 'sentenca']
  const tipo = tipos[Math.floor(Math.random() * tipos.length)]
  
  const conteudos = {
    movimentacao: [
      "Processo remetido ao Cartório para cumprimento de diligências.",
      "Juntada de petição de manifestação da parte autora.",
      "Processo concluso ao Magistrado para despacho.",
      "Designada audiência de conciliação para o dia 15/03/2024 às 14h00.",
      "Intimação expedida para comparecimento em audiência.",
      "Processo distribuído para análise do Ministério Público.",
      "Certidão de objeto e pé juntada aos autos.",
      "Processo remetido ao arquivo provisório.",
      "Juntada de comprovante de pagamento de custas.",
      "Processo concluso para sentença."
    ],
    decisao: [
      "Deferido pedido de tutela antecipada para suspensão da cobrança.",
      "Indeferido pedido de justiça gratuita por ausência de comprovação.",
      "Determinada a citação do réu por meio de oficial de justiça.",
      "Recebida contestação. Intimem-se as partes para especificação de provas.",
      "Processo saneado. Designada audiência de instrução e julgamento.",
      "Deferido pedido de produção de prova pericial.",
      "Indeferido pedido de antecipação dos efeitos da tutela.",
      "Determinada a emenda da petição inicial no prazo legal.",
      "Recebido recurso de apelação. Intimem-se as partes.",
      "Deferido pedido de assistência judiciária gratuita."
    ],
    despacho: [
      "Intime-se a parte autora para emendar a inicial no prazo de 15 dias.",
      "Determino a juntada dos documentos solicitados no prazo de 10 dias.",
      "Aguarde-se o cumprimento da diligência determinada.",
      "Certifique-se o decurso do prazo e venham os autos conclusos.",
      "Defiro o pedido de prazo adicional para manifestação.",
      "Determino a expedição de carta precatória para oitiva de testemunhas.",
      "Intime-se o perito para apresentação do laudo no prazo legal.",
      "Determino a citação por edital ante o não comparecimento do réu.",
      "Aguarde-se o recolhimento das custas processuais.",
      "Certifique-se a intimação e venham os autos conclusos."
    ],
    sentenca: [
      "JULGO PROCEDENTE o pedido inicial, condenando o réu ao pagamento de R$ 15.000,00.",
      "JULGO IMPROCEDENTE a ação, condenando o autor ao pagamento das custas processuais.",
      "JULGO PARCIALMENTE PROCEDENTE o pedido, fixando indenização em R$ 8.500,00.",
      "HOMOLOGO o acordo celebrado entre as partes, extinguindo o processo.",
      "DECLARO EXTINTO o processo sem resolução do mérito por abandono da causa.",
      "JULGO PROCEDENTE EM PARTE o pedido, condenando o réu ao pagamento de R$ 12.000,00.",
      "JULGO IMPROCEDENTE por ausência de provas suficientes.",
      "HOMOLOGO a desistência da ação, extinguindo o processo sem resolução do mérito.",
      "DECLARO a prescrição da pretensão, extinguindo o processo com resolução do mérito.",
      "JULGO PROCEDENTE o pedido de indenização por danos morais em R$ 20.000,00."
    ]
  }
  
  const conteudoArray = conteudos[tipo]
  const conteudo = conteudoArray[Math.floor(Math.random() * conteudoArray.length)]
  
  return {
    data: new Date().toLocaleString('pt-BR'),
    conteudo,
    tipo
  }
}

// Classe para gerenciar processos
export class ProcessoService {
  private static readonly STORAGE_KEY = 'processos_monitorados'

  // Salvar processos no localStorage
  static salvarProcessos(processos: Processo[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(processos))
    }
  }

  // Carregar processos do localStorage
  static carregarProcessos(): Processo[] {
    if (typeof window === 'undefined') return []
    
    try {
      const dados = localStorage.getItem(this.STORAGE_KEY)
      return dados ? JSON.parse(dados) : []
    } catch (error) {
      console.error('Erro ao carregar processos:', error)
      return []
    }
  }

  // Criar novo processo
  static criarProcesso(input: ProcessoInput): Processo {
    const atualizacaoInicial = gerarConteudoAtualizacao()
    const partesGeradas = input.partes || gerarPartesDemo()
    
    return {
      id: Date.now().toString(),
      numero: input.numero,
      tribunal: input.tribunal,
      status: input.status || 'ativo',
      ultimaAtualizacao: atualizacaoInicial.data,
      ultimoConteudo: atualizacaoInicial.conteudo,
      notificacoes: input.notificacoes ?? true,
      historico: [atualizacaoInicial],
      partes: partesGeradas,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Adicionar atualização a um processo
  static adicionarAtualizacao(processo: Processo, novaAtualizacao?: AtualizacaoProcesso): Processo {
    const atualizacao = novaAtualizacao || gerarConteudoAtualizacao()
    
    return {
      ...processo,
      ultimaAtualizacao: atualizacao.data,
      ultimoConteudo: atualizacao.conteudo,
      historico: [atualizacao, ...processo.historico],
      updatedAt: new Date().toISOString()
    }
  }

  // Atualizar status de notificações
  static toggleNotificacoes(processo: Processo): Processo {
    return {
      ...processo,
      notificacoes: !processo.notificacoes,
      updatedAt: new Date().toISOString()
    }
  }

  // Atualizar status do processo
  static atualizarStatus(processo: Processo, novoStatus: 'ativo' | 'arquivado' | 'suspenso'): Processo {
    return {
      ...processo,
      status: novoStatus,
      updatedAt: new Date().toISOString()
    }
  }

  // Buscar processo por número
  static buscarPorNumero(processos: Processo[], numero: string): Processo | undefined {
    return processos.find(p => p.numero === numero)
  }

  // Filtrar processos por status
  static filtrarPorStatus(processos: Processo[], status: 'ativo' | 'arquivado' | 'suspenso'): Processo[] {
    return processos.filter(p => p.status === status)
  }

  // Obter estatísticas dos processos
  static obterEstatisticas(processos: Processo[]) {
    return {
      total: processos.length,
      ativos: processos.filter(p => p.status === 'ativo').length,
      arquivados: processos.filter(p => p.status === 'arquivado').length,
      suspensos: processos.filter(p => p.status === 'suspenso').length,
      comNotificacoes: processos.filter(p => p.notificacoes).length,
      ultimaVerificacao: new Date().toLocaleString('pt-BR')
    }
  }

  // Exportar dados para backup
  static exportarDados(processos: Processo[]): string {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      version: '1.0',
      processos
    }, null, 2)
  }

  // Importar dados de backup
  static importarDados(dadosJson: string): Processo[] {
    try {
      const dados = JSON.parse(dadosJson)
      return dados.processos || []
    } catch (error) {
      console.error('Erro ao importar dados:', error)
      throw new Error('Formato de dados inválido')
    }
  }
}

// Utilitários para formatação
export const formatarTipoAtualizacao = (tipo: string): string => {
  const tipos = {
    movimentacao: 'Movimentação',
    decisao: 'Decisão',
    despacho: 'Despacho',
    sentenca: 'Sentença'
  }
  return tipos[tipo as keyof typeof tipos] || tipo
}

export const formatarTipoParte = (tipo: string): string => {
  const tipos = {
    autor: 'Autor',
    reu: 'Réu',
    terceiro: 'Terceiro',
    assistente: 'Assistente',
    opoente: 'Opoente'
  }
  return tipos[tipo as keyof typeof tipos] || tipo
}

export const obterCorTipo = (tipo: string): string => {
  const cores = {
    sentenca: 'bg-red-100 text-red-800',
    decisao: 'bg-blue-100 text-blue-800',
    despacho: 'bg-yellow-100 text-yellow-800',
    movimentacao: 'bg-green-100 text-green-800'
  }
  return cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800'
}

export const obterCorStatus = (status: string): string => {
  const cores = {
    ativo: 'bg-green-500',
    arquivado: 'bg-gray-500',
    suspenso: 'bg-yellow-500'
  }
  return cores[status as keyof typeof cores] || 'bg-blue-500'
}

export const obterCorParte = (tipo: string): string => {
  const cores = {
    autor: 'bg-blue-100 text-blue-800',
    reu: 'bg-red-100 text-red-800',
    terceiro: 'bg-purple-100 text-purple-800',
    assistente: 'bg-green-100 text-green-800',
    opoente: 'bg-orange-100 text-orange-800'
  }
  return cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800'
}