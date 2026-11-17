import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = 'TenderPost: all India government, construction and railway tenders in one search';

/**
 * The 1200×630 card shown when a TenderPost link is shared (WhatsApp, LinkedIn,
 * X, Slack…). Rendered once at build time by app/opengraph-image.tsx and
 * app/twitter-image.tsx.
 */
export async function renderOgImage() {
  const icon = await readFile(join(process.cwd(), 'public/icon-512x512.png'));
  const iconSrc = `data:image/png;base64,${icon.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #1c2340 0%, #0b0f24 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={iconSrc} width={96} height={96} style={{ borderRadius: 20 }} alt="" />
          <div style={{ fontSize: 44, fontWeight: 700 }}>TenderPost</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>All India Tenders, one search</div>
          <div style={{ fontSize: 36, color: '#c7cbe0' }}>
            Government · Construction · Railway · PSU tenders
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 56, height: 10, background: '#ff8a1f', borderRadius: 5 }} />
            <div style={{ width: 56, height: 10, background: '#ffffff', borderRadius: 5 }} />
            <div style={{ width: 56, height: 10, background: '#138808', borderRadius: 5 }} />
          </div>
          <div style={{ fontSize: 30, color: '#c7cbe0' }}>tenderpost.org</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
