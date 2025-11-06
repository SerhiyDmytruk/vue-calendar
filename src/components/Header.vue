<script setup>
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellIcon,
} from '@heroicons/vue/24/outline'
</script>

<template>
  <header
    class="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6 shadow-sm"
  >
    <!-- Left: Search -->
    <div class="flex items-center w-full max-w-lg">
      <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 mr-3" />
      <input
        type="text"
        placeholder="Search transactions, invoices or help"
        class="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
      />
    </div>

    <!-- Right: Icons + Profile -->
    <div class="flex items-center space-x-6">
      <GlobeAltIcon class="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
      <ChatBubbleOvalLeftEllipsisIcon
        class="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600"
      />
      <BellIcon class="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />

      <div class="flex items-center space-x-3">
        <span class="text-gray-700 font-medium">John Doe</span>
        <img
          src="https://i.pravatar.cc/150?img=2"
          alt="User avatar"
          class="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </div>
  </header>
</template>

<style>
header {
  grid-row: span 1;
  grid-column: 2;
}
</style>
