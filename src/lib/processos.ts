// Utilitários para validação e formatação de números de processos judiciais

export interface TribunalInfo {
  codigo: string
  nome: string
  sigla: string
  tipo: 'estadual' | 'federal' | 'superior' | 'eleitoral' | 'trabalhista'
}

// Mapeamento de códigos de tribunais
export const TRIBUNAIS: Record<string, TribunalInfo> = {
  '8.26': { codigo: '8.26', nome: 'Tribunal de Justiça de São Paulo', sigla: 'TJSP', tipo: 'estadual' },
  '4.03': { codigo: '4.03', nome: 'Tribunal Regional Federal da 3ª Região', sigla: 'TRF3', tipo: 'federal' },
  '1.00': { codigo: '1.00', nome: 'Supremo Tribunal Federal', sigla: 'STF', tipo: 'superior' },
  '3.00': { codigo: '3.00', nome: 'Superior Tribunal de Justiça', sigla: 'STJ', tipo: 'superior' },
  '2.00': { codigo: '2.00', nome: 'Tribunal Superior Eleitoral', sigla: 'TSE', tipo: 'eleitoral' },
  '5.00': { codigo: '5.00', nome: 'Tribunal Superior do Trabalho', sigla: 'TST', tipo: 'trabalhista' },
  '8.19': { codigo: '8.19', nome: 'Tribunal de Justiça do Paraná', sigla: 'TJPR', tipo: 'estadual' },
  '8.02': { codigo: '8.02', nome: 'Tribunal de Justiça de Alagoas', sigla: 'TJAL', tipo: 'estadual' },
  '8.06': { codigo: '8.06', nome: 'Tribunal de Justiça do Ceará', sigla: 'TJCE', tipo: 'estadual' },
  '8.21': { codigo: '8.21', nome: 'Tribunal de Justiça do Rio Grande do Sul', sigla: 'TJRS', tipo: 'estadual' },
  '8.07': { codigo: '8.07', nome: 'Tribunal de Justiça do Distrito Federal', sigla: 'TJDFT', tipo: 'estadual' },
}

/**
 * Valida se um número de processo está no formato correto
 * Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
 */
export function validarNumeroProcesso(numero: string): boolean {
  // Remove espaços e caracteres especiais desnecessários
  const numeroLimpo = numero.replace(/\s/g, '')
  
  // Regex para validar formato CNJ
  const regexCNJ = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/
  
  return regexCNJ.test(numeroLimpo)
}

/**
 * Formata um número de processo para o padrão CNJ
 */
export function formatarNumeroProcesso(numero: string): string {
  // Remove todos os caracteres não numéricos
  const apenasNumeros = numero.replace(/\D/g, '')
  
  // Se não tem 20 dígitos, retorna como está
  if (apenasNumeros.length !== 20) {
    return numero
  }
  
  // Aplica a formatação CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
  return `${apenasNumeros.slice(0, 7)}-${apenasNumeros.slice(7, 9)}.${apenasNumeros.slice(9, 13)}.${apenasNumeros.slice(13, 14)}.${apenasNumeros.slice(14, 16)}.${apenasNumeros.slice(16, 20)}`
}

/**
 * Extrai informações do tribunal a partir do número do processo
 */
export function extrairTribunal(numero: string): TribunalInfo | null {
  const numeroLimpo = numero.replace(/\D/g, '')
  
  if (numeroLimpo.length !== 20) {
    return null
  }
  
  // Extrai o código do tribunal (posições 13-14 e 14-16)
  const segmento = numeroLimpo.slice(13, 14)
  const tribunal = numeroLimpo.slice(14, 16)
  const codigoTribunal = `${segmento}.${tribunal}`
  
  return TRIBUNAIS[codigoTribunal] || null
}

/**
 * Detecta o tribunal baseado no número do processo (versão simplificada)
 */
export function detectarTribunal(numero: string): string {
  const tribunalInfo = extrairTribunal(numero)
  return tribunalInfo ? tribunalInfo.sigla : 'Tribunal não identificado'
}

/**
 * Valida e formata um número de processo
 */
export function processarNumeroProcesso(numero: string): {
  valido: boolean
  numeroFormatado: string
  tribunal: TribunalInfo | null
  erro?: string
} {
  const numeroLimpo = numero.replace(/\s/g, '')
  
  if (!numeroLimpo) {
    return {
      valido: false,
      numeroFormatado: numero,
      tribunal: null,
      erro: 'Número do processo é obrigatório'
    }
  }
  
  const numeroFormatado = formatarNumeroProcesso(numeroLimpo)
  const valido = validarNumeroProcesso(numeroFormatado)
  
  if (!valido) {
    return {
      valido: false,
      numeroFormatado: numero,
      tribunal: null,
      erro: 'Formato inválido. Use o padrão CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO'
    }
  }
  
  const tribunal = extrairTribunal(numeroFormatado)
  
  return {
    valido: true,
    numeroFormatado,
    tribunal,
    erro: tribunal ? undefined : 'Tribunal não reconhecido'
  }
}

/**
 * Gera um número de processo fictício para demonstração
 */
export function gerarProcessoDemo(tribunal: string = 'TJSP'): string {
  const tribunalCodes: Record<string, string> = {
    'TJSP': '8.26',
    'TRF3': '4.03',
    'STF': '1.00',
    'STJ': '3.00'
  }
  
  const codigo = tribunalCodes[tribunal] || '8.26'
  const [segmento, tribunalCode] = codigo.split('.')
  
  // Gera números aleatórios para as outras partes
  const sequencial = Math.floor(Math.random() * 9999999).toString().padStart(7, '0')
  const dv = Math.floor(Math.random() * 99).toString().padStart(2, '0')
  const ano = new Date().getFullYear()
  const origem = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  
  return `${sequencial}-${dv}.${ano}.${segmento}.${tribunalCode}.${origem}`
}