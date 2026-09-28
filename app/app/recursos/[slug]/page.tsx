import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource, resources } from "@/lib/resources";
import { getSiteUrl } from "@/lib/url";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: `${resource.title} | Alejandro Puerto Technology`,
    description: resource.excerpt,
    alternates: { canonical: `/recursos/${resource.slug}` },
    openGraph: {
      title: resource.title,
      description: resource.excerpt,
      type: "article",
      publishedTime: resource.publishedAt,
    },
  };
}

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const articleUrl = `${getSiteUrl()}/recursos/${resource.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.excerpt,
    datePublished: resource.publishedAt,
    dateModified: resource.updatedAt ?? resource.publishedAt,
    author: { "@type": "Person", name: "Alejandro Puerto" },
    publisher: { "@type": "Organization", name: "Alejandro Puerto Technology" },
    mainEntityOfPage: articleUrl,
  };

  return (
    <div className="page resourceArticlePage">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <article>
        <header className="resourceArticleHero">
          <div className="container resourceArticleHeroInner">
            <Link className="resourceBack" href="/recursos">← Recursos</Link>
            <p className="eyebrow">{resource.category.toUpperCase()}</p>
            <h1>{resource.title}</h1>
            <p className="resourceArticleExcerpt">{resource.excerpt}</p>
            <div className="resourceArticleMeta">
              <span>Por Alejandro Puerto</span>
              <span>{resource.readTime} de lectura</span>
              <span>28 septiembre 2026</span>
            </div>
          </div>
        </header>

        <div className="container resourceArticleLayout">
          <div className="resourceArticleBody">
            {resource.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}
          </div>

          <aside className="resourceToolCta">
            <span>LLÉVALO A LA PRÁCTICA</span>
            <h3>{resource.toolLabel}</h3>
            <p>{resource.toolDescription}</p>
            <Link className="button buttonPrimary" href={resource.toolHref}>Abrir herramienta <span>→</span></Link>
            <Link className="resourceContactLink" href="/contacto">Quiero revisarlo contigo →</Link>
          </aside>
        </div>
      </article>

      <section className="resourceMoreSection">
        <div className="container">
          <div className="resourcesSectionHead compact">
            <div><p className="eyebrow">SEGUIR APRENDIENDO</p><h2>Más recursos APT</h2></div>
            <Link href="/recursos">Ver todos →</Link>
          </div>
          <div className="resourceMoreGrid">
            {resources.filter((item) => item.slug !== resource.slug).slice(0, 3).map((item) => (
              <Link className="resourceMoreCard" href={`/recursos/${item.slug}`} key={item.slug}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <small>{item.readTime} →</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
