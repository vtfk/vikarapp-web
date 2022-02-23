export function mergeStyles(style1, style2) {
  // Input validation
  if(!style1 || typeof style1 !== 'object') style1 = {}
  if(!style2 || typeof style2 !== 'object') style2 = {}
  // Merge the two styles
  return Object.assign(style1, style2)
}