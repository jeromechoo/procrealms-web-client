<template>
  <div :class="getPlayerStatsClass()">
    <div class="name-row">
      <div class="bold-yellow">{{ player().name }}</div>
      <div class="bold-magenta">{{ player().class }}</div>
      <div><span style="color: #aaa">Level</span> <span class="bold-cyan">{{ player().level }}</span></div>
    </div>

    <hr v-if="isNaN(getTNL())" class="exp-row">
    <n-progress v-else class="exp-row" type="line" status="default" :percentage="getExpPercentage()">
      {{ getTNL() }} TNL
    </n-progress>

    <n-collapse>
      <CharacterCollapse
          :character="state.gameState.player"
          :equipment="state.gameState.equipment"
          :is-player="true"
      ></CharacterCollapse>
      <EffectsCollapse
          :affects="state.gameState.affects"
          :isPlayer="true"
      ></EffectsCollapse>
      <InventoryCollapse
          :character="state.gameState.player"
          :inventory="state.gameState.inventory"
          :isPlayer="true"
          :affects="state.gameState.affects"
      ></InventoryCollapse>
      <EquipmentCollapse
        :equipment="state.gameState.equipment"
        :character="state.gameState.player"
        :isPlayer="true"
        :affects="state.gameState.affects"
      ></EquipmentCollapse>
      <QuestCollapse></QuestCollapse>
      <SkillsCollapse
          :character="state.gameState.player"
          :skills="state.gameState.skills"
          :isPlayer="true"
      ></SkillsCollapse>
      <OptionsCollapse></OptionsCollapse>
    </n-collapse>
  </div>
</template>

<script setup>
import { NProgress, NCollapse } from 'naive-ui'
import CharacterCollapse from '@/components/side-menu/collapse-items/CharacterCollapse.vue'
import OptionsCollapse from '@/components/side-menu/collapse-items/OptionsCollapse.vue'
import QuestCollapse from '@/components/side-menu/collapse-items/QuestCollapse.vue'
import SkillsCollapse from '@/components/side-menu/collapse-items/SkillsCollapse.vue'
import EffectsCollapse from '@/components/side-menu/collapse-items/EffectsCollapse.vue'
import InventoryCollapse from '@/components/side-menu/collapse-items/InventoryCollapse.vue'
import EquipmentCollapse from '@/components/side-menu/collapse-items/EquipmentCollapse.vue'
import { state } from '@/composables/state'

function player () {
  return state.gameState.player || {}
}

function getTNL () {
  return player().xpForNextLevel - player().xp
}

function getExpPercentage () {
  return (player().xp - player().xpForCurrentLevel) / (player().xpForNextLevel - player().xpForCurrentLevel) * 100
}

function getPlayerStatsClass () {
  if (state.options.fixedMap) {
    return 'player-stats fixed-map'
  }
  return 'player-stats'
}

</script>

<style lang="less">
.spacer {
  width: 100%;
  height: 10px;
}

.player-stats {
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;

  &.fixed-map {
    overflow-y: scroll;
  }

  .name-row {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .exp-row {
    width: 100%;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid #333;
  }

  .stat-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    .stat {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .label {
        color: #aaa;
        width: 70px;
        text-align: right;
      }
      i {
        margin-left: 5px;
      }
      .white-label {
        width: 70px;
        color: #fff;
        text-align: right;
      }
      .value {
        margin-left: 5px;
        width: 52px;
      }
    }
  }

  .combat-row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .stat {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .label {
        color: #aaa;
        width: 45px;
        text-align: right;
      }
      .value {
        margin-left: 5px;
        width: 75px;
      }
    }
  }

}
</style>
