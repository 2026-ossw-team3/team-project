import { surfaceStyles, textStyles } from "../styles/uiStyles";

function PageHero({
  eyebrow,
  title,
  description,
  subDescription = "",
  titleSize = "default",
  actions = null,
  children = null,
}) {
  const titleClass =
    titleSize === "sm" ? textStyles.pageTitleSm : textStyles.pageTitle;

  return (
    <section className={surfaceStyles.heroPanel}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className={textStyles.eyebrow}>{eyebrow}</p>}

          <h1 className={titleClass}>{title}</h1>

          {description && (
            <p className={`mt-4 max-w-3xl ${textStyles.bodyBase}`}>
              {description}
            </p>
          )}

          {subDescription && (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              {subDescription}
            </p>
          )}
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {children}
    </section>
  );
}

export default PageHero;