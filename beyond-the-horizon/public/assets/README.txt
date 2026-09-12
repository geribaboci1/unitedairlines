DROP YOUR MEDIA IN THIS FOLDER.

Everything in public/assets/ is copied verbatim to dist/assets/ at build time,
which is exactly where the ./assets/ paths in the component resolve to.

Required filenames (exact, lowercase):

  creator-profile.jpg      Creator portrait        — 4:3 crop reads best
  destination-ewr.jpg      Newark hub              — landscape, 16:9 or wider
  destination-dss.jpg      Dakar, Senegal          — landscape
  destination-rak.jpg      Marrakech, Morocco      — landscape
  destination-nrt.jpg      Tokyo, Japan            — landscape

Optional:

  beyond-the-horizon-onesheet.pdf    Linked from the "Download One-Sheet PDF"
                                     button in the footer CTA.

Notes:
  - Target roughly 1800–2400px on the long edge and keep each file under
    ~600KB. These sit behind a dark gradient scrim, so slightly
    underexposed / high-contrast frames hold up better than bright ones.
  - Filenames are case-sensitive on Cloudflare Pages. "Destination-EWR.jpg"
    will 404 even though it works on macOS locally.
  - Delete this README.txt once your files are in — it is harmless either
    way, it just keeps the folder tracked by git while it's empty.
