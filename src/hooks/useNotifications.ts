"use client"

import { useState, useEffect, useCallback } from 'react'

interface NotificationOptions {
  title: string
  body: string
  icon?: string
  tag?: string
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error)
      return false
    }
  }, [isSupported])

  const sendNotification = useCallback((options: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Notificações não são suportadas ou não foram autorizadas')
      return null
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon.svg',
        tag: options.tag,
        requireInteraction: true,
        silent: false
      })

      // Auto-fechar após 5 segundos
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      return null
    }
  }, [isSupported, permission])

  const sendProcessUpdate = useCallback((numeroProcesso: string, tribunal: string) => {
    return sendNotification({
      title: 'Atualização de Processo',
      body: `O processo ${numeroProcesso} (${tribunal}) teve uma nova movimentação`,
      tag: `processo-${numeroProcesso}`
    })
  }, [sendNotification])

  const sendProcessAdded = useCallback((numeroProcesso: string) => {
    return sendNotification({
      title: 'Processo Adicionado',
      body: `O processo ${numeroProcesso} está sendo monitorado`,
      tag: `added-${numeroProcesso}`
    })
  }, [sendNotification])

  const sendSystemNotification = useCallback((message: string) => {
    return sendNotification({
      title: 'Monitor de Processos',
      body: message,
      tag: 'system'
    })
  }, [sendNotification])

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    sendProcessUpdate,
    sendProcessAdded,
    sendSystemNotification
  }
}