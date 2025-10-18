export interface AtualizacaoProcesso {
  id?: string
  data: string
  conteudo: string
  tipo: 'movimentacao' | 'decisao' | 'despacho' | 'sentenca'
  processoId?: string
}

export interface ParteProcesso {
  nome: string
  tipo: 'autor' | 'reu' | 'terceiro' | 'assistente' | 'opoente'
  documento?: string
  advogado?: string
}

export interface Processo {
  id: string
  numero: string
  tribunal: string
  status: 'ativo' | 'arquivado' | 'suspenso'
  ultimaAtualizacao: string
  ultimoConteudo: string
  notificacoes: boolean
  historico: AtualizacaoProcesso[]
  partes: ParteProcesso[]
  createdAt?: string
  updatedAt?: string
}

export interface ProcessoInput {
  numero: string
  tribunal: string
  status?: 'ativo' | 'arquivado' | 'suspenso'
  notificacoes?: boolean
  partes?: ParteProcesso[]
}

export interface AtualizacaoInput {
  processoId: string
  conteudo: string
  tipo: 'movimentacao' | 'decisao' | 'despacho' | 'sentenca'
}

export interface NotificationSettings {
  enabled: boolean
  email?: boolean
  push?: boolean
  frequency?: 'immediate' | 'daily' | 'weekly'
}