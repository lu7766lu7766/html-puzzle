// HTML 知識小手冊與核心心智模型資料庫 (來自資訊科技教材精華)
export const HANDBOOK_MODULES = [
  {
    id: 1,
    title: "Module 01: HTML 概念與元素三大構成",
    tag: "心智模型",
    summary: "HTML 是網頁骨骼與地基，由起始標籤、內容與結束標籤構成。",
    points: [
      {
        title: "HTML 的角色定位",
        desc: "HTML 是標記語言（Markup Language），非程式運算語言。比喻：HTML 是骨骼支撐肉體，CSS 是衣服外觀，JS 是大腦神經與動作互動。"
      },
      {
        title: "元素（Element）三大組成",
        desc: "1. 起始標籤 <tag>（宣告性質與包含屬性）\n2. 元素內容 Content（文字或巢狀子標籤）\n3. 結束標籤 </tag>（宣告影響範圍結束）。"
      },
      {
        title: "純粹清清楚楚",
        desc: "HTML 不在乎畫面好不好看，唯一任務是用最精確的標籤告訴瀏覽器「這裡有什麼內容與結構」。"
      }
    ],
    codeSnippet: `<p class="intro">歡迎來到資訊科技課！</p>`
  },
  {
    id: 2,
    title: "Module 02: 渲染向量、巢狀與換行避坑",
    tag: "向量與巢狀",
    summary: "瀏覽器遵循由左至右、由上至下標準流。Enter 不等於換行！",
    points: [
      {
        title: "文檔流向 (Normal Flow)",
        desc: "「由左至右 (LTR)，由上至下 (TTB)」，如讀書般依序渲染未經特殊定位的元素。"
      },
      {
        title: "巢狀結構 (Nested Hierarchy)",
        desc: "標籤層層包含，形成父元素 (Parent)、子元素 (Child) 與兄弟節點。縮排層次直接決定代碼可讀性與維護性。"
      },
      {
        title: "⚡ 避坑重點：Enter 不等於換行！",
        desc: "在代碼編輯器隨意按下 Enter，瀏覽器解讀為 \\n 僅轉譯為「一個空白鍵」，絕不會自動換行！"
      },
      {
        title: "強制換行與自閉合標籤",
        desc: "瀏覽器唯一認得的強制換行是 <br /> 空標籤（Void Tag）。空標籤無包覆內容，不需 </tag> 結束標籤（如 <meta />, <br />, <input />, <img />）。"
      }
    ],
    codeSnippet: `<div>\n  <span>第一行文字</span><br />\n  <span>第二行文字 (強制換行)</span>\n</div>`
  },
  {
    id: 3,
    title: "Module 03: 標準網頁骨架剖析",
    tag: "標準骨架",
    summary: "四大核心架構：DOCTYPE、html 根元素、head 中繼區、body 可視區。",
    points: [
      {
        title: "<!DOCTYPE html>",
        desc: "文件類型宣告 (DTD)，告訴瀏覽器採用 HTML5 標準規格渲染，避免觸發怪異模式 (Quirks Mode)。必置於第一行。"
      },
      {
        title: "<html> 根元素",
        desc: "所有標籤最高層級容器，包覆整個網頁全部內容。"
      },
      {
        title: "<head> 中繼設定區",
        desc: "畫面上看不見的資訊：編碼 (<meta charset=\"UTF-8\">)、標題分頁名稱 (<title>)、外部樣式等。"
      },
      {
        title: "<body> 主要可視內容區",
        desc: "使用者在視窗中實際看得見的所有內容（h1、p、img、form、button 等）全數放置於此。"
      }
    ],
    codeSnippet: `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8">\n    <title>網頁標題</title>\n  </head>\n  <body>\n    <h1>歡迎光臨！</h1>\n  </body>\n</html>`
  },
  {
    id: 4,
    title: "Module 04: 現代語意化標籤 (Semantic Tags)",
    tag: "語意排版",
    summary: "告別無意義的 div 地獄，讓搜尋引擎與無障礙設備讀懂結構。",
    points: [
      {
        title: "<header> 與 <nav>",
        desc: "<header> 呈現網頁表頭、Logo、標題；<nav> 包裹主導覽列清單，輔助螢幕閱讀器快速跳轉。"
      },
      {
        title: "<main> 與 <article>",
        desc: "<main> 代表全頁最核心且獨一無二的內容（每頁只能有一個）；<article> 為可獨立分發的完整文章/卡片單元。"
      },
      {
        title: "<section>, <aside>, <footer>",
        desc: "<section> 是具備主題標題的邏輯章節；<aside> 是側邊欄或次要補充資訊；<footer> 是頁尾版權宣告與聯絡資訊。"
      }
    ],
    codeSnippet: `<header>\n  <nav><a href="#home">首頁</a></nav>\n</header>\n<main>\n  <article>\n    <h2>最新公告</h2>\n    <p>內容...</p>\n  </article>\n</main>\n<footer>&copy; 2026 資訊社</footer>`
  },
  {
    id: 5,
    title: "Module 05: HTML 四大核心屬性",
    tag: "屬性核心",
    summary: "id 身分證、class 樣式類別、style 行內樣式、onclick 點擊事件。",
    points: [
      {
        title: "id 屬性（唯一身分證）",
        desc: "全頁面不得重複，供 JavaScript 或 CSS 錨點精確鎖定單一元素。"
      },
      {
        title: "class 屬性（類別共用群組）",
        desc: "可重複套用於多個元素，現代 CSS 模組化元件樣式設計的核心。"
      },
      {
        title: "style 屬性（行內即時樣式）",
        desc: "直接給予元素專屬 CSS，權重極高但維護成本高，適合臨時微調。"
      },
      {
        title: "onclick 屬性（點擊事件監聽）",
        desc: "掛載 JavaScript 互動程式碼，點擊時立即觸發執行。"
      }
    ],
    codeSnippet: `<div id="banner" class="hero-box" style="color:blue;" onclick="alert('嗨')">點我</div>`
  },
  {
    id: 6,
    title: "Module 06: 常用基礎標籤速查",
    tag: "常用標籤",
    summary: "涵蓋區塊容器、行內文字、多媒體與清單表格。",
    points: [
      {
        title: "區塊 (Block) vs 行內 (Inline)",
        desc: "<div> 預設獨佔整行 (Block)，適合做排版大骨架；<span> 不換行 (Inline)，適合包覆段落中特定文字做局域上色。"
      },
      {
        title: "<h1> ~ <h6> 與段落 <p>",
        desc: "h1 權重最高最大，h6 最小；<p> 為文字段落，自帶上下外邊距。"
      },
      {
        title: "超連結 <a> 與圖片 <img>",
        desc: "<a> 透過 href 指定跳轉網址；<img> 透過 src 載入圖片、alt 描述替代文字（空標籤）。"
      },
      {
        title: "清單 <ul>/<ol> + <li>",
        desc: "<ul> 為無序項目符號 (Unordered List)，內層必須搭配 <li> (List Item) 條列呈現。"
      }
    ],
    codeSnippet: `<ul>\n  <li><a href="https://example.com">點我連結</a></li>\n  <li><img src="logo.png" alt="標誌" /></li>\n</ul>`
  },
  {
    id: 7,
    title: "Module 07: 表單世界與輸入控制項",
    tag: "表單控制",
    summary: "input 多種 type、label 擴大熱區、radio 同名互斥原則。",
    points: [
      {
        title: "<input> 常用 Type",
        desc: "text (單行文字)、password (密碼遮罩)、number (純數值)、radio (單選圓鈕)、checkbox (多選核取方塊)。"
      },
      {
        title: "⚡ 關鍵定律：Radio 單選互斥",
        desc: "同一個問題的多個單選選項，其 name 屬性必須完全相同（例如 name=\"time\"），瀏覽器才能實現互斥單選！"
      },
      {
        title: "<label> 的提升體驗作用",
        desc: "用 <label> 包裹輸入框與文字，點擊文字也能觸發勾選，大幅提升點選熱區 (Clickable Area)！"
      },
      {
        title: "placeholder 提示文字",
        desc: "輸入框空白時顯示反灰提示，一旦打字自動消失。"
      }
    ],
    codeSnippet: `<label><input type="radio" name="plan" value="a" checked /> 方案 A</label>\n<label><input type="radio" name="plan" value="b" /> 方案 B</label>`
  }
];
