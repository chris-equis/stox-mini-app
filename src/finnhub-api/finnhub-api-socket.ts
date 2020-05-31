import { Subject } from 'rxjs'
import { stringify } from 'query-string'

import { FinnhubWebSocketMessageEventData } from './finnhub-api-types'

export const token = process.env.REACT_APP_FINNHUB_TOKEN
export const wsBaseUrl = 'wss://ws.finnhub.io'

let socket: WebSocket

const createSocketConnection = (): WebSocket => {
  const queryParams = stringify({ token })
  return new WebSocket(`${wsBaseUrl}?${queryParams}`)
}

export const subscribe = (symbol: string): [Subject<number>, () => void] => {
  if (!socket) {
    socket = createSocketConnection()
  }

  const subject = new Subject<number>()

  const messageHandler = (event: MessageEvent): void => {
    try {
      const { type, data }: FinnhubWebSocketMessageEventData = JSON.parse(event?.data)
      if (type === 'error') return

      const [{ s: messagedSymbol, p: messagedPrice }] = data ?? []

      if (type === 'trade' && symbol === messagedSymbol) {
        subject.next(messagedPrice)
      }
    } catch (error) {}
  }

  const sendSubscription = (): void => {
    socket.send(JSON.stringify({ type: 'subscribe', symbol }))
    socket.addEventListener('message', messageHandler)
  }

  switch (socket.readyState) {
    case socket.OPEN:
      sendSubscription()
      break
    case socket.CONNECTING:
      socket.addEventListener('open', sendSubscription)
      break
  }

  const closeSubject = (): void => {
    subject.complete()
    subject.unsubscribe()
    socket.removeEventListener('message', messageHandler)
    socket.removeEventListener('open', sendSubscription)
  }

  return [subject, closeSubject]
}
