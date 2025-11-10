<script setup lang="ts">
import { ref, reactive } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils.js'
import type { EventApi, CalendarOptions } from '@fullcalendar/core'
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core'

// State
const showEditModal = ref(false)
const selectedEvent = ref<EventApi | null>(null)
const editedTitle = ref('')
const currentEvents = ref<EventApi[]>([])

// Calendar Options
const calendarOptions = reactive<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  initialView: 'dayGridMonth',
  initialEvents: INITIAL_EVENTS,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
})

// Event Handlers
function handleWeekendsToggle() {
  calendarOptions.weekends = !calendarOptions.weekends
}

function handleDateSelect(selectInfo: DateSelectArg) {
  const title = prompt('Please enter a new title for your event')
  const calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    })
  }
}

function handleEventClick(clickInfo: EventClickArg) {
  selectedEvent.value = clickInfo.event
  editedTitle.value = clickInfo.event.title
  showEditModal.value = true
}

function handleEditEvent() {
  if (selectedEvent.value && editedTitle.value.trim()) {
    selectedEvent.value.setProp('title', editedTitle.value)
    closeEditModal()
  }
}

function handleDeleteEvent() {
  if (selectedEvent.value) {
    selectedEvent.value.remove()
    closeEditModal()
  }
}

function closeEditModal() {
  showEditModal.value = false
  selectedEvent.value = null
  editedTitle.value = ''
}

function handleEvents(events: EventApi[]) {
  currentEvents.value = events
}
</script>

<template>
  <div class="demo-app-main">
    <FullCalendar class="demo-app-calendar" :options="calendarOptions">
      <template #eventContent="{ timeText, event }">
        <div class="flex items-center gap-1">
          <b>{{ timeText }}</b>
          <i>{{ event.title }}</i>
        </div>
      </template>
    </FullCalendar>
  </div>

  <!-- Edit Event Modal -->
  <div v-if="showEditModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit Event</h2>
      <div class="form-group">
        <label>Event Title:</label>
        <input
          type="text"
          v-model="editedTitle"
          class="form-control"
          @keyup.enter="handleEditEvent"
        />
      </div>
      <div class="modal-actions">
        <button @click="handleEditEvent" class="btn-save">Save Changes</button>
        <button @click="handleDeleteEvent" class="btn-delete">Delete Event</button>
        <button @click="closeEditModal" class="btn-cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn-save,
.btn-delete,
.btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save {
  background-color: #4caf50;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-cancel {
  background-color: #9e9e9e;
  color: white;
}

h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family:
    Arial,
    Helvetica Neue,
    Helvetica,
    sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
</style>
