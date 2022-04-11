const funcList = {
  _IF: {str: '=IF', func: _if},
  _SUM: {str: '=SUM', func: _sum},
  _AND: {str: '=AND', func: _and},
  _OR: {str: '=OR', func: _or}
}

const operater = [
  {str: '<='},
  {str: '>='},
  {str: '<'},
  {str: '>'},
  {str: '&='},
  {str: '=='},
  {str: '='},
]
function _arrayToObjArray(arr) {
  let ret = arr.reduce((acc, value) => {
    acc.push({
      data: value,
      flag: false
    });
    return acc;
  }, []);
  return ret;
}
function _judge(src) {
  let nowPos = 0;
  let optr = '';
  let opd = [];
  let optrPos = undefined;
  let targetStr = '';
  // if (src.trim().slice(0, 1) == '(' && src.trim().slice(-1) == ')') {
  //   targetStr = src.trim().slice(1, -1);
  // } else {
    targetStr = src.trim();
  // }
  for (let i = 0; i < 2; ++i) {
    for (let op of operater) {
      // -1 の時はどうやっても入らない
      if ((optrPos == undefined || targetStr.indexOf(op.str, nowPos) < optrPos) && targetStr.indexOf(op.str, nowPos) != -1) {
        optrPos = targetStr.indexOf(op.str, nowPos);
        optr = op.str;
      }
    }
    // 項が1つで０の時はfalse
    if (i == 0 && optrPos == undefined) {
      if (targetStr.trim() == 0 || targetStr.trim() == 'FALSE') {
        return 'FALSE';
      } else {
        return 'TRUE';
      }
    }
    if (optrPos != undefined) {
      // iが0のときでも1のときでもoptrPosが-1でなければoptrPosの前まで切り取る
      opd.push(targetStr.slice(nowPos, optrPos));
      nowPos = optrPos + optr.length;
    } else { // ここには i == 1 で optPos == undifined のときしかたどり着かない
      opd.push(targetStr.slice(nowPos));
    }
    optrPos = undefined;
  } // ここまでで項２つと演算子1つを取得

  switch (optr) {
    case operater[0].str:// '<='
      if (isNaN(opd[0]) == true || isNaN(opd[1] == true)) return 'FALSE';
      if (parseInt(opd[0]) <= parseInt(opd[1])) {
        return 'TRUE';
      } else {
        return 'FALSE';
      }
    case operater[1].str:// '>='
      if (isNaN(opd[0]) == true || isNaN(opd[1] == true)) return 'FALSE';
      if (parseInt(opd[0]) >= parseInt(opd[1])) {
        return 'TRUE';
      } else {
        return 'FALSE';
      }
    case operater[2].str:// '<'
      if (isNaN(opd[0]) == true || isNaN(opd[1] == true)) return 'FALSE';
      if (parseInt(opd[0]) < parseInt(opd[1])) {
        return 'TRUE';
      } else {
        return 'FALSE';
      }
    case operater[3].str:// '>'
      if (isNaN(opd[0]) == true || isNaN(opd[1] == true)) return 'FALSE';
      if (parseInt(opd[0]) > parseInt(opd[1])) {
        return 'TRUE';
      } else {
        return 'FASLE';
      }
    case operater[4].str:// '&='
      {
        let leftOpArr = [];
        let rightOpArr = [];
        let rightOpObjArr = [];
        if (opd[0].trim().slice(0, 1) == '(' && opd[0].trim().slice(-1) == ')') {
          leftOpArr = opd[0].trim().slice(1, -1).split(',');
        } else {
          leftOpArr.push(opd[0]);
        }
        if (opd[1].trim().slice(0, 1) == '(' && opd[1].trim().slice(-1) == ')') {
          rightOpObjArr = _arrayToObjArray(opd[1].trim().slice(1, -1).split(','));
        } else {
          rightOpArr.push(opd[1]);
          rightOpObjArr = _arrayToObjArray(rightOpArr);
        }
        let isSuccess = false;
        for (let lOp of leftOpArr) {
          for (let rOp of rightOpObjArr) {
            if (lOp.trim() == rOp.data.trim()) {
              rOp.flag = true;
              isSuccess = true;
              break; // もし右辺がすべて使われているなら一つ目を通り越してここでbleakする
            } else {
              isSuccess = false;
            }
          }
          if (isSuccess == false) { // この時点で false だったらもう右辺で構成されてない左辺が見つかったからbreak;
            break;
          }
        }
        // ここまでのisSuccessは左辺が右辺によって構成されてるか
        // すべて使われているか
        for (let i = 0; i < rightOpObjArr.length; ++i) {
          if (rightOpObjArr[i].flag == false) { // 使われてないのがあったら
            isSuccess = false;
            break;
          }
        }
        return isSuccess? 'TRUE': 'FALSE';
      }
    case operater[5].str:// '=='
      {
        let leftOp = [];
        let rightOp = [];
        if (opd[0].trim().slice(0, 1) == '(' && opd[0].trim().slice(-1) == ')') {
          leftOp = opd[0].trim().slice(1, -1).split(',');
        } else {
          leftOp.push(opd[0]);
        }
        if (opd[1].trim().slice(0, 1) == '(' && opd[1].trim().slice(-1) == ')') {
          rightOp = opd[1].trim().slice(1, -1).split(',');
        } else {
          rightOp.push(opd[1]);
        }
        let isSuccess = false;
        for (let lOp of leftOp) {
          for (let rOp of rightOp) {
            if (lOp.trim() == rOp.trim()) {
              isSuccess = true;
              break;
            } else {
              isSuccess = false;
            }
          }
          if (isSuccess == false) { // この時点で false だったらもう右辺で構成されてない左辺が見つかったからbreak;
            break;
          }
        }
        return isSuccess? 'TRUE': 'FALSE';
      }
    case operater[6].str:// '='
      {
        let leftOp = [];
        let rightOp = [];
        if (opd[0].trim().slice(0, 1) == '(' && opd[0].trim().slice(-1) == ')') {
          leftOp = opd[0].trim().slice(1, -1).split(',');
        } else {
          leftOp.push(opd[0]);
        }
        if (opd[1].trim().slice(0, 1) == '(' && opd[1].trim().slice(-1) == ')') {
          rightOp = opd[1].trim().slice(1, -1).split(',');
        } else {
          rightOp.push(opd[1]);
        }
        let isSuccess = false;
        leftLoop: for (let lOp of leftOp) {
          for (let rOp of rightOp) {
            if (lOp.trim() == rOp.trim()) {
              isSuccess = true;
              break leftLoop;
            } else {
              isSuccess = false;
            }
          }
        }
        return isSuccess? 'TRUE': 'FALSE';
      }
  }
  return 'end';
}
function _if(args) {
  if (_judge(args[0]) == 'TRUE') {
    return args[1] != undefined ? args[1]: 'TRUE';
  } else {
    return args[2] != undefined ? args[2]: 'FALSE';
  }
}
function _and(args) { // =AND
  for (let arg of args) {
    if (_judge(arg) == 'FALSE') return 'FALSE';
  }
  return 'TRUE';
}
function _or(args) { // =OR
  for (let arg of args) {
    if (_judge(arg) == 'TRUE') return 'TRUE';
  }
  return 'FALSE';
}
function _sum(args) { // =SUM([@現在完了_count], [CARD1_count])
  let sum = 0;
  for (let arg of args) {
    if (isNaN(arg) == true) {
      return 'FALSE';
    } else {
      sum += parseInt(arg);
    }
  }
  return sum;
}

export default {
  name: 'converter',
  data () {
    return {}
  },
  methods: {
    // <= >= < > &= ==
    convert(src, callback) { // =IF
      let isSuccess = false;
      let lastPos = 0;
      let nowPos = 0;
      let eqPos = 0;
      let funcLength = 0;
      let targetStr = '';
      let tmpStr = '';
      let arg = [];

      if (src.indexOf('=') == 0 && callback != undefined) {
        targetStr = src.slice(src.indexOf('(') + 1);
        funcLength = src.indexOf('(') + 1;
      } else {
        targetStr = src;
      }
      let commaPos = targetStr.indexOf(',');
      let rParenPos = targetStr.indexOf(')');
      let lParenPos = targetStr.indexOf('(');
      while (nowPos <= targetStr.length && nowPos !== -1) {
        eqPos = targetStr.indexOf('=', nowPos);
        lParenPos = targetStr.indexOf('(', nowPos);
        let isEq = false;
        let isLParen = false;
        if (eqPos != -1) {
          if (lParenPos != -1 && eqPos < lParenPos) {
            if (commaPos != -1 && rParenPos != -1) {
              if (eqPos < commaPos && eqPos < rParenPos) {
                isEq = true;
              }
            } else if (commaPos == -1 && rParenPos != -1) {
              if (eqPos < rParenPos) {
                isEq = true;
              }
            } else if (commaPos != -1 && rParenPos == -1) {
              if (eqPos < commaPos) {
                isEq = true;
              }
            } else if (commaPos == -1 && rParenPos == -1) {
              isEq = true;
            }
          } else if (lParenPos == -1) {
            if (commaPos != -1 && rParenPos != -1) {
              if (eqPos < commaPos && eqPos < rParenPos) {
                isEq = true;
              }
            } else if (commaPos == -1 && rParenPos != -1) {
              if (eqPos < rParenPos) {
                isEq = true;
              }
            } else if (commaPos != -1 && rParenPos == -1) {
              if (eqPos < commaPos) {
                isEq = true;
              }
            } else if (commaPos == -1 && rParenPos == -1) {
              isEq = true;
            }
          }
        }
        if (lParenPos != -1) {
          if (commaPos != -1 && rParenPos != -1) {
            if (lParenPos < commaPos && lParenPos < rParenPos) {
              isLParen = true;
            }
          } else if (commaPos == -1 && rParenPos != -1) {
            if (lParenPos < rParenPos) {
              isLParen = true;
            }
          } else if (commaPos != -1 && rParenPos == -1) {
            if (lParenPos < commaPos) {
              isLParen = true;
            }
          } else if (commaPos == -1 && rParenPos == -1) {
            isLParen = true;
          }
        }
        if (isEq) {
          nowPos = eqPos + 1;
          for (let key in funcList) {
            if ((lParenPos != -1) && (targetStr.slice(nowPos-1, (lParenPos)).trim().toUpperCase() == funcList[key].str)) { // targetStr.indexOf('(', nowPos-1)) で見つけた括弧は0から始まる番号だけどsliceの第二項は1から始まる番号だから括弧の前まで切り取る
              if (eqPos !== 0) { // = の前までを入れる
                tmpStr = tmpStr.concat(targetStr.slice(lastPos, eqPos))
              }
              let res = this.convert(targetStr.slice(eqPos), funcList[key].func); // nowPos + 1
              tmpStr = tmpStr.concat(res.data);
              nowPos = eqPos + res.length;// ******) までが長さだから + 1 をして ) の次にnowPosを移す
              lastPos = nowPos;
              if (targetStr.indexOf(')', rParenPos + 1) < targetStr.indexOf(')', nowPos)) {
                rParenPos = targetStr.indexOf(')', nowPos);
                commaPos = targetStr.indexOf(',', nowPos);
              } else {
                // 個々の順番でcommaが飛ばされたりする
                commaPos = targetStr.indexOf(',', rParenPos);
                rParenPos = targetStr.indexOf(')', rParenPos + 1);
              }
              lParenPos = targetStr.indexOf('(', nowPos);
              break;
            }
          }
        } else if (isLParen) {
          commaPos = targetStr.indexOf(',', rParenPos);
          rParenPos = targetStr.indexOf(')', rParenPos + 1);
          nowPos = targetStr.indexOf('(', nowPos) + 1;
        } else {
          if (callback != undefined) {
            if (commaPos < rParenPos && commaPos != -1 && rParenPos != -1) { // , で次があるとき
              nowPos = commaPos;
            } else if (rParenPos == -1) { // error
              nowPos = targetStr.length;
              isSuccess = false;
            } else if ((rParenPos < commaPos && rParenPos != -1) || (rParenPos != -1 && commaPos == -1)) { // ) で閉じるとき
              nowPos = rParenPos;
              isSuccess = true;
            } else {
              // console.log('else');
            }
          } else {
            nowPos = targetStr.length;
            isSuccess = true;
          }
          tmpStr = tmpStr.concat(targetStr.slice(lastPos, nowPos));
          nowPos++; // , ) 文末を飛ばす ) を飛ばしたら nowPos < rParenPos が破綻し、whileを抜ける
          lastPos = nowPos; // nowPos < rParenPos が破綻する
          arg.push(tmpStr);
          tmpStr = '';
          commaPos = targetStr.indexOf(',', nowPos);
          if (isSuccess == true) break; // ) まだ行ったとき
        }
      }

      let replacedArg = [];
      for (let ar of arg) {
        let tmp = ar;
        tmp = this._replace(tmp, '[BOX');
        tmp = this._replace(tmp, '[CARD')
        replacedArg.push(tmp.trim());
      }

      let data;
      let length;
      if (callback != undefined) {
        if (isSuccess == true) {
            // console.log('rParenPos = '+rParenPos + ' commaPos = '+commaPos + ' nowPos = '+nowPos);
          data = callback(replacedArg);
          length = funcLength + rParenPos + 1;
        } else {
          data = src;
          length = src.length;
        }
      } else {
        data = replacedArg[0];
        length = src.length;
      }
      return {data, length}; // rParenPos は位置、rParenPos + 1 は文字数
    },
    _replace(src, repStr) {
      let replaced = '';
      let nowPos = 0;
      let lastPos = 0;
      let numStr = '';
      while (nowPos < src.length) {
        if (src.indexOf(repStr, nowPos) != -1) {
          replaced = replaced.concat(src.slice(lastPos, src.indexOf(repStr, nowPos)));
          lastPos = src.indexOf(repStr, nowPos);
          nowPos = src.indexOf(repStr, nowPos) + repStr.length;
          if (src.indexOf(']', nowPos) != -1) {
            // numStr = this._replace(src.slice(nowPos, src.indexOf(']', nowPos)));
            numStr = src.slice(nowPos, src.indexOf(']', nowPos));
            nowPos = src.indexOf(']', nowPos) + 1;
            if (numStr == numStr.trim()) {


              if (repStr == '[BOX') { // Numberのとき
                if (!isNaN(numStr)) {
                  let num = parseInt(numStr);
                  if (0 < num && num <= this.data.resultScreen.typeNum) {
                    replaced = replaced.concat(this.result.boxList[num-1].name); // REPLACE
                  } else {
                    replaced = replaced.concat(src.slice(lastPos, nowPos));
                  }
                } else {
                  replaced = replaced.concat(src.slice(lastPos, nowPos));
                }
              }


              if (repStr == '[CARD') {
                if (!isNaN(numStr)) { // Numberのとき
                  let num = parseInt(numStr);

                  if (0 < num && num <= this.data.resultScreen.cardList.length) {
                    replaced = replaced.concat(this.data.resultScreen.cardList[num-1].name); // REPLACE
                  } else {
                    replaced = replaced.concat(src.slice(lastPos, nowPos)); // 不正
                  }

                } else {
                  let num = parseInt(numStr);

                  if (0 < num && num <= this.data.resultScreen.cardList.length) {
                    if (numStr == num + '_COUNT') { // この場合numは0_COUNTの0

                      let count = 0;
                      for (let i = 0; i < this.data.resultScreen.typeNum; ++i ) {
                        if (this.data.resultScreen.cardList[num-1].name == this.result.boxList[i].name) {
                          count++;
                        }
                      }

                      replaced = replaced.concat(count);  // REPLACE
                    } else { // 不正
                      replaced = replaced.concat(src.slice(lastPos, nowPos));
                    }
                  } else {
                    replaced = replaced.concat(src.slice(lastPos, nowPos)); // 不正
                  }
                }
              }




            } else {//空白あり
              replaced = replaced.concat(src.slice(lastPos, nowPos));
            }
            lastPos = nowPos;
          } else {
            replaced = replaced.concat(src.slice(lastPos, src.length));
            lastPos = src.length;
            nowPos = src.length;
          }
        } else {
          nowPos = src.length;
          replaced = replaced.concat(src.slice(lastPos, nowPos));
          lastPos = src.length;
        }
      }
      return replaced;
    }
  }
}
