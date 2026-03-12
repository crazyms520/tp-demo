/**
 * 文字樣式 Design Tokens（來自 Zeplin 專案 64cc6c6e98ec102214efb7bc）
 * 顏色已解析為實際值
 */

import { colors } from './colors.js'

export const textStyles = {
  'text-style': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 30,
    fontWeight: 600,
    color: colors.red,
  },
  'text-style-2': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    color: colors['dark-slate-blue-80'],
  },
  'text-style-3': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 20,
    fontWeight: 600,
    color: colors['sf-dblue'],
  },
  'text-style-4': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 24,
    fontWeight: 600,
    color: 'rgb(61, 109, 193)',
  },
  'text-style-5': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 18,
    fontWeight: 500,
    color: colors['red-two'],
  },
  'text-style-6': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 18,
    fontWeight: 500,
    color: colors['brownish-grey'],
  },
  'text-style-7': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 20,
    fontWeight: 500,
    color: colors.white,
  },
  'text-style-8': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 16,
    fontWeight: 500,
    color: colors['sf-dblue'],
  },
  'text-style-9': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 16,
    fontWeight: 500,
    color: colors['greyish-brown'],
  },
  'text-style-10': {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
    fontWeight: 700,
    color: colors.white,
  },
  'text-style-11': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 29,
    color: colors['brownish-grey-two'],
  },
  'text-style-12': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    color: colors['brownish-grey'],
  },
  'text-style-13': {
    fontFamily: 'PingFangTC, sans-serif',
    fontSize: 14,
    fontWeight: 400,
    color: colors['warm-grey'],
  },
}

/** 回傳可套用在 CSS 的 style 字串（font-size 等） */
export function getTextStyleCss(styleKey) {
  const s = textStyles[styleKey]
  if (!s) return ''
  return `
    font-family: ${s.fontFamily};
    font-size: ${s.fontSize}px;
    font-weight: ${s.fontWeight};
    ${s.lineHeight ? `line-height: ${s.lineHeight}px;` : ''}
    color: ${s.color};
  `.trim()
}

export default textStyles
