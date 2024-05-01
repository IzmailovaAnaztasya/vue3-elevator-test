<template>
  <div class="about">
    <div>
      <h2>Elevator Emulator</h2>
      <p>Lift position index: {{ liftPosition }}</p>
      <p>Queue index: {{ liftQueue }}</p>
    </div>
    <div class="settings">
      <h3>Settings</h3>
      <label for="floors">
        Number of floors:
        <input
          type="number"
          id="floors"
          v-model.number="floorsCount"
          :disabled="isBusy"
          @input="changeFloorsCount"
        />
      </label>
    </div>
    <div class="elevator-group">
      <div class="shaft">
        <div class="elevator" :class="{ elevator__blink: isBlinking }">
          <div v-if="isMoving" class="elevator_display">
            <i :class="`fa fa-arrow-${moveDirection}`" />
            <p>{{ liftPosition + 1 }}</p>
          </div>
        </div>
      </div>
      <div class="floors-wrap">
        <div v-for="(floor, floorIndex) in floorsCount" class="floor" v-bind:key="floor">
          <button
            class="call-button"
            :class="{
              'call-button__next': isMoving && liftPosition === floorIndex,
              'call-button__in-queue': liftPosition !== floorIndex && liftQueue.includes(floorIndex)
            }"
            @click="addToQueue(floorIndex)"
          >
            {{ floor }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const floorHeight = 100
const floorHeightPx = computed(() => `${floorHeight * floorsCount.value}px`)
const floorsCount = ref(5)

const liftQueue = ref<number[]>([])
const liftSpeed = 1

const liftPosition = ref(0)
const liftHeightPx = computed(() => `${liftPosition.value * floorHeight}px`)

const liftMoveTime = ref(0)
const liftMoveTimeS = computed(() => `${liftMoveTime.value}s`)

const isBusy = computed(() => isMoving.value || isBlinking.value)
const isMoving = computed(() => liftMoveTime.value > 0)
const isBlinking = ref(false)

const moveDirection = ref<'up' | 'down'>('up')

const addToQueue = (floor: number) => {
  if (!liftQueue.value.includes(floor) && floor !== liftPosition.value) {
    liftQueue.value.push(floor)
  }
}

watch([() => liftQueue.value.length, isBusy], () => {
  if (liftQueue.value.length && isBusy.value === false) {
    moveToPosition(liftQueue.value[0])
  }
})

function moveToPosition(position: number) {
  const newTime = Math.abs(position - liftPosition.value) * liftSpeed
  moveDirection.value = position > liftPosition.value ? 'up' : 'down'
  liftMoveTime.value = newTime
  liftPosition.value = position

  setTimeout(onPositionReached, newTime * 1000)
}

function onPositionReached() {
  liftQueue.value.shift()
  isBlinking.value = true
  liftMoveTime.value = 0

  setTimeout(() => {
    isBlinking.value = false
  }, 3000)
}

function changeFloorsCount() {
  if (liftPosition.value >= floorsCount.value - 1) {
    liftPosition.value = floorsCount.value - 1
  }
  liftQueue.value = []
}
</script>

<style lang="scss" scoped>
.settings {
  margin-bottom: 20px;
}

.elevator-group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.shaft {
  position: relative;
  width: 124px;
  height: v-bind(floorHeightPx);
  background-color: #b6b6b666;
  border-left: black 2px solid;
  border-right: black 2px solid;
}

.elevator {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #15d0d6;
  bottom: v-bind(liftHeightPx);
  left: 10px;
  border: #0d9297 1.5px solid;

  transition: all v-bind(liftMoveTimeS) ease-in-out;

  &__blink {
    animation: blinker 1s linear infinite;
  }

  @keyframes blinker {
    50% {
      background-color: #21c7ed;
      box-shadow: 0 0 15px #21c7ed;
    }
  }
}

.floors-wrap {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  height: v-bind(floorHeightPx);

  width: 100px;
  margin-left: 10px;
}

.floor {
  border-bottom: black 2px solid;

  display: flex;
  justify-content: center;
  align-items: center;
  height: v-bind(floorHeightPx);
}

.call-button {
  &__next {
    background-color: rgba(0, 128, 0, 0.5);
  }

  &__in-queue {
    background-color: rgba(225, 225, 0, 0.5);
  }
}
</style>
