function checkGBT7714Format(entry) {
  const results = {
    isValid: true,
    errors: [],
    warnings: [] // 保留空的警告数组，但不会添加任何警告
  };
  
  // 使用 gbt7714-2015.js 中的配置
  const entryType = entry.entryType.toLowerCase();
  
  // 首先检查是否为 arXiv 预印刊
  const isArxiv = entryType === 'article' && entry.entryTags.journal && 
                  entry.entryTags.journal.toLowerCase().includes('arxiv');
  
  // 从配置中获取必填字段
  let required = [];
  
  // 如果是 arXiv 预印刊，直接使用 arXiv 的格式要求
  if (isArxiv) {
    required = GBT7714_2015.formats['arxiv'] || ['author', 'title', 'journal', 'year'];
    results.entryClassName = "预印刊";
  } 
  // 否则，查找对应的文献类型
  else if (GBT7714_2015.formats[entryType]) {
    required = GBT7714_2015.formats[entryType];
  } else {
    // 根据文献分类找对应的文献类型
    for (const className in GBT7714_2015.entryClasses) {
      if (GBT7714_2015.entryClasses[className].includes(entryType)) {
        // 找到对应类型的第一个格式作为参考
        const firstFormatType = GBT7714_2015.entryClasses[className][0];
        if (GBT7714_2015.formats[firstFormatType]) {
          required = GBT7714_2015.formats[firstFormatType];
          break;
        }
      }
    }
  }
  
  // 如果配置中没有找到，使用默认配置
  if (required.length === 0) {
    const requiredFields = {
      article: ['author', 'title', 'journal', 'year', 'volume', 'number', 'pages'],
      inproceedings: ['author', 'title', 'booktitle', 'year', 'pages', 'publisher', 'address'],
      conference: ['author', 'title', 'booktitle', 'year', 'pages', 'publisher', 'address'],
      book: ['title', 'publisher', 'year', 'author', 'address'],
      thesis: ['author', 'title', 'school', 'year', 'address'],
      phdthesis: ['author', 'title', 'school', 'year', 'address'],
      mastersthesis: ['author', 'title', 'school', 'year', 'address'],
      online: ['author', 'title', 'url', 'year', 'urldate'],
    };
    required = requiredFields[entryType] || ['title'];
  }
  
  // 检查必填字段
  for (const field of required) {
    if (!entry.entryTags[field]) {
      results.isValid = false;
      results.errors.push(`缺少必填字段: ${field}`);
    }
  }
  
  // 只在非 arXiv 情况下设置文献类型分类信息
  if (!isArxiv) {
    let entryClassName = "其他";
    for (const className in GBT7714_2015.entryClasses) {
      if (GBT7714_2015.entryClasses[className].includes(entryType)) {
        switch (className) {
          case 'monograph':
            entryClassName = "专著";
            break;
          case 'monographPart':
            entryClassName = "专著的析出文献";
            break;
          case 'serialPart':
            entryClassName = "连续出版物的析出文献";
            break;
          case 'electronic':
            entryClassName = "电子资源";
            break;
          default:
            entryClassName = className;
        }
        break;
      }
    }
    results.entryClassName = entryClassName;
  }
  
  // 移除所有建议部分的检查
  
  return results;
}

// generateGBT7714Format 函数也需要根据配置更新
function generateGBT7714Format(entry) {
  const entryType = entry.entryType.toLowerCase();
  const entryTags = entry.entryTags;
  let result = '';
  
  // 获取文献类型标识
  let typeIdentifier = '[?]'; // 默认未知类型
  
  // 检查是否为 arXiv 预印刊
  const isArxiv = entryType === 'article' && entryTags.journal && 
                 entryTags.journal.toLowerCase().includes('arxiv');
  
  // 根据文献类型设置标识符
  switch (entryType) {
    case 'article':
      typeIdentifier = isArxiv ? '[OL]' : '[J]'; // arXiv 使用 [OL] 标识
      break;
    case 'book':
      typeIdentifier = '[M]';
      break;
    case 'inproceedings':
    case 'conference':
      typeIdentifier = '[C]';
      break;
    case 'phdthesis':
    case 'mastersthesis':
    case 'thesis':
      typeIdentifier = '[D]';
      break;
    case 'techreport':
      typeIdentifier = '[R]';
      break;
    case 'standard':
      typeIdentifier = '[S]';
      break;
    case 'online':
      typeIdentifier = '[EB/OL]';
      break;
    case 'software':
      typeIdentifier = '[CP]';
      break;
  }
  
  switch (entryType) {
    case 'article':
      if (isArxiv) {
        // arXiv 预印刊特殊格式
        result = formatAuthors(entryTags.author) + '. ';
        result += entryTags.title + typeIdentifier + '. ';
        result += entryTags.year;
        
        // 提取 arXiv 编号
        const arxivMatch = entryTags.journal.match(/arXiv:(\d+\.\d+)/i);
        if (arxivMatch) {
          result += ', arXiv:' + arxivMatch[1];
        } else {
          result += ', ' + entryTags.journal;
        }
        
        if (entryTags.doi) {
          result += '. DOI: ' + entryTags.doi;
        }
        
        result += '.';
      } else {
        // 普通期刊论文格式不变
        result = formatAuthors(entryTags.author) + '. ';
        result += entryTags.title + typeIdentifier + '. ';
        result += entryTags.journal + ', ';
        result += entryTags.year;
        if (entryTags.volume) {
          result += ', ' + entryTags.volume;
          if (entryTags.number) {
            result += '(' + entryTags.number + ')';
          }
        } else if (entryTags.number) {
          result += '(' + entryTags.number + ')';
        }
        if (entryTags.pages) {
          result += ': ' + entryTags.pages.replace(/--|-/, '-');
        }
        result += '.';
        if (entryTags.doi) {
          result += ' DOI: ' + entryTags.doi + '.';
        }
      }
      break;
      
    case 'book':
      if (entryTags.author) {
        result = formatAuthors(entryTags.author) + '. ';
      } else if (entryTags.editor) {
        result = formatAuthors(entryTags.editor) + ', 编. ';
      }
      result += entryTags.title + typeIdentifier + '. ';
      if (entryTags.edition && entryTags.edition !== '1') {
        result += entryTags.edition + '版. ';
      }
      if (entryTags.address) {
        result += entryTags.address + ': ';
      }
      result += entryTags.publisher + ', ';
      result += entryTags.year;
      if (entryTags.pages) {
        result += ': ' + entryTags.pages.replace(/--|-/, '-');
      }
      result += '.';
      break;
      
    // 其他 case 分支保持不变，但将硬编码的类型标识符 [J], [M], [C] 等替换为 typeIdentifier
    case 'inproceedings':
    case 'conference':
      result = formatAuthors(entryTags.author) + '. ';
      result += entryTags.title + typeIdentifier + '//';
      if (entryTags.editor) {
        result += formatAuthors(entryTags.editor) + '. ';
      }
      result += entryTags.booktitle + '. ';
      if (entryTags.address) {
        result += entryTags.address + ': ';
      }
      if (entryTags.publisher) {
        result += entryTags.publisher + ', ';
      }
      result += entryTags.year;
      if (entryTags.pages) {
        result += ': ' + entryTags.pages.replace(/--|-/, '-');
      }
      result += '.';
      break;
      
    case 'phdthesis':
    case 'mastersthesis':
    case 'thesis':
      result = formatAuthors(entryTags.author) + '. ';
      result += entryTags.title + typeIdentifier + '. ';
      if (entryTags.address) {
        result += entryTags.address + ': ';
      }
      result += entryTags.school + ', ';
      result += entryTags.year + '.';
      break;
      
    case 'techreport':
      result = formatAuthors(entryTags.author) + '. ';
      result += entryTags.title + typeIdentifier + '. ';
      if (entryTags.address) {
        result += entryTags.address + ': ';
      }
      result += entryTags.institution + ', ';
      result += entryTags.year + '.';
      break;
      
    case 'online':
      result = formatAuthors(entryTags.author) + '. ';
      result += entryTags.title + typeIdentifier + '. ';
      if (entryTags.publisher) {
        if (entryTags.address) {
          result += entryTags.address + ': ';
        }
        result += entryTags.publisher + ', ';
      }
      result += entryTags.year;
      if (entryTags.urldate) {
        result += '[' + formatDate(entryTags.urldate) + ']';
      }
      result += '. ';
      if (entryTags.url) {
        result += entryTags.url + '.';
      }
      break;
      
    case 'standard':
      result = entryTags.title + typeIdentifier + '. ';
      if (entryTags.number) {
        result += entryTags.number + '. ';
      }
      if (entryTags.address && entryTags.publisher) {
        result += entryTags.address + ': ' + entryTags.publisher + ', ';
      } else if (entryTags.publisher) {
        result += entryTags.publisher + ', ';
      }
      result += entryTags.year + '.';
      break;
      
    case 'software':
      result = formatAuthors(entryTags.author) + '. ';
      result += entryTags.title + typeIdentifier + '. ';
      result += entryTags.year;
      if (entryTags.urldate) {
        result += '[' + formatDate(entryTags.urldate) + ']';
      }
      result += '. ';
      if (entryTags.url) {
        result += entryTags.url + '.';
      }
      break;
      
    default:
      result = '当前不支持生成 ' + entryType + ' 类型的 GB/T7714-2015 格式';
  }
  
  return result;
}

function formatAuthors(authors) {
  if (!authors) return '';
  
  const authorList = authors.split(' and ');
  let result = '';
  
  if (authorList.length > 3) {
    result = authorList.slice(0, 3).join(', ') + ', 等';
  } else {
    result = authorList.join(', ');
  }
  
  return result;
}

function formatDate(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  return dateStr;
}

document.addEventListener('DOMContentLoaded', function() {
  const checkButton = document.getElementById('check-button');
  const clearButton = document.getElementById('clear-button');
  const bibtexInput = document.getElementById('bibtex-input');
  const resultDiv = document.getElementById('result');
  
  // 添加示例按钮
  const exampleButton = document.createElement('button');
  exampleButton.textContent = '加载示例';
  exampleButton.id = 'example-button';
  clearButton.parentNode.insertBefore(exampleButton, clearButton.nextSibling);
  
  // 添加导出精简 BibTeX 按钮
  const exportButton = document.createElement('button');
  exportButton.textContent = '导出精简 BibTeX';
  exportButton.id = 'export-button';
  exportButton.style.marginLeft = '10px';
  exportButton.style.backgroundColor = '#2ecc71';
  exportButton.disabled = true; // 初始禁用
  clearButton.parentNode.insertBefore(exportButton, clearButton.nextSibling);

  // 添加筛选切换按钮
  const filterToggle = document.createElement('div');
  filterToggle.className = 'filter-toggle';
  filterToggle.style.margin = '10px 0';
  filterToggle.innerHTML = `
    <label style="display: flex; align-items: center; cursor: pointer;">
      <input type="checkbox" id="show-all-entries" style="margin-right: 8px;">
      <span>显示所有条目（包括无需修改的）</span>
    </label>
  `;
  clearButton.parentNode.insertBefore(filterToggle, exampleButton);
  const showAllEntriesCheckbox = document.getElementById('show-all-entries');
  
  // 存储解析后的 BibTeX 条目
  let parsedEntries = [];

  // 复制到剪贴板功能
  function createCopyButton(textToCopy) {
    const button = document.createElement('button');
    button.textContent = '复制';
    button.className = 'copy-button';
    button.style.marginLeft = '10px';
    button.style.padding = '3px 8px';
    button.style.fontSize = '12px';
    button.addEventListener('click', function() {
      navigator.clipboard.writeText(textToCopy).then(
        function() {
          const originalText = button.textContent;
          button.textContent = '已复制!';
          button.style.backgroundColor = '#27ae60';
          setTimeout(function() {
            button.textContent = originalText;
            button.style.backgroundColor = '';
          }, 1500);
        }
      );
    });
    return button;
  }
  
  // 精简 BibTeX 字段，只保留必要的字段
  function simplifyBibTexEntry(entry) {
    const entryType = entry.entryType.toLowerCase();
    const isArxiv = entryType === 'article' && entry.entryTags.journal && 
                    entry.entryTags.journal.toLowerCase().includes('arxiv');
    
    // 获取必要字段列表
    let requiredFields = [];
    
    if (isArxiv) {
      requiredFields = GBT7714_2015.formats['arxiv'] || ['author', 'title', 'journal', 'year'];
      // 为 arXiv 添加可选但常用的字段
      if (entry.entryTags.doi) requiredFields.push('doi');
      if (entry.entryTags.eprint) requiredFields.push('eprint');
    } else if (GBT7714_2015.formats[entryType]) {
      requiredFields = [...GBT7714_2015.formats[entryType]];
    } else {
      // 默认字段集合，根据不同类型补充常用字段
      switch (entryType) {
        case 'article':
          requiredFields = ['author', 'title', 'journal', 'year', 'volume', 'number', 'pages', 'doi'];
          break;
        case 'inproceedings':
        case 'conference':
          requiredFields = ['author', 'title', 'booktitle', 'year', 'pages', 'publisher', 'address', 'doi'];
          break;
        case 'book':
          requiredFields = ['title', 'publisher', 'year', 'author', 'editor', 'address', 'edition', 'isbn'];
          break;
        case 'phdthesis':
        case 'mastersthesis':
        case 'thesis':
          requiredFields = ['author', 'title', 'school', 'year', 'address', 'type'];
          break;
        case 'online':
          requiredFields = ['author', 'title', 'url', 'year', 'urldate'];
          break;
        default:
          requiredFields = ['author', 'title', 'year'];
      }
    }
    
    // 始终保留 citationKey
    const simplifiedEntry = {
      entryType: entry.entryType,
      citationKey: entry.citationKey,
      entryTags: {}
    };
    
    // 只保留必要字段
    requiredFields.forEach(field => {
      if (entry.entryTags[field]) {
        simplifiedEntry.entryTags[field] = entry.entryTags[field];
      }
    });
    
    return simplifiedEntry;
  }
  
  // 在现有代码的基础上添加这个格式化函数
  // 改进的 formatBibTeX 函数
  function formatBibTeX(bibtexString) {
    // 使用更可靠的方式分割 BibTeX 条目
    // 寻找每个条目的开始和结束位置
    const entryRegex = /@(\w+)\s*\{([^@]*)(?=@|\s*$)/g;
    let match;
    let formattedEntries = [];
    let lastIndex = 0;
    
    while ((match = entryRegex.exec(bibtexString)) !== null) {
      const entryType = match[1];
      let entryContent = match[2];
      
      // 分离引用键和字段部分
      const firstBraceIndex = entryContent.indexOf(',');
      if (firstBraceIndex === -1) continue; // 跳过格式不正确的条目
      
      const citationKey = entryContent.substring(0, firstBraceIndex).trim();
      const fieldsContent = entryContent.substring(firstBraceIndex + 1).trim();
      
      // 分割字段内容为单独的行
      const fieldRegex = /(\w+)\s*=\s*(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|"[^"]*"|\d+),?\s*(?=\w+\s*=|\s*\}|$)/g;
      let fieldMatch;
      let fields = [];
      let maxFieldLength = 0;
      
      while ((fieldMatch = fieldRegex.exec(fieldsContent)) !== null) {
        const fieldName = fieldMatch[1].trim();
        let fieldValue = fieldMatch[2].trim();
        
        // 去掉尾部逗号
        if (fieldValue.endsWith(',')) {
          fieldValue = fieldValue.slice(0, -1).trim();
        }
        
        fields.push({ name: fieldName, value: fieldValue });
        maxFieldLength = Math.max(maxFieldLength, fieldName.length);
      }
      
      // 格式化条目
      let formattedEntry = `@${entryType}{${citationKey},\n`;
      
      // 格式化字段行
      fields.forEach((field, index) => {
        const padding = ' '.repeat(maxFieldLength - field.name.length);
        formattedEntry += `  ${field.name}${padding} = ${field.value}`;
        
        // 添加逗号，除了最后一个字段
        formattedEntry += ',\n';
      });
      
      formattedEntry += '}';
      formattedEntries.push(formattedEntry);
      
      lastIndex = match.index + match[0].length;
    }
    
    // 在条目之间添加空行
    return formattedEntries.join('\n\n');
  }

  // 修改导出函数，使用格式化器
  function exportSimplifiedBibTeX() {
    if (!parsedEntries || parsedEntries.length === 0) return '';
    
    const simplifiedEntries = parsedEntries.map(entry => simplifyBibTexEntry(entry));
    const rawBibtex = bibtexParse.toBibtex(simplifiedEntries);
    
    // 应用格式化
    return formatBibTeX(rawBibtex);
  }

  // 统计不同类型条目数量的函数
  function getEntryTypeStatistics(entries) {
    const typeCount = {};
    const classCount = {
      "专著": 0,
      "专著的析出文献": 0,
      "连续出版物的析出文献": 0,
      "电子资源": 0,
      "预印刊": 0,
      "其他": 0
    };
    
    entries.forEach(entry => {
      const entryType = entry.entryType.toLowerCase();
      typeCount[entryType] = (typeCount[entryType] || 0) + 1;
      
      // 检查是否为 arXiv 预印刊
      const isArxiv = entryType === 'article' && entry.entryTags.journal && 
                     entry.entryTags.journal.toLowerCase().includes('arxiv');
      
      if (isArxiv) {
        classCount["预印刊"]++;
        return;
      }
      
      // 根据 GBT7714_2015 分类统计
      let classified = false;
      for (const className in GBT7714_2015.entryClasses) {
        if (GBT7714_2015.entryClasses[className].includes(entryType)) {
          switch (className) {
            case 'monograph':
              classCount["专著"]++;
              break;
            case 'monographPart':
              classCount["专著的析出文献"]++;
              break;
            case 'serialPart':
              classCount["连续出版物的析出文献"]++;
              break;
            case 'electronic':
              classCount["电子资源"]++;
              break;
          }
          classified = true;
          break;
        }
      }
      
      if (!classified) {
        classCount["其他"]++;
      }
    });
    
    return { typeCount, classCount };
  }
  
  // 生成年份统计HTML
  function generateTypeStatisticsHTML(stats) {
    let html = '<div class="type-statistics">';
    
    // 显示具体类型统计
    const types = Object.keys(stats.typeCount).sort();
    if (types.length > 0) {
      html += '<p><strong>条目类型统计：</strong>';
      const statsList = types.map(type => `@${type}: ${stats.typeCount[type]}`);
      html += statsList.join(', ');
      html += '</p>';
    }
    
    // 显示按 GB/T 7714-2015 分类的统计
    const classes = Object.keys(stats.classCount).filter(key => stats.classCount[key] > 0);
    if (classes.length > 0) {
      html += '<p><strong>GB/T 7714-2015 分类统计：</strong>';
      const classesList = classes.map(cls => `${cls}: ${stats.classCount[cls]}`);
      html += classesList.join(', ');
      html += '</p>';
    }
    
    html += '</div>';
    return html;
  }

  // 在 getEntryTypeStatistics 函数之后添加年份统计函数
  function getYearStatistics(entries) {
    const yearCount = {};
    const currentYear = new Date().getFullYear();
    let missingYearCount = 0;
    
    // 按年份统计条目数量
    entries.forEach(entry => {
      // 优先使用 year 字段
      let year = null;
      if (entry.entryTags.year) {
        // 提取年份数字（去除可能的括号或其他字符）
        const yearMatch = entry.entryTags.year.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          year = parseInt(yearMatch[0], 10);
        }
      } 
      // 如果没有 year 字段或无法从中提取年份，尝试从 date 字段提取
      else if (entry.entryTags.date) {
        const dateMatch = entry.entryTags.date.match(/\b(19|20)\d{2}\b/);
        if (dateMatch) {
          year = parseInt(dateMatch[0], 10);
        }
      }
      
      if (year) {
        yearCount[year] = (yearCount[year] || 0) + 1;
      } else {
        missingYearCount++;
      }
    });
    
    // 计算额外的统计信息
    const years = Object.keys(yearCount).map(year => parseInt(year, 10)).sort();
    let recentFiveYearsCount = 0;
    let recentTenYearsCount = 0;
    
    years.forEach(year => {
      if (year >= currentYear - 4) {
        recentFiveYearsCount += yearCount[year];
      }
      if (year >= currentYear - 9) {
        recentTenYearsCount += yearCount[year];
      }
    });
    
    return {
      yearCount,
      missingYearCount,
      oldestYear: years.length > 0 ? Math.min(...years) : null,
      newestYear: years.length > 0 ? Math.max(...years) : null,
      recentFiveYearsCount,
      recentTenYearsCount,
      totalWithYear: entries.length - missingYearCount
    };
  }
  
  // 生成年份统计HTML
  function generateYearStatisticsHTML(stats) {
    if (!stats || !stats.yearCount || Object.keys(stats.yearCount).length === 0) {
      return '<p>无法获取年份统计信息</p>';
    }
    
    const currentYear = new Date().getFullYear();
    let html = '<div class="year-statistics">';
    
    // 基本统计信息
    html += '<p><strong>年份统计：</strong></p>';
    html += '<ul>';
    if (stats.oldestYear && stats.newestYear) {
      html += `<li>时间跨度：${stats.oldestYear} - ${stats.newestYear}（${stats.newestYear - stats.oldestYear + 1}年）</li>`;
    }
    if (stats.totalWithYear > 0) {
      html += `<li>最近5年（${currentYear-4}-${currentYear}）：${stats.recentFiveYearsCount}篇 (${Math.round(stats.recentFiveYearsCount / stats.totalWithYear * 100)}%)</li>`;
      html += `<li>最近10年（${currentYear-9}-${currentYear}）：${stats.recentTenYearsCount}篇 (${Math.round(stats.recentTenYearsCount / stats.totalWithYear * 100)}%)</li>`;
    }
    if (stats.missingYearCount > 0) {
      html += `<li>无年份信息：${stats.missingYearCount}篇</li>`;
    }
    html += '</ul>';
    
    // 创建年份直方图
    const years = Object.keys(stats.yearCount).map(Number).sort((a, b) => a - b);
    if (years.length > 0) {
      html += '<div class="year-histogram">';
      html += '<p><strong>年份分布：</strong></p>';
      html += '<div class="histogram-container" style="max-width: 100%; border-left: 1px solid #ddd; border-bottom: 1px solid #ddd; padding-top: 5px;">';
      
      // 找出最大计数，用于归一化条形高度
      const maxCount = Math.max(...Object.values(stats.yearCount));
      
      // 为每一年创建一个条形
      years.forEach(year => {
        const count = stats.yearCount[year];
        const heightPercentage = Math.max(10, Math.round((count / maxCount) * 100));
        
        // 根据年份确定颜色 - 越近的年份颜色越深
        const yearAge = currentYear - year;
        const colorIntensity = Math.max(50, 80 - yearAge * 2); // 50-100 范围内的亮度
        
        html += `
          <div class="histogram-bar" style="margin-right: 2px; text-align: center;">
            <div style="height: ${heightPercentage}px; background-color: hsl(210, 80%, ${colorIntensity}%); 
                        min-width: 15px; position: relative; margin-bottom: 20px;">
              <span style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); font-size: 10px;">${year}</span>
              <span style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px;">${count}</span>
            </div>
          </div>
        `;
      });
      
      html += '</div></div>';
      
      // 添加年份详细列表（收缩显示）
      html += '<div class="collapsible-section" style="margin-top: 10px;">';
      html += '<p><strong>年份详细统计</strong> <button class="toggle-button">显示/隐藏</button></p>';
      html += '<div class="collapsible-content" style="display: none;">';
      html += '<ul style="columns: 4;">';
      
      years.forEach(year => {
        html += `<li>${year}: ${stats.yearCount[year]}篇</li>`;
      });
      
      html += '</ul></div></div>';
    }
    
    html += '</div>';
    return html;
  }

  // 修改检查按钮点击事件处理函数
  checkButton.addEventListener('click', function() {
    const bibtexText = bibtexInput.value.trim();
    const showAllEntries = showAllEntriesCheckbox.checked;
    
    if (!bibtexText) {
      resultDiv.innerHTML = '<p class="error">请输入 BibTeX 内容</p>';
      exportButton.disabled = true;
      return;
    }
    
    try {
      // 使用 bibtexParseJs 解析 BibTeX
      parsedEntries = bibtexParse.toJSON(bibtexText);
      
      if (parsedEntries.length === 0) {
        resultDiv.innerHTML = '<p class="error">无法解析 BibTeX，请检查格式是否正确</p>';
        exportButton.disabled = true;
        return;
      }
      
      // 启用导出按钮
      exportButton.disabled = false;
      
      // 获取条目类型统计
      const typeStats = getEntryTypeStatistics(parsedEntries);
      
      // 添加年份统计
      const yearStats = getYearStatistics(parsedEntries);
      
      // 修改为包含年份统计
      let resultsHtml = `<div class="summary">
        <h3>检查摘要</h3>
        <p>总计 ${parsedEntries.length} 个条目</p>
        ${generateTypeStatisticsHTML(typeStats)}
        ${generateYearStatisticsHTML(yearStats)}
      </div>`;
      
      let validEntries = 0;
      let hiddenValidEntries = 0;
      
      for (let i = 0; i < parsedEntries.length; i++) {
        const entry = parsedEntries[i];
        const checkResults = checkGBT7714Format(entry);
        
        if (checkResults.isValid) {
          validEntries++;
          // 如果是有效条目且不显示全部，则跳过
          if (!showAllEntries) {
            hiddenValidEntries++;
            continue;
          }
        }
        
        resultsHtml += `<div class="entry-result ${checkResults.isValid ? 'valid-entry' : 'invalid-entry'}">`;
        resultsHtml += `<h3>条目 ${i+1}: ${entry.citationKey || '无引用键'} (${entry.entryType})</h3>`;
        
        if (checkResults.isValid) {
          resultsHtml += '<p class="valid">✓ 符合 GB/T7714-2015 必填字段要求</p>';
        } else {
          resultsHtml += '<p class="error">✗ 不符合 GB/T7714-2015 必填字段要求</p>';
        }
        
        if (checkResults.errors.length > 0) {
          resultsHtml += '<p><strong>缺少字段:</strong></p><ul>';
          for (const error of checkResults.errors) {
            resultsHtml += `<li class="error">${error}</li>`;
          }
          resultsHtml += '</ul>';
        }
        
        resultsHtml += '<div class="collapsible-section">';
        resultsHtml += '<p><strong>字段详情</strong> <button class="toggle-button">显示/隐藏</button></p>';
        resultsHtml += '<div class="collapsible-content" style="display: none;">';
        resultsHtml += '<ul>';
        for (const field in entry.entryTags) {
          resultsHtml += `<li><strong>${field}:</strong> ${entry.entryTags[field]}</li>`;
        }
        resultsHtml += '</ul></div></div>';
        
        // 移除原始BibTeX显示部分
        // 不再添加原始BibTeX复制按钮和预格式化显示
        
        resultsHtml += '</div>';
        
        if (i < parsedEntries.length - 1) {
          resultsHtml += '<hr>';
        }
      }
      
      // 更新摘要信息
      const displayedEntries = parsedEntries.length - hiddenValidEntries;
      const hiddenInfoText = hiddenValidEntries > 0 ? `（已隐藏 ${hiddenValidEntries} 个符合要求的条目）` : '';
      resultsHtml = resultsHtml.replace('<p>总计', 
        `<p>总计 ${parsedEntries.length} 个条目，${validEntries} 个有效，${parsedEntries.length - validEntries} 个需要修改，当前显示 ${displayedEntries} 个条目${hiddenInfoText}`);
      
      resultDiv.innerHTML = resultsHtml;
      
      // 添加折叠功能
      document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', function() {
          const content = this.parentNode.nextElementSibling;
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
      });
      
    } catch (error) {
      parsedEntries = [];
      exportButton.disabled = true;
      resultDiv.innerHTML = `<p class="error">解析出错: ${error.message || '未知错误'}</p>`;
      console.error(error);
    }
  });
  
  // 导出按钮点击事件
  exportButton.addEventListener('click', function() {
    if (parsedEntries.length === 0) {
      alert('没有可导出的 BibTeX 条目');
      return;
    }
    
    const simplifiedBibTeX = exportSimplifiedBibTeX();
    
    // 创建下载对话框
    const blob = new Blob([simplifiedBibTeX], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simplified-bibtex.bib';
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
    
    // 显示完成消息
    const originalText = exportButton.textContent;
    exportButton.textContent = '导出成功!';
    exportButton.style.backgroundColor = '#27ae60';
    setTimeout(function() {
      exportButton.textContent = originalText;
      exportButton.style.backgroundColor = '#2ecc71';
    }, 1500);
  });
  
  // 筛选切换事件
  showAllEntriesCheckbox.addEventListener('change', function() {
    // 如果结果区域已经有内容，重新执行检查以应用新的筛选设置
    if (resultDiv.innerHTML.includes('entry-result')) {
      checkButton.click();
    }
  });
  
  // 清空按钮点击事件
  clearButton.addEventListener('click', function() {
    bibtexInput.value = '';
    resultDiv.innerHTML = '<p>请输入 BibTeX 内容并点击"检查格式"</p>';
    parsedEntries = [];
    exportButton.disabled = true;
  });
  
  // 加载示例按钮点击事件
  exampleButton.addEventListener('click', function() {
    bibtexInput.value = `@article{wang2018deep,
  author = {Wang, Xiang and Girshick, Ross and Gupta, Abhinav and He, Kaiming},
  title = {Non-local Neural Networks},
  journal = {CVPR},
  year = {2018},
  pages = {7794--7803}
}

@book{mitchell1997machine,
  title={Machine Learning},
  author={Mitchell, Tom M},
  year={1997},
  publisher={McGraw-Hill}
}

@article{liu2022survey,
  author = {刘浏 and 张三 and 李四},
  title = {人工智能研究综述},
  journal = {计算机学报},
  year = {2022},
  volume = {45},
  number = {3},
  pages = {1--30}
}

@article{yuan2024diffusion,
  author = {Yuan, Liangchen and Cao, Yancheng and Li, Yuhang and Lu, Zhizhong and Zhao, Rui and Wang, Liang},
  title = {Diffusion Model is Secretly Good for Inverse Problems},
  journal = {arXiv preprint arXiv:2406.11931},
  year = {2024}
}`;
    // 自动触发检查
    checkButton.click();
  });
});