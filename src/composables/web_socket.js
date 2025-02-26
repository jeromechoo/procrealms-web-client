import { addLine, state } from './state'
import { loadSettingsByNameAndType } from "@/composables/triggers"
import { useCookieHandler } from "@/composables/cookie_handler"

const { readTokensFromCookie } = useCookieHandler()

let ws

export function useWebSocket () {
  function initConnection ({ onConnect, onClose, onEvent, url }) {
    try {
      ws = new window.WebSocket(url)

      ws.onopen = onConnect
      ws.onclose = onClose
      ws.onmessage = ({ data }) => _onMessage(data, onEvent)
    } catch (err) {
      console.log(err.stack)
    }

    const _onMessage = (json, onEvent) => {
      try {
        let { cmd, msg, id } = JSON.parse(json)
        if (id) {
          state.cache.commandCache[id] = msg
        }
        if (process.env.NODE_ENV != 'production') {
          console.log(`%c<%c ${cmd} %c${msg ? JSON.stringify(msg) : ''} ${id ? ` (id=${id})` : ''}`, 'background-color: #226622; color: #fff', 'color: #33ff33', 'color: #ccffcc')
        }

        id ? onEvent(cmd, msg, id) : onEvent(cmd, msg)
      } catch (err) {
        console.log('error parsing message: %s', json)
        console.log(err.stack)
      }
    }
  }

  function doTokenAuth (name) {
    loadSettingsByNameAndType(state.triggers, name, 'triggers')
    loadSettingsByNameAndType(state.variables, name, 'variables')
    let token = readTokensFromCookie()[name]
    send('token', { name, token, width: 70, height: 24, ttype: 'play.proceduralrealms.com' })
  }

  function send (cmd, msg, id = false) {
    if (process.env.NODE_ENV != 'production') {
      console.log(`%c>%c ${cmd} %c${msg ? JSON.stringify(msg) : ''} ${id ? ` (id=${id})` : ''}`, 'background-color: #662222; color: #fff', 'color: #ff3333', 'color: #ffcccc')
    }
    let out = { cmd, msg }
    if (id) {
      out.id = id
    }
    ws.send(JSON.stringify(out))
  }

  function cmd (command, id, fromTrigger) {
    if (!id) {
      // Crude filter to avoid shouting the ugly 'look iid:123456' in the output
      const lcCmd = command.toLowerCase()
      const excludeIIDCommand = (lcCmd.includes('iid:') || lcCmd.includes('eid:')) && !lcCmd.includes('chat ') && !lcCmd.includes('say ')
          && !lcCmd.includes('trade ') && !lcCmd.includes('newbie ')
      if (!excludeIIDCommand) {
        if (fromTrigger) {
          addLine(`<span class="player-cmd-caret">> ${command}</span>`, 'output')
        } else {
          addLine('', 'output')
          addLine(`<span class="player-cmd-caret">></span> <span class="player-cmd">${command}</span>`, 'output')
          addLine('', 'output')
        }
      }
    }
    send('cmd', command, id)
  }

  function fetchEntity (eid, skipCache) {
    if (state.cache.entityCache[eid] && !skipCache) {
      return new Promise((resolve) => resolve(state.cache.entityCache[eid].entity))
    }

    const requestId = `entity-${eid}`
    const pendingRequest = state.pendingRequests[requestId]
    if (pendingRequest) {
      return pendingRequest.promise
    }

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Request for entity-${eid} timed out after 5 seconds`)), 5000)
      state.pendingRequests[requestId] = { resolve, reject, timeout }
    })

    state.pendingRequests[requestId].promise = promise

    send('entity', { eid })
    return promise
  }

  function fetchEntities (eids) {
    let fetchEids = eids.filter(eid => !state.cache.entityCache[eid])
    if (!fetchEids.length) {
      return new Promise((resolve) => {
        let entities = []
        for (let eid of eids) {
          entities.push(state.cache.entityCache[eid].entity)
        }
        resolve(entities)
      })
    }

    let id = Math.round(Math.random() * 1000000)
    while (state.pendingRequests[`entities-${id}`]) {
      id = Math.round(Math.random() * 1000000)
    }
    let requestId = `entities-${id}`

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Request for ${requestId} timed out after 5 seconds`)), 5000)
      state.pendingRequests[requestId] = { resolve, reject, timeout, eids }
    })

    state.pendingRequests[requestId].promise = promise

    send('entities', { eids: fetchEids, id })
    return promise
  }

  function fetchItem (iid)  {
    if (state.cache.itemCache[iid]) {
      return new Promise((resolve) => resolve(state.cache.itemCache[iid].item))
    }

    const requestId = `item-${iid}`
    const pendingRequest = state.pendingRequests[requestId]
    if (pendingRequest) {
      return pendingRequest.promise
    }

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Request for item-${iid} timed out after 5 seconds`)), 5000)
      state.pendingRequests[requestId] = { resolve, reject, timeout }
    })

    state.pendingRequests[requestId].promise = promise

    send('item', { iid })
    return promise
  }

  function fetchItems (iids) {
    let fetchIids = iids.filter(iid => !state.cache.itemCache[iid])
    if (!fetchIids.length) {
      return new Promise((resolve) => {
        let items = []
        for (let iid of iids) {
          items.push(state.cache.itemCache[iid].item)
        }
        resolve(items)
      })
    }

    let id = Math.round(Math.random() * 1000000)
    while (state.pendingRequests[`items-${id}`]) {
      id = Math.round(Math.random() * 1000000)
    }
    let requestId = `items-${id}`

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Request for ${requestId} timed out after 5 seconds`)), 5000)
      state.pendingRequests[requestId] = { resolve, reject, timeout, iids }
    })

    state.pendingRequests[requestId].promise = promise

    send('items', { iids: fetchIids, id })
    return promise
  }

  return {
    initConnection, doTokenAuth, send, cmd, fetchEntity, fetchEntities, fetchItem, fetchItems
  }
}
