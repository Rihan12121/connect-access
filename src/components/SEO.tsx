import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({ 
  title = 'Noor - E-Commerce',
  description = 'Noor - Deine E-Commerce Plattform für Qualitätsprodukte zu fairen Preisen. Entdecke Baby, Schönheit, Elektronik und mehr.',
  image = '/og-image.png',
  url = 'https://noor.de'
}: SEOProps) => {
  const fullTitle = title === 'Noor - E-Commerce' ? title : `${title} | Noor`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
