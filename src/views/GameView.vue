<template>
  <LogoutModal></LogoutModal>

  <HelpOverlay></HelpOverlay>

  <n-layout has-sider
    v-if="state.token && state.connected && !state.disconnected" class="game" 
    :sider-placement="state.options.swapControls ? 'right' : 'left'">
    <SideMenu v-if="!state.options.swapControls"></SideMenu>
    <n-layout>
      <MapModal></MapModal>
      <MercModal></MercModal>
      <TriggersModal></TriggersModal>
      <div class="content-area">
        <LineOutput></LineOutput>
      </div>
      <MobileMovement v-if="state.options.showMobileMovement"></MobileMovement>
      <QuickSlots v-if="state.options.showQuickSlots"></QuickSlots>
      <KeyboardInput></KeyboardInput>
    </n-layout>
    <SideMenu v-if="state.options.swapControls"></SideMenu>
  </n-layout>
</template>

<script setup>
import { state } from '@/composables/state'
import { NLayout } from 'naive-ui'

import LineOutput from '@/components/main-area/LineOutput.vue'
import KeyboardInput from '@/components/main-area/KeyboardInput.vue'
import LogoutModal from '@/components/modals/LogoutModal.vue'
import HelpOverlay from '@/components/HelpOverlay.vue'
import MapModal from '@/components/modals/MapModal'
import MercModal from '@/components/modals/MercModal'
import MobileMovement from '@/components/main-area/MobileMovement.vue'
import QuickSlots from '@/components/main-area/QuickSlots.vue'
import SideMenu from '@/components/side-menu/SideMenu'
import TriggersModal from "@/components/modals/TriggersModal.vue";

</script>

<style lang="less">
.game {
  background-color: #181818;
  height: 100vh;
  .stats-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .bottom-area {
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }
    .map-area {
      align-items: center;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;

      .map-icon {
        font-size: 1.9rem;
        text-align: left;
        cursor: pointer;
      }
    }
  }

  .content-area {
    flex-basis: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    min-height: 0;
  }
}

.n-layout {
  z-index: 1;
}

.n-layout-sider {
  z-index: 2;
}

</style>
