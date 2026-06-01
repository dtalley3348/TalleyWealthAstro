const gaMeasurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-PMB7EVR4G6';
const clarityProjectId = import.meta.env.PUBLIC_CLARITY_PROJECT_ID?.trim() || 'x0aqtyazy9';

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
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params || {});
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

export const talleySite = {
  id: 'talley-wealth',
  tenantKey: 'talley-wealth',
  name: 'Talley Wealth',
  siteUrl: 'https://talleywealth.com',
  headInject: analyticsHeadInject,
  bodyStartInject: '',
};
