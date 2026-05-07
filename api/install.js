<script>
    document.addEventListener('DOMContentLoaded', async () => {
        const container = document.getElementById('apps-container');
        const loading = document.getElementById('loading');

        try {
            const response = await fetch('apps.json');
            const apps = await response.json();
            loading.remove();

            apps.forEach((app, index) => {
                // بناء رابط API وتشفيره
                const apiUrl = `https://${window.location.host}/api/install?name=${encodeURIComponent(app.name)}&ipa_url=${encodeURIComponent(app.ipa_url)}&bundle_id=${encodeURIComponent(app.bundle_id)}&image_url=${encodeURIComponent(app.image_url)}`;
                // بناء رابط التثبيت
                const installLink = `itms-services://?action=download-manifest&url=${encodeURIComponent(apiUrl)}`;

                const appDiv = document.createElement('div');
                appDiv.className = 'app-item';
                
                appDiv.innerHTML = `
                    <img src="${app.image_url}" alt="${app.name}" class="app-icon">
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <p>${app.bundle_id}</p>
                    </div>
                    <button class="install-btn"><span>تثبيت</span></button>
                `;

                const btn = appDiv.querySelector('.install-btn');
                const btnText = appDiv.querySelector('.install-btn span');

                btn.addEventListener('click', (e) => {
                    e.preventDefault();

                    // 1. بدء الأنيميشن
                    btn.classList.add('loading');
                    btnText.innerText = 'جاري...';

                    // 2. الانتظار حتى يكتمل اللون (1.5 ثانية)
                    setTimeout(() => {
                        btnText.innerText = '100%'; 

                        // 3. فتح نافذة التثبيت بشكل مباشر وآمن لكي لا يحظرها سفاري
                        window.location.href = installLink;

                        // 4. الانتظار 3 ثوانٍ حتى يضغط المستخدم على "تثبيت" في النافذة، ثم التحويل للتليجرام
                        setTimeout(() => {
                            window.location.href = 'https://t.me/ipasoon';
                        }, 3000); 

                    }, 1500); 
                });

                container.appendChild(appDiv);

                // أنيميشن الظهور المتتابع
                setTimeout(() => {
                    appDiv.classList.add('show');
                }, index * 100);
            });

        } catch (error) {
            loading.innerText = 'خطأ في تحميل البيانات.';
            console.error(error);
        }
    });
</script>
