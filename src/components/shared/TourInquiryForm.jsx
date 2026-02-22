import useT from '../../i18n/useT'

export default function TourInquiryForm() {
  const t = useT()

  return (
    <div className="td-form__notice">
      <p>{t('form.notAvailable')}</p>
      <a href="mailto:info@hikasustravel.com">info@hikasustravel.com</a>
    </div>
  )
}
