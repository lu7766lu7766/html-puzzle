export function useLevelValidator() {
  /**
   * 即時檢查關卡目標清單 (Checklist)
   * @param {Object} level 關卡物件
   * @param {string} htmlCode 當前生成的 HTML 代碼
   * @param {Array} canvasNodes 當前節點清單
   * @returns {Object} { [checkId]: boolean }
   */
  function evaluateChecklist(level, htmlCode, canvasNodes) {
    const results = {};
    if (!level || !level.checklist) return results;

    const lowerHtml = (htmlCode || '').toLowerCase();

    // 依關卡個別判定目標
    switch (level.id) {
      case 'stage-1':
        results['has_p_open'] = lowerHtml.includes('<p') && !lowerHtml.includes('<span>');
        results['has_content'] = htmlCode.includes('歡迎') || htmlCode.includes('研習社');
        results['has_p_close'] = lowerHtml.includes('</p>');
        break;

      case 'stage-2':
        results['has_container'] = lowerHtml.includes('<div') && lowerHtml.includes('</div>');
        results['has_br_tag'] = lowerHtml.includes('<br') || lowerHtml.includes('<br />');
        results['understands_void'] = !lowerHtml.includes('</br>') && (lowerHtml.includes('<br') || lowerHtml.includes('<br />'));
        break;

      case 'stage-3':
        results['chk_dtd'] = lowerHtml.includes('<!doctype html>');
        results['chk_head'] = lowerHtml.includes('<head>') && lowerHtml.includes('<title>') && lowerHtml.includes('</title>');
        results['chk_body'] = lowerHtml.includes('<body>') && lowerHtml.includes('<h1') && lowerHtml.includes('<p');
        break;

      case 'stage-4':
        results['chk_header_nav'] = lowerHtml.includes('<header>') && lowerHtml.includes('<nav>');
        results['chk_main_article'] = lowerHtml.includes('<main>') && lowerHtml.includes('<article>');
        results['chk_footer'] = lowerHtml.includes('<footer>');
        break;

      case 'stage-5':
        results['chk_id'] = lowerHtml.includes('id="like-btn"');
        results['chk_class'] = lowerHtml.includes('class="btn-primary"');
        results['chk_style'] = lowerHtml.includes('style=') && lowerHtml.includes('color');
        results['chk_onclick'] = lowerHtml.includes('onclick="alert(');
        break;

      case 'stage-6':
        results['chk_h1'] = lowerHtml.includes('<h1') && lowerHtml.includes('</h1>');
        results['chk_ul_li'] = lowerHtml.includes('<ul') && lowerHtml.includes('<li') && lowerHtml.includes('</li>');
        results['chk_img'] = lowerHtml.includes('<img') && lowerHtml.includes('src=') && lowerHtml.includes('alt=');
        break;

      case 'stage-7':
        results['chk_inp_placeholder'] = lowerHtml.includes('<input') && lowerHtml.includes('placeholder=');
        results['chk_radio_mutual'] = (lowerHtml.match(/name="shift"/g) || []).length >= 2;
        results['chk_label_wrap'] = lowerHtml.includes('<label>') && lowerHtml.includes('</label>');
        break;

      case 'boss-1':
        results['chk_nest_a_img'] = /<a[^>]*>[\s\S]*<img[\s\S]*<\/a>/i.test(htmlCode);
        results['chk_href_google'] = lowerHtml.includes('href="https://www.google.com"');
        results['chk_img_clickable'] = results['chk_nest_a_img'] && results['chk_href_google'];
        break;

      case 'boss-2':
        results['chk_placeholder_wang'] = htmlCode.includes('placeholder="王XX"');
        results['chk_three_radio_name'] = (lowerHtml.match(/name="time"/g) || []).length >= 3;
        results['chk_labels_wrapped'] = (lowerHtml.match(/<label>/g) || []).length >= 3;
        results['chk_submit_btn'] = lowerHtml.includes('<button') && htmlCode.includes('送出');
        break;

      case 'boss-3':
        results['chk_text_test'] = htmlCode.includes('test');
        results['chk_strikethrough'] = lowerHtml.includes('line-through') || lowerHtml.includes('<s>');
        results['chk_color_red'] = lowerHtml.includes('red');
        results['chk_size_32'] = lowerHtml.includes('32px') || lowerHtml.includes('size=');
        break;

      default:
        // 沙盒或其他自由關卡
        results['sandbox_any'] = (canvasNodes && canvasNodes.length > 0);
        break;
    }

    return results;
  }

  /**
   * 執行模擬人機互動測試與評分 (Interactive Test Runner)
   * 透過 DOMParser 模擬實際瀏覽器行為
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

    if (totalGoals === 0 || passedGoals === totalGoals) {
      report.passed = true;
      report.stars = 3;
      report.logs.push('✅ 所有語法與結構檢核完全正確！');
    } else {
      report.passed = false;
      report.stars = passedGoals >= Math.ceil(totalGoals / 2) ? 2 : 1;
      checks.forEach(c => {
        if (!checklistStatus[c.id]) {
          report.errorDetails.push(`未完成：${c.label}`);
        } else {
          report.logs.push(`通過：${c.label}`);
        }
      });
      return report;
    }

    // 瀏覽器行為互動模擬
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, 'text/html');

      // 1. 針對表單單選互斥測試
      if (level.id === 'stage-7' || level.id === 'boss-2') {
        const radios = doc.querySelectorAll('input[type="radio"]');
        if (radios.length >= 2) {
          const firstRadioName = radios[0].getAttribute('name');
          const allSameName = Array.from(radios).every(r => r.getAttribute('name') === firstRadioName);
          if (allSameName && firstRadioName) {
            report.logs.push(`⚡ 瀏覽器人機測試：所有 Radio 皆設定相同 name="${firstRadioName}"，單選互斥性驗證成功！`);
          } else {
            report.passed = false;
            report.errorDetails.push('❌ Radio 按鈕 name 屬性不一致，無法達成單選互斥！');
          }
        }
      }

      // 2. 針對圖片超連結巢狀測試
      if (level.id === 'boss-1') {
        const link = doc.querySelector('a');
        const img = link ? link.querySelector('img') : null;
        if (img) {
          report.logs.push('⚡ 瀏覽器人機測試：<a> 成功包覆 <img>，整張圖片點擊熱區擴展完成！');
        } else {
          report.passed = false;
          report.errorDetails.push('❌ 圖片未被包裹在 <a> 容器內！');
        }
      }

      // 3. 針對換行空標籤測試
      if (level.id === 'stage-2') {
        const br = doc.querySelector('br');
        if (br) {
          report.logs.push('⚡ 瀏覽器文檔流解析：成功偵測到 <br /> 空標籤，文本已正確折行！');
        }
      }
    } catch (e) {
      report.logs.push(`模擬解析提示: ${e.message}`);
    }

    return report;
  }

  return {
    evaluateChecklist,
    runInteractiveTest
  };
}
