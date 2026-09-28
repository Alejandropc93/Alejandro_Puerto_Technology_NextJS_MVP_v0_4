# Google Analytics 4 - v0.4

Measurement ID: `G-RZWFFNLKBG`

The project includes a public fallback for this ID, so GA4 can work immediately after deployment. For explicit environment configuration in Vercel, add:

`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RZWFFNLKBG`

GA4 is only enabled after the visitor accepts analytics in the privacy banner. Rejection disables GA4 and keeps the site functional.

Private analytics dashboard: `/admin/analytics`.

After deployment, validate:
1. Open the site in a private browser window.
2. Before accepting analytics, GA4 should not receive the page view.
3. Accept analytics.
4. Navigate through several pages and use an APT Lab tool.
5. Check Google Analytics > Reports > Realtime.
6. Check `/admin/analytics` for the proprietary Supabase analytics layer.
