<template>
  <div class="shaft">
    <div class="elevator" :class="{ elevator__blink: isBlinking }">
      <div v-if="isMoving" class="elevator_display">
        <i :class="`fa fa-arrow-${moveDirection}`" />
        <p>{{ liftPosition + 1 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { floorHeight, liftSpeed } = defineProps<{
  floorHeight: number
  liftSpeed: number
}>()

const liftPosition = ref(0)

const liftHeightPx = computed(() => `${liftPosition.value * floorHeight}px`)

const liftMoveTime = ref(0)
const liftMoveTimeS = computed(() => `${liftMoveTime.value}s`)

const isBusy = computed(() => isMoving.value || isBlinking.value)
const isMoving = computed(() => liftMoveTime.value > 0)
const isBlinking = ref(false)

const moveDirection = ref<'up' | 'down'>('up')

function moveToPosition(position: number) {
  const newTime = Math.abs(position - liftPosition.value) * liftSpeed
  moveDirection.value = position > liftPosition.value ? 'up' : 'down'
  liftPosition.value = position
  liftMoveTime.value = newTime

  setTimeout(onPositionReached, newTime * 1000)
}

function onPositionReached() {
  isBlinking.value = true
  liftMoveTime.value = 0

  setTimeout(() => {
    isBlinking.value = false
  }, 3000)
}

defineExpose({
  moveToPosition,
  position: liftPosition,
  isBusy,
  isMoving
})
</script>

<style lang="scss" scoped>
.shaft {
  margin: 0px 10px;
  position: relative;
  width: 124px;
  height: 100%;
  background-color: rgba(182, 182, 182, 0.4);
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
</style>
