const gaMeasurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-PMB7EVR4G6';
const clarityProjectId = import.meta.env.PUBLIC_CLARITY_PROJECT_ID?.trim() || 'x0aqtyazy9';
const metaPixelId = import.meta.env.PUBLIC_META_PIXEL_ID?.trim() || '2408956706235160';

const analyticsHeadInject = [
  gaMeasurementId
    ? `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaMeasurementId}');
</script>
<script>
  window.talleyTrackEvent = function(name, params) {
    var eventParams = params || {};

    if (typeof window.gtag === 'function') {
      window.gtag('event', name, eventParams);
    }

    if (typeof window.fbq === 'function') {
      if (name === 'lead_form_submit') {
        window.fbq('track', 'Lead', {
          content_name: 'Website contact form',
          form_source: eventParams.form_source,
          form_topic: eventParams.form_topic
        });
        return;
      }

      if (name === 'explore_call_scheduled') {
        window.fbq('track', 'Lead', {
          content_name: 'Explore Call scheduled',
          event_category: eventParams.event_category,
          event_label: eventParams.event_label
        });
        return;
      }

      if (name === 'explore_call_click') {
        window.fbq('trackCustom', 'ExploreCallClick', {
          link_url: eventParams.link_url,
          link_text: eventParams.link_text
        });
      }
    }
  };

  document.addEventListener('click', function(event) {
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link || typeof window.talleyTrackEvent !== 'function') return;

    var href = link.getAttribute('href') || '';
    var label = (link.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 120);

    if (href.indexOf('tel:') === 0) {
      window.talleyTrackEvent('phone_click', { link_url: href, link_text: label });
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      window.talleyTrackEvent('email_click', { link_url: href, link_text: label });
      return;
    }

    if (href === '/get-started' || href.indexOf('/get-started') === 0 || href.indexOf('calendly.com/talleywealth/explore-call') !== -1) {
      window.talleyTrackEvent('explore_call_click', { link_url: href, link_text: label });
    }
  }, { capture: true });
</script>`.trim()
    : '',
  metaPixelId
    ? `
<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${metaPixelId}');
  fbq('track', 'PageView');
</script>`.trim()
    : '',
  clarityProjectId
    ? `
<!-- Microsoft Clarity -->
<script>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${clarityProjectId}");
</script>`.trim()
    : '',
].filter(Boolean).join('\n\n');

const analyticsBodyStartInject = [
  metaPixelId
    ? `
<!-- Meta Pixel noscript fallback -->
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" alt="" /></noscript>`.trim()
    : '',
].filter(Boolean).join('\n\n');

export const talleySite = {
  id: 'talley-wealth',
  tenantKey: 'talley-wealth',
  name: 'Talley Wealth',
  siteUrl: 'https://talleywealth.com',
  headInject: analyticsHeadInject,
  bodyStartInject: analyticsBodyStartInject,
};
