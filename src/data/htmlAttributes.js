// HTML 標籤屬性知識庫
// 提供標籤專用屬性、通用屬性與屬性值建議

// 全域通用屬性（所有 HTML 元素皆具備）
export const GLOBAL_ATTRIBUTES = [
  { key: 'class', label: 'class', desc: '樣式類別名稱', defaultVal: 'my-class' },
  { key: 'id', label: 'id', desc: '唯一識別碼', defaultVal: 'my-id' },
  { key: 'style', label: 'style', desc: '行內 CSS 樣式', defaultVal: 'color: #4f46e5;' },
  { key: 'title', label: 'title', desc: '滑鼠懸停提示文字', defaultVal: '詳細資訊說明' },
  { key: 'name', label: 'name', desc: '元素名稱（常用於表單識別）', defaultVal: 'item-name' },
  { key: 'hidden', label: 'hidden', desc: '隱藏元素', defaultVal: 'hidden' },
  { key: 'tabindex', label: 'tabindex', desc: '鍵盤 Tab 焦點順序', defaultVal: '0' }
];

// 各標籤專屬常用屬性字典
export const TAG_SPECIFIC_ATTRIBUTES = {
  // 圖片
  img: [
    { key: 'src', label: 'src', desc: '圖片來源網址或路徑', defaultVal: 'https://picsum.photos/300/200' },
    { key: 'alt', label: 'alt', desc: '圖片替代文字（無障礙與載入失敗顯示）', defaultVal: '展示圖片' },
    { key: 'width', label: 'width', desc: '圖片寬度 (px 或 %)', defaultVal: '300' },
    { key: 'height', label: 'height', desc: '圖片高度 (px 或 %)', defaultVal: '200' },
    { key: 'loading', label: 'loading', desc: '延遲載入方式', defaultVal: 'lazy', values: ['lazy', 'eager'] }
  ],
  // 超連結
  a: [
    { key: 'href', label: 'href', desc: '超連結跳轉目標網址', defaultVal: 'https://google.com' },
    { key: 'target', label: 'target', desc: '開啟方式（_blank 為新分頁）', defaultVal: '_blank', values: ['_blank', '_self', '_top', '_parent'] },
    { key: 'rel', label: 'rel', desc: '與目標頁面的關係', defaultVal: 'noopener noreferrer', values: ['noopener noreferrer', 'nofollow'] },
    { key: 'download', label: 'download', desc: '點擊直接下載檔案', defaultVal: 'filename.pdf' }
  ],
  // 外部資源引入
  link: [
    { key: 'rel', label: 'rel', desc: '資源關聯類型（stylesheet/icon 等）', defaultVal: 'stylesheet', values: ['stylesheet', 'icon', 'preconnect', 'preload'] },
    { key: 'href', label: 'href', desc: '資源路徑 (CSS、圖標等)', defaultVal: 'style.css' },
    { key: 'type', label: 'type', desc: '資源 MIME 類型', defaultVal: 'text/css', values: ['text/css', 'image/x-icon', 'image/png'] }
  ],
  // JavaScript 腳本
  script: [
    { key: 'src', label: 'src', desc: '外部 JS 腳本路徑', defaultVal: 'script.js' },
    { key: 'type', label: 'type', desc: '腳本類型（module/javascript）', defaultVal: 'module', values: ['module', 'text/javascript'] },
    { key: 'defer', label: 'defer', desc: '延遲執行直到 HTML 解析完畢', defaultVal: 'true' },
    { key: 'async', label: 'async', desc: '非同步下載並儘速執行', defaultVal: 'true' }
  ],
  // 輸入框
  input: [
    { key: 'type', label: 'type', desc: '輸入控制元件類型', defaultVal: 'text', values: ['text', 'password', 'email', 'number', 'checkbox', 'radio', 'submit', 'button', 'file', 'date', 'color', 'hidden'] },
    { key: 'placeholder', label: 'placeholder', desc: '未輸入時的提示文字', defaultVal: '請輸入內容...' },
    { key: 'value', label: 'value', desc: '輸入框預設值', defaultVal: '' },
    { key: 'name', label: 'name', desc: '表單提交鍵名', defaultVal: 'username' },
    { key: 'required', label: 'required', desc: '設定為必填欄位', defaultVal: 'required' },
    { key: 'checked', label: 'checked', desc: '單選/核取方塊預設勾選', defaultVal: 'checked' },
    { key: 'disabled', label: 'disabled', desc: '禁用欄位不可互動', defaultVal: 'disabled' },
    { key: 'readonly', label: 'readonly', desc: '唯讀欄位不可修改', defaultVal: 'readonly' },
    { key: 'maxlength', label: 'maxlength', desc: '最大輸入字數限制', defaultVal: '50' },
    { key: 'min', label: 'min', desc: '數字/日期下限值', defaultVal: '0' },
    { key: 'max', label: 'max', desc: '數字/日期上限值', defaultVal: '100' }
  ],
  // 按鈕
  button: [
    { key: 'type', label: 'type', desc: '按鈕功能類型', defaultVal: 'button', values: ['button', 'submit', 'reset'] },
    { key: 'disabled', label: 'disabled', desc: '禁用按鈕', defaultVal: 'disabled' },
    { key: 'name', label: 'name', desc: '按鈕提交名稱', defaultVal: 'action' },
    { key: 'value', label: 'value', desc: '按鈕提交值', defaultVal: 'save' }
  ],
  // 表單
  form: [
    { key: 'action', label: 'action', desc: '表單提交目標處理網址', defaultVal: '/api/submit' },
    { key: 'method', label: 'method', desc: 'HTTP 請求傳送方式', defaultVal: 'post', values: ['post', 'get'] },
    { key: 'target', label: 'target', desc: '提交後響應視窗', defaultVal: '_self', values: ['_self', '_blank'] },
    { key: 'enctype', label: 'enctype', desc: '編碼方式（上傳檔案必填）', defaultVal: 'multipart/form-data', values: ['multipart/form-data', 'application/x-www-form-urlencoded'] }
  ],
  // 網頁詮釋資料
  meta: [
    { key: 'charset', label: 'charset', desc: '網頁編碼設定', defaultVal: 'UTF-8', values: ['UTF-8'] },
    { key: 'name', label: 'name', desc: '中繼設定名稱（如 viewport）', defaultVal: 'viewport', values: ['viewport', 'description', 'keywords', 'author', 'robots'] },
    { key: 'content', label: 'content', desc: '設定參數內容', defaultVal: 'width=device-width, initial-scale=1.0' },
    { key: 'http-equiv', label: 'http-equiv', desc: 'HTTP 標頭模擬', defaultVal: 'X-UA-Compatible', values: ['X-UA-Compatible', 'refresh'] }
  ],
  // 影音多媒體
  video: [
    { key: 'src', label: 'src', desc: '影片檔案連結', defaultVal: 'video.mp4' },
    { key: 'controls', label: 'controls', desc: '顯示播放控制列', defaultVal: 'controls' },
    { key: 'autoplay', label: 'autoplay', desc: '自動播放', defaultVal: 'autoplay' },
    { key: 'loop', label: 'loop', desc: '循環重複播放', defaultVal: 'loop' },
    { key: 'muted', label: 'muted', desc: '預設靜音（自動播放必備）', defaultVal: 'muted' },
    { key: 'poster', label: 'poster', desc: '影片載入前封面預覽圖', defaultVal: 'cover.jpg' }
  ],
  audio: [
    { key: 'src', label: 'src', desc: '音訊檔案連結', defaultVal: 'audio.mp3' },
    { key: 'controls', label: 'controls', desc: '顯示音訊控制面板', defaultVal: 'controls' },
    { key: 'autoplay', label: 'autoplay', desc: '自動播放', defaultVal: 'autoplay' },
    { key: 'loop', label: 'loop', desc: '循環播放', defaultVal: 'loop' }
  ],
  // 內嵌頁面
  iframe: [
    { key: 'src', label: 'src', desc: '嵌入網頁網址', defaultVal: 'https://example.com' },
    { key: 'width', label: 'width', desc: '嵌入寬度', defaultVal: '100%' },
    { key: 'height', label: 'height', desc: '嵌入高度', defaultVal: '400' },
    { key: 'title', label: 'title', desc: '嵌入頁面標題說明', defaultVal: '內嵌頁面' },
    { key: 'loading', label: 'loading', desc: '延遲載入', defaultVal: 'lazy', values: ['lazy', 'eager'] }
  ],
  // 標籤關聯
  label: [
    { key: 'for', label: 'for', desc: '綁定的表單元素 ID', defaultVal: 'input-id' }
  ],
  // 下拉選單
  select: [
    { key: 'name', label: 'name', desc: '欄位提交名稱', defaultVal: 'category' },
    { key: 'multiple', label: 'multiple', desc: '允許多選', defaultVal: 'multiple' },
    { key: 'disabled', label: 'disabled', desc: '禁用選單', defaultVal: 'disabled' },
    { key: 'required', label: 'required', desc: '必選設定', defaultVal: 'required' }
  ],
  // 下拉選單選項
  option: [
    { key: 'value', label: 'value', desc: '選項提交值', defaultVal: '1' },
    { key: 'selected', label: 'selected', desc: '預設選中此項目', defaultVal: 'selected' },
    { key: 'disabled', label: 'disabled', desc: '禁用此選項', defaultVal: 'disabled' }
  ],
  // 多行文字框
  textarea: [
    { key: 'name', label: 'name', desc: '欄位名稱', defaultVal: 'message' },
    { key: 'rows', label: 'rows', desc: '可見列數', defaultVal: '4' },
    { key: 'cols', label: 'cols', desc: '可見行寬', defaultVal: '40' },
    { key: 'placeholder', label: 'placeholder', desc: '預設提示文字', defaultVal: '請在此輸入文字...' },
    { key: 'required', label: 'required', desc: '必填設定', defaultVal: 'required' }
  ],
  // 表格
  td: [
    { key: 'colspan', label: 'colspan', desc: '水平跨越欄數', defaultVal: '2' },
    { key: 'rowspan', label: 'rowspan', desc: '垂直跨越列數', defaultVal: '2' }
  ],
  th: [
    { key: 'scope', label: 'scope', desc: '表頭範疇 (col/row)', defaultVal: 'col', values: ['col', 'row', 'colgroup', 'rowgroup'] },
    { key: 'colspan', label: 'colspan', desc: '跨欄數', defaultVal: '2' },
    { key: 'rowspan', label: 'rowspan', desc: '跨列數', defaultVal: '2' }
  ]
};

/**
 * 取得指定 HTML 標籤適用的屬性定義（包含專屬特有屬性與通用屬性）
 * @param {string} tag - HTML 標籤名稱（如 'img', 'a', 'input', 'div'）
 * @returns {{ specific: Array, global: Array, all: Array }}
 */
export function getAvailableAttributesForTag(tag) {
  const normalizedTag = (tag || '').toLowerCase().replace(/[<>]/g, '').trim();
  const specific = TAG_SPECIFIC_ATTRIBUTES[normalizedTag] || [];
  const global = GLOBAL_ATTRIBUTES;
  
  // 合併列表並去重複
  const seen = new Set();
  const all = [];

  for (const item of specific) {
    seen.add(item.key);
    all.push({ ...item, isSpecific: true });
  }

  for (const item of global) {
    if (!seen.has(item.key)) {
      seen.add(item.key);
      all.push({ ...item, isSpecific: false });
    }
  }

  return {
    specific,
    global,
    all
  };
}

/**
 * 取得特定標籤的特定屬性的候選預設值/枚舉值清單（若有）
 * @param {string} tag - HTML 標籤
 * @param {string} key - 屬性名稱
 * @returns {Array<string>} 候選值陣列
 */
export function getSuggestedValuesForAttr(tag, key) {
  if (!key) return [];
  const normalizedTag = (tag || '').toLowerCase().replace(/[<>]/g, '').trim();
  const lowerKey = key.toLowerCase().trim();

  // 1. 先查專屬屬性是否有枚舉值
  const specific = TAG_SPECIFIC_ATTRIBUTES[normalizedTag] || [];
  const foundSpecific = specific.find(item => item.key.toLowerCase() === lowerKey);
  if (foundSpecific && foundSpecific.values) {
    return foundSpecific.values;
  }

  // 2. 查全域通用字典或特定屬性類型
  if (lowerKey === 'target') return ['_blank', '_self', '_top', '_parent'];
  if (lowerKey === 'method') return ['post', 'get'];
  if (lowerKey === 'loading') return ['lazy', 'eager'];
  if (lowerKey === 'type' && (normalizedTag === 'input' || normalizedTag === 'button')) {
    return ['text', 'password', 'email', 'number', 'checkbox', 'radio', 'submit', 'button', 'file'];
  }

  return [];
}
