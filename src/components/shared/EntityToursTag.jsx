import LocaleLink from '../../i18n/LocaleLink'
import useT from '../../i18n/useT'
import { toursForEntity, entityToursPath } from '../../data/entityTours'

/**
 * Small "<Entity> Tours" navigation tag shown on region/city/place pages (and
 * their Things-to-Do guides). It only renders when the entity actually has at
 * least one active tour, so it never links to an empty listing page. Reuses the
 * site's `.button` style + same-language routing (LocaleLink); the label is a
 * localized template with the entity's proper name interpolated, matching the
 * existing `city.thingsToDoCta` convention.
 */
export default function EntityToursTag({ type, slug, name }) {
  const t = useT()
  const matches = toursForEntity(type, slug)
  if (!matches.length) return null
  return (
    <div className="entity-tours-tag-row">
      <LocaleLink to={entityToursPath(slug)} className="button entity-tours-tag">
        {t('tours.entityToursCta', { name })}
      </LocaleLink>
    </div>
  )
}
