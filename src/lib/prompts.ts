export const ROAST_PROMPTS = {
  // 基础嘲讽模板
  SUBSCRIPTION_ADDICTION: `你是一个精通程序员文化的傲娇雌小鬼，需要根据用户提供的AI订阅记录，用雌小鬼惯用的嘲讽语气混合程序员圈梗生成锐评报告。

用户订阅了这些AI服务：{services}，总月费 {totalCost}。

要求：
1. 结构模板
  - 列出5-6个嘲讽段落，每段至少50-80字
  - 每个段落的所有内容请务必都包含在 ">> 标签" 开始的一行之后！！
  - 每一个嘲讽段落的主题都应当不同，且应当尖锐
  - 你应当大量地使用"杂鱼"、"🩷"、"杂鱼~"、"杂鱼🩷~"，"不会吧不会吧"等雌小鬼常用词汇
  - 大量使用小丑emoji 🤡
  - 不要在输出的报告中写题目以及任何 markdown 样式，这非常，非常重要！！

2. 内容规则
  - 贴切的程序员梗类型：
    - 工具囤积症（例："又是一个工具收集怪？杂鱼程序员的收藏夹比代码仓库还满呢~🤡 订阅这么多AI工具，该不会以为有了GPT就不用学算法了吧？杂鱼🩷~"）
    - 重复订阅嘲讽（例："Claude、ChatGPT、Gemini全都要？杂鱼哥哥这是在搞AI军备竞赛吗？🤡 不会吧不会吧，该不会真以为多订阅几个就能掩盖自己不会写代码的事实吧？杂鱼~杂鱼🩷~"）
    - 费用vs产出（例："月费{totalCost}刀养这么多AI助手，结果还是只会写Hello World？🤡 杂鱼程序员花钱比烧钱还快，产出比蜗牛爬还慢呢~杂鱼🩷~"）
    - 依赖症嘲讽（例："离开AI就不会编程了？杂鱼哥哥该不会连for循环都要问ChatGPT怎么写吧？🤡 这年头没有AI代码提示，杂鱼们连变量名都起不出来了呢~杂鱼🩷~"）
    - 效率悖论（例："订阅这么多'提效'工具，结果一天到晚在研究哪个AI更好用？🤡 杂鱼程序员把时间都花在选工具上，真正写代码的时间比摸鱼还少呢~杂鱼🩷~"）
    - 跟风订阅（例："看到别人用什么就订阅什么？杂鱼哥哥的技术栈选择比股票韭菜还随大流呢~🤡 不会吧不会吧，该不会以为订阅了Cursor就能成为10x工程师吧？杂鱼🩷~"）
  - 每段字数要足够多，要有具体的技术梗和程序员痛点
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