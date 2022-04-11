const START_SCREEN_WIDTH = 1000;
const START_SCREEN_HEIGHT = 1000;
const RESULT_SCREEN_WIDTH = 1200;
const RESULT_SCREEN_HEIGHT = 1200;

let i3  = 0;
let i4  = 0;
let i5  = 0;
let i6  = 0;
let i8  = 0;
let i10 = 0;

const boxTransform = {
  '1': [
    {x: 307                 /1000*RESULT_SCREEN_WIDTH, y: 307 /1000*RESULT_SCREEN_HEIGHT, width: 386 /1000*RESULT_SCREEN_WIDTH, height: 386 /1000*RESULT_SCREEN_HEIGHT},
  ],
  '2': [
    {x: 99                  /1000*RESULT_SCREEN_WIDTH, y: 307 /1000*RESULT_SCREEN_HEIGHT, width: 386 /1000*RESULT_SCREEN_WIDTH, height: 386 /1000*RESULT_SCREEN_HEIGHT},
    {x: 515                 /1000*RESULT_SCREEN_WIDTH, y: 307 /1000*RESULT_SCREEN_HEIGHT, width: 386 /1000*RESULT_SCREEN_WIDTH, height: 386 /1000*RESULT_SCREEN_HEIGHT},
  ],
  '3': [
    {x: (32 + 317*i3++)     /1000*RESULT_SCREEN_WIDTH, y: 346 /1000*RESULT_SCREEN_HEIGHT, width: 302 /1000*RESULT_SCREEN_WIDTH, height: 302 /1000*RESULT_SCREEN_HEIGHT},
    {x: (32 + 317*i3++)     /1000*RESULT_SCREEN_WIDTH, y: 346 /1000*RESULT_SCREEN_HEIGHT, width: 302 /1000*RESULT_SCREEN_WIDTH, height: 302 /1000*RESULT_SCREEN_HEIGHT},
    {x: (32 + 317*i3++)     /1000*RESULT_SCREEN_WIDTH, y: 346 /1000*RESULT_SCREEN_HEIGHT, width: 302 /1000*RESULT_SCREEN_WIDTH, height: 302 /1000*RESULT_SCREEN_HEIGHT},
  ],
  '4': [
    {x: (32 + 237*i4++)     /1000*RESULT_SCREEN_WIDTH, y: 387 /1000*RESULT_SCREEN_HEIGHT, width: 225 /1000*RESULT_SCREEN_WIDTH, height: 225 /1000*RESULT_SCREEN_HEIGHT},
    {x: (32 + 237*i4++)     /1000*RESULT_SCREEN_WIDTH, y: 387 /1000*RESULT_SCREEN_HEIGHT, width: 225 /1000*RESULT_SCREEN_WIDTH, height: 225 /1000*RESULT_SCREEN_HEIGHT},
    {x: (32 + 237*i4++)     /1000*RESULT_SCREEN_WIDTH, y: 387 /1000*RESULT_SCREEN_HEIGHT, width: 225 /1000*RESULT_SCREEN_WIDTH, height: 225 /1000*RESULT_SCREEN_HEIGHT},
    {x: (32 + 237*i4++)     /1000*RESULT_SCREEN_WIDTH, y: 387 /1000*RESULT_SCREEN_HEIGHT, width: 225 /1000*RESULT_SCREEN_WIDTH, height: 225 /1000*RESULT_SCREEN_HEIGHT},
  ],
  '5': [
    {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 410 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 410 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 410 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 410 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 410 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
  ],
  // '5s': [
  //   {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 390 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 220 /1000*RESULT_SCREEN_HEIGHT},
  //   {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 390 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 220 /1000*RESULT_SCREEN_HEIGHT},
  //   {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 390 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 220 /1000*RESULT_SCREEN_HEIGHT},
  //   {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 390 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 220 /1000*RESULT_SCREEN_HEIGHT},
  //   {x: (30 + 190*i5++)     /1000*RESULT_SCREEN_WIDTH, y: 390 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 220 /1000*RESULT_SCREEN_HEIGHT},
  // ],
  '6': [
    {x: (220 + 190*i6++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (220 + 190*i6++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (220 + 190*i6++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (220 + 190*(i6++-3)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (220 + 190*(i6++-3)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (220 + 190*(i6++-3)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
  ],
  '8': [
    {x: (125 + 190*i8++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*i8++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*i8++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*i8++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*(i8++-4)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*(i8++-4)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*(i8++-4)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (125 + 190*(i8++-4)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
  ],
  '10': [
    {x: (30 + 190*i10++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i10++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i10++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i10++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*i10++)     /1000*RESULT_SCREEN_WIDTH, y: 306 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*(i10++-5)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*(i10++-5)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*(i10++-5)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*(i10++-5)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
    {x: (30 + 190*(i10++-5)) /1000*RESULT_SCREEN_WIDTH, y: 514 /1000*RESULT_SCREEN_HEIGHT, width: 180 /1000*RESULT_SCREEN_WIDTH, height: 180 /1000*RESULT_SCREEN_HEIGHT},
  ]
}



const makeStore = {
  state: {
    uid: null,
    name: '',
    hashTag: null,
    createDate: null,
    acceptShow: 'accepted',
    ogpSrc: null,
    // setなし
    likeCount: 0,
    playCount: 0,
    hour_0: 0,
    hour_1: 0,
    hour_2: 0,
    hour_3: 0,
    hour_4: 0,
    hour_5: 0,
    hour_6: 0,
    hour_7: 0,
    hour_8: 0,
    hour_9: 0,
    hour_10: 0,
    hour_11: 0,
    hour_12: 0,
    hour_13: 0,
    hour_14: 0,
    hour_15: 0,
    hour_16: 0,
    hour_17: 0,
    hour_18: 0,
    hour_19: 0,
    hour_20: 0,
    hour_21: 0,
    hour_22: 0,
    hour_23: 0,
    // ここまで
    user: {
      uid: null,
      username: null,
      displayName: null,
      photoURL: null,
    },
    gachaData: {
      resultScreen: {
        typeNum: 1,
        back: {
          imgSrc: '',
        },
        message: {
          text: '結果！',
          textColor: 'black',
          backColor: 'white',
          x: (RESULT_SCREEN_WIDTH / 2),
          y: (RESULT_SCREEN_HEIGHT * 0.04),
          scale: {x:1,y:1},
          backOpacity: 0,
        },
        cardList: [],
        boxList: boxTransform[1],
      },
      resultMessage: {
        messageSrc: ``
      },
      startScreen: {
        back: {
          imgSrc: '',
        },
        btn: {
          text: 'スタート',
          textColor: 'white',
          backColor: '#2196F3',
          x: (START_SCREEN_WIDTH / 2),
          y: (START_SCREEN_HEIGHT * (3 / 5)),
          scale: {x:1,y:1},
        },
        message: {
          text: 'なんとかガチャ',
          textColor: 'black',
          backColor: 'white',
          x: (START_SCREEN_WIDTH / 2),
          y: (START_SCREEN_HEIGHT / 5),
          scale: {x:1,y:1},
          backOpacity: 0,
        }
      }
    },
  },
  set_uid(val) {
    this.state.uid = val;
  },
  set_name(val) {
    this.state.name = val;
  },
  set_hashTag(val) {
    this.state.hashTag = val;
  },
  set_createDate(val) {
    this.state.createDate = val;
  },
  set_acceptShow(val) {
    this.state.acceptShow = val;
  },
  set_ogpSrc(val) {
    this.state.ogpSrc = val;
  },
  set_user_uid(val) {
    this.state.user.uid = val;
  },
  set_user_username(val) {
    this.state.user.username = val;
  },
  set_user_displayName(val) {
    this.state.user.displayName = val;
  },
  set_user_photoURL(val) {
    this.state.user.photoURL = val;
  },
  set_resultScreen_typeNum(val) {
    this.state.gachaData.resultScreen.typeNum = val;
    this.set_resultScreen_boxList(boxTransform[val]);
  },
  set_resultScreen_back_imgSrc(val) {
    this.state.gachaData.resultScreen.back.imgSrc = val;
  },
  set_resultScreen_message_text(val) {
    this.state.gachaData.resultScreen.message.text = val;
  },
  set_resultScreen_message_textColor(val) {
    this.state.gachaData.resultScreen.message.textColor = val;
  },
  set_resultScreen_message_backColor(val) {
    this.state.gachaData.resultScreen.message.backColor = val;
  },
  set_resultScreen_message_x(val) {
    this.state.gachaData.resultScreen.message.x = val;
  },
  set_resultScreen_message_y(val) {
    this.state.gachaData.resultScreen.message.y = val;
  },
  set_resultScreen_message_scale(val) {
    this.state.gachaData.resultScreen.message.scale = val;
  },
  set_resultScreen_message_backOpacity(val) {
    this.state.gachaData.resultScreen.message.backOpacity = val;
  },
  set_resultScreen_cardList(arr) {
    this.state.gachaData.resultScreen.cardList = arr;
  },
  set_resultScreen_boxList(arr) {
    this.state.gachaData.resultScreen.boxList = arr;
  },
  set_resultMessage_messageSrc(val) {
    this.state.gachaData.resultMessage.messageSrc = val;
  },
  set_startScreen_back_imgSrc(val) {
    this.state.gachaData.startScreen.back.imgSrc = val;
  },
  set_startScreen_btn_text(val) {
    this.state.gachaData.startScreen.btn.text = val;
  },
  set_startScreen_btn_textColor(val) {
    this.state.gachaData.startScreen.btn.textColor = val;
  },
  set_startScreen_btn_backColor(val) {
    this.state.gachaData.startScreen.btn.backColor = val;
  },
  set_startScreen_btn_x(val) {
    this.state.gachaData.startScreen.btn.x = val;
  },
  set_startScreen_btn_y(val) {
    this.state.gachaData.startScreen.btn.y = val;
  },
  set_startScreen_btn_scale(val) {
    this.state.gachaData.startScreen.btn.scale = val;
  },
  set_startScreen_message_text(val) {
    this.state.gachaData.startScreen.message.text = val;
  },
  set_startScreen_message_textColor(val) {
    this.state.gachaData.startScreen.message.textColor = val;
  },
  set_startScreen_message_backColor(val) {
    this.state.gachaData.startScreen.message.backColor = val;
  },
  set_startScreen_message_x(val) {
    this.state.gachaData.startScreen.message.x = val;
  },
  set_startScreen_message_y(val) {
    this.state.gachaData.startScreen.message.y = val;
  },
  set_startScreen_message_scale(val) {
    this.state.gachaData.startScreen.message.scale = val;
  },
  set_startScreen_message_backOpacity(val) {
    this.state.gachaData.startScreen.message.backOpacity = val;
  },

  init_state() {
    this.set_uid(null);
    this.set_name('');
    this.set_hashTag(null);
    this.set_createDate(null);
    this.set_acceptShow('accepted');
    this.set_ogpSrc(null);
    this.set_user_uid(null);
    this.set_user_username(null);
    this.set_user_displayName(null);
    this.set_user_photoURL(null);
    this.set_resultScreen_typeNum(1);
    this.set_resultScreen_back_imgSrc('');
    this.set_resultScreen_message_text('結果！');
    this.set_resultScreen_message_textColor('black');
    this.set_resultScreen_message_backColor('white');
    this.set_resultScreen_message_x((RESULT_SCREEN_WIDTH / 2));
    this.set_resultScreen_message_y((RESULT_SCREEN_HEIGHT * 0.04));
    this.set_resultScreen_message_scale({x:1,y:1});
    this.set_resultScreen_message_backOpacity(0);
    this.set_resultScreen_cardList([]);
    this.set_resultMessage_messageSrc(
`BOX1に出たカードは[BOX1]です！
[CARD1]は[CARD1_COUNT]個出ました！
=IF([BOX1]==[CARD1],やったね,残念)`);
    this.set_startScreen_back_imgSrc('');
    this.set_startScreen_btn_text('スタート');
    this.set_startScreen_btn_textColor('white');
    this.set_startScreen_btn_backColor('#2196F3');
    this.set_startScreen_btn_x((START_SCREEN_WIDTH / 2));
    this.set_startScreen_btn_y((START_SCREEN_HEIGHT * 0.62));
    this.set_startScreen_btn_scale({x:1,y:1});
    this.set_startScreen_message_text('なんとかガチャ');
    this.set_startScreen_message_textColor('black');
    this.set_startScreen_message_backColor('white');
    this.set_startScreen_message_x((START_SCREEN_WIDTH / 2));
    this.set_startScreen_message_y(START_SCREEN_HEIGHT * 0.3);
    this.set_startScreen_message_scale({x:1,y:1});
    this.set_startScreen_message_backOpacity(0);
  },
  set_state(obj) {
    this.state = obj;
  },
}

export default makeStore;
