"use client"

import { useState, useEffect } from 'react'
import { Bell, Plus, Search, AlertCircle, CheckCircle, Clock, Trash2, Settings, RefreshCw, ChevronDown, ChevronUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useNotifications } from '@/hooks/useNotifications'
import { processarNumeroProcesso, gerarProcessoDemo } from '@/lib/processos'
import { ProcessoService, obterCorTipo, obterCorStatus, formatarTipoParte, obterCorParte } from '@/lib/processo-service'
import { Processo } from '@/lib/types'
import Configuracoes from '@/components/Configuracoes'

export default function ProcessMonitor() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [isClient, setIsClient] = useState(false)
  const [novoProcesso, setNovoProcesso] = useState('')
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [configAberto, setConfigAberto] = useState(false)
  const [erro, setErro] = useState('')
  const [verificandoProcessos, setVerificandoProcessos] = useState(false)
  const [atualizandoProcesso, setAtualizandoProcesso] = useState<string | null>(null)
  const [processosExpandidos, setProcessosExpandidos] = useState<Set<string>>(new Set())

  const { 
    isSupported, 
    permission, 
    requestPermission, 
    sendProcessAdded,
    sendProcessUpdate,
    sendSystemNotification 
  } = useNotifications()

  // Inicializar dados apenas no cliente para evitar hydration mismatch
  useEffect(() => {
    setIsClient(true)
    
    // Carregar processos salvos ou criar dados demo
    const processosSalvos = ProcessoService.carregarProcessos()
    
    if (processosSalvos.length === 0) {
      // Criar dados demo se não houver processos salvos
      const processoDemo1 = ProcessoService.criarProcesso({
        numero: '1234567-89.2023.8.26.0100',
        tribunal: 'TJSP'
      })
      
      const processoDemo2 = ProcessoService.criarProcesso({
        numero: '9876543-21.2023.4.03.6100',
        tribunal: 'TRF3'
      })
      
      const processosDemo = [processoDemo1, processoDemo2]
      setProcessos(processosDemo)
      ProcessoService.salvarProcessos(processosDemo)
    } else {
      setProcessos(processosSalvos)
    }
  }, [])

  // Salvar processos sempre que houver mudanças
  useEffect(() => {
    if (isClient && processos.length > 0) {
      ProcessoService.salvarProcessos(processos)
    }
  }, [processos, isClient])

  // Solicitar permissão para notificações ao carregar
  useEffect(() => {
    if (isSupported && notificacoesAtivas && permission === 'default') {
      requestPermission()
    }
  }, [isSupported, notificacoesAtivas, permission, requestPermission])

  // Simular verificação automática de processos
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      if (notificacoesAtivas && processos.length > 0) {
        // Simular atualização aleatória
        const processoAleatorio = processos[Math.floor(Math.random() * processos.length)]
        if (Math.random() > 0.95) { // 5% de chance de atualização
          sendProcessUpdate(processoAleatorio.numero, processoAleatorio.tribunal)
          
          // Atualizar o processo na lista
          setProcessos(prev => prev.map(p => 
            p.id === processoAleatorio.id 
              ? ProcessoService.adicionarAtualizacao(p)
              : p
          ))
        }
      }
    }, 30000) // Verificar a cada 30 segundos para demo

    return () => clearInterval(interval)
  }, [isClient, notificacoesAtivas, processos, sendProcessUpdate])

  const adicionarProcesso = () => {
    if (!novoProcesso.trim()) {
      setErro('Digite um número de processo válido')
      return
    }

    const resultado = processarNumeroProcesso(novoProcesso)
    
    if (!resultado.valido) {
      setErro(resultado.erro || 'Número de processo inválido')
      return
    }

    // Verificar se já existe
    if (ProcessoService.buscarPorNumero(processos, resultado.numeroFormatado)) {
      setErro('Este processo já está sendo monitorado')
      return
    }

    const novoProcessoObj = ProcessoService.criarProcesso({
      numero: resultado.numeroFormatado,
      tribunal: resultado.tribunal?.sigla || 'Desconhecido'
    })
    
    setProcessos([...processos, novoProcessoObj])
    setNovoProcesso('')
    setErro('')
    setDialogAberto(false)
    
    // Enviar notificação de sucesso
    if (notificacoesAtivas) {
      sendProcessAdded(resultado.numeroFormatado)
    }
  }

  const removerProcesso = (id: string) => {
    setProcessos(processos.filter(p => p.id !== id))
  }

  const toggleNotificacaoProcesso = (id: string) => {
    setProcessos(processos.map(p => 
      p.id === id ? ProcessoService.toggleNotificacoes(p) : p
    ))
  }

  const toggleProcessoExpandido = (id: string) => {
    const novosExpandidos = new Set(processosExpandidos)
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id)
    } else {
      novosExpandidos.add(id)
    }
    setProcessosExpandidos(novosExpandidos)
  }

  const atualizarProcesso = async (id: string) => {
    setAtualizandoProcesso(id)
    
    // Simular verificação individual
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Atualizar o processo específico
    setProcessos(prev => prev.map(p => 
      p.id === id ? ProcessoService.adicionarAtualizacao(p) : p
    ))
    
    setAtualizandoProcesso(null)
    
    const processo = processos.find(p => p.id === id)
    if (notificacoesAtivas && processo) {
      sendProcessUpdate(processo.numero, processo.tribunal)
    }
  }

  const verificarTodosProcessos = async () => {
    setVerificandoProcessos(true)
    
    // Simular verificação
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Atualizar todos os processos
    setProcessos(prev => prev.map(p => ProcessoService.adicionarAtualizacao(p)))
    
    setVerificandoProcessos(false)
    
    if (notificacoesAtivas) {
      sendSystemNotification(`Verificação concluída! ${processos.length} processos atualizados.`)
    }
  }

  const adicionarProcessoDemo = () => {
    const tribunais = ['TJSP', 'TRF3', 'STF', 'STJ']
    const tribunalAleatorio = tribunais[Math.floor(Math.random() * tribunais.length)]
    const numeroDemo = gerarProcessoDemo(tribunalAleatorio)
    setNovoProcesso(numeroDemo)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <CheckCircle className="w-4 h-4" />
      case 'arquivado': return <AlertCircle className="w-4 h-4" />
      case 'suspenso': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  // Obter estatísticas dos processos
  const estatisticas = ProcessoService.obterEstatisticas(processos)

  // Renderizar loading state até o cliente estar pronto
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Carregando Juris Push...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Organizado */}
        <div className="mb-8">
          {/* Título Principal */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Juris Push</h1>
              <p className="text-gray-600">Acompanhe atualizações dos seus processos judiciais em tempo real</p>
            </div>
          </div>

          {/* Barra de Ações */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={notificacoesAtivas}
                  onCheckedChange={setNotificacoesAtivas}
                />
                <Label className="text-sm font-medium text-gray-700">Notificações Ativas</Label>
              </div>
              
              <Button
                variant="outline"
                onClick={verificarTodosProcessos}
                disabled={verificandoProcessos}
                className="flex items-center gap-2 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${verificandoProcessos ? 'animate-spin' : ''}`} />
                Verificar Todos
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setConfigAberto(true)}
                className="p-2"
                title="Configurações"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Processo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Processo</DialogTitle>
                    <DialogDescription>
                      Digite o número do processo para começar o monitoramento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="numero">Número do Processo</Label>
                      <Input
                        id="numero"
                        placeholder="Ex: 1234567-89.2023.8.26.0100"
                        value={novoProcesso}
                        onChange={(e) => {
                          setNovoProcesso(e.target.value)
                          setErro('')
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && adicionarProcesso()}
                        className={erro ? 'border-red-500' : ''}
                      />
                      {erro && (
                        <p className="text-sm text-red-600 mt-1">{erro}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={adicionarProcesso} className="flex-1">
                        Adicionar Processo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={adicionarProcessoDemo}
                        className="text-xs"
                      >
                        Demo
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Status Cards - REDUZIDOS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Total de Processos</p>
                    <p className="text-lg font-bold text-gray-900">{estatisticas.total}</p>
                  </div>
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Ativos</p>
                    <p className="text-lg font-bold text-green-600">{estatisticas.ativos}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Com Notificações</p>
                    <p className="text-lg font-bold text-blue-600">{estatisticas.comNotificacoes}</p>
                  </div>
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Última Verificação</p>
                    <p className="text-xs font-bold text-gray-900">
                      {verificandoProcessos ? 'Verificando...' : 'Há 2 min'}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas de Status */}
          {notificacoesAtivas && permission === 'granted' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Notificações ativas! Você será alertado sobre qualquer atualização nos seus processos.
              </AlertDescription>
            </Alert>
          )}

          {notificacoesAtivas && permission === 'denied' && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Notificações bloqueadas pelo navegador. Clique no ícone de cadeado na barra de endereços para permitir.
              </AlertDescription>
            </Alert>
          )}

          {!isSupported && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Seu navegador não suporta notificações push. Use um navegador moderno para receber alertas.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Lista de Processos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Processos Monitorados</h2>
          
          {processos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum processo monitorado</h3>
                <p className="text-gray-600 mb-4">Adicione um processo para começar o monitoramento</p>
                <Button onClick={() => setDialogAberto(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Processo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {processos.map((processo) => (
                <Card key={processo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold text-gray-900 mb-1">
                          {processo.numero}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {processo.tribunal}
                          </Badge>
                          <Badge className={`text-xs text-white ${obterCorStatus(processo.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(processo.status)}
                              {processo.status.charAt(0).toUpperCase() + processo.status.slice(1)}
                            </span>
                          </Badge>
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNotificacaoProcesso(processo.id)}
                          className={processo.notificacoes ? 'text-blue-600' : 'text-gray-400'}
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerProcesso(processo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => atualizarProcesso(processo.id)}
                          disabled={atualizandoProcesso === processo.id}
                          className="text-blue-600 hover:text-blue-700 p-1 h-8 w-8"
                        >
                          <RefreshCw className={`w-3 h-3 ${atualizandoProcesso === processo.id ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Partes do Processo */}
                      <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-800">PARTES DO PROCESSO</span>
                        </div>
                        <div className="space-y-2">
                          {(processo.partes || []).map((parte, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{parte.nome}</p>
                                {parte.advogado && (
                                  <p className="text-xs text-gray-600">Adv: {parte.advogado}</p>
                                )}
                              </div>
                              <Badge className={`text-xs ${obterCorParte(parte.tipo)}`}>
                                {formatarTipoParte(parte.tipo)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Última atualização:</span>
                          <span className="font-medium">{processo.ultimaAtualizacao}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Notificações:</span>
                          <span className={`font-medium ${processo.notificacoes ? 'text-green-600' : 'text-gray-400'}`}>
                            {processo.notificacoes ? 'Ativas' : 'Desativadas'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Conteúdo da última atualização */}
                      <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">ÚLTIMA MOVIMENTAÇÃO</span>
                          <Badge className={`text-xs ${obterCorTipo((processo.historico && processo.historico[0]?.tipo) || 'movimentacao')}`}>
                            {((processo.historico && processo.historico[0]?.tipo) || 'movimentacao').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {processo.ultimoConteudo}
                        </p>
                      </div>
                      
                      {/* Histórico expandível */}
                      {processo.historico && processo.historico.length > 1 && (
                        <Collapsible 
                          open={processosExpandidos.has(processo.id)}
                          onOpenChange={() => toggleProcessoExpandido(processo.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
                              Ver histórico ({processo.historico.length - 1} anteriores)
                              {processosExpandidos.has(processo.id) ? 
                                <ChevronUp className="w-4 h-4" /> : 
                                <ChevronDown className="w-4 h-4" />
                              }
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-2 mt-2">
                            {processo.historico.slice(1, 4).map((atualizacao, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-300">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-500">{atualizacao.data}</span>
                                  <Badge className={`text-xs ${obterCorTipo(atualizacao.tipo)}`}>
                                    {atualizacao.tipo.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {atualizacao.conteudo}
                                </p>
                              </div>
                            ))}
                            {processo.historico.length > 4 && (
                              <p className="text-xs text-gray-500 text-center py-2">
                                + {processo.historico.length - 4} movimentações anteriores
                              </p>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Sistema de monitoramento automático • Verificações a cada 24 horas • Notificações em tempo real
          </p>
        </div>

        {/* Dialog de Configurações */}
        <Dialog open={configAberto} onOpenChange={setConfigAberto}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configurações do Sistema</DialogTitle>
              <DialogDescription>
                Personalize as configurações de monitoramento e notificações
              </DialogDescription>
            </DialogHeader>
            <Configuracoes onClose={() => setConfigAberto(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}