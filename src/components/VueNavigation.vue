<script setup lang="ts">
import {
  HomeIcon,
  ChartBarIcon,
  InboxIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

import { ref } from 'vue'

const menu = [
  { name: 'home', label: 'Home', icon: HomeIcon },
  { name: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
  { name: 'inbox', label: 'Inbox', icon: InboxIcon },
  { name: 'products', label: 'Products', icon: TagIcon },
  { name: 'invoices', label: 'Invoices', icon: DocumentTextIcon },
  { name: 'customers', label: 'Customers', icon: UserIcon },
  { name: 'chat', label: 'Chat Room', icon: ChatBubbleOvalLeftEllipsisIcon },
  { name: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { name: 'help', label: 'Help Center', icon: QuestionMarkCircleIcon },
  { name: 'settings', label: 'Settings', icon: Cog6ToothIcon },
]

const active = ref('calendar')
const setActive = (name: string) => (active.value = name)
</script>

<template>
  <aside class="app-aside bg-slate-700 text-white h-screen bg-gray-900 text-gray-100 flex flex-col">
    <!-- Logo -->
    <div class="p-6 text-lg font-bold tracking-wide bg-gray-800">IMPEKABLE</div>

    <!-- Navigation -->
    <nav class="flex-1">
      <ul>
        <li
          v-for="item in menu"
          :key="item.name"
          @click="setActive(item.name)"
          :class="[
            'flex items-center px-6 py-3 cursor-pointer hover:bg-gray-800 transition',
            active === item.name ? 'bg-gray-800 border-l-4 border-indigo-500' : '',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3 text-gray-300" />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style>
.app-aside {
  /* Let the aside fill the column provided by the parent grid */
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>
