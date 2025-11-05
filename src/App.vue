<script setup>
import { ref } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

const events = ref([])
const showDialog = ref(false)
const editEvent = ref({})

function openAddDialog(payload) {
  const date = payload?.date instanceof Date ? payload.date : new Date()

  editEvent.value = {
    title: '',
    content: '',
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000),
    color: '#3498db'
  }
  showDialog.value = true
}

function openDialog({ event }) {
  editEvent.value = { ...event, __source: event }
  showDialog.value = true
}

function saveChanges() {
  const eventData = {
    ...editEvent.value,
    start: new Date(editEvent.value.start),
    end: new Date(editEvent.value.end)
  }

  if (eventData.id) {
    // якщо є посилання на оригінал
    if (eventData.__source) {
      Object.assign(eventData.__source, eventData)
    }

    const idx = events.value.findIndex(e => e.id === eventData.id)
    if (idx !== -1) events.value.splice(idx, 1, eventData)
  } else {
    eventData.id = Date.now()
    events.value.push(eventData)
  }

  showDialog.value = false
}

function deleteEvent() {
  events.value = events.value.filter(e => e.id !== editEvent.value.id)
  showDialog.value = false
}

function formatDateInput(date) {
  if (!date) return ''
  const iso = new Date(date).toISOString()
  return iso.slice(0, 16) // YYYY-MM-DDTHH:mm
}
</script>


<template>
  <div id="app">
    <vue-cal
      class="vuecal--blue-theme"
      :events="events"
      @event-dblclick="openDialog"
      @cell-click="openAddDialog"
      editable-events
      draggable
      active-view="month"
      :time-from="8 * 60"
      :time-to="20 * 60"
      events-on-month-view="short"
      :overlaps="true" 
    >
      <template #event="{ event }">
        <div class="vuecal__event-title" :style="{ background: event.color }">
          {{ event.title }}
        </div>
      </template>
    </vue-cal>

    <!-- Add/Edit dialog -->
    <div v-if="showDialog" class="dialog">
      <div class="dialog-content">
        <h3>{{ editEvent.id ? 'Edit Event' : 'Add Event' }}</h3>

        <label>
          Title:
          <input v-model="editEvent.title" maxlength="30" />
        </label>

        <label>
          Content:
          <textarea v-model="editEvent.content"></textarea>
        </label>

        <label>
          Start:
          <input type="datetime-local"     :value="formatDateInput(editEvent.start)"
            @input="e => editEvent.start = new Date(e.target.value)" />
        </label>

        <label>
          End:
          <input type="datetime-local"     :value="formatDateInput(editEvent.end)"
            @input="e => editEvent.end = new Date(e.target.value)"/>
        </label>

        <label>
          Color:
          <input type="color" v-model="editEvent.color" />
        </label>

        <div class="actions">
          <button @click="saveChanges">💾 Save</button>
          <button v-if="editEvent.id" @click="deleteEvent">🗑 Delete</button>
          <button @click="showDialog = false">✖ Close</button>
        </div>
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
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
