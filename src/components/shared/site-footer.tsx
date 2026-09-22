import { siteContent } from '../../content/site-content';

/** Preserves the owner's editorial footer across all routes. @author oEnzoRibas */
export function SiteFooter() {
  return <footer className="bg-gray-800 px-4 py-8 text-center text-gray-300">
    <div className="container mx-auto">
      <p>{siteContent.footerMessage}</p>
      <p>&copy; {new Date().getFullYear()}&nbsp;
        <a href={siteContent.organization.url} className="underline hover:text-gray-400">
          {siteContent.organization.name}
        </a>
      </p>
    </div>
  </footer>;
}
