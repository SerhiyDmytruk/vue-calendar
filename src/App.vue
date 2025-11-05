<script setup>
import { ref } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const events = ref([
  {
    id: 1,
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    title: 'Doctor Appointment',
    content: 'General check-up',
    class: 'health'
  },
  {
    id: 2,
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    title: 'Team Meeting',
    content: 'Discuss project goals',
    class: 'work'
  }
])

const showDialog = ref(false)
const selectedEvent = ref(null)
const editEvent = ref({})

function openDialog({ event }) {
  selectedEvent.value = event
  // clone to edit safely
  editEvent.value = { ...event }
  showDialog.value = true
}

function saveChanges() {
  const idx = events.value.findIndex(e => e.id === selectedEvent.value.id)
  if (idx !== -1) {
    events.value[idx] = { ...editEvent.value }
  }
  showDialog.value = false
}
</script>

<template>
  <vue-cal
    class="vuecal--blue-theme"
    :events="events"
    editable-events
    @event-click="openDialog"
  ></vue-cal>

  <!-- simple edit dialog -->
  <div v-if="showDialog" class="dialog">
    <div class="dialog-content">
      <h3>Edit event</h3>

      <label>
        Title:
        <input v-model="editEvent.title" />
      </label>

      <label>
        Content:
        <textarea v-model="editEvent.content"></textarea>
      </label>

      <label>
        Start:
        <input
          type="datetime-local"
          v-model="editEvent.startString"
          @change="editEvent.start = new Date(editEvent.startString)"
        />
      </label>

      <label>
        End:
        <input
          type="datetime-local"
          v-model="editEvent.endString"
          @change="editEvent.end = new Date(editEvent.endString)"
        />
      </label>

      <div class="actions">
        <button @click="saveChanges">💾 Save</button>
        <button @click="showDialog = false">✖ Close</button>
      </div>
    </div>
  </div>
</template>

<style>
.vuecal {
  height: 90vh;
}

.dialog {
  position: fixed;
  inset: 0;
  background: #0005;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.dialog-content {
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.dialog-content input,
.dialog-content textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}
</style>
