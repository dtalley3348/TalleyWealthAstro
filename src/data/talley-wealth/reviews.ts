export type ReviewContext =
  | 'retirement'
  | 'young-professional'
  | 'business'
  | 'tax'
  | 'trust'
  | 'team'
  | 'general';

export interface Review {
  author: string;
  quote: string;
  date: string;
  contexts: ReviewContext[];
  featured?: boolean;
}

export const TOTAL_REVIEW_COUNT = 67;
export const AVERAGE_RATING = 5.0;
export const GOOGLE_REVIEWS_URL = 'https://share.google/fLD3pNTTDtrwScu4z';

export const reviews: Review[] = [
  {
    author: 'Derrick N.',
    quote:
      "I've been working with David Talley for the past three months, and the experience has been outstanding. He has helped me make real progress in areas like tax strategies, debt payoff planning, cash flow management, and estate planning. David has a unique ability to uncover blind spots and provide clarity on where to focus, which has completely changed the way I view my financial decisions.",
    date: '2024-10',
    contexts: ['tax', 'general'],
  },
  {
    author: 'Pam D.',
    quote:
      "We never thought we needed a financial advisor until we went and spoke with David. He has a way of explaining our finances and relieving our anxiety about money. He led us down a very sensible path. So glad we found him and would highly recommend him to anyone needing answers for their financial planning needs.",
    date: '2024-09',
    contexts: ['retirement', 'trust'],
    featured: true,
  },
  {
    author: 'Paul K.',
    quote:
      "David Talley is an outstanding financial advisor who truly takes the time to understand your goals and explain everything in a way that's easy to grasp. His staff—Stephenee and Ashlynn—are just as impressive! They're incredibly kind, professional, and always on top of everything.",
    date: '2024-08',
    contexts: ['team', 'general'],
  },
  {
    author: 'Todd D.',
    quote:
      'We have worked with Talley Financial for a few years now. David does an outstanding job of breaking down financial and tax strategies for less technical people like ourselves. A trusted partner in our families future!',
    date: '2024-11',
    contexts: ['tax', 'trust'],
  },
  {
    author: 'Doyle C.',
    quote:
      'David and his team are incredibly talented and exceptionally professional. My family will always use the services of Talley throughout our lives. 10/10',
    date: '2024-11',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Tim M.',
    quote:
      "I am transitioning into retirement and my wife was wanting to move her retirement savings so we were looking for someone to help with the change and to manage things going forward. Thank goodness David and his team were recommended to us! They are without a doubt one of the best things to happen to us as we enter into this new phase of our lives. David's wisdom and expertise knows no bounds and his deep desire to help guide us down the best avenues to achieve our goals inspire total trust and confidence.",
    date: '2024-09',
    contexts: ['retirement', 'trust'],
    featured: true,
  },
  {
    author: 'Alyssa G.',
    quote:
      "I've been working with David and his team for about 2 years now. At just 29 years old, I feel so ahead of the game when it comes to financial competence and freedom. He doesn't just take my money and go — he makes sure that his plan is aligned to my personal goals and values and educates me at every step along the way. It's nice to not only be financially secure, but also financially confident — even during times like these!",
    date: '2024-05',
    contexts: ['young-professional'],
    featured: true,
  },
  {
    author: 'Cody L.',
    quote:
      'Love working with David and his team. His knowledge has helped me both with my business and personal finances. If you need help with anything, I highly recommend reaching out for a conversation.',
    date: '2024-11',
    contexts: ['business', 'general'],
  },
  {
    author: 'Gentry H.',
    quote:
      "It has taken us a long time to find someone we trust to advise us with our money. I feel confident you will appreciate David's way of explaining your options, ideas for growth, and his ability to see \"down the road.\" His whole staff is very personable — really nice people who know what they're doing.",
    date: '2024-03',
    contexts: ['trust', 'team'],
    featured: true,
  },
  {
    author: 'Brian B.',
    quote:
      'David has provided knowledgeable and insightful financial information to my wife and I since we started working with him. Not only is he dedicated to his profession but he truly cares about his clients. I would highly recommend him.',
    date: '2024-08',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Pearce G.',
    quote:
      "I've had an excellent experience working with David at Talley Financial. David takes the time to really understand your goals so he can provide the best advice. David is very thorough in his explanations of any options and answers any questions I have.",
    date: '2024-07',
    contexts: ['tax', 'general'],
  },
  {
    author: 'Lauren B.',
    quote:
      "David and his team are wonderful to work with! David is very knowledgeable and tailors his approach to your financial goals because he knows goals are not one size fits all. He is very patient with those in the beginning stages of managing their money, and he speaks to everyone with the same level of respect whether they have a thousand or a million dollars.",
    date: '2024-03',
    contexts: ['young-professional', 'trust'],
  },
  {
    author: 'George S.',
    quote:
      'Mr. Talley is an awesome Financial Advisor to work with. He makes it personal and he takes time to help you with all it takes to feel comfortable with your options you chose for your investment strategies. And his staff are TOP notch!',
    date: '2024-10',
    contexts: ['team', 'general'],
  },
  {
    author: 'Julia W.',
    quote:
      "I was referred to David by a coworker, and I'm so glad I decided to work with him. From the start, he took the time to understand my financial goals and created a personalized plan to help me reach them. He's patient, always takes the time to answer my questions, and truly wants to educate his clients so they feel comfortable and informed.",
    date: '2024-05',
    contexts: ['general', 'trust'],
  },
  {
    author: 'Ketmanee W.',
    quote:
      "I've been working with David and Talley Financial since the beginning of this year. His guidance and thoughtful consideration of how to help me grow my businesses have been a relief and an eye opening experience. I'm grateful for his guidance and look forward to more tax saving strategies in the years to come.",
    date: '2024-08',
    contexts: ['business', 'tax'],
  },
  {
    author: 'Dimitre S.',
    quote:
      'Working with David has been a breath of fresh air. He is genuine, relatable, and very knowledgeable. He works closely with entrepreneurs by listening openly and thinking creatively about all aspects of their financial situation. David and his whole team are kind, professional, & knowledgeable.',
    date: '2024-04',
    contexts: ['business', 'team'],
  },
  {
    author: 'Juan D.',
    quote:
      "David Talley is an exceptional financial advisor who truly goes above and beyond for his clients. He took the time to understand my unique financial situation, goals, and concerns, and he worked tirelessly to create a customized plan that was tailored specifically to my needs. I never felt rushed or pressured to make any decisions.",
    date: '2023-03',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Ryan W.',
    quote:
      "David is as thorough of a financial planner as you'll find. He's articulate in such a way to speak with you on all levels on whatever you may need help with. I know I can reach him easily, and he genuinely cares about the well-being of all the folks he serves. Talley Financial needs to be managing your assets. Plain and simple.",
    date: '2023-03',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Brittany E.',
    quote:
      "Everyone at Talley Financial is great! They always make you feel like you matter and are important to them! They always have your best interest at heart and never pressure you into anything you do not want to do! I've worked with David for several years and have always been pleased.",
    date: '2024-03',
    contexts: ['trust', 'team'],
  },
  {
    author: 'Brent D.',
    quote:
      "David meets you where you're at financially and creates the best gameplan for each individual to meet their goals. I couldn't be more happy to work with David and his team. They are truly the best in the business.",
    date: '2024-04',
    contexts: ['general'],
  },
  {
    author: 'Andrea R.',
    quote:
      'David and his team have been wonderful to work with! He has walked us through several financial steps and questions, and has helped us tremendously! He took time to understand our present and future goals and how to more easily attain them. I also really appreciate that he wanted to get to know us and is now a genuine friend.',
    date: '2022-03',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Morris B.',
    quote:
      "David and his staff have been great to work with. The process he walked through to get to know me was a comfort. Understanding who I am, where I've been and where I want to go requires more than just reviewing financial information and he worked to learn.",
    date: '2022-03',
    contexts: ['trust', 'retirement'],
  },
  {
    author: 'Katie J.',
    quote:
      'Talley Financial has been great to work with. David does a great job providing insight on the different financial vehicles and which are most suitable to achieve our goals. His strategy for us seemed specifically tailored to our needs which put my mind at ease. I highly recommend Talley Financial for anyone at any stage in their journey to wealth.',
    date: '2023-03',
    contexts: ['general', 'trust'],
  },
  {
    author: 'Josh T.',
    quote:
      'Thrilled to be working with David and the team at Talley Wealth! The effort and preparation they put in, combined with the teaching and guidance they offer, have made us very excited about our partnership. Their expertise in the financial industry, along with their personable and caring approach, makes them an outstanding team.',
    date: '2024-11',
    contexts: ['team', 'general'],
  },
  {
    author: 'Jeff J.',
    quote:
      "David Talley and his Team are true professionals. David took the time to answer all of my questions very thoroughly. He explained in great detail what the plan would be moving forward. He is a Certified Financial Planner and from what I've learned this is the way to go. He works with you and for you.",
    date: '2022-03',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Julie J.',
    quote:
      "We started working with David and his team almost 10 years ago, and I couldn't be happier with his support and advice. He genuinely cares about his clients and understands how every situation is different. My husband has already retired, and I will join him in the next few years, fortunate that our financial outlook during retirement is solid thanks to David.",
    date: '2021-03',
    contexts: ['retirement', 'trust'],
    featured: true,
  },
  {
    author: 'Ryan F.',
    quote:
      'David is great to work with. He really knows his stuff and has our interest at heart. In addition to helping us with our personal finances, David has been a tremendous resource for us as we got our business launched. He helped us make so many great connections.',
    date: '2022-03',
    contexts: ['business', 'general'],
  },
  {
    author: 'Zack M.',
    quote:
      "Honest, good advice. We got burned by a previous advisor but have never had any issues with David and he has never tried to push us into a bad decision. He's also not afraid to ask the questions nobody wants to ask. Your opinions as a client matter and are factored into the discussion.",
    date: '2021-03',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Tara S.',
    quote:
      'The whole team at Talley Financial is amazing! They are so knowledgeable and organized it makes the process so simple. David really takes the time to listen and understand your life, finances, and goals… then he creates a comfortable plan for you and your family to achieve financial security!',
    date: '2023-03',
    contexts: ['team', 'general'],
  },
  {
    author: 'Edward D.',
    quote:
      "David Talley and his team are extremely professional. We were quite concerned about our retirement/financial planning, because of all the complications involved — everything from social security to interest rates to taxes. David and his team gave us all the time we needed, and made everything clear. The future feels much more friendly to us, now that we have a plan.",
    date: '2021-03',
    contexts: ['retirement', 'tax'],
  },
  {
    author: 'Marci P.',
    quote:
      'Working with Talley Financial has been an excellent experience! David took the time to understand my financial goals and explained everything in a way that made me feel confident about my decisions. It\'s clear he genuinely cares about his clients and wants to see them succeed.',
    date: '2024-03',
    contexts: ['trust', 'general'],
  },
  {
    author: 'Mark S.',
    quote:
      'Very pleased with the relationship built with David and team at Talley Financial. David has provided timely advice, answered my multiple questions with patience and knowledge, and has provided a well structured retirement plan to meet my family\'s needs.',
    date: '2024-03',
    contexts: ['retirement', 'general'],
  },
  {
    author: 'Joe H.',
    quote:
      'I have used David for many years now to help with everything from financial planning, to setup of new businesses, multiple insurances, legal trusts — I can\'t say enough good things about him and his business!',
    date: '2024-03',
    contexts: ['business', 'general'],
  },
];

/** Get reviews filtered by one or more context tags */
export function getReviewsByContext(
  ...contexts: ReviewContext[]
): Review[] {
  return reviews.filter((r) =>
    contexts.some((c) => r.contexts.includes(c))
  );
}

/** Get the featured reviews (hand-picked best-of) */
export function getFeaturedReviews(): Review[] {
  return reviews.filter((r) => r.featured);
}

/** Pick N random reviews matching a context, excluding already-shown authors */
export function pickContextualReviews(
  contexts: ReviewContext[],
  count: number,
  excludeAuthors: string[] = []
): Review[] {
  const pool = reviews.filter(
    (r) =>
      contexts.some((c) => r.contexts.includes(c)) &&
      !excludeAuthors.includes(r.author)
  );
  // Deterministic shuffle based on author name length for consistency
  const sorted = [...pool].sort(
    (a, b) => a.author.length + a.quote.length - (b.author.length + b.quote.length)
  );
  return sorted.slice(0, count);
}

export const TESTIMONIAL_DISCLAIMER =
  'Testimonials are from current clients and reflect their individual experiences. These testimonials are not indicative of future results and should not be relied upon as a guarantee of any particular outcome.';

export const selectedGoogleReviews = {
  default: [
    {
      author: 'Joanna C.',
      quote:
        "David is exceptionally knowledgeable, and really takes his time to get to know you, and tailor his advice to your personal situation. He explains everything clearly, and makes sure you fully understand what he's suggesting and why. He is very responsive to emails, and his professional approach engenders trust and respect. I would definitely recommend him for investment advice, tax planning, estate planning, and tax preparation. It's very reassuring to have everything looked after seamlessly by one person. Thank you David!",
    },
    {
      author: 'Paul K.',
      quote:
        "David Talley is an outstanding financial advisor who truly takes the time to understand your goals and explain everything in a way that's easy to grasp. He's knowledgeable, honest, and always makes you feel confident in the decisions you're making. His staff, Stephenee and Ashlynn, are just as impressive.",
    },
    {
      author: 'Julia W.',
      quote:
        "From the start, he took the time to understand my financial goals and created a personalized plan to help me reach them. He's patient, always takes the time to answer my questions, and truly wants to educate his clients so they feel comfortable and informed.",
    },
  ],
  home: [
    {
      author: 'Joanna C.',
      quote:
        "David is exceptionally knowledgeable, and really takes his time to get to know you, and tailor his advice to your personal situation. He explains everything clearly, and makes sure you fully understand what he's suggesting and why. It's very reassuring to have everything looked after seamlessly by one person.",
    },
    {
      author: 'Tim M.',
      quote:
        "I am transitioning into retirement and my wife was wanting to move her retirement savings so we were looking for someone to help with the change and to manage things going forward. Thank goodness David and his team were recommended to us!",
    },
    {
      author: 'Dimitre S.',
      quote:
        'Working with David has been a breath of fresh air. He is genuine, relatable, and very knowledgeable. He works closely with entrepreneurs by listening openly and thinking creatively about all aspects of their financial situation.',
    },
  ],
  business: [
    {
      author: 'Dimitre S.',
      quote:
        'Working with David has been a breath of fresh air. He is genuine, relatable, and very knowledgeable. He works closely with entrepreneurs by listening openly and thinking creatively about all aspects of their financial situation. David and his whole team are kind, professional, & knowledgeable.',
    },
    {
      author: 'Ketmanee W.',
      quote:
        "His guidance and thoughtful consideration of how to help me grow my businesses have been a relief and an eye opening experience. I'm grateful for his guidance and look forward to more tax saving strategies in the years to come.",
    },
    {
      author: 'Cody L.',
      quote:
        'Love working with David and his team. His knowledge has helped me both with my business and personal finances. If you need help with anything, I highly recommend reaching out for a conversation.',
    },
  ],
  retirement: [
    {
      author: 'Tim M.',
      quote:
        "I am transitioning into retirement and my wife was wanting to move her retirement savings so we were looking for someone to help with the change and to manage things going forward. Thank goodness David and his team were recommended to us!",
    },
    {
      author: 'Edward D.',
      quote:
        'We were quite concerned about our retirement/financial planning, because of all the complications involved - everything from social security to interest rates to taxes. David and his team gave us all the time we needed, and made everything clear.',
    },
    {
      author: 'Julie J.',
      quote:
        "We started working with David and his team almost 10 years ago, and I couldn't be happier with his support and advice. He genuinely cares about his clients and understands how every situation is different.",
    },
  ],
  tax: [
    {
      author: 'Joanna C.',
      quote:
        "I would definitely recommend him for investment advice, tax planning, estate planning, and tax preparation. It's very reassuring to have everything looked after seamlessly by one person.",
    },
    {
      author: 'Todd D.',
      quote:
        'David does an outstanding job of breaking down financial and tax strategies for less technical people like ourselves. A trusted partner in our families future!',
    },
    {
      author: 'Derrick N.',
      quote:
        'He has helped me make real progress in areas like tax strategies, debt payoff planning, cash flow management, and estate planning. David has a unique ability to uncover blind spots and provide clarity on where to focus.',
    },
  ],
  inherited: [
    {
      author: 'Gentry H.',
      quote:
        'It has taken us a long time to find someone we trust to advise us with our money. I feel confident you will appreciate David’s way of explaining your options, ideas for growth and his ability to see down the road.',
    },
    {
      author: 'Joanna C.',
      quote:
        "He explains everything clearly, and makes sure you fully understand what he's suggesting and why. His professional approach engenders trust and respect.",
    },
    {
      author: 'Randy B.',
      quote:
        'David took the time to get to know me personally as well as financially before guiding me through the confusing world of investing, retirement, insurance and taxes. His advice, his integrity and his team are top notch.',
    },
  ],
  equity: [
    {
      author: 'Derrick N.',
      quote:
        'David has a unique ability to uncover blind spots and provide clarity on where to focus, which has completely changed the way I view my financial decisions.',
    },
    {
      author: 'Pearce G.',
      quote:
        'David takes the time to really understand your goals so he can provide the best advice. David is very thorough in his explanations of any options and answers any questions I have.',
    },
    {
      author: 'Julia W.',
      quote:
        "He took the time to understand my financial goals and created a personalized plan to help me reach them. He's patient, always takes the time to answer my questions, and truly wants to educate his clients.",
    },
  ],
};
