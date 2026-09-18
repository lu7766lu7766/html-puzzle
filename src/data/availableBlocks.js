// 全局可用積木與標籤庫（供沙盒與自選使用）
export const HTML_BLOCK_PALETTE = {
  structure: [
    { type: "container", tag: "div", label: "<div>", desc: "區塊矩形容器，獨佔一行" },
    { type: "container", tag: "span", label: "<span>", desc: "行內容器，適合包裹局部文字" },
    { type: "container", tag: "header", label: "<header>", desc: "網頁表頭與網站標誌區" },
    { type: "container", tag: "nav", label: "<nav>", desc: "主導覽列清單容器" },
    { type: "container", tag: "main", label: "<main>", desc: "網頁核心獨一無二內容" },
    { type: "container", tag: "article", label: "<article>", desc: "可獨立分發之文章單元" },
    { type: "container", tag: "section", label: "<section>", desc: "文件邏輯章節分區" },
    { type: "container", tag: "footer", label: "<footer>", desc: "頁尾版權與聯絡宣告" }
  ],
  text: [
    { type: "container", tag: "h1", label: "<h1>", desc: "最高權重一級大標題", text: "主標題文字" },
    { type: "container", tag: "h2", label: "<h2>", desc: "二級副標題", text: "副標題文字" },
    { type: "container", tag: "p", label: "<p>", desc: "文字段落，帶有下邊距", text: "這是一段網頁文字說明。" },
    { type: "void_tag", tag: "br", label: "<br />", desc: "強制換行空標籤（無須閉合）" },
    { type: "void_tag", tag: "hr", label: "<hr />", desc: "水平分隔線空標籤" },
    { type: "container", tag: "strong", label: "<strong>", desc: "語意重要粗體強調", text: "重點文字" },
    { type: "container", tag: "s", label: "<s>", desc: "刪除線文字", text: "特價前原價" }
  ],
  media_links: [
    { 
      type: "container", 
      tag: "a", 
      label: "<a> 超連結", 
      desc: "跳轉目標超連結", 
      attrs: { href: "https://example.com" },
      text: "點擊前往連結" 
    },
    { 
      type: "void_tag", 
      tag: "img", 
      label: "<img> 圖片", 
      desc: "外部圖像多媒體空標籤", 
      attrs: { 
        src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300", 
        alt: "展示圖片",
        class: "rounded-lg max-w-[200px]"
      } 
    },
    { type: "container", tag: "ul", label: "<ul> 清單", desc: "無序項目符號清單", children: [] },
    { type: "container", tag: "li", label: "<li> 項目", desc: "清單項目元素", text: "項目條目" },
    { type: "container", tag: "button", label: "<button>", desc: "標準互動按鈕", text: "點擊按鈕" }
  ],
  forms: [
    { 
      type: "void_tag", 
      tag: "input", 
      label: '<input type="text" />', 
      desc: "單行文字輸入框",
      attrs: { type: "text", placeholder: "請輸入內容..." }
    },
    { 
      type: "void_tag", 
      tag: "input", 
      label: '<input type="radio" />', 
      desc: "單選圓鈕（同 name 互斥）",
      attrs: { type: "radio", name: "option", value: "1" }
    },
    { 
      type: "void_tag", 
      tag: "input", 
      label: '<input type="checkbox" />', 
      desc: "多選方框",
      attrs: { type: "checkbox", value: "check" }
    },
    { 
      type: "container", 
      tag: "label", 
      label: "<label> 標籤", 
      desc: "表單選項包覆器，擴大點擊熱區",
      children: [],
      text: " 選項名稱"
    }
  ],
  attributes: [
    { key: "id", value: "custom-id", label: 'id="custom-id"' },
    { key: "class", value: "highlight-box", label: 'class="highlight-box"' },
    { key: "style", value: "color:red;", label: 'style="color:red;"' },
    { key: "onclick", value: "alert('Hello!')", label: 'onclick="alert(...)"' },
    { key: "placeholder", value: "請輸入資訊", label: 'placeholder="..."' },
    { key: "name", value: "group1", label: 'name="group1"' }
  ]
};
