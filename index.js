import { getHeaders, config } from './config.js';
import readline from 'readline';
import axios from 'axios';
import fs from 'fs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();

    resolve(ans);
  }));
}

async function resolveUsernameToId(username) {
  const url = `https://www.threads.com/@${username}`;
  console.log(`\n"${username}" kullanıcısının Threads ID'si aranıyor...`);

  try {
    const response = await axios.get(url, {
      headers: getHeaders(url)
    });

    const html = response.data;
    const regex = /"user_id"\s*:\s*"(\d+)"/g;
    let match;
    const foundIds = new Set();

    while ((match = regex.exec(html)) !== null) {
      const id = match[1];

      if (id !== '0') foundIds.add(id);
    }

    const ids = Array.from(foundIds);
    if (ids.length === 0) throw new Error('Profil sayfasında user_id bulunamadı!');

    const viewerId = config.ds_user_id;
    if (ids.length > 1 && viewerId) {
      const targetId = ids.find(id => id !== viewerId);
      if (targetId) return targetId;
    };

    return ids[0];
  } catch (error) {
    console.error(`"${username}" kullanıcı adı aranırken bir hata oluştu:`, error.message);

    return null;
  }
}

let fbDtsgToken = '';

async function fetchFbDtsgToken() {
  if (fbDtsgToken) return fbDtsgToken;

  const homeUrl = 'https://www.threads.com/';

  try {
    const response = await axios.get(homeUrl, {
      headers: getHeaders(homeUrl)
    });

    const html = response.data;
    const match = html.match(/"DTSGInitData"\s*,\s*\[\s*\]\s*,\s*\{\s*"token"\s*:\s*"([^"]+)"/);
    if (match) {
      fbDtsgToken = match[1];

      return fbDtsgToken;
    };

    const match2 = html.match(/"token"\s*:\s*"([^"]+)"/);
    if (match2) {
      fbDtsgToken = match2[1];

      return fbDtsgToken;
    };
  } catch (error) {
    console.error('fb_dtsg tokeni alınırken hata oluştu:', error.message);
  }

  return null;
}

async function fetchProfileStats(userId) {
  const url = 'https://www.threads.com/api/graphql';
  const headers = getHeaders();

  const dtsg = await fetchFbDtsgToken();

  const formData = new URLSearchParams();
  formData.append('av', config.ds_user_id || '0');
  formData.append('__user', '0');
  formData.append('__a', '1');
  formData.append('__req', '1');
  formData.append('__hs', '20625.HYP:barcelona_web_pkg.2.1...0');
  formData.append('dpr', '1');
  formData.append('__ccg', 'EXCELLENT');
  formData.append('__rev', '1041856931');
  formData.append('__comet_req', '29');
  formData.append('fb_dtsg', dtsg || '');
  formData.append('jazoest', '26195');
  formData.append('lsd', config.lsd || 'gyrvbMb8iYHSHRnFRFlFC_');
  formData.append('fb_api_caller_class', 'RelayModern');
  formData.append('fb_api_req_friendly_name', 'BarcelonaFriendshipsDialogUserQuery');
  formData.append('variables', JSON.stringify({
    shouldFetchMutualsCount: false,
    userID: userId
  }));

  formData.append('doc_id', '27932967052970549');

  try {
    const response = await axios.post(url, formData.toString(), { headers });

    if (response.data && response.data.data && response.data.data.user) return response.data.data;
  } catch (error) {
    console.error('Profil bilgileri alınırken hata oluştu:', error.message);
  }

  return null;
}

async function fetchFullRelationshipList(userId, type) {
  const list = [];
  let nextMaxId = '';
  let hasMore = true;
  let page = 1;

  const typeLabel = type === 'followers' ? 'Takipçi' : 'Takip edilen';
  console.log(`\n${typeLabel} listesi çekiliyor...`);

  while (hasMore) {
    let url = `https://www.threads.com/api/v1/friendships/${userId}/${type}/`;
    if (nextMaxId) url += `?max_id=${nextMaxId}`;

    try {
      const response = await axios.get(url, {
        headers: getHeaders(url)
      });

      const data = response.data;
      if (data && data.users) {
        list.push(...data.users);

        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Sayfa ${page} (${list.length} kişi çekildi)`);

        hasMore = data.has_more === true && data.next_max_id;
        nextMaxId = data.next_max_id || '';

        page++;
      } else {
        hasMore = false;
      };
    } catch (error) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      console.error(`${typeLabel} listesinin ${page}. sayfası çekilirken hata oluştu:`, error.message);
      if (error.response && error.response.status === 400) console.log('Not: Bu hesabın takip listesi Meta tarafından kısıtlanmış veya hesap gizli olabilir.');

      hasMore = false;
    }

    if (hasMore) await sleep(1000);
  }

  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);

  console.log(`${typeLabel} listesi başarıyla çekildi! (Toplam: ${list.length} kişi)`);

  return list;
}

async function main() {
  console.log('=========================================');
  console.log('    Threads GT\'den Çıkanı Bulma Aracı ');
  console.log('=========================================');

  const viewerUserId = config.csrftoken ? config.cookie.match(/ds_user_id=([^;]+)/)?.[1] : null;

  let viewerUsername = '';
  if (viewerUserId) {
    const viewerStats = await fetchProfileStats(viewerUserId);
    if (viewerStats && viewerStats.user) viewerUsername = viewerStats.user.username;
  };

  if (!viewerUserId) console.warn('Uyarı: Cookie\'de ds_user_id bulunamadı! Lütfen çerezlerini kontrol et!');
  else console.log(`Giriş Yapılan Hesap: @${viewerUsername || viewerUserId}`);

  const targetUsername = await askQuestion('\nAnaliz edilecek kullanıcı adını gir (kendin için direkt Enter\'a bas): ');

  let targetId = viewerUserId;
  let targetName = viewerUsername || viewerUserId;

  if (targetUsername.trim()) {
    targetName = targetUsername.trim();
    targetId = await resolveUsernameToId(targetName);
  };

  if (!targetId) {
    console.error('Kullanıcı ID\'si tespit edilemedi! Çıkılıyor.');

    process.exit(1);
  };

  const stats = await fetchProfileStats(targetId);
  if (!stats) {
    console.warn('\nUyarı: Kullanıcı profili detayları (takipçi sayıları) alınamadı. İşleme listeleri çekerek devam ediliyor...');
  } else {
    console.log('\n--- Seçilen Kullanıcı Özeti ---');
    console.log(`Kullanıcı Adı: @${stats.user.username}`);
    console.log(`Takipçi Sayısı: ${stats.counts.total_followers_count}`);
    console.log(`Takip Edilen Sayısı: ${stats.counts.total_following_count}`);
    console.log('-------------------------------');
  };

  const proceed = await askQuestion('\nTakip listelerini çekip geri takip etmeyenleri bulmak istiyor musun? (e/h): ');
  if (proceed.toLowerCase() !== 'e' && proceed.toLowerCase() !== 'y') {
    console.log('İşlem iptal edildi. Çıkılıyor.');

    process.exit(0);
  };

  const followersList = await fetchFullRelationshipList(targetId, 'followers');
  const followingList = await fetchFullRelationshipList(targetId, 'following');

  if (followersList.length === 0 && followingList.length === 0) {
    console.log('Kullanıcı listeleri çekilemedi. Çıkılıyor.');

    process.exit(1);
  };

  console.log(`\nİşlem tamamlandı!`);
  console.log(`   Çekilen Takipçi: ${followersList.length}`);
  console.log(`   Çekilen Takip Edilen: ${followingList.length}`);

  const followerIds = new Set(followersList.map(u => u.id));
  const unfollowers = followingList.filter(u => !followerIds.has(u.id));

  console.log(`\n=========================================`);
  console.log(`GT\'den Çıkan Kişi Sayısı: ${unfollowers.length}`);
  console.log(`=========================================`);

  if (unfollowers.length > 0) {
    const tableData = {};
    unfollowers.forEach((u, i) => {
      tableData[i + 1] = {
        'Kullanıcı Adı': `@${u.username}`,
        'Takma Adı': u.full_name || 'Yok'
      };
    });

    const originalLog = console.log;
    let tableOutput = '';

    console.log = (...args) => {
      tableOutput += args.join(' ') + '\n';
    };

    console.table(tableData);

    console.log = originalLog;
    console.log(tableOutput.replace('(index)', 'Sıra   '));

    const exportData = unfollowers.map(u => ({
      id: u.id,
      username: u.username,
      full_name: u.full_name,
      profile_pic_url: u.profile_pic_url
    }));

    fs.writeFileSync('unfollowers.json', JSON.stringify(exportData, null, 2));
    console.log('\nDetaylı liste "unfollowers.json" dosyasına kaydedildi.');
  } else {
    console.log('Garip şekilde inanılmaz! Takip ettiğiniz herkes sizi geri takip ediyor.');
  };
}

main().catch((err) => {
  console.error('Fatal error:', err);
});