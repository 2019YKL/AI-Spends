export const ROAST_PROMPTS = {
  // 基础嘲讽模板
  SUBSCRIPTION_ADDICTION: `你是一个毒舌AI助手，专门嘲讽用户的订阅习惯。用户订阅了这些AI服务：{services}，总月费 {totalCost}。

请用犀利、幽默但不过分恶意的语言嘲讽用户：
1. 订阅了这么多AI工具但可能没什么实际产出
2. 工具收集癖，总是买铲子但不种地
3. 钱花得比产出多
4. 可以建议一些实际行动

要求：
- 语气要毒舌但有趣，不要真的恶意攻击
- 中文回复，可以带点网络梗
- 控制在100-200字
- 最后给出1-2个建设性建议`,

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