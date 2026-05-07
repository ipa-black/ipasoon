export default function handler(req, res) {
    const { name, ipa_url, bundle_id, image_url } = req.query;

    if (!name || !ipa_url || !bundle_id) {
        return res.status(400).send('Missing parameters');
    }

    const escapeXml = (unsafe) => unsafe.replace(/[<>&'"]/g, c => 
        ({'<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'}[c]));

    const safeName = escapeXml(name);
    const safeIpa = escapeXml(ipa_url);
    const safeBid = escapeXml(bundle_id);
    const safeImg = escapeXml(image_url || '');

    const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict><key>items</key><array><dict><key>assets</key><array><dict><key>kind</key><string>software-package</string><key>url</key><string>${safeIpa}</string></dict><dict><key>kind</key><string>display-image</string><key>url</key><string>${safeImg}</string></dict></array><key>metadata</key><dict><key>bundle-identifier</key><string>${safeBid}</string><key>bundle-version</key><string>1.0</string><key>kind</key><string>software</string><key>title</key><string>${safeName}</string></dict></dict></array></dict></plist>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(plist);
}
