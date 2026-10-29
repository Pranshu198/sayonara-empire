import { useReducedMotion as useFrmReducedMotion } from 'framer-motion'
// Accessibility: user ne reduced-motion rakha hai to bade animations band
export function useReducedMotion() {
  return !!useFrmReducedMotion()
}
