<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import type { Ref } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

interface CalendarEvent {
  id: number
  start: Date
  end: Date
  title: string
  content?: string
  color: string
  background?: boolean
  __source?: CalendarEvent
}

const getInitialEvents = (): CalendarEvent[] => {
  // Get current date for reference
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()

  return [
    {
      id: 1,
      start: new Date(year, month, date, 10, 30),
      end: new Date(year, month, date, 12, 0),
      title: 'Morning Meeting',
      content: 'Team sync-up meeting',
      color: '#3498db',
    },
    {
      id: 2,
      start: new Date(year, month, date + 1, 14, 0),
      end: new Date(year, month, date + 1, 15, 30),
      title: 'Client Call',
      content: 'Project discussion',
      color: '#2ecc71',
    },
    {
      id: 3,
      start: new Date(year, month, date - 1, 12, 0),
      end: new Date(year, month, date -1, 13, 0),
      title: 'Lunch Break',
      content: 'Team lunch',
      color: '#e74c3c',
      background: true,
    },
    {
      id: 4,
      start: new Date(year, month, date + 3, 9, 0),
      end: new Date(year, month, date + 3, 17, 0),
      title: 'Workshop',
      content: 'Annual planning workshop',
      color: '#9b59b6',
    },
  ]
}
// Initialize events ref with an empty array
const events: Ref<CalendarEvent[]> = ref(getInitialEvents())
const showDialog = ref(false)
const editEvent: Ref<Partial<CalendarEvent>> = ref({})

function openAddDialog(payload: { date: Date }) {
  const date = payload?.date instanceof Date ? payload.date : new Date()

  editEvent.value = {
    title: '',
    content: '',
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000),
    color: '#3498db',
  }
  showDialog.value = true
}

function openDialog({ event }: { event: CalendarEvent }) {
  editEvent.value = { ...event, __source: event }
  showDialog.value = true
}

function saveChanges() {
  const eventData: CalendarEvent = {
    ...(editEvent.value as CalendarEvent),
    start: new Date(editEvent.value.start!),
    end: new Date(editEvent.value.end!),
    id: editEvent.value.id ?? Date.now(),
  }

  if (eventData.id) {
    // якщо є посилання на оригінал
    if (eventData.__source) {
      Object.assign(eventData.__source, eventData)
    }

    const idx = events.value.findIndex((e) => e.id === eventData.id)
    if (idx !== -1) events.value.splice(idx, 1, eventData)
    else events.value.push(eventData)
  } else {
    eventData.id = Date.now()
    events.value.push(eventData)
  }

  showDialog.value = false
}

function deleteEvent() {
  events.value = events.value.filter((e) => e.id !== editEvent.value.id)
  showDialog.value = false
}

function formatDateInput(date: Date | undefined) {
  if (!date) return ''
  const iso = new Date(date).toISOString()
  return iso.slice(0, 16)
}

// Expose events to the template
defineExpose({ events })
</script>

<template>
  <div class="p-4 sm:p-8 bg-slate-100">
    <h1 class="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight">Calendar</h1>
    <vue-cal
      class="vuecal--blue-theme"
      :events="events"
      @event-dblclick="openDialog"
      @cell-click="openAddDialog"
      editable-events
      draggable
      active-view="month"
      :time-from="0"
      :time-to="20 * 60"
      events-on-month-view="short"
      :overlaps="true"
      small
      :cell-click-hold="true"
      :disable-views="['years']"
      hide-weekends
    >
      <template #event="{ event, view }">
        <div 
          class="vuecal__event-title vuecal__event-title--edit" 
          :style="{ 
            background: event.color,
            padding: '2px 6px',
            borderRadius: '3px',
            color: 'white',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }"
        >
          {{ event.title }}
          <small v-if="view.id === 'month'" class="vuecal__event-time">
            {{ new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
          </small>
        </div>
      </template>
      <template #arrow-prev="">Back</template>
      <template #arrow-next="">Next</template>
    </vue-cal>

    <!-- Add/Edit dialog -->
    <div v-if="showDialog" class="dialog">
      <div class="dialog-content">
        <h3 class="text-2xl font-bold mb-4 text-gray-700">
          {{ editEvent.id ? 'Edit Event' : 'Add New Event' }}
        </h3>

        <label class="block mb-3">
          <span class="text-sm font-medium text-gray-600 mb-1 block">Title (Max 30 chars):</span>
          <input
            v-model="editEvent.title"
            maxlength="30"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="e.g., Doctor appointment"
          />
        </label>

        <label class="block mb-3">
          <span class="text-sm font-medium text-gray-600 mb-1 block">Notes:</span>
          <textarea
            v-model="editEvent.content"
            rows="2"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Add a description..."
          ></textarea>
        </label>

        <div class="flex gap-4 mb-3 flex-wrap sm:flex-nowrap flex-col">
          <label class="block flex-1 w-full sm:w-auto">
            <span class="text-sm font-medium text-gray-600 mb-1 block">Start:</span>
            <input
              type="datetime-local"
              :value="formatDateInput(editEvent.start)"
              @input="(e) => (editEvent.start = new Date((e.target as HTMLInputElement)?.value))"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>
        </div>

        <div class="flex gap-4 mb-3 flex-wrap sm:flex-nowrap flex-col">
          <label class="block flex-1 w-full sm:w-auto">
            <span class="text-sm font-medium text-gray-600 mb-1 block">End:</span>
            <input
              type="datetime-local"
              :value="formatDateInput(editEvent.end)"
              @input="(e) => (editEvent.end = new Date((e.target as HTMLInputElement)?.value))"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>
        </div>

        <label class="block mb-5">
          <span class="text-sm font-medium text-gray-600 mb-1 block">Color:</span>
          <div class="flex items-center gap-4">
            <input
              type="color"
              v-model="editEvent.color"
              class="w-8 h-8 rounded-full border-none cursor-pointer"
            />
            <span class="text-gray-500 font-mono text-sm">{{ editEvent.color }}</span>
          </div>
        </label>

        <div class="actions border-t pt-4 mt-auto">
          <button
            @click="saveChanges"
            :disabled="!editEvent.title || !editEvent.start || !editEvent.end"
            class="btn-save"
          >
            💾 {{ editEvent.id ? 'Save Changes' : 'Add Event' }}
          </button>
          <button v-if="editEvent.id" @click="deleteEvent" class="btn-delete">🗑 Delete</button>
          <button @click="showDialog = false" class="btn-close">✖ Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Styles for better aesthetics and dialog */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f7fafc;
}

/* Calendar styling */
.vuecal {
  min-height: 74vh;
  max-width: 100%;
  border: none !important;
}

/* VueCal theme override to add shadow/rounded corners */
.vuecal--blue-theme {
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;

  .vuecal__menu,
  .vuecal__cell-events-count,
  .vuecal__title-bar {
    background-color: #fff;
    color: black;
    padding: 20px;
  }
}

.vuecal__menu {
  justify-content: flex-end;

  .vuecal__view-btn {
    border: 1px solid #ececec;

    &:not(:last-child) {
      margin-right: -1px;
    }

    &:first-child {
      border-radius: 4px 0 0 4px;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
    }
  }

  .vuecal__view-btn--active {
    color: tomato;
  }
}

.vuecal__weekdays-headings {
  background-color: #f5f6fa;
  border-color: #f5f6fa;
  text-transform: uppercase;
  color: var(--color-gray-700);
  font-size: 12px;
}

.vuecal__no-event {
  display: none;
}

.vuecal--month-view {
  .vuecal__cell-content {
    position: relative;

    .vuecal__cell-date {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
}

.vuecal__time-column {
  .vuecal__time-cell {
    text-align: center;
    line-height: 40px;
  }
}

.vuecal__cell:before {
  border-color: #f5f6fa;
}

/* Event slot styling for better look */

.vuecal__event {
  &:hover {
    .vuecal__event-delete {
      transform: translateY(0);
    }
  }
}

.vuecal__event-title {
  min-height: 1.25rem;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 4px 8px;
  font-size: 0.875rem; /* text-sm */
}

.vuecal__event-title {
  color: white;
  min-height: 1.5rem;
  font-size: 0.9em;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  .vuecal__event-time {
    font-size: 0.8em;
    opacity: 0.9;
  }
}

/* Dialog/Modal Styling */
.dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  transition: opacity 0.3s ease;
}

.dialog-content {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(1);
  transition: transform 0.3s ease;
}

/* Input Styling */
input[type='text'],
textarea,
input[type='datetime-local'] {
  transition: all 0.2s;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Button Styling */
.actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.actions button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
  flex-grow: 1;
  min-width: 90px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-save {
  background-color: #3498db;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-save:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.btn-close {
  background-color: #ecf0f1;
  color: #333;
}

.btn-close:hover {
  background-color: #dde1e2;
}

/* Ensure color input displays correctly */
input[type='color'] {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  padding: 0;
  border: 1px solid #eee;
  cursor: pointer;
}
</style>
