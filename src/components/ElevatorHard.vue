<template>
  <div class="about">
    <div class="settings">
      <h3>Settings</h3>
      <label for="floors">
        Number of floors:
        <input
          type="number"
          id="floors"
          :disabled="isAnyElevatorBusy"
          v-model.number="floorsCount"
          @input="changeFloorsCount"
        />
      </label>

      <label for="elevators">
        Number of elevators:
        <input
          type="number"
          id="elevators"
          :disabled="isAnyElevatorBusy"
          v-model.number="elevatorsCount"
          @change="callsQueue = []"
        />
      </label>
    </div>
    <div class="elevator-group">
      <ShaftItem
        v-for="elevator in elevatorsCount"
        :key="elevator"
        ref="elevatorsRefs"
        :floorHeight="floorHeight"
        :liftSpeed="liftSpeed"
      />
      <div class="floors-wrap">
        <div v-for="(floor, floorIndex) in floorsCount" class="floor" v-bind:key="floor">
          <button
            class="call-button"
            :class="{
              'call-button__next': nextFloorsList.includes(floorIndex),
              'call-button__in-queue': callsQueue.includes(floorIndex)
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
import ShaftItem from './ShaftItem.vue'

const liftSpeed = 1
const floorHeight = 100

const floorsCount = ref(5)
const floorHeightPx = computed(() => `${floorHeight * floorsCount.value}px`)

const elevatorsCount = ref(3)
const elevatorsRefs = ref<InstanceType<typeof ShaftItem>[]>([])

const callsQueue = ref<number[]>([])

const nextFloorsList = computed(() =>
  elevatorsRefs.value
    .map((elevator) => elevator.isMoving && elevator.position)
    .filter((position) => position)
)

const notBusyElevators = computed(() => elevatorsRefs.value.filter((elevator) => !elevator.isBusy))
const isAnyElevatorBusy = computed(() => elevatorsRefs.value.some((elevator) => elevator.isBusy))
const currenElevatorsPosition = computed(() =>
  elevatorsRefs.value.map((elevator) => elevator.position)
)

const addToQueue = (floor: number) => {
  if (!callsQueue.value.includes(floor) && !currenElevatorsPosition.value.includes(floor)) {
    callsQueue.value.push(floor)
  }
}

watch([() => callsQueue.value.length, notBusyElevators], () => {
  if (callsQueue.value.length && notBusyElevators.value.length > 0) {
    const targetFloor = callsQueue.value[0]

    const sortedElevators = notBusyElevators.value.sort(
      (a, b) => Math.abs(a.position - targetFloor) - Math.abs(b.position - targetFloor)
    )

    const elevator = sortedElevators[0]
    if (elevator) {
      elevator.moveToPosition(callsQueue.value[0])
      callsQueue.value.shift()
    }
  }
})

function changeFloorsCount() {
  elevatorsRefs.value.forEach((elevator) => {
    if (elevator.position >= floorsCount.value - 1) {
      elevator.position = floorsCount.value - 1
    }
    return elevator
  })
  callsQueue.value = []
}
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.elevator-group {
  display: flex;
  justify-content: center;
  align-items: center;
  height: v-bind(floorHeightPx);
}

.floors-wrap {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  height: v-bind(floorHeightPx);

  width: 100px;
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
