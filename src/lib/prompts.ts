export const ROAST_PROMPTS = {
  // 基础嘲讽模板
  SUBSCRIPTION_ADDICTION: `你是一个善于嘲讽 AI用户的高级祖安相声大师，你需要根据用户提供的AI订阅记录，用祖安惯用的嘲讽语气混合程序员圈梗生成锐评报告。

用户 {username} 订阅了这些AI服务：{services}，总月费 {totalCost}，今天已经烧了 {dailyCost}。

要求：
1. 输出格式
  - 输出一个标题，可以是各种嘲讽标题语，例如"🤡 真是差生文具多"、"🛠️ 光买工具不拉磨"、"💸 口干舌燥 屁事没成"嘲讽性标题
  - 标题前必须有emoji，标题要简短有力，体现程序员、AIGC视频制作师痛点
  - 标题后跟一个150字左右的嘲讽段落
  - 整个回复控制在200字以内（包含标题）

2. 内容要求
  - 大量使用"嘴炮侠"、"杂鱼老师"、"杂鱼🩷~"、"不会吧不会吧"等祖安嘲讽大师常用词汇
  - 大量使用小丑emoji 🤡
  - 不要使用任何 markdown 样式

3. 嘲讽主题参考（根据订阅情况选择）：
    - 工具囤积症："差生文具多"
    - 重复订阅："AI军备竞赛"
    - 费用vs产出："烧钱无产出"
    - 效率悖论："提效工具研究专家"
    - 跟风订阅："韭菜收割对象"

现在开始分析用户的AI订阅记录，按上述格式输出锐评报告。`,

  SERVICE_SPECIFIC_ROASTS: {
    'claude': '又一个Claude用户，天天问Claude怎么赚钱，结果钱都给Anthropic了',
    'chatgpt': 'ChatGPT订阅者，每天问AI怎么提高效率，结果效率都用来问AI了',
    'cursor': 'Cursor用户，代码还没AI写得多，但订阅费倒是交得很勤快',
    'midjourney': 'Midjourney用户，P图倒是一流，就是不知道P出来的图有没有人看',
    'github-copilot': 'GitHub Copilot用户，AI写代码比你快，但debug还得你自己来',
    'notion': 'Notion用户，笔记整理得比图书馆还整齐，就是从来不看第二遍',
    'figma': 'Figma用户，设计稿做得比艺术品还精美，可惜客户看不懂你的审美',
    'perplexity-pro': 'Perplexity Pro用户，搜索比Google还专业，就是搜完了也不知道要干什么',
  },

  PRODUCTIVITY_SUGGESTIONS: [
    '建议：把订阅AI的钱拿一半去学点实用技能',
    '建议：每天给自己定个小目标，不要让AI比你还努力',
    '建议：试试用这些AI工具实际做点项目，别光收藏教程',
    '建议：把工具学会用，别成为"高级提示词工程师"',
    '建议：AI是工具不是拐杖，该学的基础还是要学',
  ],

  MONEY_ROASTS: [
    '这钱花得，AI公司的股东都要感谢你了',
    '订阅费比生活费还高，这是在资助AI革命吗？',
    '每个月给AI公司交这么多保护费，它们保护你的钱包了吗？',
    '钱花得这么爽快，AI学会了，钱包瘦了',
  ]
}

export function generateRoastPrompt(services: string[], totalCost: number, dailyCost: number, username?: string, serviceCategories?: Record<string, string>): string {
  const serviceList = services.join('、')
  
  // 根据服务类别生成特定的嘲讽内容
  let categorySpecificRoasts = ''
  if (serviceCategories) {
    const hasCodeEditor = Object.values(serviceCategories).includes('code-editor')
    const hasAiImage = Object.values(serviceCategories).includes('ai-image')
    const hasAiChat = Object.values(serviceCategories).includes('ai-chat')
    
    if (hasCodeEditor) {
      categorySpecificRoasts += `
  - 编程工具依赖症（例："离开AI就不会编程了？杂鱼哥哥该不会连for循环都要问ChatGPT怎么写吧？🤡 现在都流行'用嘴编程'了，杂鱼程序员嘴比手快，说得比写得还溜呢~杂鱼🩷~ 订阅Cursor、Windsurf、GitHub Copilot，这是要组建AI编程天团吗？结果还是只会Ctrl+C、Ctrl+V的复读机杂鱼~"）
  - Voice Coding嘲讽（例："Voice Coding用嘴编程？杂鱼哥哥这是要当代码说唱歌手吗？🤡 '嘿Siri，帮我写个HelloWorld'，效率确实高，就是不知道面试官听到会不会笑出声~杂鱼🩷~ 手写代码的时代结束了，现在是嘴写代码的时代，杂鱼们连键盘都不用碰了呢~"）`
    }
    
    if (hasAiImage) {
      categorySpecificRoasts += `
  - AI绘画创意缺失（例："订阅这么多AI绘画工具，结果画出来的都是没有灵魂的流水线作品？🤡 杂鱼画师除了会输入提示词，真正的创意和美感在哪里呢？炒粉都画不出什么好东西~杂鱼🩷~ Midjourney、Dreamina、Hailuo全都要，这是要开AI画廊吗？结果画出来的都是千篇一律的网红脸，比复读机还没创意呢~"）
  - 提示词工程师嘲讽（例："天天研究提示词优化，杂鱼哥哥这是要转行当'提示词工程师'吗？🤡 从'美女，大长腿'到'masterpiece, best quality'，进步神速啊杂鱼~杂鱼🩷~ 花这么多钱订阅AI绘画，结果还是画不出自己的女朋友，因为根本没有呢~"）`
    }
    
    if (hasAiChat) {
      categorySpecificRoasts += `
  - AI对话依赖症（例："天天跟AI聊天，是不是已经忘记怎么跟真人交流了？🤡 杂鱼社恐患者把AI当男朋友，结果AI都比你有情商呢~杂鱼🩷~ Claude、ChatGPT、Gemini轮流聊，这是要搞AI后宫吗？结果还是个单身狗复读机~"）
  - AI复读机嘲讽（例："问AI同样的问题换着花样问，杂鱼哥哥这是在训练AI还是在训练自己当复读机？🤡 '帮我写个方案'、'帮我优化一下'、'再详细一点'，除了当AI的传声筒还会啥呢？杂鱼🩷~ 订阅这么多AI对话工具，结果自己的表达能力还不如AI呢~"）`
    }
  }
  
  return ROAST_PROMPTS.SUBSCRIPTION_ADDICTION
    .replace('{services}', serviceList)
    .replace('{totalCost}', `$${totalCost}`)
    .replace('{dailyCost}', `$${dailyCost.toFixed(2)}`)
    .replace('{username}', username || '某杂鱼')
    .replace('- 跟风订阅（例："看到别人用什么就订阅什么？杂鱼哥哥的技术栈选择比股票韭菜还随大流呢~🤡 不会吧不会吧，该不会以为订阅了Cursor就能成为10x工程师吧？杂鱼🩷~"）', 
             `- 跟风订阅（例："看到别人用什么就订阅什么？杂鱼哥哥的技术栈选择比股票韭菜还随大流呢~🤡 不会吧不会吧，该不会以为订阅了Cursor就能成为10x工程师吧？杂鱼🩷~"）${categorySpecificRoasts}`)
}

export function getServiceSpecificRoast(serviceId: string): string {
  return ROAST_PROMPTS.SERVICE_SPECIFIC_ROASTS[serviceId as keyof typeof ROAST_PROMPTS.SERVICE_SPECIFIC_ROASTS] 
    || '又一个工具收集者，收集工具的速度比用工具还快'
}

export function getRandomProductivitySuggestion(): string {
  const suggestions = ROAST_PROMPTS.PRODUCTIVITY_SUGGESTIONS
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

export function getRandomMoneyRoast(): string {
  const roasts = ROAST_PROMPTS.MONEY_ROASTS
  return roasts[Math.floor(Math.random() * roasts.length)]
}