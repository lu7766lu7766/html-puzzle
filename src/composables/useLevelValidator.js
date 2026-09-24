/**
 * 嚴格檢驗關卡積木排列順序與巢狀階層結構
 * @param {Object} level 關卡物件
 * @param {Array} canvasNodes 畫布節點樹狀陣列
 * @param {string} htmlCode 當前生成的 HTML 字串
 * @returns {Object} { valid: boolean, errors: string[], logs: string[] }
 */
export function validateLevelSequenceAndStructure(level, canvasNodes = [], htmlCode = '') {
  const result = { valid: true, errors: [], logs: [] };
  if (!level) return result;

  const nodes = canvasNodes || [];
  const lowerHtml = (htmlCode || '').toLowerCase();

  switch (level.id) {
    case 'stage-1': {
      // 必須為 3 個節點：<p> open_tag -> 歡迎... text -> </p> close_tag
      if (nodes.length !== 3) {
        result.valid = false;
        if (nodes.length < 3) {
          result.errors.push('積木數量不足：請放置完整的起始標籤、文字內容與結束標籤！');
        } else {
          result.errors.push('畫布上有非必要的干擾積木，請檢查並移除多餘項目！');
        }
        return result;
      }
      const isFirstPOpen = nodes[0].type === 'open_tag' && nodes[0].tag === 'p';
      const isSecondText = nodes[1].type === 'text' && (nodes[1].text?.includes('歡迎') || nodes[1].text?.includes('研習社'));
      const isThirdPClose = nodes[2].type === 'close_tag' && nodes[2].tag === 'p';

      if (!isFirstPOpen || !isSecondText || !isThirdPClose) {
        result.valid = false;
        result.errors.push('積木排列順序有誤：請檢查標籤的開始、內容與結束閉合順序！');
      } else {
        result.logs.push('✅ 積木順序檢核完全正確：<p> ➔ 公告文字 ➔ </p>');
      }
      break;
    }

    case 'stage-2': {
      // 必須為 5 個節點：<div> -> 時間 -> <br /> -> 地點 -> </div>
      if (nodes.length !== 5) {
        result.valid = false;
        if (nodes.length < 5) {
          result.errors.push('積木數量不足：請確認外層容器、兩行文字與換行標籤是否皆已放置！');
        } else {
          result.errors.push('畫布上有非必要積木，請檢查並移除多餘項目！');
        }
        return result;
      }
      const n0 = nodes[0].type === 'open_tag' && nodes[0].tag === 'div';
      const n1 = nodes[1].type === 'text' && nodes[1].text?.includes('時間');
      const n2 = nodes[2].type === 'void_tag' && nodes[2].tag === 'br';
      const n3 = nodes[3].type === 'text' && nodes[3].text?.includes('地點');
      const n4 = nodes[4].type === 'close_tag' && nodes[4].tag === 'div';

      if (!n0 || !n1 || !n2 || !n3 || !n4) {
        result.valid = false;
        if (!n0 || !n4) {
          result.errors.push('容器結構有誤：請使用 <div> 容器將兩行文字與換行元素完整包覆！');
        } else {
          result.errors.push('積木順序有誤：文字與換行標籤的先後位置尚未正確，請對照成果重新檢視！');
        }
      } else {
        result.logs.push('✅ 積木順序檢核完全正確：<div> ➔ 時間 ➔ <br /> ➔ 地點 ➔ </div>');
      }
      break;
    }

    case 'stage-3': {
      // 頂層必須僅有：<!DOCTYPE html> (void_tag) -> <html> (container)
      if (nodes.length !== 2) {
        result.valid = false;
        result.errors.push('頂層架構有誤：最外層應僅保留宣告與根容器，子元素請依層級嵌套放入內部！');
        return result;
      }
      if (nodes[0].tag !== '!DOCTYPE html') {
        result.valid = false;
        result.errors.push('頂層宣告位置有誤：請確認文檔型態宣告是否置於最頂部！');
        return result;
      }
      if (nodes[1].tag !== 'html') {
        result.valid = false;
        result.errors.push('根容器位置有誤：請確認根標籤是否包覆其餘所有網頁內容！');
        return result;
      }
      const htmlChildren = nodes[1].children || [];
      if (htmlChildren.length !== 2) {
        result.valid = false;
        result.errors.push('根容器內部結構有誤：請確認資訊容器（head）與主體內容容器（body）之配置！');
        return result;
      }
      const headNode = htmlChildren[0];
      const bodyNode = htmlChildren[1];

      if (headNode.tag !== 'head') {
        result.valid = false;
        result.errors.push('結構順序錯誤：請確認看不見的資訊容器（head）與看得見的內容容器（body）之先後順序！');
        return result;
      }
      if (bodyNode.tag !== 'body') {
        result.valid = false;
        result.errors.push('結構順序錯誤：內容主體容器（body）位置不正確，請重新調整！');
        return result;
      }

      // Check head children
      const headChildren = headNode.children || [];
      const titleNode = headChildren.find(c => c.tag === 'title');
      if (!titleNode || !titleNode.text?.includes('校園資訊網')) {
        result.valid = false;
        result.errors.push('標頭容器內容未齊全：請確認分頁標題元素是否正確置於 head 內部！');
        return result;
      }

      // Check body children: h1 -> p
      const bodyChildren = bodyNode.children || [];
      if (bodyChildren.length !== 2) {
        result.valid = false;
        result.errors.push('內容主體結構未完備：body 內部應包含大標題與內文段落！');
        return result;
      }
      if (bodyChildren[0].tag !== 'h1' || bodyChildren[1].tag !== 'p') {
        result.valid = false;
        result.errors.push('主體內容順序有誤：請對照成果確認標題與段落的由上而下排列順序！');
        return result;
      }
      result.logs.push('✅ 標準網頁骨架結構與順序檢核完全正確！');
      break;
    }

    case 'stage-4': {
      // 頂層必須僅有：<header> -> <main> -> <footer>
      if (nodes.length !== 3) {
        result.valid = false;
        result.errors.push('頁面語意架構有誤：最外層應為頂部、主體與頁尾三大區域，其餘標籤應放入對應區域！');
        return result;
      }
      if (nodes[0].tag !== 'header' || nodes[1].tag !== 'main' || nodes[2].tag !== 'footer') {
        result.valid = false;
        result.errors.push('語意分區順序有誤：請依照網頁閱讀邏輯檢查頂部、主體與底部區域的先後順序！');
        return result;
      }
      // header: nav
      const headerChildren = nodes[0].children || [];
      if (!headerChildren.some(c => c.tag === 'nav')) {
        result.valid = false;
        result.errors.push('頂部區塊結構未完備：<nav> 導覽列應置於頂部 <header> 容器內部！');
        return result;
      }
      // main: article -> h2, p
      const mainChildren = nodes[1].children || [];
      const artNode = mainChildren.find(c => c.tag === 'article');
      if (!artNode) {
        result.valid = false;
        result.errors.push('主體區塊結構未完備：專題文章 <article> 應置於核心主體 <main> 容器內部！');
        return result;
      }
      const artChildren = artNode.children || [];
      if (artChildren.length !== 2 || artChildren[0].tag !== 'h2' || artChildren[1].tag !== 'p') {
        result.valid = false;
        result.errors.push('文章內部結構或順序有誤：<article> 內部應依序放入 <h2> 標題與 <p> 內文！');
        return result;
      }
      result.logs.push('✅ 語意化排版結構與順序檢核完全正確！');
      break;
    }

    case 'stage-5': {
      const validNodes = nodes.filter(n => n.type === 'container' || n.type === 'void_tag');
      if (validNodes.length !== 1 || validNodes[0].tag !== 'button') {
        result.valid = false;
        result.errors.push('元件結構有誤：畫布上應僅保留目標按鈕，並將屬性晶片直接掛載於該按鈕！');
        return result;
      }
      const attrs = validNodes[0].attrs || {};
      const missingAttrs = [];
      if (attrs.id !== 'like-btn') missingAttrs.push('身分識別');
      if (attrs.class !== 'btn-primary') missingAttrs.push('樣式類別');
      if (!attrs.style || !attrs.style.includes('color')) missingAttrs.push('行內樣式');
      if (!attrs.onclick || !attrs.onclick.includes('alert(')) missingAttrs.push('互動事件');

      if (missingAttrs.length > 0) {
        result.valid = false;
        result.errors.push(`屬性掛載未齊全：按鈕尚有必要屬性尚未正確掛載（例如：${missingAttrs.join('、')}），請檢視任務需求！`);
        return result;
      }
      result.logs.push('✅ 四大核心屬性晶片掛載檢核完全正確！');
      break;
    }

    case 'stage-6': {
      // 頂層必須僅有：<h1> -> <ul> -> <img>
      if (nodes.length !== 3) {
        result.valid = false;
        result.errors.push('名片結構有誤：最外層應依序保留大標題、清單與圖片，清單項目請放入清單容器內部！');
        return result;
      }
      if (nodes[0].tag !== 'h1' || nodes[1].tag !== 'ul' || nodes[2].tag !== 'img') {
        result.valid = false;
        result.errors.push('元件順序有誤：請對照成果預覽由上而下調整標題、清單與圖片的順序！');
        return result;
      }
      const ulChildren = nodes[1].children || [];
      if (ulChildren.length !== 2) {
        result.valid = false;
        result.errors.push('清單結構未完備：清單容器內部應放入兩項清單項目！');
        return result;
      }
      const isLi1 = ulChildren[0].tag === 'li' && ulChildren[0].text?.includes('專業');
      const isLi2 = ulChildren[1].tag === 'li' && ulChildren[1].text?.includes('徽章');
      if (!isLi1 || !isLi2) {
        result.valid = false;
        result.errors.push('清單項目順序有誤：請檢查清單內部各項目的先後順序！');
        return result;
      }
      if (!nodes[2].attrs?.src || !nodes[2].attrs?.alt) {
        result.valid = false;
        result.errors.push('圖片標籤屬性未完備：請確認圖片載入來源與替代文字等必備屬性！');
        return result;
      }
      result.logs.push('✅ 個人多媒體檔案結構與順序檢核完全正確！');
      break;
    }

    case 'stage-7': {
      // 頂層必須僅有：<input type="text"> -> <label> 上午 -> <label> 下午
      if (nodes.length !== 3) {
        result.valid = false;
        result.errors.push('表單結構有誤：最外層應為輸入框與時段選項，單選鈕請放入對應標籤內！');
        return result;
      }
      if (nodes[0].tag !== 'input' || nodes[0].attrs?.type !== 'text') {
        result.valid = false;
        result.errors.push('表單順序有誤：表單頂部首項應為文字輸入框！');
        return result;
      }
      if (nodes[1].tag !== 'label' || !nodes[1].text?.includes('上午') ||
          nodes[2].tag !== 'label' || !nodes[2].text?.includes('下午')) {
        result.valid = false;
        result.errors.push('表單時段順序有誤：請依照日常時間順序調整時段選項！');
        return result;
      }
      const r1 = (nodes[1].children || []).find(c => c.tag === 'input' && c.attrs?.type === 'radio');
      const r2 = (nodes[2].children || []).find(c => c.tag === 'input' && c.attrs?.type === 'radio');
      if (!r1 || !r2) {
        result.valid = false;
        result.errors.push('選項標籤未包裹：時段標籤內部必須各自包覆對應的單選按鈕！');
        return result;
      }
      if (!r1.attrs?.name || r1.attrs?.name !== r2.attrs?.name) {
        result.valid = false;
        result.errors.push('單選互斥設定未完成：請檢查各單選按鈕的群組屬性設定是否一致！');
        return result;
      }
      result.logs.push('✅ 選修表單控制項結構與順序檢核完全正確！');
      break;
    }

    case 'boss-1': {
      if (nodes.length !== 1 || nodes[0].tag !== 'a') {
        result.valid = false;
        result.errors.push('超連結傳送門結構有誤：頂層應為超連結標籤，並將圖片放置於其內部！');
        return result;
      }
      const aChildren = nodes[0].children || [];
      const hasImg = aChildren.some(c => c.tag === 'img');
      if (!hasImg) {
        result.valid = false;
        result.errors.push('標籤巢狀包覆未完成：圖片必須置於超連結容器內部！');
        return result;
      }
      if (!nodes[0].attrs?.href?.includes('https://www.google.com')) {
        result.valid = false;
        result.errors.push('超連結目標設定有誤：請檢查超連結的目標網址屬性！');
        return result;
      }
      result.logs.push('✅ 圖片超連結傳送門巢狀結構檢核完全正確！');
      break;
    }

    case 'boss-2': {
      if (nodes.length !== 5) {
        result.valid = false;
        result.errors.push('綜合表單結構有誤：最外層應依序包含姓名區塊、三個時段選項與送出按鈕！');
        return result;
      }
      if (nodes[0].tag !== 'div' || !nodes[0].text?.includes('尊姓大名')) {
        result.valid = false;
        result.errors.push('表單順序有誤：首項應為姓名輸入區塊！');
        return result;
      }
      const nameInp = (nodes[0].children || []).find(c => c.tag === 'input');
      if (!nameInp || nameInp.attrs?.placeholder !== '王XX') {
        result.valid = false;
        result.errors.push('姓名區塊設定未完備：輸入框缺少提示屬性或未正確放入姓名區塊內！');
        return result;
      }
      if (nodes[1].tag !== 'label' || !nodes[1].text?.includes('早上') ||
          nodes[2].tag !== 'label' || !nodes[2].text?.includes('中午') ||
          nodes[3].tag !== 'label' || !nodes[3].text?.includes('晚上')) {
        result.valid = false;
        result.errors.push('時段選項順序有誤：請依照日常時間先後排列早、中、晚時段！');
        return result;
      }
      if (nodes[4].tag !== 'button' || !nodes[4].text?.includes('送出')) {
        result.valid = false;
        result.errors.push('表單結尾有誤：表單末端應為送出按鈕！');
        return result;
      }
      const r1 = (nodes[1].children || []).find(c => c.tag === 'input' && c.attrs?.value === 'morning');
      const r2 = (nodes[2].children || []).find(c => c.tag === 'input' && c.attrs?.value === 'noon');
      const r3 = (nodes[3].children || []).find(c => c.tag === 'input' && c.attrs?.value === 'evening');
      if (!r1 || !r2 || !r3) {
        result.valid = false;
        result.errors.push('時段選項標籤未包裹：各時段標籤內必須各自包覆對應時段的單選按鈕！');
        return result;
      }
      if (!r1.attrs?.name || r1.attrs?.name !== r2.attrs?.name || r2.attrs?.name !== r3.attrs?.name) {
        result.valid = false;
        result.errors.push('單選互斥設定未完成：三個單選鈕的群組屬性設定必須完全一致！');
        return result;
      }
      result.logs.push('✅ 課堂綜合表單結構與順序檢核完全正確！');
      break;
    }

    case 'boss-3': {
      const hasTest = lowerHtml.includes('test');
      const hasStrike = lowerHtml.includes('line-through') || lowerHtml.includes('<s>');
      const hasRed = lowerHtml.includes('red');
      const hasSize = lowerHtml.includes('32px') || lowerHtml.includes('size=');

      if (!hasTest || !hasStrike || !hasRed || !hasSize) {
        result.valid = false;
        result.errors.push('文字外觀樣式未達標：請確認文字內容及刪除線、色彩與字級等外觀樣式設定！');
        return result;
      }
      result.logs.push('✅ 文字刪除線與現代樣式檢核完全正確！');
      break;
    }
  }

  return result;
}

export function useLevelValidator() {
  /**
   * 即時檢查關卡目標清單 (Checklist)
   * 結合 HTML 原始碼與畫布節點順序及層級進行判定
   * @param {Object} level 關卡物件
   * @param {string} htmlCode 當前生成的 HTML 代碼
   * @param {Array} canvasNodes 當前節點清單
   * @returns {Object} { [checkId]: boolean }
   */
  function evaluateChecklist(level, htmlCode, canvasNodes) {
    const results = {};
    if (!level || !level.checklist) return results;

    const lowerHtml = (htmlCode || '').toLowerCase();
    const nodes = canvasNodes || [];

    // 依關卡個別判定目標（含順序檢驗）
    switch (level.id) {
      case 'stage-1': {
        const pOpenIdx = nodes.findIndex(n => n.type === 'open_tag' && n.tag === 'p');
        const textIdx = nodes.findIndex(n => n.type === 'text' && (n.text?.includes('歡迎') || n.text?.includes('研習社')));
        const pCloseIdx = nodes.findIndex(n => n.type === 'close_tag' && n.tag === 'p');
        const hasSpan = nodes.some(n => n.tag === 'span');
        const pOpenCount = nodes.filter(n => n.type === 'open_tag' && n.tag === 'p').length;
        const pCloseCount = nodes.filter(n => n.type === 'close_tag' && n.tag === 'p').length;
        const textCount = nodes.filter(n => n.type === 'text').length;
        const noDuplicateOrExtra = nodes.length === 3 && pOpenCount === 1 && textCount === 1 && pCloseCount === 1;

        results['has_p_open'] = pOpenIdx !== -1 && !hasSpan && (textIdx === -1 || pOpenIdx < textIdx) && (pCloseIdx === -1 || pOpenIdx < pCloseIdx);
        results['has_content'] = textIdx !== -1 && (pOpenIdx === -1 || pOpenIdx < textIdx) && (pCloseIdx === -1 || textIdx < pCloseIdx);
        results['has_p_close'] = pCloseIdx !== -1 && (pOpenIdx !== -1 && pOpenIdx < pCloseIdx) && (textIdx !== -1 && textIdx < pCloseIdx) && !hasSpan && noDuplicateOrExtra;
        break;
      }

      case 'stage-2': {
        const divOpenIdx = nodes.findIndex(n => n.type === 'open_tag' && n.tag === 'div');
        const t1Idx = nodes.findIndex(n => n.type === 'text' && n.text?.includes('時間'));
        const brIdx = nodes.findIndex(n => n.type === 'void_tag' && n.tag === 'br');
        const t2Idx = nodes.findIndex(n => n.type === 'text' && n.text?.includes('地點'));
        const divCloseIdx = nodes.findIndex(n => n.type === 'close_tag' && n.tag === 'div');
        const hasBrClose = nodes.some(n => n.type === 'close_tag' && n.tag === 'br');

        // 必須同時具備「時間」與「地點」兩段文字，且文字積木數量為 2
        const textNodes = nodes.filter(n => n.type === 'text');
        const hasCorrectTexts = t1Idx !== -1 && t2Idx !== -1 && textNodes.length === 2;
        const noExtraNodes = nodes.length === 5;

        results['has_container'] = divOpenIdx !== -1 && divCloseIdx !== -1 && divOpenIdx < divCloseIdx &&
          hasCorrectTexts && divOpenIdx < t1Idx && t2Idx < divCloseIdx && noExtraNodes;
        results['has_br_tag'] = brIdx !== -1 && hasCorrectTexts && t1Idx < brIdx && brIdx < t2Idx;
        results['understands_void'] = brIdx !== -1 && !hasBrClose;
        break;
      }

      case 'stage-3': {
        const dtdAtTop = nodes[0]?.tag === '!DOCTYPE html';
        const htmlNode = nodes.find(n => n.tag === 'html');
        const headNode = htmlNode?.children?.find(c => c.tag === 'head');
        const bodyNode = htmlNode?.children?.find(c => c.tag === 'body');
        const headIdx = htmlNode?.children?.indexOf(headNode) ?? -1;
        const bodyIdx = htmlNode?.children?.indexOf(bodyNode) ?? -1;
        const titleInHead = (headNode?.children || []).some(c => c.tag === 'title' && c.text?.includes('校園資訊網')) && (headNode?.children?.length === 1);
        const h1InBody = bodyNode?.children?.some(c => c.tag === 'h1');
        const pInBody = bodyNode?.children?.some(c => c.tag === 'p');
        const h1IdxInBody = (bodyNode?.children || []).findIndex(c => c.tag === 'h1');
        const pIdxInBody = (bodyNode?.children || []).findIndex(c => c.tag === 'p');
        const bodyOrdered = h1IdxInBody !== -1 && pIdxInBody !== -1 && h1IdxInBody < pIdxInBody && (bodyNode?.children?.length === 2);
        const isCleanRoot = nodes.length === 2 && nodes[0]?.tag === '!DOCTYPE html' && nodes[1]?.tag === 'html';

        results['chk_dtd'] = dtdAtTop;
        results['chk_head'] = !!(htmlNode && headNode && titleInHead && (bodyIdx === -1 || headIdx < bodyIdx));
        results['chk_body'] = !!(htmlNode && bodyNode && h1InBody && pInBody && bodyOrdered && (headIdx === -1 || headIdx < bodyIdx) && isCleanRoot);
        break;
      }

      case 'stage-4': {
        const headerIdx = nodes.findIndex(n => n.tag === 'header');
        const mainIdx = nodes.findIndex(n => n.tag === 'main');
        const footerIdx = nodes.findIndex(n => n.tag === 'footer');

        const headerNode = headerIdx !== -1 ? nodes[headerIdx] : null;
        const mainNode = mainIdx !== -1 ? nodes[mainIdx] : null;
        const footerNode = footerIdx !== -1 ? nodes[footerIdx] : null;

        const navInHeader = (headerNode?.children || []).some(c => c.tag === 'nav') && (headerNode?.children?.length === 1);
        const artInMain = mainNode?.children?.find(c => c.tag === 'article');
        const h2IdxInArt = (artInMain?.children || []).findIndex(c => c.tag === 'h2');
        const pIdxInArt = (artInMain?.children || []).findIndex(c => c.tag === 'p');
        const h2BeforePInArt = artInMain && h2IdxInArt !== -1 && pIdxInArt !== -1 && h2IdxInArt < pIdxInArt && (artInMain?.children?.length === 2);
        const isCleanRoot = nodes.length === 3 && nodes[0]?.tag === 'header' && nodes[1]?.tag === 'main' && nodes[2]?.tag === 'footer';

        results['chk_header_nav'] = !!(headerNode && navInHeader && (mainIdx === -1 || headerIdx < mainIdx) && (footerIdx === -1 || headerIdx < footerIdx));
        results['chk_main_article'] = !!(mainNode && artInMain && h2BeforePInArt && (headerIdx === -1 || headerIdx < mainIdx) && (footerIdx === -1 || mainIdx < footerIdx));
        results['chk_footer'] = !!(footerNode && (headerIdx === -1 || headerIdx < footerIdx) && (mainIdx === -1 || mainIdx < footerIdx) && isCleanRoot);
        break;
      }

      case 'stage-5': {
        const validNodes = nodes.filter(n => n.type === 'container' || n.type === 'void_tag');
        const btnNode = validNodes.find(n => n.tag === 'button') || nodes.find(n => n.tag === 'button');
        const attrs = btnNode?.attrs || {};
        results['chk_id'] = attrs.id === 'like-btn';
        results['chk_class'] = attrs.class === 'btn-primary';
        results['chk_style'] = typeof attrs.style === 'string' && attrs.style.includes('color');
        results['chk_onclick'] = typeof attrs.onclick === 'string' && attrs.onclick.includes('alert(');
        break;
      }

      case 'stage-6': {
        const h1Idx = nodes.findIndex(n => n.tag === 'h1');
        const ulIdx = nodes.findIndex(n => n.tag === 'ul');
        const imgIdx = nodes.findIndex(n => n.tag === 'img');

        const ulNode = ulIdx !== -1 ? nodes[ulIdx] : null;
        const ulChildren = ulNode?.children || [];
        const li1Idx = ulChildren.findIndex(c => c.tag === 'li' && c.text?.includes('專業'));
        const li2Idx = ulChildren.findIndex(c => c.tag === 'li' && c.text?.includes('徽章'));
        const ulHasCorrectLi = ulChildren.length === 2 && li1Idx === 0 && li2Idx === 1;

        const imgNode = imgIdx !== -1 ? nodes[imgIdx] : null;
        const imgValid = !!(imgNode && imgNode.attrs?.src && imgNode.attrs?.alt);
        const isCleanRoot = nodes.length === 3 && nodes[0]?.tag === 'h1' && nodes[1]?.tag === 'ul' && nodes[2]?.tag === 'img';

        results['chk_h1'] = h1Idx !== -1 && (ulIdx === -1 || h1Idx < ulIdx) && (imgIdx === -1 || h1Idx < imgIdx);
        results['chk_ul_li'] = !!(ulNode && ulHasCorrectLi && (h1Idx === -1 || h1Idx < ulIdx) && (imgIdx === -1 || ulIdx < imgIdx));
        results['chk_img'] = !!(imgValid && (h1Idx === -1 || h1Idx < imgIdx) && (ulIdx === -1 || ulIdx < imgIdx) && isCleanRoot);
        break;
      }

      case 'stage-7': {
        const inpIdx = nodes.findIndex(n => n.tag === 'input' && n.attrs?.type === 'text');
        const lbl1Idx = nodes.findIndex(n => n.tag === 'label' && n.text?.includes('上午'));
        const lbl2Idx = nodes.findIndex(n => n.tag === 'label' && n.text?.includes('下午'));

        const lbl1 = lbl1Idx !== -1 ? nodes[lbl1Idx] : null;
        const lbl2 = lbl2Idx !== -1 ? nodes[lbl2Idx] : null;

        const r1 = (lbl1?.children || []).find(c => c.tag === 'input' && c.attrs?.type === 'radio');
        const r2 = (lbl2?.children || []).find(c => c.tag === 'input' && c.attrs?.type === 'radio');

        const radiosMutual = !!(r1 && r2 && r1.attrs?.name && r1.attrs?.name === r2.attrs?.name);
        const labelsOrdered = lbl1Idx !== -1 && lbl2Idx !== -1 && lbl1Idx < lbl2Idx;
        const inputAtTop = inpIdx !== -1 && (lbl1Idx === -1 || inpIdx < lbl1Idx) && (lbl2Idx === -1 || inpIdx < lbl2Idx);
        const isCleanRoot = nodes.length === 3 && nodes[0]?.tag === 'input' && nodes[1]?.tag === 'label' && nodes[2]?.tag === 'label';

        results['chk_inp_placeholder'] = inputAtTop && !!nodes[inpIdx]?.attrs?.placeholder;
        results['chk_radio_mutual'] = radiosMutual;
        results['chk_label_wrap'] = labelsOrdered && !!r1 && !!r2 && isCleanRoot;
        break;
      }

      case 'boss-1': {
        const isCleanRoot = nodes.length === 1 && nodes[0]?.tag === 'a';
        const aNode = isCleanRoot ? nodes[0] : nodes.find(n => n.tag === 'a');
        const hasImgInA = (aNode?.children || []).some(c => c.tag === 'img') && (aNode?.children?.length === 1);
        const hasHrefGoogle = typeof aNode?.attrs?.href === 'string' && aNode.attrs.href.includes('https://www.google.com');

        results['chk_nest_a_img'] = hasImgInA;
        results['chk_href_google'] = hasHrefGoogle;
        results['chk_img_clickable'] = hasImgInA && hasHrefGoogle && isCleanRoot;
        break;
      }

      case 'boss-2': {
        const nameDivIdx = nodes.findIndex(n => n.tag === 'div' && n.text?.includes('尊姓大名'));
        const l1Idx = nodes.findIndex(n => n.tag === 'label' && n.text?.includes('早上'));
        const l2Idx = nodes.findIndex(n => n.tag === 'label' && n.text?.includes('中午'));
        const l3Idx = nodes.findIndex(n => n.tag === 'label' && n.text?.includes('晚上'));
        const btnIdx = nodes.findIndex(n => n.tag === 'button' && n.text?.includes('送出'));

        const nameDiv = nameDivIdx !== -1 ? nodes[nameDivIdx] : null;
        const hasWangInp = (nameDiv?.children || []).some(c => c.tag === 'input' && c.attrs?.placeholder === '王XX');

        const l1 = l1Idx !== -1 ? nodes[l1Idx] : null;
        const l2 = l2Idx !== -1 ? nodes[l2Idx] : null;
        const l3 = l3Idx !== -1 ? nodes[l3Idx] : null;

        const r1 = (l1?.children || []).find(c => c.tag === 'input' && c.attrs?.value === 'morning');
        const r2 = (l2?.children || []).find(c => c.tag === 'input' && c.attrs?.value === 'noon');
        const r3 = (l3?.children || []).find(c => c.tag === 'input' && c.attrs?.value === 'evening');

        const radiosMatch = !!(r1 && r2 && r3 && r1.attrs?.name && r1.attrs?.name === r2.attrs?.name && r2.attrs?.name === r3.attrs?.name);
        const labelsInOrder = l1Idx !== -1 && l2Idx !== -1 && l3Idx !== -1 && l1Idx < l2Idx && l2Idx < l3Idx;
        const nameBeforeLabels = nameDivIdx !== -1 && (l1Idx === -1 || nameDivIdx < l1Idx);
        const btnAfterLabels = btnIdx !== -1 && (l3Idx === -1 || l3Idx < btnIdx);
        const isCleanRoot = nodes.length === 5 && nameDivIdx === 0 && l1Idx === 1 && l2Idx === 2 && l3Idx === 3 && btnIdx === 4;

        results['chk_placeholder_wang'] = !!(hasWangInp && nameBeforeLabels);
        results['chk_three_radio_name'] = radiosMatch;
        results['chk_labels_wrapped'] = labelsInOrder && !!(r1 && r2 && r3);
        results['chk_submit_btn'] = !!(btnIdx !== -1 && btnAfterLabels && isCleanRoot);
        break;
      }

      case 'boss-3': {
        results['chk_text_test'] = htmlCode.includes('test');
        results['chk_strikethrough'] = lowerHtml.includes('line-through') || lowerHtml.includes('<s>');
        results['chk_color_red'] = lowerHtml.includes('red');
        results['chk_size_32'] = lowerHtml.includes('32px') || lowerHtml.includes('size=');
        break;
      }

      default:
        // 沙盒或其他自由關卡
        results['sandbox_any'] = (nodes && nodes.length > 0);
        break;
    }

    // 全面一致性防呆：若個別目標看似全數通過，但整體結構/順序/重複積木檢驗未達標，
    // 確保不會出現目標達成度全滿 (100%) 的誤導狀態
    if (level.checklist && level.checklist.length > 0) {
      const allPassed = level.checklist.every(c => results[c.id]);
      if (allPassed) {
        const structureCheck = validateLevelSequenceAndStructure(level, canvasNodes, htmlCode);
        if (!structureCheck.valid) {
          const lastCheck = level.checklist[level.checklist.length - 1];
          if (lastCheck) {
            results[lastCheck.id] = false;
          }
        }
      }
    }

    return results;
  }

  /**
   * 執行模擬人機互動測試與評分 (Interactive Test Runner)
   * 透過 DOMParser 模擬實際瀏覽器行為，並嚴格檢核順序與結構
   */
  async function runInteractiveTest(level, htmlCode, canvasNodes) {
    const checklistStatus = evaluateChecklist(level, htmlCode, canvasNodes);
    const checks = level.checklist || [];
    const totalGoals = checks.length;
    const passedGoals = checks.filter(c => checklistStatus[c.id]).length;

    const report = {
      passed: false,
      stars: 1,
      logs: [],
      errorDetails: []
    };

    // 1. 檢核目標清單日誌
    checks.forEach(c => {
      if (checklistStatus[c.id]) {
        report.logs.push(`目標達成：${c.label}`);
      }
    });

    // 2. 嚴格檢驗積木順序與階層結構 (Sequence & Nesting Structure)
    const structureResult = validateLevelSequenceAndStructure(level, canvasNodes, htmlCode);
    if (!structureResult.valid) {
      report.passed = false;
      report.stars = 1;
      // 僅提供非洩題的啟發式除錯指引，並去除重複項目
      report.errorDetails = [...new Set(structureResult.errors)];
      return report;
    } else {
      report.logs.push(...structureResult.logs);
    }

    // 3. 確保所有目標清單均通過
    if (totalGoals > 0 && passedGoals !== totalGoals) {
      report.passed = false;
      report.stars = passedGoals >= Math.ceil(totalGoals / 2) ? 2 : 1;
      report.errorDetails.push(`尚有部分任務條件未完全達標（已達成 ${passedGoals} / ${totalGoals} 項），請對照成果畫面檢查積木配置！`);
      return report;
    }

    // 4. 瀏覽器行為互動模擬
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, 'text/html');

      // 針對表單單選互斥測試
      if (level.id === 'stage-7' || level.id === 'boss-2') {
        const radios = doc.querySelectorAll('input[type="radio"]');
        if (radios.length >= 2) {
          const firstRadioName = radios[0].getAttribute('name');
          const allSameName = Array.from(radios).every(r => r.getAttribute('name') === firstRadioName);
          if (allSameName && firstRadioName) {
            report.logs.push(`⚡ 瀏覽器人機測試：所有 Radio 皆設定相同 name="${firstRadioName}"，單選互斥性驗證成功！`);
          } else {
            report.passed = false;
            report.errorDetails.push('單選互斥效果尚未完成：請檢查各選項的群組屬性設定！');
            return report;
          }
        }
      }

      // 針對圖片超連結巢狀測試
      if (level.id === 'boss-1') {
        const link = doc.querySelector('a');
        const img = link ? link.querySelector('img') : null;
        if (img) {
          report.logs.push('⚡ 瀏覽器人機測試：<a> 成功包覆 <img>，整張圖片點擊熱區擴展完成！');
        } else {
          report.passed = false;
          report.errorDetails.push('標籤巢狀包覆未完成：請確認圖片是否置於超連結容器內！');
          return report;
        }
      }

      // 針對換行空標籤測試
      if (level.id === 'stage-2') {
        const br = doc.querySelector('br');
        if (br) {
          report.logs.push('⚡ 瀏覽器文檔流解析：成功偵測到 <br /> 空標籤，文本已正確折行！');
        }
      }
    } catch (e) {
      report.logs.push(`模擬解析提示: ${e.message}`);
    }

    report.passed = true;
    report.stars = 3;
    report.logs.push('✅ 所有語法、順序與結構檢核完全正確！');
    return report;
  }

  return {
    evaluateChecklist,
    runInteractiveTest
  };
}
