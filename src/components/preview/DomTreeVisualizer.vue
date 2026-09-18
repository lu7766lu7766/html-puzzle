<template>
  <div class="h-full bg-white dark:bg-slate-900/90 rounded-xl p-3 sm:p-4 overflow-y-auto border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm select-none transition-colors">
    <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div class="flex items-center space-x-2">
        <span class="text-base">🌳</span>
        <span class="font-extrabold text-slate-800 dark:text-slate-200">DOM 樹狀階層結構 (DOM Tree)</span>
      </div>
      <span class="text-xs text-slate-400 font-sans">Document Object Model</span>
    </div>

    <div v-if="canvasNodes.length === 0" class="text-center py-12 text-slate-400 font-sans font-medium">
      DOM 樹目前為空，請在左側組裝積木
    </div>

    <div v-else class="space-y-1">
      <!-- 根節點 #document -->
      <div class="flex items-center space-x-1.5 text-indigo-700 dark:text-indigo-400 font-extrabold py-1">
        <span>📁</span>
        <span>#document (文件根)</span>
      </div>

      <!-- 遞迴子樹渲染 -->
      <div class="pl-4 border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-2 space-y-1">
        <div v-for="node in canvasNodes" :key="node.id">
          <DomTreeNodeItem :node="node" :depth="1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, h } from 'vue';

const props = defineProps({
  canvasNodes: { type: Array, required: true }
});

// 內部遞迴組件
const DomTreeNodeItem = defineComponent({
  name: 'DomTreeNodeItem',
  props: {
    node: { type: Object, required: true },
    depth: { type: Number, default: 0 }
  },
  setup(props) {
    return () => {
      const node = props.node;

      // 純文字節點
      if (node.type === 'text') {
        return h('div', { class: 'flex items-center space-x-1.5 py-0.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm' }, [
          h('span', { class: 'text-slate-400 dark:text-slate-600' }, '└─'),
          h('span', { class: 'px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 font-sans font-medium' }, `"#text: ${node.text}"`)
        ]);
      }

      // 空標籤節點
      if (node.type === 'void_tag') {
        return h('div', { class: 'flex items-center space-x-1.5 py-0.5 text-amber-800 dark:text-amber-300 text-xs sm:text-sm' }, [
          h('span', { class: 'text-slate-400 dark:text-slate-600' }, '└─'),
          h('span', { class: 'font-extrabold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/60' }, `<${node.tag} />`),
          h('span', { class: 'text-xs text-amber-600 dark:text-amber-500 font-sans' }, '(Void Tag)')
        ]);
      }

      // 容器節點
      const hasChildren = (node.children && node.children.length > 0) || node.text;

      return h('div', { class: 'space-y-1 text-xs sm:text-sm' }, [
        h('div', { class: 'flex items-center space-x-1.5 py-0.5' }, [
          h('span', { class: 'text-slate-400 dark:text-slate-600' }, '└─'),
          h('span', { class: 'font-extrabold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800/80 text-indigo-800 dark:text-indigo-300' }, `<${node.tag}>`),
          node.attrs && Object.keys(node.attrs).length > 0
            ? h('span', { class: 'text-xs font-bold text-cyan-700 dark:text-cyan-400' }, `[${Object.keys(node.attrs).join(', ')}]`)
            : null
        ]),
        hasChildren
          ? h('div', { class: 'pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2 space-y-1' }, [
              node.text
                ? h('div', { class: 'flex items-center space-x-1 py-0.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm' }, [
                    h('span', { class: 'text-slate-400 dark:text-slate-600' }, '└─'),
                    h('span', { class: 'px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/60 text-amber-700 dark:text-amber-200 font-sans font-medium' }, `"${node.text}"`)
                  ])
                : null,
              ...(node.children || []).map(child => h(DomTreeNodeItem, { node: child, depth: props.depth + 1 }))
            ])
          : null
      ]);
    };
  }
});
</script>
