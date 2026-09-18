import { ref } from 'vue';

// 全域共享之當前拖曳積木狀態（供畫布與容器即時半透明預覽）
const draggingBlock = ref(null);

export function usePuzzleEngine() {
  // 畫布上的根節點清單
  const canvasNodes = ref([]);

  // 屬性物件轉 HTML 字串
  function serializeAttrs(attrs) {
    if (!attrs || Object.keys(attrs).length === 0) return '';
    return ' ' + Object.entries(attrs)
      .filter(([k, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
  }

  // 節點遞迴轉 HTML 代碼字串
  function nodeToHtml(node, depth = 0) {
    const indent = '  '.repeat(depth);
    if (!node) return '';

    // 1. 純文字
    if (node.type === 'text') {
      return `${indent}${node.text}\n`;
    }

    // 2. 自閉合 / 空標籤
    if (node.type === 'void_tag') {
      if (node.tag === '!DOCTYPE html') {
        return `<!DOCTYPE html>\n`;
      }
      return `${indent}<${node.tag}${serializeAttrs(node.attrs)} />\n`;
    }

    // 3. Strict 模式下的單一標籤碎片
    if (node.type === 'open_tag') {
      return `${indent}<${node.tag}${serializeAttrs(node.attrs)}>\n`;
    }
    if (node.type === 'close_tag') {
      return `${indent}</${node.tag}>\n`;
    }

    // 4. 容器成對標籤
    if (node.type === 'container') {
      const openTag = `<${node.tag}${serializeAttrs(node.attrs)}>`;
      const closeTag = `</${node.tag}>`;

      // 若只有單純文字內容，單行顯示
      if ((!node.children || node.children.length === 0) && node.text) {
        return `${indent}${openTag}${node.text}${closeTag}\n`;
      }

      let innerContent = '';
      if (node.text) {
        innerContent += `${indent}  ${node.text}\n`;
      }
      if (node.children && node.children.length > 0) {
        innerContent += node.children.map(child => nodeToHtml(child, depth + 1)).join('');
      }

      return `${indent}${openTag}\n${innerContent}${indent}${closeTag}\n`;
    }

    return '';
  }

  // 生成完整標準 HTML5 代碼
  function generateHtmlCode() {
    if (!canvasNodes.value || canvasNodes.value.length === 0) {
      return '<!-- 畫布目前為空，請從左側拖曳積木至此 -->';
    }
    return canvasNodes.value.map(node => nodeToHtml(node, 0)).join('');
  }

  // 複製深拷貝新節點
  function createNewNode(blockTemplate) {
    const uniqueId = 'node_' + Math.random().toString(36).substring(2, 9);
    const copy = JSON.parse(JSON.stringify(blockTemplate));
    copy.id = uniqueId;
    if (copy.type === 'container' && !copy.children) {
      copy.children = [];
    }
    if (!copy.attrs) {
      copy.attrs = {};
    }
    return copy;
  }

  // 尋訪特定節點及其所在陣列與父節點
  function findNodeAndParentList(nodeId, list = canvasNodes.value, parent = null) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === nodeId) {
        return { node: list[i], list, index: i, parent };
      }
      if (list[i].children && list[i].children.length > 0) {
        const found = findNodeAndParentList(nodeId, list[i].children, list[i]);
        if (found) return found;
      }
    }
    return null;
  }

  // 判斷 searchId 是否為 ancestorNode 之子代（防止迴圈掛載）
  function isDescendant(ancestorNode, searchId) {
    if (!ancestorNode || !ancestorNode.children) return false;
    for (const child of ancestorNode.children) {
      if (child.id === searchId || isDescendant(child, searchId)) {
        return true;
      }
    }
    return false;
  }

  // 在指定目標節點之前 ('before') 或之後 ('after') 插入新節點
  function insertNodeRelative(node, targetNodeId, position = 'before') {
    const targetInfo = findNodeAndParentList(targetNodeId);
    if (!targetInfo) {
      canvasNodes.value.push(node);
      return;
    }
    const insertIndex = position === 'before' ? targetInfo.index : targetInfo.index + 1;
    targetInfo.list.splice(insertIndex, 0, node);
    canvasNodes.value = [...canvasNodes.value];
  }

  // 在指定容器內部的最前 ('start')、最後 ('end') 或特定索引插入新節點
  function insertNodeIntoContainer(node, targetContainerId, position = 'end') {
    const containerInfo = findNodeAndParentList(targetContainerId);
    if (!containerInfo || containerInfo.node.type !== 'container') {
      canvasNodes.value.push(node);
      return;
    }
    const container = containerInfo.node;
    if (!container.children) container.children = [];

    if (position === 'start') {
      container.children.unshift(node);
    } else if (typeof position === 'number') {
      container.children.splice(position, 0, node);
    } else {
      container.children.push(node);
    }
    canvasNodes.value = [...canvasNodes.value];
  }

  // 移動現有節點至目標節點之前或之後
  function moveNodeRelative(nodeId, targetNodeId, position = 'before') {
    if (nodeId === targetNodeId) return;
    const sourceInfo = findNodeAndParentList(nodeId);
    if (!sourceInfo) return;
    if (isDescendant(sourceInfo.node, targetNodeId)) return;

    const [extracted] = sourceInfo.list.splice(sourceInfo.index, 1);
    const targetInfo = findNodeAndParentList(targetNodeId);
    if (!targetInfo) {
      canvasNodes.value.push(extracted);
      return;
    }
    const insertIndex = position === 'before' ? targetInfo.index : targetInfo.index + 1;
    targetInfo.list.splice(insertIndex, 0, extracted);
    canvasNodes.value = [...canvasNodes.value];
  }

  // 移動現有節點至指定容器內部
  function moveNodeIntoContainer(nodeId, targetContainerId, position = 'end') {
    if (nodeId === targetContainerId) return;
    const sourceInfo = findNodeAndParentList(nodeId);
    if (!sourceInfo) return;
    if (isDescendant(sourceInfo.node, targetContainerId)) return;

    const [extracted] = sourceInfo.list.splice(sourceInfo.index, 1);
    const containerInfo = findNodeAndParentList(targetContainerId);
    if (!containerInfo || containerInfo.node.type !== 'container') {
      canvasNodes.value.push(extracted);
      return;
    }
    const container = containerInfo.node;
    if (!container.children) container.children = [];

    if (position === 'start') {
      container.children.unshift(extracted);
    } else if (typeof position === 'number') {
      container.children.splice(position, 0, extracted);
    } else {
      container.children.push(extracted);
    }
    canvasNodes.value = [...canvasNodes.value];
  }

  // 移動節點上移 (-1) 或下移 (+1)，支援任意巢狀深度的兄弟節點間調序
  function moveNode(nodeId, dir) {
    const info = findNodeAndParentList(nodeId);
    if (!info) return;
    const targetIdx = info.index + dir;
    if (targetIdx >= 0 && targetIdx < info.list.length) {
      const [moved] = info.list.splice(info.index, 1);
      info.list.splice(targetIdx, 0, moved);
      canvasNodes.value = [...canvasNodes.value];
    }
  }

  // 新增節點到最外層或特定容器內
  function addNode(node, targetContainerId = null) {
    if (!targetContainerId) {
      canvasNodes.value.push(node);
      return;
    }
    insertNodeIntoContainer(node, targetContainerId, 'end');
  }

  // 刪除節點
  function removeNode(nodeId) {
    function searchAndRemove(list) {
      const idx = list.findIndex(n => n.id === nodeId);
      if (idx !== -1) {
        list.splice(idx, 1);
        return true;
      }
      for (const item of list) {
        if (item.children && searchAndRemove(item.children)) {
          return true;
        }
      }
      return false;
    }
    searchAndRemove(canvasNodes.value);
    canvasNodes.value = [...canvasNodes.value];
  }

  // 為節點掛載屬性晶片
  function attachAttribute(nodeId, key, value) {
    function searchAndSetAttr(list) {
      for (const item of list) {
        if (item.id === nodeId) {
          if (!item.attrs) item.attrs = {};
          item.attrs[key] = value;
          return true;
        }
        if (item.children && searchAndSetAttr(item.children)) {
          return true;
        }
      }
      return false;
    }
    searchAndSetAttr(canvasNodes.value);
  }

  // 移除節點特定屬性
  function removeAttribute(nodeId, key) {
    function searchAndDelAttr(list) {
      for (const item of list) {
        if (item.id === nodeId && item.attrs) {
          delete item.attrs[key];
          return true;
        }
        if (item.children && searchAndDelAttr(item.children)) {
          return true;
        }
      }
      return false;
    }
    searchAndDelAttr(canvasNodes.value);
  }

  // 清空畫布
  function clearCanvas() {
    canvasNodes.value = [];
  }

  // 拖曳中的暫存積木（供畫布與容器做半透明預覽）
  function setDraggingBlock(block) {
    draggingBlock.value = block;
  }

  function clearDraggingBlock() {
    draggingBlock.value = null;
  }

  function loadNodes(nodes) {
    canvasNodes.value = nodes ? JSON.parse(JSON.stringify(nodes)) : [];
  }

  // 遞迴計算畫布上實際組裝的積木數量
  function countBlocks(levelId) {
    function calc(nodes) {
      if (!nodes || !Array.isArray(nodes)) return 0;
      let count = 0;
      for (const node of nodes) {
        count += 1;
        if (node.children && node.children.length > 0) {
          count += calc(node.children);
        }
        if (levelId === 'stage-5' && node.attrs) {
          count += Object.keys(node.attrs).length;
        }
      }
      return count;
    }
    return calc(canvasNodes.value);
  }

  return {
    canvasNodes,
    draggingBlock,
    setDraggingBlock,
    clearDraggingBlock,
    generateHtmlCode,
    createNewNode,
    addNode,
    insertNodeRelative,
    insertNodeIntoContainer,
    moveNodeRelative,
    moveNodeIntoContainer,
    moveNode,
    findNodeAndParentList,
    removeNode,
    attachAttribute,
    removeAttribute,
    clearCanvas,
    loadNodes,
    countBlocks
  };
}
