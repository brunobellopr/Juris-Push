"use client"

import { useState } from 'react'
import { Settings, Clock, Bell, Shield, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface ConfiguracoesProps {
  onClose: () => void
}

export default function Configuracoes({ onClose }: ConfiguracoesProps) {
  const [notificacoesPush, setNotificacoesPush] = useState(true)
  const [notificacoesEmail, setNotificacoesEmail] = useState(false)
  const [frequenciaVerificacao, setFrequenciaVerificacao] = useState([24])
  const [tribunaisSelecionados, setTribunaisSelecionados] = useState('todos')
  const [modoPrivacidade, setModoPrivacidade] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
      </div>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja receber alertas sobre atualizações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Notificações Push</Label>
              <p className="text-sm text-gray-600">Receba alertas instantâneos no navegador</p>
            </div>
            <Switch 
              checked={notificacoesPush}
              onCheckedChange={setNotificacoesPush}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Notificações por Email</Label>
              <p className="text-sm text-gray-600">Receba resumos diários por email</p>
            </div>
            <Switch 
              checked={notificacoesEmail}
              onCheckedChange={setNotificacoesEmail}
            />
          </div>
        </CardContent>
      </Card>

      {/* Monitoramento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Monitoramento
          </CardTitle>
          <CardDescription>
            Defina a frequência de verificação dos processos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Frequência de Verificação: {frequenciaVerificacao[0]} horas
            </Label>
            <Slider
              value={frequenciaVerificacao}
              onValueChange={setFrequenciaVerificacao}
              max={72}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>24h</span>
              <span>72h</span>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-2 block">Tribunais Monitorados</Label>
            <Select value={tribunaisSelecionados} onValueChange={setTribunaisSelecionados}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione os tribunais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tribunais</SelectItem>
                <SelectItem value="tjsp">TJSP - Tribunal de Justiça de SP</SelectItem>
                <SelectItem value="trf3">TRF3 - Tribunal Regional Federal</SelectItem>
                <SelectItem value="stf">STF - Supremo Tribunal Federal</SelectItem>
                <SelectItem value="stj">STJ - Superior Tribunal de Justiça</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacidade e Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacidade e Segurança
          </CardTitle>
          <CardDescription>
            Controle como seus dados são armazenados e processados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Modo Privacidade</Label>
              <p className="text-sm text-gray-600">Criptografia adicional para dados sensíveis</p>
            </div>
            <Switch 
              checked={modoPrivacidade}
              onCheckedChange={setModoPrivacidade}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Armazenamento Local</h4>
                <p className="text-sm text-blue-700">
                  Seus dados são armazenados localmente no navegador e nunca compartilhados com terceiros.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-3 pt-4">
        <Button onClick={onClose} className="flex-1">
          Salvar Configurações
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}