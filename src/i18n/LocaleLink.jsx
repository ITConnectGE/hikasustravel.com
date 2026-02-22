import { forwardRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { I18nContext } from './I18nProvider'

const LocaleLink = forwardRef(function LocaleLink({ to, ...props }, ref) {
  const { lang } = useContext(I18nContext)
  const prefixed = to && typeof to === 'string' ? `/${lang}${to.startsWith('/') ? '' : '/'}${to}` : to
  return <Link ref={ref} to={prefixed} {...props} />
})

export default LocaleLink
