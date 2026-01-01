import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  product?: {
    name: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    category?: string;
    image?: string;
    description?: string;
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const SEO = ({ 
  title = 'Noor — Premium E-Commerce',
  description = 'Entdecken Sie bei Noor exklusive Qualitätsprodukte für Baby, Schönheit, Elektronik, Haus & Küche, Garten, Schmuck, Spielzeug und mehr. Faire Preise, schneller Versand.',
  image = 'https://noor-shop.de/og-image.png',
  url = 'https://noor-shop.de',
  type = 'website',
  keywords = 'Noor, Online Shop, E-Commerce, Baby, Schönheit, Elektronik, Haus, Küche, Garten, Schmuck, Spielzeug, Kleidung, Sport, Deutschland',
  author = 'Noor',
  publishedTime,
  modifiedTime,
  product,
  breadcrumbs
}: SEOProps) => {
  const fullTitle = title === 'Noor — Premium E-Commerce' ? title : `${title} | Noor`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : url;

  // Generate Product structured data
  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || description,
    "image": product.image || image,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency || "EUR",
      "availability": `https://schema.org/${product.availability || 'InStock'}`,
      "seller": {
        "@type": "Organization",
        "name": "Noor"
      }
    },
    "category": product.category
  } : null;

  // Generate Breadcrumb structured data
  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:site_name" content="Noor" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Product Structured Data */}
      {productJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd)}
        </script>
      )}
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
