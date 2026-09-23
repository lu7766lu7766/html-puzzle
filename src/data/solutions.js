// 各關卡參考解答與解謎模板庫
export const LEVEL_SOLUTIONS = {
  'stage-1': [
    { id: 's1_p_open', type: 'open_tag', tag: 'p', label: '<p>' },
    { id: 's1_text', type: 'text', text: '歡迎加入資訊科技研習社！' },
    { id: 's1_p_close', type: 'close_tag', tag: 'p', label: '</p>' }
  ],
  'stage-2': [
    { id: 's2_div_open', type: 'open_tag', tag: 'div', label: '<div>' },
    { id: 's2_t1', type: 'text', text: '活動時間：本週五下午四點' },
    { id: 's2_br', type: 'void_tag', tag: 'br', label: '<br />' },
    { id: 's2_t2', type: 'text', text: '活動地點：第二電腦教室' },
    { id: 's2_div_close', type: 'close_tag', tag: 'div', label: '</div>' }
  ],
  'stage-3': [
    { id: 's3_dtd', type: 'void_tag', tag: '!DOCTYPE html', label: '<!DOCTYPE html>' },
    {
      id: 's3_html',
      type: 'container',
      tag: 'html',
      label: '<html>',
      children: [
        {
          id: 's3_head',
          type: 'container',
          tag: 'head',
          label: '<head>',
          children: [
            { id: 's3_title', type: 'container', tag: 'title', label: '<title>', text: '校園資訊網' }
          ]
        },
        {
          id: 's3_body',
          type: 'container',
          tag: 'body',
          label: '<body>',
          children: [
            { id: 's3_h1', type: 'container', tag: 'h1', label: '<h1>', text: '歡迎來到校園資訊網' },
            { id: 's3_p', type: 'container', tag: 'p', label: '<p>', text: '今日熱門社團活動報導' }
          ]
        }
      ]
    }
  ],
  'stage-4': [
    {
      id: 's4_header',
      type: 'container',
      tag: 'header',
      label: '<header>',
      children: [
        { id: 's4_nav', type: 'container', tag: 'nav', label: '<nav>', text: '首頁 | 最新專題 | 關於我們' }
      ]
    },
    {
      id: 's4_main',
      type: 'container',
      tag: 'main',
      label: '<main>',
      children: [
        {
          id: 's4_art',
          type: 'container',
          tag: 'article',
          label: '<article>',
          children: [
            { id: 's4_h2', type: 'container', tag: 'h2', label: '<h2>', text: '探索 AI 人工智慧新浪潮' },
            { id: 's4_p', type: 'container', tag: 'p', label: '<p>', text: '高中生如何運用生成式 AI 提升自主學習效率？' }
          ]
        }
      ]
    },
    { id: 's4_footer', type: 'container', tag: 'footer', label: '<footer>', text: '© 2026 校刊社版權所有' }
  ],
  'stage-5': [
    {
      id: 's5_btn',
      type: 'container',
      tag: 'button',
      label: '<button>',
      text: '點我送出愛心',
      attrs: {
        id: 'like-btn',
        class: 'btn-primary',
        style: 'color:crimson;font-weight:bold;',
        onclick: "alert('感謝特工點讚！')"
      }
    }
  ],
  'stage-6': [
    { id: 's6_h1', type: 'container', tag: 'h1', label: '<h1>', text: '資訊特工：小明' },
    {
      id: 's6_ul',
      type: 'container',
      tag: 'ul',
      label: '<ul>',
      children: [
        { id: 's6_li1', type: 'container', tag: 'li', label: '<li>', text: '專業：前端架構與 DOM 樹拼裝' },
        { id: 's6_li2', type: 'container', tag: 'li', label: '<li>', text: '徽章：獲頒全校資訊解謎特工第一名' }
      ]
    },
    {
      id: 's6_img',
      type: 'void_tag',
      tag: 'img',
      label: '<img>',
      attrs: {
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=60',
        alt: '特工工作筆電',
        class: 'rounded-lg shadow-md max-w-[240px] my-2'
      }
    }
  ],
  'stage-7': [
    {
      id: 's7_inp',
      type: 'void_tag',
      tag: 'input',
      label: '<input>',
      attrs: { type: 'text', placeholder: '請輸入學號' }
    },
    {
      id: 's7_lbl1',
      type: 'container',
      tag: 'label',
      label: '<label>',
      text: ' 上午時段',
      children: [
        {
          id: 's7_r1',
          type: 'void_tag',
          tag: 'input',
          label: '<input radio>',
          attrs: { type: 'radio', name: 'shift', value: 'morning' }
        }
      ]
    },
    {
      id: 's7_lbl2',
      type: 'container',
      tag: 'label',
      label: '<label>',
      text: ' 下午時段',
      children: [
        {
          id: 's7_r2',
          type: 'void_tag',
          tag: 'input',
          label: '<input radio>',
          attrs: { type: 'radio', name: 'shift', value: 'afternoon' }
        }
      ]
    }
  ],
  'boss-1': [
    {
      id: 'b1_a',
      type: 'container',
      tag: 'a',
      label: '<a>',
      attrs: { href: 'https://www.google.com', target: '_blank' },
      children: [
        {
          id: 'b1_img',
          type: 'void_tag',
          tag: 'img',
          label: '<img>',
          attrs: {
            src: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png',
            alt: 'Google 首頁',
            class: 'h-14 object-contain inline-block p-2 bg-white rounded border border-slate-700 hover:scale-105 transition-transform'
          }
        }
      ]
    }
  ],
  'boss-2': [
    {
      id: 'b2_div',
      type: 'container',
      tag: 'div',
      label: '<div>',
      text: '尊姓大名 ',
      children: [
        {
          id: 'b2_inp_name',
          type: 'void_tag',
          tag: 'input',
          label: '<input>',
          attrs: { type: 'text', placeholder: '王XX' }
        }
      ]
    },
    {
      id: 'b2_l1',
      type: 'container',
      tag: 'label',
      label: '<label>',
      text: ' 早上',
      children: [
        { id: 'b2_r1', type: 'void_tag', tag: 'input', attrs: { type: 'radio', name: 'time', value: 'morning' } }
      ]
    },
    {
      id: 'b2_l2',
      type: 'container',
      tag: 'label',
      label: '<label>',
      text: ' 中午',
      children: [
        { id: 'b2_r2', type: 'void_tag', tag: 'input', attrs: { type: 'radio', name: 'time', value: 'noon' } }
      ]
    },
    {
      id: 'b2_l3',
      type: 'container',
      tag: 'label',
      label: '<label>',
      text: ' 晚上',
      children: [
        { id: 'b2_r3', type: 'void_tag', tag: 'input', attrs: { type: 'radio', name: 'time', value: 'evening' } }
      ]
    },
    { id: 'b2_btn', type: 'container', tag: 'button', label: '<button>', text: '送出' }
  ],
  'boss-3': [
    {
      id: 'b3_span',
      type: 'container',
      tag: 'span',
      label: '<span>',
      text: 'test',
      attrs: {
        style: 'text-decoration: line-through; color: red; font-size: 32px;'
      }
    }
  ]
};
