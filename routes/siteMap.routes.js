const { Router } = require('express');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

let sitemap;

const router = Router();

router.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (sitemap) {
    res.send(sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({ hostname: 'https://localhost:8050' });
    const pipeline = smStream.pipe(createGzip());

    // List of all routes
    const routes = ['/', '/api/todo', '/api/figure', '/api/convertPicture', '/api-docs', '/api'];

    routes.forEach(route => {
      smStream.write({ url: route, changefreq: 'monthly', priority: 0.7 });
    });

    smStream.end();

    streamToPromise(pipeline).then(sm => {
      sitemap = sm;
      res.send(sitemap);
    });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

module.exports = router;