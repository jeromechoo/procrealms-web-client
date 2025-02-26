<template>
  <n-card title="Map" size="small" :class="[rightClass, geMapModalSizeClass()]" v-if="state.modals.mapModal" content-style="display: flex; flex-wrap: wrap; justify-content: center; align-content:center; overflow:hidden;" closable @close="closeModal()">
    <template #header-extra>
      <n-button text @click="toggleMapModalSize()">
        <n-icon size="15"><WindowOutlined></WindowOutlined></n-icon>
      </n-button>
    </template>
    <div class="ansi" v-for="(line, id) in largeMap" :key="id" v-html-safe="ansiToHtml(line)"></div>
  </n-card>
</template>

<script setup>
import { NCard, NButton, NIcon } from 'naive-ui'
import { ref, watch, onMounted } from 'vue'
import { helpers } from '@/composables/helpers'
import { state } from '@/composables/state'
import { command_ids } from '@/composables/constants/command_ids'
import { useWebSocket } from '@/composables/web_socket'
import { useKeyHandler } from '@/composables/key_handler'
import WindowOutlined from '@vicons/material/WindowOutlined'

const { cmd } = useWebSocket()
const { onKeydown, keyState } = useKeyHandler()
const { ansiToHtml } = helpers()

const MAP_ID = command_ids.MAP
const largeMap = ref([])
const rightClass = ref('right')

watch(() => state.cache.commandCache[MAP_ID], () => {
  if (state.modals.mapModal) {
    largeMap.value = state.cache.commandCache[MAP_ID].split('\n')
  }
})

watch(() => state.modals.mapModal, () => {
  if (state.modals.mapModal) {
    cmd('map', MAP_ID)
  }
})

watch(() => state.cache.commandCache[MAP_ID], () => {
  largeMap.value = state.cache.commandCache[MAP_ID].split('\n')
})

watch(() => state.gameState.map, () => {
  if (state.modals.mapModal) {
    cmd('map', MAP_ID)
  }
})

watch(() => [state.modals.mercModal, state.options.swapControls, state.modals.mapModalSize], () => {
	if (state.modals.mercModal && !state.options.swapControls && state.modals.mapModalSize !== 'large') {
      rightClass.value = 'right-offset'
    } else {
		rightClass.value = 'right'
    }
})

function toggleMapModalSize() {
  if (state.modals.mapModalSize == "small") {
    state.modals.mapModalSize = "medium"
  }
  else if (state.modals.mapModalSize == "medium") {
    state.modals.mapModalSize = "large"
  }
  else {
    state.modals.mapModalSize = "small"
  }

  state.options.mapModalSize = state.modals.mapModalSize
  localStorage.setItem('options', JSON.stringify(state.options))
}

function geMapModalSizeClass() {
  return "map-" + state.modals.mapModalSize
}

// function getSideClass() {
//   return state.options.swapControls ? 'map-modal right' : 'map-modal left'
// }

function closeModal() {
  state.modals.mapModal = false
}

onKeydown((ev) => {
  if (keyState.alt || keyState.ctrl) {
    return false
  }

  if (state.modals.triggersModal) {
    return false
  }

  if (state.mode === 'input') {
    return false
  }

  if (ev.code === 'KeyM') {
    state.modals.mapModal = !state.modals.mapModal
    return true
  }
})

onMounted(() => {
  if (state.modals.mapModal) {
    cmd('map', MAP_ID)
  }
})
</script>

<style scoped lang="less">
.ansi {
  white-space: pre;
  font-size: 1rem;
  line-height: 0.9rem;
}

.right {
  right: 10px;
}

.right-offset {
  right: 410px;
}

.n-card {
  position: absolute;
  margin-top: 35px;
  max-width: calc(100vw - 290px);
  z-index: 2;
}

.n-card.map-small {
  width: 400px;
  height: 400px;
}

.n-card.map-medium {
  width: 600px;
}

.close {
  position: absolute;
  top: -10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.4em;
}
</style>
