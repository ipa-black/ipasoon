export default function handler(req, res) {
    const { name, ipa_url, bundle_id, image_url } = req.query;

    if (!name || !ipa_url || !bundle_id) {
        return res.status(400).send('عذراً، معلومات التطبيق غير مكتملة.');
    }

    // تنظيف الرموز لتجنب أخطاء نظام iOS
    const escapeXml = (unsafeStr) => {
        if (!unsafeStr) return '';
        return unsafeStr.replace(/[<>&'"]/g, (char) => {
            switch (char) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return char;
            }
        });
    };

    const safeName = escapeXml(name);
    const safeIpaUrl = escapeXml(ipa_url);
    const safeBundleId = escapeXml(bundle_id);
    const safeImageUrl = escapeXml(image_url || 'https://via.placeholder.com/100');

    const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string>${safeIpaUrl}</string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>needs-shine</key>
                    <true/>
                    <key>url</key>
                    <string>${safeImageUrl}</string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>${safeBundleId}</string>
                <key>bundle-version</key>
                <string>1.0</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string>${safeName}</string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Disposition', 'inline; filename="install.plist"');
    
    res.status(200).send(plist);
}
