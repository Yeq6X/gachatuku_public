const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const CONFIG = functions.config();
const app_domain = admin.app.domain;
const OGP_IMG_WIDTH = 1200;
const OGP_IMG_HEIGHT = 630;

exports.share = functions
// .region('asia-northeast1')
.https.onRequest((req, res) => {

  const [ , , shareid] = req.path.split('/');
  return db.collection('tw').doc(shareid).get().then(snap => {
    if (!snap) {
      res.status(404).end('404 Not Found');
      return
    }
    const appItem = snap ? snap.data() : {};
    const appName = appItem.name || '';
    const imgURL = appItem.url;
    const appid = appItem.uid;
    const html = createHtml(appName, shareid, imgURL, appid);
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    res.status(200).end(html);
    return
  }).catch((err) => {
    console.warn(err);
    // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
  })
});

const createHtml = (appName, shareid, imgURL, appid) => {
  const SITEURL = `https://${app_domain}`
  const PAGEURL = `${SITEURL}/tw/${shareid}`
  const TITLE = `${escapeHtml(appName+'｜ガチャつく')}`
  const DESCRIPTION = 'オリジナルのガチャを作れるサイトです'
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title></title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${imgURL}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${imgURL}">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    <script type="text/javascript">window.location="/app/${appid}";</script>
  </body>
</html>
`
}

const escapeHtml = (str) => {
  if (!str) return;
  return str.replace(/[<>&"'`]/g, (match) => {
    const escape = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;'
    };
    return escape[match];
  });
}

const fs = require('fs');

exports.shareAppPage = functions
.https.onRequest((req, res) => {
  let indexHTML = fs.readFileSync('./index.html').toString();
  const userAgent = req.headers['user-agent'].toLowerCase()
  const isBot = userAgent.includes('googlebot') ||
    userAgent.includes('yahoou') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('yandex') ||
    userAgent.includes('yeti') ||
    userAgent.includes('yodaobot') ||
    userAgent.includes('gigabot') ||
    userAgent.includes('ia_archiver') ||
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('developers\.google\.com') ? true : false
  if (!isBot) {
    res.status(200).send(indexHTML)
  }

  if (isBot) {
    const [ , , appId] = req.path.split('/');
    return db.collection('apps').doc(appId).get().then(snap => {
      if (!snap) {
        res.status(404).end('404 Not Found');
        return
      }
      const appItem = snap ? snap.data() : {};
      const appName = appItem.name || '';
      html = createCommonHtml(appName, `app/${appId}`, 'summary_large_image', appItem.ogpSrc);
      res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
      res.status(200).end(html);
      return
    }).catch((err) => {
      console.warn(err);
      // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
    })
  }
});


exports.sharePage = functions
.https.onRequest((req, res) => {
  let indexHTML = fs.readFileSync('./index.html').toString();
  const pageType = req.path.split('/')[1];
  const userAgent = req.headers['user-agent'].toLowerCase()
  const isBot = userAgent.includes('googlebot') ||
    userAgent.includes('yahoou') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('baiduspider') ||
    userAgent.includes('yandex') ||
    userAgent.includes('yeti') ||
    userAgent.includes('yodaobot') ||
    userAgent.includes('gigabot') ||
    userAgent.includes('ia_archiver') ||
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('developers\.google\.com') ? true : false
  const pageName = {'new_arrivals': '新着', 'ranking': '人気'};

  if (!isBot) {
    res.status(200).send(indexHTML)
  }

  if (isBot) {
    html = createCommonHtml(pageName[pageType], pageType, 'summary');
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    res.status(200).end(html);
  }
});

const createCommonHtml = (pageName, path, ogType, imgURL) => {
  imgURL = imgURL || 'https://firebasestorage.googleapis.com/v0/b/o-gacha-maker.appspot.com/o/meta%2Ffavicon.png?alt=media&token=b6f579db-cda2-4baf-a7ac-e340ca235cfd'
  const SITEURL = `https://${app_domain}`
  const PAGEURL = `${SITEURL}/${path}`
  const TITLE = `${escapeHtml(pageName+'｜ガチャつく')}`
  const DESCRIPTION = 'オリジナルのガチャを作れるサイトです'

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title></title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${imgURL}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="${ogType}">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${imgURL}">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
  </body>
</html>
`
}





exports.countReset = functions
// .region('asia-northeast1')
.pubsub
.schedule('30 * * * *')
.timeZone('Asia/Tokyo')
.onRun( async context => {
  // 時間取得
  const nowTime = await getServerTime();
  const nowHour = (parseInt(Number(nowTime.toString().split(' ')[4].split(':')[0])) + 9)%24; // UCT + 9
  console.log(nowHour);

  db.collection('apps')
  // １時間前はランキングに用済みだからリセットする。もったいないから0以上
  .where(`hour_${(nowHour+23)%24}`, '>', 0).get().then( snap => {
    if (snap) {
      snap.forEach(doc => {
        console.log(doc.data().uid);
        doc.ref.set(
          {[`hour_${(nowHour+23)%24}`]: 0},// リセット
          {merge: true}
        )
      });
    }
  });
});


async function getServerTime() {
  // ダミーのコレクションにサーバー時刻を書き込む
  const ref = await db
    .collection('dummy_for_time_get') // 任意のダミーコレクション名
    .doc('time2');
  await ref.set({
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  return new Promise((resolve, reject) => {
    try {
      // 書き込みが終わったらデータを取得して返す
      ref.onSnapshot(snapshot => {
        const timestamp = snapshot.data().timestamp;
        resolve(timestamp.toDate());
      })
    } catch (err) {
      reject(err)
    }
  });
}




exports.updateUsername = functions.firestore
.document('users_base/{userId}')
.onWrite( async (change, context) => {
  // If we set `/users/marie` to {name: "Marie"} then
  // context.params.userId == "marie"
  // ... and ...
  // change.after.data() == {name: "Marie"}
  const appArray = await getAppArry(context.params.userId);

  if (change.after.data().uid) {
    db.collection('users').doc(context.params.userId)
    .set(
      {
        uid: change.after.data().uid,
      },
      {merge: true}
    )
  }
  if (change.after.data().username) {
    db.collection('users').doc(context.params.userId)
    .set(
      {
        username: change.after.data().username,
      },
      {merge: true}
    )
  }
  if (change.after.data().displayName) {
    db.collection('users').doc(context.params.userId)
    .set(
      {
        displayName: change.after.data().displayName,
      },
      {merge: true}
    )
  }
  if (change.after.data().photoURL) {
    db.collection('users').doc(context.params.userId)
    .set(
      {
        photoURL: change.after.data().photoURL,
      },
      {merge: true}
    )
  }
  if (appArray) {
    for (let i = 0; i < appArray.length; ++i) {
      await db
        .collection('apps')
        .doc(appArray[i])
        .set({user: {
            username: change.after.data().username,
            displayName: change.after.data().displayName,
            photoURL: change.after.data().photoURL,
          }
        }, {merge: true});
    }
  }
});


async function getAppArry(userId) {
  const userDoc = await db
    .collection('users')
    .doc(userId)
    .get();
  if (userDoc.data()) {
    return userDoc.data().appArray;
  }
}


exports.addPrefix = functions.https.onCall((data, context) => {
  const userID = data.userID;

  db.collection('users_base').doc(userID).set({ username: `?${doc.data().username}`}, {merge: true});

})
