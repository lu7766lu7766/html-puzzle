<template>
  <div class="relative group my-1.5 transition-all">
    <!-- 頂部插入導引區 (Drop Before) -->
    <div 
      v-if="draggingBlock && !isSelfBeingDragged"
      class="transition-all duration-150 relative z-30"
      :class="[
        dropPos === 'before' 
          ? 'h-9 my-1.5 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/20 flex items-center justify-center shadow-md animate-pulse' 
          : 'h-2.5 -my-1 opacity-0 hover:opacity-100'
      ]"
      @dragover.prevent.stop="onDropZoneOver($event, 'before')"
      @dragleave.stop="onDropZoneLeave($event, 'before')"
      @drop.stop="onDropRelative('before', $event)"
    >
      <span v-if="dropPos === 'before'" class="text-xs font-mono font-extrabold text-indigo-700 dark:text-indigo-300 pointer-events-none flex items-center gap-1.5">
        <span>⬆ 插入在 &lt;{{ node.tag || node.label || '此積木' }}&gt; 之前</span>
      </span>
    </div>

    <!-- 1. 成對容器積木 (Container) -->
    <div 
      v-if="node.type === 'container'" 
      class="rounded-xl border border-indigo-300 dark:border-indigo-700/60 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-all"
      :class="isSelfBeingDragged ? 'opacity-40 scale-[0.99] border-dashed border-indigo-500' : 'opacity-100'"
    >
      <!-- 容器起始標籤頂條 (Opening Bar) - 可直接按住拖曳整個容器及其內容 -->
      <div 
        class="px-3 py-2 bg-indigo-50/80 dark:bg-gradient-to-r dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-900/90 border-b border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between gap-2 puzzle-notch-top select-none cursor-grab active:cursor-grabbing hover:bg-indigo-100/70 dark:hover:bg-indigo-950/90 transition-colors"
        draggable="true"
        @dragstart="onNodeDragStart"
        @dragend="onNodeDragEnd"
        @dragover.prevent.stop="onOpeningBarDragOver"
        @dragleave.stop="onOpeningBarDragLeave"
        @drop.stop="onOpeningBarDrop"
        title="按住此處可拖曳移動整組容器（連同內容）"
      >
        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
          <!-- 拖曳搬移視覺圖示 -->
          <span 
            class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-mono px-1 py-0.5 rounded transition-colors"
          >
            ⠿
          </span>

          <!-- 標籤名稱 -->
          <span class="font-mono text-sm font-extrabold text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700/50">
            &lt;{{ node.tag }}&gt;
          </span>

          <!-- 屬性晶片展示與自訂 -->
          <div v-if="node.attrs && Object.keys(node.attrs).length > 0" class="flex items-center space-x-1.5 flex-wrap gap-1">
            <span 
              v-for="(val, key) in node.attrs" 
              :key="key"
              class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold"
              @click.stop
              @dragstart.stop
              draggable="false"
            >
              <span>{{ key }}="<span class="text-amber-600 dark:text-amber-300">{{ val }}</span>"</span>
              <button 
                @click.stop="$emit('remove-attr', { nodeId: node.id, key })"
                class="text-cyan-600 dark:text-cyan-400 hover:text-red-500 ml-1 font-bold cursor-pointer"
                title="移除屬性"
              >
                ×
              </button>
            </span>
          </div>

          <!-- 行內新增屬性區塊 (替代原生彈窗) -->
          <div v-if="isAddingAttr" class="inline-flex items-center space-x-1 p-1 rounded-lg bg-cyan-100/90 dark:bg-cyan-950/90 border border-cyan-400 dark:border-cyan-700 shadow-sm" @click.stop @dragstart.stop draggable="false">
            <input 
              ref="attrKeyInputRef"
              v-model="newAttrKey"
              type="text"
              placeholder="名稱 (如 class)"
              class="w-24 px-2 py-0.5 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 rounded text-xs font-mono focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-100"
              @keydown.enter.prevent="attrValInputRef?.focus()"
              @keydown.esc.prevent="cancelAddAttr"
              @click.stop
            />
            <span class="text-slate-500 font-bold">=</span>
            <input 
              ref="attrValInputRef"
              v-model="newAttrVal"
              type="text"
              placeholder="值 (如 btn)"
              class="w-24 px-2 py-0.5 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 rounded text-xs font-mono focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-100"
              @keydown.enter.prevent="submitAddAttr"
              @keydown.esc.prevent="cancelAddAttr"
              @click.stop
            />
            <button 
              @click.stop="submitAddAttr"
              class="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
            >
              ✓
            </button>
            <button 
              @click.stop="cancelAddAttr"
              class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- 快速增加屬性按鈕 -->
          <button 
            v-else
            @click.stop="startAddAttr"
            @dragstart.stop
            draggable="false"
            class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            title="新增屬性 (如 id, class, style)"
          >
            + 屬性
          </button>
        </div>

        <!-- 右側操作：上移、下移、刪除 -->
        <div class="flex items-center space-x-1 text-slate-500 dark:text-slate-400" @click.stop @dragstart.stop draggable="false">
          <button 
            v-if="canMoveUp" 
            @click.stop="$emit('move-node', { nodeId: node.id, dir: -1 })"
            class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
            title="上移"
          >
            ▲
          </button>
          <button 
            v-if="canMoveDown" 
            @click.stop="$emit('move-node', { nodeId: node.id, dir: 1 })"
            class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
            title="下移"
          >
            ▼
          </button>
          <button 
            @click.stop="$emit('remove-node', node.id)"
            class="p-1 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-sm font-bold transition-colors ml-1 cursor-pointer"
            title="刪除積木"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 開頭即時插入提示 (Opening Bar Hover Preview) -->
      <div 
        v-if="openingBarDropPos === 'inside-start' && !isSelfBeingDragged" 
        class="p-2 mx-3 my-1 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold flex items-center justify-between shadow-sm animate-pulse"
      >
        <span>📥 置入 &lt;{{ node.tag }}&gt; 內部最上方：{{ draggingBlock?.label || draggingBlock?.tag }}</span>
        <span class="text-xs font-sans px-1.5 py-0.5 rounded bg-emerald-200/50 dark:bg-emerald-950">插在開頭</span>
      </div>

      <!-- 容器內部巢狀插槽 (Nested Slot) -->
      <div 
        class="pl-4 pr-3 py-2.5 border-l-2 border-indigo-400 dark:border-indigo-500/30 ml-4 my-1 space-y-2 bg-slate-50/50 dark:bg-slate-950/20"
        @dragover.prevent.stop="isContainerDragOver = true"
        @dragleave.stop="onContainerDragLeave"
        @drop.stop="onDropInsideContainer('end', $event)"
      >
        <!-- 包含文字內容編輯 -->
        <div v-if="node.text !== undefined" class="flex items-center space-x-2" @click.stop @dragstart.stop draggable="false">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">內容:</span>
          <input 
            v-model="node.text" 
            type="text" 
            placeholder="填寫元素內容..."
            class="flex-1 bg-white dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
            @click.stop
            draggable="false"
          />
        </div>

        <!-- 容器內部最上方快速落點（有子元素時顯示） -->
        <div 
          v-if="draggingBlock && !isSelfBeingDragged && node.children && node.children.length > 0"
          class="transition-all duration-150 relative z-20"
          :class="[
            containerInnerDropPos === 'start'
              ? 'h-8 my-1 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-500/20 flex items-center justify-center animate-pulse'
              : 'h-2 -my-1 opacity-0 hover:opacity-100'
          ]"
          @dragover.prevent.stop="containerInnerDropPos = 'start'"
          @dragleave.stop="containerInnerDropPos = null"
          @drop.stop="onDropInsideContainer('start', $event)"
        >
          <span v-if="containerInnerDropPos === 'start'" class="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 pointer-events-none">
            📥 插入至 &lt;{{ node.tag }}&gt; 內部最上方
          </span>
        </div>

        <!-- 遞迴子節點清單 -->
        <div v-if="node.children && node.children.length > 0" class="space-y-1">
          <PuzzleNode
            v-for="(child, cIdx) in node.children"
            :key="child.id"
            :node="child"
            :depth="depth + 1"
            :can-move-up="cIdx > 0"
            :can-move-down="cIdx < node.children.length - 1"
            @remove-node="$emit('remove-node', $event)"
            @remove-attr="$emit('remove-attr', $event)"
            @add-attr="$emit('add-attr', $event)"
            @move-node="$emit('move-node', $event)"
            @drop-inside="$emit('drop-inside', $event)"
            @drop-relative="$emit('drop-relative', $event)"
          />
        </div>

        <!-- 容器內部拖曳即時半透明預覽 (Ghost Preview inside empty container) -->
        <div 
          v-if="isContainerDragOver && draggingBlock && !isSelfBeingDragged && (!node.children || node.children.length === 0)" 
          class="my-1.5 p-2 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 opacity-70 flex items-center justify-between text-xs font-mono font-bold pointer-events-none animate-pulse"
        >
          <span>📥 即將置入 &lt;{{ node.tag }}&gt; 內部：{{ draggingBlock.label || draggingBlock.tag }}</span>
          <span class="text-xs font-sans px-1.5 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-950">半透明預覽</span>
        </div>

        <!-- 行內新增文字內容輸入區 (徹底取代易閃退的 window.prompt) -->
        <div 
          v-if="isAddingChildText" 
          class="p-2.5 border-2 border-indigo-400 dark:border-indigo-600 rounded-xl bg-indigo-50/95 dark:bg-indigo-950/90 shadow-sm space-y-2 select-none"
          @click.stop
          @dragstart.stop
          draggable="false"
        >
          <div class="text-xs font-bold text-indigo-800 dark:text-indigo-200 flex items-center justify-between">
            <span>✍️ 輸入要放入 &lt;{{ node.tag }}&gt; 內的文字內容：</span>
            <span class="text-[11px] text-slate-500 font-normal">按 Enter 送出，Esc 取消</span>
          </div>
          <div class="flex items-center space-x-1.5">
            <input 
              ref="childTextInputRef"
              v-model="newChildText"
              type="text"
              placeholder="請填寫文字內容（例如：今日熱門社團活動報導）..."
              class="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
              @keydown.enter.prevent="submitAddChildText"
              @keydown.esc.prevent="cancelAddChildText"
              @click.stop
              draggable="false"
            />
            <button 
              @click.stop="submitAddChildText"
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              確認加入
            </button>
            <button 
              @click.stop="cancelAddChildText"
              class="px-2 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- 嵌套拖曳置放輔助引導槽 (點擊直接切換為行內輸入) -->
        <div 
          v-else
          class="py-2 px-3 border border-dashed border-indigo-300 dark:border-indigo-800/40 rounded-lg text-center text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20 hover:border-indigo-500 transition-all cursor-pointer select-none"
          :class="containerInnerDropPos === 'end' ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-400 animate-pulse' : ''"
          @dragover.prevent.stop="containerInnerDropPos = 'end'"
          @dragleave.stop="containerInnerDropPos = null"
          @drop.stop="onDropInsideContainer('end', $event)"
          @click.stop="startAddChildText"
        >
          <span>📥 點此輸入文字內容，或拖曳積木成為 &lt;{{ node.tag }}&gt; 的子元素</span>
        </div>
      </div>

      <!-- 容器結束標籤底條 (Closing Bar) -->
      <div 
        class="px-3 py-1 bg-indigo-50/60 dark:bg-indigo-950/40 border-t border-indigo-200 dark:border-indigo-900/30 flex items-center justify-between text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 puzzle-notch-bottom select-none"
        @dragover.prevent.stop="onClosingBarDragOver"
        @dragleave.stop="onClosingBarDragLeave"
        @drop.stop="onClosingBarDrop"
      >
        <span>&lt;/{{ node.tag }}&gt;</span>
        <span class="text-xs text-slate-500 font-sans font-normal">封裝閉合</span>
      </div>
    </div>

    <!-- 2. 自閉合 / 空標籤 (Void Tag) - 整張卡片可直接按住拖曳 -->
    <div 
      v-else-if="node.type === 'void_tag'"
      class="rounded-xl border border-amber-300 dark:border-amber-600/60 bg-amber-50/60 dark:bg-slate-900/90 shadow-sm p-2.5 sm:p-3 flex items-center justify-between gap-2 transition-all select-none cursor-grab active:cursor-grabbing hover:border-amber-400"
      :class="isSelfBeingDragged ? 'opacity-40 scale-[0.99] border-dashed border-amber-500' : 'opacity-100'"
      draggable="true"
      @dragstart="onNodeDragStart"
      @dragend="onNodeDragEnd"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
      title="按住此積木可拖曳調整位置"
    >
      <div class="flex items-center space-x-2 flex-wrap gap-y-1">
        <span 
          class="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-mono px-1 py-0.5 rounded transition-colors"
        >
          ⠿
        </span>
        <span class="font-mono text-sm font-extrabold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60">
          <template v-if="node.tag === '!DOCTYPE html'">&lt;!DOCTYPE html&gt;</template>
          <template v-else>&lt;{{ node.tag }} /&gt;</template>
        </span>
        <span class="text-xs px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-amber-800/60">
          空標籤 (自閉合)
        </span>

        <!-- 屬性標籤 -->
        <div v-if="node.attrs && Object.keys(node.attrs).length > 0" class="flex items-center space-x-1.5 flex-wrap gap-1">
          <span 
            v-for="(val, key) in node.attrs" 
            :key="key"
            class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold"
            @click.stop
            @dragstart.stop
            draggable="false"
          >
            <span>{{ key }}="<span class="text-amber-600 dark:text-amber-300">{{ val }}</span>"</span>
            <button 
              @click.stop="$emit('remove-attr', { nodeId: node.id, key })"
              class="text-cyan-600 dark:text-cyan-400 hover:text-red-500 ml-1 font-bold cursor-pointer"
              title="移除屬性"
            >
              ×
            </button>
          </span>
        </div>

        <!-- 行內屬性新增 -->
        <div v-if="isAddingAttr" class="inline-flex items-center space-x-1 p-1 rounded-lg bg-cyan-100/90 dark:bg-cyan-950/90 border border-cyan-400 dark:border-cyan-700 shadow-sm" @click.stop @dragstart.stop draggable="false">
          <input 
            ref="attrKeyInputRef"
            v-model="newAttrKey"
            type="text"
            placeholder="名稱 (如 src)"
            class="w-24 px-2 py-0.5 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 rounded text-xs font-mono focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-100"
            @keydown.enter.prevent="attrValInputRef?.focus()"
            @keydown.esc.prevent="cancelAddAttr"
            @click.stop
          />
          <span class="text-slate-500 font-bold">=</span>
          <input 
            ref="attrValInputRef"
            v-model="newAttrVal"
            type="text"
            placeholder="值 (如 logo.png)"
            class="w-24 px-2 py-0.5 bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-700 rounded text-xs font-mono focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-100"
            @keydown.enter.prevent="submitAddAttr"
            @keydown.esc.prevent="cancelAddAttr"
            @click.stop
          />
          <button 
            @click.stop="submitAddAttr"
            class="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition-colors cursor-pointer"
          >
            ✓
          </button>
          <button 
            @click.stop="cancelAddAttr"
            class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        <button 
          v-else-if="node.tag !== '!DOCTYPE html'"
          @click.stop="startAddAttr"
          @dragstart.stop
          draggable="false"
          class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-cyan-300 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
        >
          + 屬性
        </button>
      </div>

      <div class="flex items-center space-x-1" @click.stop @dragstart.stop draggable="false">
        <button 
          v-if="canMoveUp" 
          @click.stop="$emit('move-node', { nodeId: node.id, dir: -1 })"
          class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
        >
          ▲
        </button>
        <button 
          v-if="canMoveDown" 
          @click.stop="$emit('move-node', { nodeId: node.id, dir: 1 })"
          class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
        >
          ▼
        </button>
        <button 
          @click.stop="$emit('remove-node', node.id)"
          class="p-1 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-sm font-bold ml-1 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 3. Strict 模式下的起始標籤 (open_tag) -->
    <div 
      v-else-if="node.type === 'open_tag'"
      class="rounded-xl border border-indigo-300 dark:border-indigo-500/70 bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 sm:p-3 flex items-center justify-between puzzle-notch-bottom shadow-sm transition-all select-none cursor-grab active:cursor-grabbing hover:border-indigo-400"
      :class="isSelfBeingDragged ? 'opacity-40 scale-[0.99] border-dashed border-indigo-500' : 'opacity-100'"
      draggable="true"
      @dragstart="onNodeDragStart"
      @dragend="onNodeDragEnd"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
      title="按住此積木可拖曳調整位置"
    >
      <div class="flex items-center space-x-2">
        <span class="text-indigo-400 hover:text-indigo-600 text-sm font-mono px-1 py-0.5 rounded transition-colors">
          ⠿
        </span>
        <span class="font-mono text-sm font-extrabold text-indigo-700 dark:text-indigo-300">&lt;{{ node.tag }}&gt;</span>
        <span class="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold">起始標籤</span>
      </div>
      <div class="flex items-center space-x-1" @click.stop @dragstart.stop draggable="false">
        <button v-if="canMoveUp" @click.stop="$emit('move-node', { nodeId: node.id, dir: -1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer">▲</button>
        <button v-if="canMoveDown" @click.stop="$emit('move-node', { nodeId: node.id, dir: 1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer">▼</button>
        <button @click.stop="$emit('remove-node', node.id)" class="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm font-bold ml-1 cursor-pointer">✕</button>
      </div>
    </div>

    <!-- 4. Strict 模式下的結束標籤 (close_tag) -->
    <div 
      v-else-if="node.type === 'close_tag'"
      class="rounded-xl border border-purple-300 dark:border-purple-500/70 bg-purple-50/70 dark:bg-purple-950/40 p-2.5 sm:p-3 flex items-center justify-between puzzle-notch-top shadow-sm transition-all select-none cursor-grab active:cursor-grabbing hover:border-purple-400"
      :class="isSelfBeingDragged ? 'opacity-40 scale-[0.99] border-dashed border-purple-500' : 'opacity-100'"
      draggable="true"
      @dragstart="onNodeDragStart"
      @dragend="onNodeDragEnd"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
      title="按住此積木可拖曳調整位置"
    >
      <div class="flex items-center space-x-2">
        <span class="text-purple-400 hover:text-purple-600 text-sm font-mono px-1 py-0.5 rounded transition-colors">
          ⠿
        </span>
        <span class="font-mono text-sm font-extrabold text-purple-700 dark:text-purple-300">&lt;/{{ node.tag }}&gt;</span>
        <span class="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-bold">結束閉合標籤</span>
      </div>
      <div class="flex items-center space-x-1" @click.stop @dragstart.stop draggable="false">
        <button v-if="canMoveUp" @click.stop="$emit('move-node', { nodeId: node.id, dir: -1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer">▲</button>
        <button v-if="canMoveDown" @click.stop="$emit('move-node', { nodeId: node.id, dir: 1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer">▼</button>
        <button @click.stop="$emit('remove-node', node.id)" class="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm font-bold ml-1 cursor-pointer">✕</button>
      </div>
    </div>

    <!-- 5. 純文字積木 (text) - 可拖曳卡片，點擊輸入框可直接編輯文字 -->
    <div 
      v-else-if="node.type === 'text'"
      class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-2.5 sm:p-3 flex items-center justify-between shadow-sm transition-all select-none cursor-grab active:cursor-grabbing hover:border-slate-400"
      :class="isSelfBeingDragged ? 'opacity-40 scale-[0.99] border-dashed border-slate-500' : 'opacity-100'"
      draggable="true"
      @dragstart="onNodeDragStart"
      @dragend="onNodeDragEnd"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
      title="按住此積木可拖曳調整位置"
    >
      <div class="flex items-center space-x-2 flex-1 mr-2">
        <span class="text-slate-400 hover:text-slate-700 text-sm font-mono px-1 py-0.5 rounded transition-colors">
          ⠿
        </span>
        <span class="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">文字內容:</span>
        <input 
          v-model="node.text" 
          type="text" 
          class="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none cursor-text"
          @click.stop
          @dragstart.stop
          draggable="false"
        />
      </div>
      <div class="flex items-center space-x-1" @click.stop @dragstart.stop draggable="false">
        <button v-if="canMoveUp" @click.stop="$emit('move-node', { nodeId: node.id, dir: -1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer">▲</button>
        <button v-if="canMoveDown" @click.stop="$emit('move-node', { nodeId: node.id, dir: 1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold cursor-pointer">▼</button>
        <button @click.stop="$emit('remove-node', node.id)" class="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm font-bold ml-1 cursor-pointer">✕</button>
      </div>
    </div>

    <!-- 底部插入導引區 (Drop After) -->
    <div 
      v-if="draggingBlock && !isSelfBeingDragged"
      class="transition-all duration-150 relative z-30"
      :class="[
        dropPos === 'after' 
          ? 'h-9 my-1.5 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/20 flex items-center justify-center shadow-md animate-pulse' 
          : 'h-2.5 -my-1 opacity-0 hover:opacity-100'
      ]"
      @dragover.prevent.stop="onDropZoneOver($event, 'after')"
      @dragleave.stop="onDropZoneLeave($event, 'after')"
      @drop.stop="onDropRelative('after', $event)"
    >
      <span v-if="dropPos === 'after'" class="text-xs font-mono font-extrabold text-indigo-700 dark:text-indigo-300 pointer-events-none flex items-center gap-1.5">
        <span>⬇ 插入在 &lt;{{ node.tag || node.label || '此積木' }}&gt; 之後</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { usePuzzleEngine } from '../../composables/usePuzzleEngine';

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  canMoveUp: { type: Boolean, default: false },
  canMoveDown: { type: Boolean, default: false }
});

const emit = defineEmits([
  'remove-node',
  'remove-attr',
  'add-attr',
  'move-node',
  'drop-inside',
  'drop-relative'
]);

const { draggingBlock, setDraggingBlock, clearDraggingBlock } = usePuzzleEngine();

// 當前積木是否正在被拖曳
const isSelfBeingDragged = computed(() => {
  if (!draggingBlock.value) return false;
  const draggingId = draggingBlock.value.nodeId || draggingBlock.value.id;
  return draggingId === props.node.id;
});

// 拖曳落點狀態
const dropPos = ref(null); // 'before' | 'after'
const openingBarDropPos = ref(null); // 'inside-start'
const containerInnerDropPos = ref(null); // 'start' | 'end'
const isContainerDragOver = ref(false);

// 行內文字內容新增狀態
const isAddingChildText = ref(false);
const newChildText = ref('');
const childTextInputRef = ref(null);

function startAddChildText() {
  isAddingChildText.value = true;
  newChildText.value = '';
  nextTick(() => {
    childTextInputRef.value?.focus();
  });
}

function submitAddChildText() {
  const trimmed = newChildText.value.trim();
  if (trimmed) {
    emit('drop-inside', {
      targetContainerId: props.node.id,
      position: 'end',
      block: { type: 'text', text: trimmed }
    });
  }
  isAddingChildText.value = false;
  newChildText.value = '';
}

function cancelAddChildText() {
  isAddingChildText.value = false;
  newChildText.value = '';
}

// 行內屬性新增狀態
const isAddingAttr = ref(false);
const newAttrKey = ref('');
const newAttrVal = ref('');
const attrKeyInputRef = ref(null);
const attrValInputRef = ref(null);

function startAddAttr() {
  isAddingAttr.value = true;
  newAttrKey.value = '';
  newAttrVal.value = '';
  nextTick(() => {
    attrKeyInputRef.value?.focus();
  });
}

function submitAddAttr() {
  const k = newAttrKey.value.trim();
  if (k) {
    emit('add-attr', {
      nodeId: props.node.id,
      key: k,
      value: newAttrVal.value.trim()
    });
  }
  isAddingAttr.value = false;
  newAttrKey.value = '';
  newAttrVal.value = '';
}

function cancelAddAttr() {
  isAddingAttr.value = false;
  newAttrKey.value = '';
  newAttrVal.value = '';
}

// 拖曳現有節點（完整包含其所有 children 與內容）
function onNodeDragStart(e) {
  setDraggingBlock(props.node);
  const data = {
    isExistingNode: true,
    nodeId: props.node.id,
    type: props.node.type,
    tag: props.node.tag,
    label: props.node.label || (props.node.tag ? `<${props.node.tag}>` : props.node.text),
    text: props.node.text,
    attrs: props.node.attrs ? JSON.parse(JSON.stringify(props.node.attrs)) : {},
    children: props.node.children ? JSON.parse(JSON.stringify(props.node.children)) : []
  };
  e.dataTransfer.setData('text/plain', JSON.stringify(data));
  e.dataTransfer.effectAllowed = 'move';
}

function onNodeDragEnd() {
  clearDraggingBlock();
}

// 頂部/底部落點懸停
function onDropZoneOver(e, pos) {
  if (isSelfBeingDragged.value) return;
  dropPos.value = pos;
}

function onDropZoneLeave(e, pos) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  if (dropPos.value === pos) {
    dropPos.value = null;
  }
}

// 容器頂條懸停判定
function onOpeningBarDragOver(e) {
  if (isSelfBeingDragged.value) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  if (e.clientY < midY) {
    dropPos.value = 'before';
    openingBarDropPos.value = null;
  } else {
    dropPos.value = null;
    openingBarDropPos.value = 'inside-start';
  }
}

function onOpeningBarDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  dropPos.value = null;
  openingBarDropPos.value = null;
}

function onOpeningBarDrop(e) {
  if (isSelfBeingDragged.value) return;
  if (openingBarDropPos.value === 'inside-start') {
    onDropInsideContainer('start', e);
  } else if (dropPos.value === 'before') {
    onDropRelative('before', e);
  }
}

// 容器底條懸停判定
function onClosingBarDragOver(e) {
  if (isSelfBeingDragged.value) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  if (e.clientY < midY) {
    containerInnerDropPos.value = 'end';
    dropPos.value = null;
  } else {
    containerInnerDropPos.value = null;
    dropPos.value = 'after';
  }
}

function onClosingBarDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  containerInnerDropPos.value = null;
  dropPos.value = null;
}

function onClosingBarDrop(e) {
  if (isSelfBeingDragged.value) return;
  if (containerInnerDropPos.value === 'end') {
    onDropInsideContainer('end', e);
  } else if (dropPos.value === 'after') {
    onDropRelative('after', e);
  }
}

// 非容器卡片本體懸停判定
function onCardDragOver(e) {
  if (isSelfBeingDragged.value) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  dropPos.value = e.clientY < midY ? 'before' : 'after';
}

function onCardDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  dropPos.value = null;
}

function onCardDrop(e) {
  if (isSelfBeingDragged.value) return;
  const pos = dropPos.value || 'after';
  onDropRelative(pos, e);
}

function onContainerDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  isContainerDragOver.value = false;
  containerInnerDropPos.value = null;
}

// 相對位置釋放 (before / after)
function onDropRelative(position, e) {
  if (isSelfBeingDragged.value) return;
  dropPos.value = null;
  openingBarDropPos.value = null;
  containerInnerDropPos.value = null;
  isContainerDragOver.value = false;
  clearDraggingBlock();
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (raw) {
      const block = JSON.parse(raw);
      // 防呆：禁止將自身插入至自身前後
      if (block.isExistingNode && block.nodeId === props.node.id) return;
      emit('drop-relative', {
        targetNodeId: props.node.id,
        position,
        block
      });
    }
  } catch (err) {}
}

// 容器內釋放 (start / end)
function onDropInsideContainer(position = 'end', e) {
  if (isSelfBeingDragged.value) return;
  isContainerDragOver.value = false;
  containerInnerDropPos.value = null;
  openingBarDropPos.value = null;
  clearDraggingBlock();
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (raw) {
      const block = JSON.parse(raw);
      // 防呆：禁止將自身放入自身內部
      if (block.isExistingNode && block.nodeId === props.node.id) return;
      emit('drop-inside', {
        targetContainerId: props.node.id,
        position,
        block
      });
    }
  } catch (err) {}
}
</script>
