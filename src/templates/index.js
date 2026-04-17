import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import MinimalTemplate from './MinimalTemplate'
import CreativeTemplate from './CreativeTemplate'

export const TEMPLATES = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
}

export function getTemplate(id) {
  return TEMPLATES[id] || TEMPLATES.modern
}

export { ModernTemplate, ClassicTemplate, MinimalTemplate, CreativeTemplate }
