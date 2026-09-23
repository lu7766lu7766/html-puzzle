// 7 大模組關卡 + 3 道課堂實作魔王題完整關卡資料庫
export const PUZZLE_LEVELS = [
  {
    id: "stage-1",
    levelNumber: 1,
    category: "module",
    title: "第一關：發布第一則公告",
    moduleTitle: "Module 01: HTML 概念與三大構成",
    badge: "元素大師",
    scenario: "資訊社剛成立，社長需要發布第一則社團歡迎公告。請幫他將標籤的「起始標籤」、「文字內容」與「結束標籤」拼合完整！",
    hint: "HTML 元素三大核心：起始標籤 <p> 宣告開始，中間放實質內容，結束標籤 </p> 代表閉合！",
    defaultMode: "strict",
    requiredBlocksCount: 3,
    learningGoal: "掌握起始標籤、內容與結束標籤的三大構成與閉合關係。",
    targetDescription: "使用 <p> 標籤完整包覆文字，呈現一段獨立的歡迎公告段落。",
    targetHtml: `<p>
歡迎加入資訊科技研習社！
</p>`,
    initialBlocks: [
      { id: "b1", type: "open_tag", tag: "p", label: "<p>" },
      { id: "b2", type: "text", text: "歡迎加入資訊科技研習社！" },
      { id: "b3", type: "close_tag", tag: "p", label: "</p>" },
      { id: "b_distract_1", type: "open_tag", tag: "span", label: "<span>" }
    ],
    targetStructure: {
      tag: "p",
      textPattern: "歡迎加入資訊科技研習社"
    },
    checklist: [
      { id: "has_p_open", label: "使用 <p> 起始標籤" },
      { id: "has_content", label: "填入公告文字內容" },
      { id: "has_p_close", label: "使用 </p> 結束標籤正確閉合" }
    ]
  },
  {
    id: "stage-2",
    levelNumber: 2,
    category: "module",
    title: "第二關：打破換行迷思",
    moduleTitle: "Module 02: 渲染向量與換行避坑",
    badge: "文檔流先鋒",
    scenario: "走廊公告欄的兩行訊息黏在一起了！有同學按了十次 Enter 鍵也沒用，請使用 <div> 容器將內容完整包覆，並加入空標籤 <br /> 替公告強制換行。",
    hint: "避坑定律：1. 需使用 <div> 與 </div> 容器標籤將文字內容完整包覆；2. Enter 在 HTML 中只等於一個空白鍵，強制換行請使用自閉合空標籤 <br />（不需要 </br>）！",
    defaultMode: "strict",
    requiredBlocksCount: 5,
    learningGoal: "理解文檔流向量、Enter 不等於換行，以及空標籤（自閉合）的特性。",
    targetDescription: "在 <div> 內將兩行文字透過自閉合空標籤 <br /> 分隔換行顯示。",
    targetHtml: `<div>
活動時間：本週五下午四點
<br />
活動地點：第二電腦教室
</div>`,
    initialBlocks: [
      { id: "b_div_open", type: "open_tag", tag: "div", label: "<div>" },
      { id: "b_t1", type: "text", text: "活動時間：本週五下午四點" },
      { id: "b_br", type: "void_tag", tag: "br", label: "<br /> (空標籤)" },
      { id: "b_t2", type: "text", text: "活動地點：第二電腦教室" },
      { id: "b_div_close", type: "close_tag", tag: "div", label: "</div>" }
    ],
    targetStructure: {
      hasBr: true,
      hasTwoLines: true
    },
    checklist: [
      { id: "has_container", label: "以 <div> 容器包覆內容" },
      { id: "has_br_tag", label: "兩段文字中間加入 <br /> 強制換行" },
      { id: "understands_void", label: "正確使用自閉合標籤（無需 </br>）" }
    ]
  },
  {
    id: "stage-3",
    levelNumber: 3,
    category: "module",
    title: "第三關：網頁標準骨架地基",
    moduleTitle: "Module 03: 標準網頁骨架剖析",
    badge: "架構工程師",
    scenario: "建造網站如同蓋摩天大樓，沒有地基瀏覽器會陷入怪異模式！請從 DOCTYPE 宣告開始，組裝出標準現代網頁骨架。",
    hint: "標準順序：<!DOCTYPE html> 第一行，接著 <html> 根元素包覆全部；<head> 放看不見的資訊 (<title>)，<body> 放看得見的內容！",
    defaultMode: "container",
    requiredBlocksCount: 7,
    learningGoal: "建立 DOCTYPE、html 根元素、head 與 body 的完整巢狀架構思維。",
    targetDescription: "標準現代網頁結構：含 DOCTYPE、head 標題，以及 body 內的 h1 大標題與 p 內文。",
    targetHtml: `<!DOCTYPE html>
<html>
  <head>
    <title>校園資訊網</title>
  </head>
  <body>
    <h1>歡迎來到校園資訊網</h1>
    <p>今日熱門社團活動報導</p>
  </body>
</html>`,
    initialBlocks: [
      { id: "b_dtd", type: "void_tag", tag: "!DOCTYPE html", label: "<!DOCTYPE html>" },
      { id: "b_html", type: "container", tag: "html", label: "<html>...</html>", children: [] },
      { id: "b_head", type: "container", tag: "head", label: "<head>...</head>", children: [] },
      { id: "b_title", type: "container", tag: "title", label: "<title>...</title>", text: "校園資訊網" },
      { id: "b_body", type: "container", tag: "body", label: "<body>...</body>", children: [] },
      { id: "b_h1", type: "container", tag: "h1", label: "<h1>...</h1>", text: "歡迎來到校園資訊網" },
      { id: "b_p", type: "container", tag: "p", label: "<p>...</p>", text: "今日熱門社團活動報導" }
    ],
    targetStructure: {
      hasDoctype: true,
      hasHeadWithTitle: true,
      hasBodyWithContent: true
    },
    checklist: [
      { id: "chk_dtd", label: "首行放置 <!DOCTYPE html> 宣告" },
      { id: "chk_head", label: "<head> 中包含 <title> 分頁標題" },
      { id: "chk_body", label: "<body> 中包含 <h1> 標題與 <p> 內容" }
    ]
  },
  {
    id: "stage-4",
    levelNumber: 4,
    category: "module",
    title: "第四關：校刊專題語意化排版",
    moduleTitle: "Module 04: 現代語意化標籤",
    badge: "語意守護者",
    scenario: "校刊社專題排版充斥著無意義的 <div>！請使用語意化標籤重塑清晰結構：在頂部 <header> 中放入 <nav> 導覽列，在核心主體 <main> 中放入專題文章 <article>（包含副標題與內文），最後在頁尾以 <footer> 宣告版權。",
    hint: "語意排版三大分區與巢狀心法：\n1. 頂部：<header> 容器內部放入 <nav> 導覽列\n2. 主體：<main> 核心主體容器內部放入 <article> 獨立文章，<article> 內部再放入 <h2> 標題與 <p> 內文\n3. 頁尾：<footer> 置於最底部宣告版權聲明！",
    defaultMode: "container",
    requiredBlocksCount: 7,
    learningGoal: "告別 div 地獄，掌握 header 包覆 nav、main 包覆 article，以及 footer 佈局的標準語意化結構。",
    targetDescription: "語意化版面：表頭 <header> 包含導覽 <nav>，主體 <main> 包含文章 <article>（含 h2 與 p），底部配置 <footer> 版權聲明。",
    targetHtml: `<header>
  <nav>首頁 | 最新專題 | 關於我們</nav>
</header>
<main>
  <article>
    <h2>探索 AI 人工智慧新浪潮</h2>
    <p>高中生如何運用生成式 AI 提升自主學習效率？</p>
  </article>
</main>
<footer>© 2026 校刊社版權所有</footer>`,
    initialBlocks: [
      { id: "b_header", type: "container", tag: "header", label: "<header> 表頭", children: [] },
      { id: "b_nav", type: "container", tag: "nav", label: "<nav> 導覽", text: "首頁 | 最新專題 | 關於我們" },
      { id: "b_main", type: "container", tag: "main", label: "<main> 核心主體", children: [] },
      { id: "b_art", type: "container", tag: "article", label: "<article> 獨立文章", children: [] },
      { id: "b_h2", type: "container", tag: "h2", label: "<h2>", text: "探索 AI 人工智慧新浪潮" },
      { id: "b_p_art", type: "container", tag: "p", label: "<p>", text: "高中生如何運用生成式 AI 提升自主學習效率？" },
      { id: "b_footer", type: "container", tag: "footer", label: "<footer> 頁尾版權", text: "© 2026 校刊社版權所有" }
    ],
    checklist: [
      { id: "chk_header_nav", label: "<header> 內部包含 <nav> 導覽連結" },
      { id: "chk_main_article", label: "<main> 內部包含獨立 <article> 文章" },
      { id: "chk_footer", label: "放置 <footer> 標記版權聲明" }
    ]
  },
  {
    id: "stage-5",
    levelNumber: 5,
    category: "module",
    title: "第五關：神兵屬性晶片插槽",
    moduleTitle: "Module 05: HTML 四大核心屬性",
    badge: "屬性調度師",
    scenario: "社團首頁需要一個酷炫的互動按鈕！請為 <button> 插上身分證 id、樣式群組 class、行內樣式 style 與點擊監聽 onclick！",
    hint: "屬性晶片：id 具唯一性，class 樣式類別，style 自訂行內色彩，onclick 觸發點擊警示！",
    defaultMode: "container",
    requiredBlocksCount: 5,
    learningGoal: "掌握 id, class, style 與 onclick 四大屬性的語法與作用。",
    targetDescription: "具備紅色字體、id/class 與點擊互動 onclick 彈窗的按鈕元件。",
    targetHtml: `<button id="like-btn" class="btn-primary" style="color:crimson;font-weight:bold;" onclick="alert('感謝特工點讚！')">點我送出愛心</button>`,
    initialBlocks: [
      { 
        id: "b_btn", 
        type: "container", 
        tag: "button", 
        label: "<button> 按鈕", 
        text: "點我送出愛心",
        attrs: {} 
      },
      { id: "attr_id", type: "attr", key: "id", value: "like-btn", label: 'id="like-btn"' },
      { id: "attr_class", type: "attr", key: "class", value: "btn-primary", label: 'class="btn-primary"' },
      { id: "attr_style", type: "attr", key: "style", value: "color:crimson;font-weight:bold;", label: 'style="color:crimson;"' },
      { id: "attr_click", type: "attr", key: "onclick", value: "alert('感謝特工點讚！')", label: 'onclick="alert(...)"' }
    ],
    checklist: [
      { id: "chk_id", label: "按鈕掛載 id 唯一身分證" },
      { id: "chk_class", label: "按鈕掛載 class 樣式類別" },
      { id: "chk_style", label: "按鈕掛載 style 行內色彩" },
      { id: "chk_onclick", label: "按鈕掛載 onclick 點擊互動事件" }
    ]
  },
  {
    id: "stage-6",
    levelNumber: 6,
    category: "module",
    title: "第六關：特工個人多媒體檔案",
    moduleTitle: "Module 06: 常用基礎標籤速查",
    badge: "多媒體大亨",
    scenario: "特工需要建立一份完整的個人技能與社群名片，包含標題 <h1>、清單 <ul>/<li>、超連結 <a> 與多媒體圖片 <img>！",
    hint: "<ul> 是清單外框，清單項目必須用 <li>；<img> 是自閉合空標籤，需填入 src 圖檔來源與 alt 替代文字！",
    defaultMode: "container",
    requiredBlocksCount: 5,
    learningGoal: "熟練掌握標題層次、項目符號清單、超連結與圖片標籤。",
    targetDescription: "特工名片：醒目的一級標題、項目清單與工作筆電照片。",
    targetHtml: `<h1>資訊特工：小明</h1>
<ul>
  <li>專業：前端架構與 DOM 樹拼裝</li>
  <li>徽章：獲頒全校資訊解謎特工第一名</li>
</ul>
<img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=60" alt="特工工作筆電" class="rounded-lg shadow-md max-w-[240px] my-2" />`,
    initialBlocks: [
      { id: "b_h1_agent", type: "container", tag: "h1", label: "<h1>", text: "資訊特工：小明" },
      { id: "b_ul", type: "container", tag: "ul", label: "<ul> 清單", children: [] },
      { id: "b_li1", type: "container", tag: "li", label: "<li>", text: "專業：前端架構與 DOM 樹拼裝" },
      { id: "b_li2", type: "container", tag: "li", label: "<li>", text: "徽章：獲頒全校資訊解謎特工第一名" },
      { 
        id: "b_img", 
        type: "void_tag", 
        tag: "img", 
        label: '<img src="..." alt="特工證" />',
        attrs: { 
          src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=60", 
          alt: "特工工作筆電",
          class: "rounded-lg shadow-md max-w-[240px] my-2"
        }
      }
    ],
    checklist: [
      { id: "chk_h1", label: "使用 <h1> 呈現大標題" },
      { id: "chk_ul_li", label: "使用 <ul> 搭配 <li> 建立項目清單" },
      { id: "chk_img", label: "正確配置 <img> 標籤並填妥 src 與 alt" }
    ]
  },
  {
    id: "stage-7",
    levelNumber: 7,
    category: "module",
    title: "第七關：全校選修表單大作戰",
    moduleTitle: "Module 07: 表單世界與輸入控制項",
    badge: "表單架構師",
    scenario: "選修課系統即將上線！請製作包含「學號輸入框（含 placeholder）」與「兩個互相排斥的單選時段」，並用 <label> 提升點擊範圍！",
    hint: "單選互斥關鍵：兩個 radio 的 name 屬性必須完全相同！用 <label> 包裹文字與選項，點擊文字也能秒選！",
    defaultMode: "container",
    requiredBlocksCount: 5,
    learningGoal: "掌握 input text、placeholder、radio 單選互斥 name 屬性與 label 綁定體驗。",
    targetDescription: "選修表單：具備灰字提示的學號輸入框，以及透過 label 包裹且互相排斥的上午/下午單選時段。",
    targetHtml: `<input type="text" placeholder="請輸入學號" />
<label>
   上午時段
  <input type="radio" name="shift" value="morning" />
</label>
<label>
   下午時段
  <input type="radio" name="shift" value="afternoon" />
</label>`,
    initialBlocks: [
      { 
        id: "b_inp_txt", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="text" placeholder="請輸入學號" />',
        attrs: { type: "text", placeholder: "請輸入學號" }
      },
      { 
        id: "b_lbl_1", 
        type: "container", 
        tag: "label", 
        label: "<label> 上午班", 
        children: [],
        text: " 上午時段"
      },
      { 
        id: "b_rad_1", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="radio" name="shift" />',
        attrs: { type: "radio", name: "shift", value: "morning" }
      },
      { 
        id: "b_lbl_2", 
        type: "container", 
        tag: "label", 
        label: "<label> 下午班", 
        children: [],
        text: " 下午時段"
      },
      { 
        id: "b_rad_2", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="radio" name="shift" />',
        attrs: { type: "radio", name: "shift", value: "afternoon" }
      }
    ],
    checklist: [
      { id: "chk_inp_placeholder", label: "輸入框配置 placeholder 反灰提示" },
      { id: "chk_radio_mutual", label: "兩個 radio 的 name 屬性相同（具備互斥性）" },
      { id: "chk_label_wrap", label: "使用 <label> 包裹選項提升點擊熱區" }
    ]
  },
  // 3 道課堂經典實作魔王題
  {
    id: "boss-1",
    levelNumber: 8,
    category: "boss",
    title: "魔王題一：圖片傳送門超連結",
    moduleTitle: "Practice 01: 課堂實戰練習 (一)",
    badge: "傳送門造物主",
    scenario: "【課堂實戰一】：試著寫出一張圖片，當使用者點擊該圖片時，能夠自動超連結跳轉到 Google 首頁（https://www.google.com）。",
    hint: "<a> 標籤是容器，可以直接把 <img> 圖片標籤包裹在其內容區間，這樣整張圖片都會變成可點擊的熱區！",
    defaultMode: "container",
    requiredBlocksCount: 2,
    learningGoal: "實踐標籤巢狀包覆（<a> 包覆 <img>）與 href 屬性跳轉應用。",
    targetDescription: "圖片超連結傳送門：點擊 Google 圖片標誌即可在新分頁開啟 Google 官網。",
    targetHtml: `<a href="https://www.google.com" target="_blank">
  <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png" alt="Google 首頁" class="h-14 object-contain inline-block p-2 bg-white rounded border border-slate-700 hover:scale-105 transition-transform" />
</a>`,
    initialBlocks: [
      { 
        id: "b_boss1_a", 
        type: "container", 
        tag: "a", 
        label: '<a href="https://www.google.com">',
        attrs: { href: "https://www.google.com", target: "_blank" },
        children: []
      },
      { 
        id: "b_boss1_img", 
        type: "void_tag", 
        tag: "img", 
        label: '<img src="google_logo.png" alt="Google 首頁" />',
        attrs: { 
          src: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png", 
          alt: "Google 首頁",
          class: "h-14 object-contain inline-block p-2 bg-white rounded border border-slate-700 hover:scale-105 transition-transform"
        }
      }
    ],
    checklist: [
      { id: "chk_nest_a_img", label: "使用 <a> 標籤完整包覆 <img> 圖片標籤" },
      { id: "chk_href_google", label: "超連結 href 正確指向 https://www.google.com" },
      { id: "chk_img_clickable", label: "圖片具備完整可點擊跳轉熱區" }
    ]
  },
  {
    id: "boss-2",
    levelNumber: 9,
    category: "boss",
    title: "魔王題二：預設值表單與單選互斥",
    moduleTitle: "Practice 02: 課堂實戰練習 (二)",
    badge: "極致表單達人",
    scenario: "【課堂實戰二】：寫出一張表單：1. 標題『尊姓大名』文字輸入框，空白時以灰色呈現『王XX』；2. Radio 單選選擇器（選項：早上、中午、晚上）；3. 最後附一個『送出』按鈕。",
    hint: "綜合表單心法：輸入框提供預設提示、多個單選鈕透過相同 name 群組達成互斥、使用 label 包覆提升點擊體驗，最後加上送出按鈕！",
    defaultMode: "container",
    requiredBlocksCount: 9,
    learningGoal: "綜合應用 placeholder、radio 單選互斥 name、label 綁定與按鈕元件。",
    targetDescription: "課堂綜合表單：姓名輸入框（反灰王XX）、三個互斥時段單選（早/中/晚）與送出按鈕。",
    targetHtml: `<div>
  尊姓大名 
  <input type="text" placeholder="王XX" />
</div>
<label>
   早上
  <input type="radio" name="time" value="morning" />
</label>
<label>
   中午
  <input type="radio" name="time" value="noon" />
</label>
<label>
   晚上
  <input type="radio" name="time" value="evening" />
</label>
<button>送出</button>`,
    initialBlocks: [
      { 
        id: "b_f_name", 
        type: "container", 
        tag: "div", 
        label: "<div> 姓名區塊", 
        text: "尊姓大名 ",
        children: [] 
      },
      { 
        id: "b_f_inp_name", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="text" placeholder="王XX" />',
        attrs: { type: "text", placeholder: "王XX" } 
      },
      { 
        id: "b_f_r1", 
        type: "container", 
        tag: "label", 
        label: "<label> 早上", 
        text: " 早上",
        children: [] 
      },
      { 
        id: "b_f_inp_r1", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="radio" name="time" />',
        attrs: { type: "radio", name: "time", value: "morning" } 
      },
      { 
        id: "b_f_r2", 
        type: "container", 
        tag: "label", 
        label: "<label> 中午", 
        text: " 中午",
        children: [] 
      },
      { 
        id: "b_f_inp_r2", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="radio" name="time" />',
        attrs: { type: "radio", name: "time", value: "noon" } 
      },
      { 
        id: "b_f_r3", 
        type: "container", 
        tag: "label", 
        label: "<label> 晚上", 
        text: " 晚上",
        children: [] 
      },
      { 
        id: "b_f_inp_r3", 
        type: "void_tag", 
        tag: "input", 
        label: '<input type="radio" name="time" />',
        attrs: { type: "radio", name: "time", value: "evening" } 
      },
      { 
        id: "b_f_btn", 
        type: "container", 
        tag: "button", 
        label: "<button> 送出", 
        text: "送出" 
      }
    ],
    checklist: [
      { id: "chk_placeholder_wang", label: '姓名輸入框含 placeholder="王XX"' },
      { id: "chk_three_radio_name", label: "早上/中午/晚上三個 radio 的 name 完全相同" },
      { id: "chk_labels_wrapped", label: "三選項皆使用 <label> 包覆提升點選熱區" },
      { id: "chk_submit_btn", label: "附帶一個「送出」按鈕" }
    ]
  },
  {
    id: "boss-3",
    levelNumber: 10,
    category: "boss",
    title: "魔王題三：文字刪除線與樣式對比",
    moduleTitle: "Practice 03: 課堂實戰練習 (三)",
    badge: "樣式煉金術師",
    scenario: "【課堂實戰三】：試著寫出一段文字『test』，上面帶有一條刪除線，文字顏色為紅色，文字大小為 32px！體驗傳統標籤 vs 現代 CSS Style 寫法！",
    hint: '現代標準推薦寫法：<span style="text-decoration: line-through; color: red; font-size: 32px;">test</span>！HTML 專注結構，外觀由 style 控制！',
    defaultMode: "container",
    requiredBlocksCount: 1,
    learningGoal: "比較傳統 <s><font> 與現代標準 <span> + style 的結構分離心法。",
    targetDescription: "指定文字「test」呈現紅色、帶有刪除線與 32px 大字體效果。",
    targetHtml: `<span style="text-decoration: line-through; color: red; font-size: 32px;">test</span>`,
    initialBlocks: [
      { 
        id: "b_boss3_span", 
        type: "container", 
        tag: "span", 
        label: "<span> 現代樣式容器", 
        text: "test",
        attrs: {
          style: "text-decoration: line-through; color: red; font-size: 32px;"
        }
      },
      { 
        id: "b_boss3_s_trad", 
        type: "container", 
        tag: "s", 
        label: "<s> 傳統刪除線", 
        children: []
      },
      { 
        id: "b_boss3_font_trad", 
        type: "container", 
        tag: "font", 
        label: '<font color="red" size="6">', 
        attrs: { color: "red", size: "6" },
        text: "test"
      }
    ],
    checklist: [
      { id: "chk_text_test", label: "包含指定文字「test」" },
      { id: "chk_strikethrough", label: "文字具有刪除線效果 (line-through 或 <s>)" },
      { id: "chk_color_red", label: "文字呈現紅色 (color: red)" },
      { id: "chk_size_32", label: "文字呈現大字體 (font-size: 32px 或 size 屬性)" }
    ]
  }
];
