 lexport default function handler(req, res) {
    const { name, ipa_url, bundle_id, image_url } = req.query;

    if (!name || !ipa_url || !bundle_id) {
        return res.status(400).send('Missing parameters');
    }

    // تنظيف البيانات لضمان عدم كسر الـ XML
    const clean = (str) => str.replace(/[<>&'"]/g, c => ({
        '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
    }[c]));

    const safeName = clean(name);
    const safeIpa = clean(ipa_url);
    const safeBid = clean(bundle_id);
    const safeImg = clean(image_url || '');

    // بناء ملف الـ plist بتنسيق آبل الرسمي الدقيق
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
					<string>${safeIpa}</string>
				</dict>
				<dict>
					<key>kind</key>
					<string>display-image</string>
					<key>needs-shine</key>
					<true/>
					<key>url</key>
					<string>${safeImg}</string>
				</dict>
			</array>
			<key>metadata</key>
			<dict>
				<key>bundle-identifier</key>
				<string>${safeBid}</string>
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

    // إعدادات الرد (Headers) هامة جداً لنجاح التثبيت
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).send(plist);
}
