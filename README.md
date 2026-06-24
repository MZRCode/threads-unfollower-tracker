<h1 align="center">Threads Unfollower Tracker</h1>

<p align="center">
  <a href="#threads-unfollower-tracker-gtden-çıkanları-bulma-aracı">Türkçe Dökümantasyon için Tıklayın</a> | <a href="#threads-unfollower-tracker-1">Click for English Documentation</a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg" alt="Node.js Version"></a>
</p>

---

## Threads Unfollower Tracker (GT'den Çıkanları Bulma Aracı)
Threads hesabınızda sizi takip etmeyen (geri takip yapmayan) kullanıcıları tespit etmek ve listelemek için geliştirilmiş hafif ve hızlı bir komut satırı (CLI) aracıdır. Sonuçları hem terminalde tablo olarak gösterir hem de detaylı inceleme yapabilmeniz için unfollowers.json dosyasına kaydeder.

### Özellikler
- **Hızlı Karşılaştırma:** Takipçi ve takip edilen listelerini karşılaştırarak anında sizi takip etmeyenleri bulur.
- **JSON Çıktısı:** Tespit edilen kullanıcıları unfollowers.json dosyasına profil resimleri ve kullanıcı kimlikleri dahil olacak şekilde kaydeder.
- **Esnek Analiz:** Kendi hesabınızın yanı sıra, hedef gösterdiğiniz herhangi bir açık Threads profilini de analiz edebilir.
- **Basit Arayüz:** Tamamen komut satırı üzerinden yönlendirmelerle çalışır.

---

### Gereksinimler
- Bilgisayarınızda Node.js (Sürüm 18 veya üzeri) kurulu olmalıdır.

---

### Kurulum ve Çalıştırma
1. Projeyi bilgisayarınıza indirin:
   ```bash
   git clone https://github.com/MZRDev/threads-unfollower-tracker.git
   cd threads-unfollower-tracker
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Çevre değişkenlerini yapılandırın:
   Proje kök dizininde .env.example adında bir örnek dosya bulunmaktadır. Bu dosyanın bir kopyasını oluşturup adını .env yapın:
   ```bash
   cp .env.example .env
   ```
   Ardından, .env dosyasını bir metin editörüyle açıp gerekli bilgileri girin (Bu bilgileri nasıl alacağınız aşağıda açıklanmıştır).

4. Uygulamayı çalıştırın:
   ```bash
   npm start
   ```

---

### Gerekli Bilgiler Nasıl Alınır?
Threads API'si resmi olarak geliştiricilere açık olmadığı için, bu araç tarayıcınızın gönderdiği istekleri simüle eder. Gerekli parametreleri tarayıcınızdan almak için aşağıdaki adımları izleyin:

1. Tarayıcınızda (Chrome, Brave, Edge vb.) threads.com adresine gidin ve hesabınıza giriş yapın.
2. Klavyenizden F12 tuşuna basın veya sayfaya sağ tıklayıp İncele (Inspect) seçeneğini seçerek Geliştirici Araçları panelini açın.
3. Üst menüden Network (Ağ) sekmesine geçiş yapın.
4. Ağ trafiğini görmek için Threads sayfasını yenileyin (F5) veya kendi profilinize gidin.
5. Filtreleme kısmına graphql yazın ve listelenen isteklerden birine tıklayın.
6. Sağ tarafta açılan detay panelinde Headers (İstek Başlıkları) sekmesine gelin:
   - **cookie:** Request Headers (İstek Başlıkları) kısmında bulunan cookie: değerinin tamamını kopyalayın ve .env dosyasındaki THREADS_COOKIE alanına yapıştırın.
   - **user-agent:** user-agent: değerini kopyalayıp .env dosyasındaki THREADS_USER_AGENT alanına yapıştırın.
   - **x-ig-app-id:** x-ig-app-id: değerini kopyalayıp THREADS_APP_ID alanına yapıştırın (Genellikle 238260118697367 değeridir).
   - **lsd veya x-fb-lsd:** İstek başlıklarında veya Payload (İstek Verisi) sekmesinde bulunan lsd token değerini kopyalayıp THREADS_LSD alanına yapıştırın.

---

### Destek Olma ve Katkıda Bulunma
Projeye destek olmak veya geliştirmesine katkı sağlamak isterseniz yapabilecekleriniz:
- **Yıldız Atın:** Projeyi beğendiyseniz GitHub sayfasının sağ üst köşesinden yıldızlayarak destek olabilirsiniz.
- **Hata Bildirin (Issue):** Bir sorunla karşılaşırsanız veya yeni bir özellik öneriniz varsa, Issues sekmesinden yeni bir başlık açabilirsiniz.
- **Katkı Sağlayın (Pull Request):** Kodu geliştirmek isterseniz projeyi fork'layıp değişikliklerinizi yaptıktan sonra bir Pull Request gönderebilirsiniz. Her türlü katkıya açığız!

---

### Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Detaylı bilgi için [LICENSE](/LICENSE) dosyasını inceleyebilirsiniz.

---

### Yasal Uyarı
Bu araç resmi olarak Meta veya Threads ile ilişkili değildir. Araç, web tarayıcınızın yaptığı istekleri taklit ederek çalışır. Aşırı kullanım veya Meta'nın algoritmalarındaki değişiklikler nedeniyle hesabınızın geçici kısıtlamalar alması veya engellenmesi gibi durumlardan tamamen kullanıcı sorumludur. Bu aracı makul aralıklarla ve dikkatli kullanmanız önerilir.

---

---

## Threads Unfollower Tracker
A lightweight and fast Command Line Interface (CLI) tool developed to detect and list users who do not follow you back on Threads. It prints the results as a clean table in the terminal and saves them to unfollowers.json for further analysis.

### Features
- **Fast Comparison:** Instantly matches followers and following lists to find who does not follow you back.
- **JSON Export:** Saves detected accounts to unfollowers.json with profile pictures and user IDs.
- **Flexible Analysis:** Analyze your own profile or inspect any other public Threads profile.
- **Simple UI:** Guided directly through interactive command-line prompts.

---

### Prerequisites
- Node.js (Version 18 or higher) must be installed on your machine.

---

### Installation and Run
1. Clone the Project:
   ```bash
   git clone https://github.com/MZRDev/threads-unfollower-tracker.git
   cd threads-unfollower-tracker
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   A sample environment file named .env.example is located in the root directory. Copy it and rename it to .env:
   ```bash
   cp .env.example .env
   ```
   Open the .env file in a text editor and fill in the required values (instructions on how to obtain these values are listed below).

4. Run the Application:
   ```bash
   npm start
   ```

---

### How to Retrieve Required Credentials?
Since Threads does not offer a public API, this tool simulates the network requests sent by your browser. Follow these steps to extract the credentials:

1. Open your browser (Chrome, Brave, Edge, etc.), go to threads.com, and log into your account.
2. Press F12 or right-click anywhere on the page and click Inspect to open the Developer Tools panel.
3. Switch to the Network tab in the Developer Tools.
4. Refresh the page (F5) or navigate to your profile to generate network traffic.
5. Type graphql in the network filter input and click on one of the requests.
6. Look at the Headers tab in the details panel on the right side:
   - **cookie:** Copy the entire value of the cookie: header in the Request Headers section and paste it into the THREADS_COOKIE field in your .env file.
   - **user-agent:** Copy the user-agent: header value and paste it into THREADS_USER_AGENT.
   - **x-ig-app-id:** Copy the x-ig-app-id: header value and paste it into THREADS_APP_ID (defaults to 238260118697367).
   - **lsd or x-fb-lsd:** Find the lsd value under the Payload (or header fields) and paste it into THREADS_LSD.

---

### How to Support & Contribute
If you'd like to support the project or contribute to its development:
- **Give a Star:** Support the project by clicking the Star button in the top-right corner of the GitHub repository page.
- **Report Issues:** If you encounter bugs or want to suggest new features, open an issue in the Issues tab.
- **Submit Pull Requests:** Fork the repository, make your improvements, and submit a Pull Request. All contributions are welcome!

---

### License
This project is licensed under the MIT License. For more details, see the [LICENSE](/LICENSE) file.

---

### Disclaimer
This tool is not officially affiliated with Meta or Threads. It works by simulating browser-like network requests. The user is entirely responsible for any temporary restrictions, bans, or account blocks that might occur due to rate limits or changes in Meta's algorithms. It is recommended to use this tool at reasonable intervals.