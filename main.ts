/*
Riven
load dependency
"newland": "file:../pxt-newland"
*/

//% color="#5c7cfa" weight=10 icon="\uf108"
//% groups='["Basic", Classifier"]'
namespace ME66 {
  //type起个新类型
  type EvtAct = () => void
  type EvtNum = (num: number) => void
  type EvtCardNum = (num: number) => void
  type Evtxye = (x: string, y: string, e: string) => void
  type Evtxy = (x: number, y: number) => void
  type EvtFaceNum = (x: number) => void
  type Evtxyobj = (txt: string, x: number, y: number) => void
  type Evtxywh = (x: number, y: number, w: number, h: number) => void
  type Evtxyr = (x: number, y: number, r: number) => void
  type Evtpp = (x1: number, y1: number, x2: number, y2: number) => void
  type Evttxt = (txt: string) => void
  type Evtsxy = (
      id: string,
      x: number,
      y: number,
      w: number,
      h: number,
      rX: number,
      rY: number,
      rZ: number
  ) => void
  type Evtss = (t1: string, t2: string) => void
  type Evtsn = (t1: string, n: number) => void
  type Evtssnns = (t1: string, t2: string, n: number, n1: number, t3: string) => void

  let classifierEvt: Evttxt = null
  let kmodelEvt: EvtNum = null
  let speechCmdEvt: Evttxt = null
  let facetokenEvt: Evtssnns = null
  let facefoundEvt: Evtsn = null



  let btnEvt: Evtxye = null
  let circleEvt: Evtxyr = null
  let rectEvt: Evtxywh = null
  let colorblobEvt: Evtxywh = null
  let lineEvt: Evtpp = null
  let imgtrackEvt: Evtxywh = null
  let qrcodeEvt: Evttxt = null
  let barcodeEvt: Evttxt = null
  let apriltagEvt: Evtsxy = null
  let facedetEvt: Evtxy = null
  let facenumEvt: EvtFaceNum = null
  let objectdetEvt: Evtxyobj = null
  let carddetEvt: EvtCardNum = null
  let ipEvt: Evttxt = null
  let mqttDataEvt: Evtss = null

  let lastCmd: Array<string> = null
  let faceNum = 0


  const PortSerial = [
    [SerialPin.P1, SerialPin.P2],
    [SerialPin.P1, SerialPin.P12],
    [SerialPin.P2, SerialPin.P13],
    [SerialPin.P14, SerialPin.P15],
  ]

  export enum SerialPorts {
    PORT1 = 0,
    PORT2 = 1,
    PORT3 = 2,
    PORT4 = 3,
  }

  export enum VolumeNum {
    Volume5 = 5,
    Volume0 = 0,
    Volume1 = 1,
    Volume2 = 2,
    Volume3 = 3,
    Volume4 = 4,
  }

  export enum OnOffDirection {
    //% block=On
    On = 1,
    //% block=Off
    Off = 0,
  }

  export enum LcdDirection {
    //% block=Front
    Front = 0,
    //% block=Back
    Back = 2,
  }

  function trim(n: string): string {
    while (n.charCodeAt(n.length - 1) < 0x1f) {
      n = n.slice(0, n.length - 1)
    }
    return n
  }

  serial.onDataReceived('\n', function () {


    let a = serial.readUntil('\n')

    if (a.indexOf("<STX>") != -1) {
      basic.showNumber(7)
    } else {
      basic.showString(a)
      basic.showNumber(8)

      let obj = JSON.parse(a);

      if (btnEvt) {
        btnEvt(obj.SKU, obj.Name_PY, obj.Price) // btna btnb
      }
      let cmd =42;
      control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + cmd)
    }





    if (a.charAt(0) == 'K') {
      a = trim(a)
      let b = a.slice(1, a.length).split(' ')
      let cmd = parseInt(b[0])

    }
  })

  function asyncWrite(msg: string, evt: number): void {
    serial.writeLine(msg)
    //control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + evt)

  }

  /**
   * init serial port
   * @param tx Tx pin; eg: SerialPin.P1
   * @param rx Rx pin; eg: SerialPin.P2
   */
  //% blockId=newland_init block="Newland init|Tx pin %tx|Rx pin %rx"
  //% group="Basic" weight=100
  export function newland_init(tx: SerialPin, rx: SerialPin): void {
    serial.redirect(tx, rx, BaudRate.BaudRate115200)
    serial.readString()
    //serial.writeString('\n\n')
    basic.pause(300)
  }



  //% blockId=newland_volume_control block="Newland  Volume Dir%dir"
  //% group="Basic" weight=98
  export function newland_volume_control(dir: VolumeNum): void {
    if (dir == 0) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=0><ETX><56>')
    } else if (dir == 1) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=1><ETX><57>')
    } else if (dir == 2) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=2><ETX><54>')
    } else if (dir == 3) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=3><ETX><55>')
    } else if (dir == 4) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=4><ETX><52>')
    } else if (dir == 5) {
      serial.writeLine('<STX><0015><SET><01><00><VOLUME=5><ETX><53>')
    }
    basic.pause(100)
  }


  //% blockId=newland_volume_onOff block="Newland Volume onOff%dir"
  //% group="Basic" weight=98
  export function newland_volume_onOff(dir: OnOffDirection): void {
    if (dir == 0) {
      serial.writeLine('<STX><0021><SET><01><00><PROMPT=0003OFF><ETX><21>')
    } else if (dir == 1) {
      serial.writeLine('<STX><0020><SET><01><00><PROMPT=0002ON><ETX><6F>')
    }
    basic.pause(100)
  }


  //% blockId=newland_volume_set block="Newland volume Set"
  //% group="Basic" weight=88
  export function newland_volume_set(): void {
    //OFF
    serial.writeLine('<STX><0016><SET><01><00><RESET=OFF><ETX><77>')
    basic.pause(100)
    //ON
    serial.writeLine('<STX><0015><SET><01><00><RESET=ON><ETX><3A>')
    basic.pause(100)
  }


  //% blockId=newland_oncolorblob block="on Color blob"
  //% group="Basic" weight=98 draggableParameters=reporter blockGap=40
  export function newland_oncolorblob(
      handler: (x: number, y: number, w: number, h: number) => void
  ) {
    colorblobEvt = handler
  }


  /**
   * @param t string to display; eg: hello
   * @param d delay; eg: 1000
   */
  //% blockId=newland_print block="Newland print %t X %x Y %y||delay %d ms"
  //% x.min=0 x.max=320
  //% y.min=0 y.max=240
  //% group="Basic" weight=97
  export function newland_print(t: string, x: number, y: number, d: number = 1000): void {

    let str = `K4 ${x} ${y} ${d} ${t}\n`
    serial.writeLine(str)
  }

  //% blockId=newland_onbtn block="on Button"
  //% weight=96
  //% group="Basic" draggableParameters=reporter
  export function newland_onbtn(
      handler: (btnA: string, btnB: string, btnEnter: string) => void
  ): void {
    btnEvt = handler
  }


}



