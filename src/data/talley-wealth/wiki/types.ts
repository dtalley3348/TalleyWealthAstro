export interface WikiArticle {
  slug: string;
  category: string;
  question: string;
  quickAnswer: string;
  content: string;
  relatedSlugs: string[];
  lastUpdated: string;
  author: string;
  type: 'practical' | 'educational' | 'strategy' | 'fear' | 'myth-busting' | 'local' | 'persona' | 'silent';
}

export interface WikiCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articleCount: number;
}

export interface FAQSchemaItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FAQSchemaItem[];
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  dateModified: string;
  datePublished: string;
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }[];
}
