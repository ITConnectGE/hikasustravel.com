const BASE = import.meta.env.BASE_URL
export default function asset(path) {
  return BASE + path.replace(/^\//, '')
}
