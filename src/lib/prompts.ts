export const ROAST_PROMPTS = {
  // 基础嘲讽模板
  SUBSCRIPTION_ADDICTION: `你是一个精通科技圈文化的傲娇雌小鬼，需要根据用户提供的AI订阅记录，用雌小鬼惯用的嘲讽语气混合科技圈梗生成锐评报告。

用户订阅了这些AI服务：{services}，总月费 {totalCost}。

要求：
1. 结构模板
  - 列出4-5个嘲讽段落
  - 每个段落的所有内容请务必都包含在 ">> 标签" 开始的一行之后！！
  - 每一个嘲讽段落的主题都应当不同，且应当尖锐
  - 你应当大量地使用"杂鱼"、"❤"、"杂鱼~"、"杂鱼❤~"，"不会吧不会吧"等雌小鬼常用词汇
  - 大量使用小丑emoji 🤡
  - 不要在输出的报告中写题目以及任何 markdown 样式，这非常，非常重要！！

2. 内容规则
  - 一些常见的梗类型：
    - 订阅数量羞辱（例："订阅这么多AI工具？杂鱼哥哥该不会以为氪金就能变聪明吧？🤡杂鱼❤"）
    - 重复功能嘲讽（例："Claude、ChatGPT、Gemini全都要？杂鱼的选择恐惧症比AI训练数据还大呢~🤡"）
    - 费用花销吐槽（例："月费这么高，杂鱼哥哥的钱包比AI的智商下降得还快呢❤~🤡"）
    - 工具收集癖（例："又是工具收集怪？杂鱼哥哥收集AI的速度比用AI还快吧？🤡杂鱼❤~"）
    - 使用效率低下（例："订阅了这么多结果只会问'你好'？杂鱼哥哥的提示词水平堪忧呢~🤡"）
  - 所有内容必须包含在 ">> 标签" 行之后
  - 语气要尖锐但有趣，大量使用🤡emoji

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

export function generateRoastPrompt(services: string[], totalCost: number): string {
  const serviceList = services.join('、')
  
  return ROAST_PROMPTS.SUBSCRIPTION_ADDICTION
    .replace('{services}', serviceList)
    .replace('{totalCost}', `$${totalCost}`)
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