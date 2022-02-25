/*
Riven
load dependency
"newland": "file:../pxt-newland"
*/

//% color="#5c7cfa" weight=10 icon="\uf16b"
//% groups='["Basic", "Graphic", Classifier", "Tag/Code", "Audio", "Face", "Wifi", "CloudAI", "AI"]'
namespace newland {
  //type起个新类型
  type EvtAct = () => void
  type EvtNum = (num: number) => void
  type EvtCardNum = (num: number) => void
  type Evtxye = (x: number, y: number, e: number) => void
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
    if (a.charAt(0) == 'K') {
      a = trim(a)
      let b = a.slice(1, a.length).split(' ')
      let cmd = parseInt(b[0])
      if (cmd == 42) {
        if (classifierEvt) {
          classifierEvt(b[1])
        }
      } else if (cmd == 46) {
        if (kmodelEvt) {
          kmodelEvt(parseInt(b[1]))
        }
      } else if (cmd == 3) {
        if (btnEvt) {
          btnEvt(parseInt(b[1]), parseInt(b[2]), parseInt(b[3])) // btna btnb
        }
      } else if (cmd == 10) {
        // circle position
        if (circleEvt) {
          circleEvt(parseInt(b[1]), parseInt(b[2]), parseInt(b[3])) // x y r
        }
      } else if (cmd == 11) {
        // rect return
        if (rectEvt) {
          rectEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          ) // x y w h
        }
      } else if (cmd == 12) {
        // line track
        if (lineEvt) {
          lineEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          )
        }
      } else if (cmd == 15) {
        // color blob
        if (colorblobEvt) {
          colorblobEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          )
        }
      } else if (cmd == 17) {
        // image track return
        if (imgtrackEvt) {
          imgtrackEvt(
              parseInt(b[1]),
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4])
          )
        }
      } else if (cmd == 20) {
        // qrcode return
        if (qrcodeEvt) {
          qrcodeEvt(b[1])
        }
      } else if (cmd == 22) {
        // barcode return
        if (barcodeEvt) {
          barcodeEvt(b[1])
        }
      } else if (cmd == 23) {
        // april tag return
        if (apriltagEvt) {
          apriltagEvt(
              b[1],
              parseInt(b[2]),
              parseInt(b[3]),
              parseInt(b[4]),
              parseInt(b[5]),
              Math.roundWithPrecision(parseFloat(b[6]), 2),
              Math.roundWithPrecision(parseFloat(b[7]), 2),
              Math.roundWithPrecision(parseFloat(b[8]), 2)
          )
        }
      } else if (cmd == 31) {
        // face position
        if (facedetEvt && b[1]) {
          facedetEvt(parseInt(b[1]), parseInt(b[2]))
        }
      } else if (cmd == 32) {
        // face number
        if (facenumEvt && b[1]) {
          facenumEvt(parseInt(b[1]))
        }
        //  faceNum = parseInt(b[1])
      } else if (cmd == 51) {
        if (objectdetEvt && b[1]) {
          objectdetEvt(b[1], parseInt(b[2]), parseInt(b[3]))
        }
      } else if (cmd == 54) {
        // ip
        if (ipEvt) {
          ipEvt(b[1])
        }
      } else if (cmd == 55) {
        if (mqttDataEvt) {
          mqttDataEvt(b[1], b[2])
        }
      } else if (cmd == 61) {
        if (carddetEvt && b[1]) {
          carddetEvt(parseInt(b[1]))
        }
      } else if (cmd == 65) {
        if (speechCmdEvt) {
          speechCmdEvt(b[1])
        }
      } else if (cmd == 75) {
        if (facetokenEvt) {
          // K75 token age gender ismask expression
          facetokenEvt(b[1], b[3], parseInt(b[2]), parseInt(b[4]), b[5])
        }
      } else if (cmd == 77) {
        if (facefoundEvt) {
          facefoundEvt(b[1], parseInt(b[2]))
        }
      } else {
        lastCmd = b.slice(1); // deep copy?
      }
      control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + cmd)
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
    basic.pause(500)
    serial.setTxBufferSize(64)
    serial.setRxBufferSize(64)
    serial.readString()
    serial.writeString('\n\n')
    // take control of the ext serial port from Newland
    asyncWrite(`K0`, 0)
    basic.pause(300)
  }

  //% blockId=newland_init_pw block="Newland init powerbrick|Port %port"
  //% group="Basic" weight=99
  export function newland_init_pw(port: SerialPorts): void {
    newland_init(PortSerial[port][0], PortSerial[port][1])
  }

  //% blockId=newland_lcd_direction block="Newland LCD Dir%dir"
  //% group="Basic" weight=98
  export function newland_lcd_direction(dir: LcdDirection): void {
    let str = `K6 ${dir}`
    serial.writeLine(str)
    basic.pause(100)
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
      handler: (btnA: number, btnB: number, btnEnter: number) => void
  ): void {
    btnEvt = handler
  }

  /**
   * @param name savepath; eg: name.jpg
   */
  //% blockId=newland_screenshot block="Newland Screenshot %name"
  //% group="Basic" weight=95
  export function newland_screenshot(name: string): void {
    let str = `K2 ${name}`
    serial.writeLine(str)
  }

  /**
   * @param name jpeg to display; eg: name.jpg
   */
  //% blockId=newland_display block="Newland Display %name"
  //% group="Basic" weight=94 blockGap=40
  export function newland_display(name: string): void {
    let str = `K1 ${name}`
    serial.writeLine(str)
  }

  /*//% blockId=newland_reset_cls block="Newland Reset Classifier"
  //% group="Classifier" weight=90
  export function newland_reset_cls(): void {
    let str = `K40`
    serial.writeLine(str)
  }*/

  /**
   * @param tag tag index; eg: cat
   */
  /*//% blockId=newland_addtag block="Newland Add Tag %tag"
  //% group="Classifier" weight=89
  export function newland_addtag(tag: string): void {
    let str = `K41 ${tag}`
    serial.writeLine(str)
  }*/

  //% blockId=newland_run block="Newland Run Classifer"
  //% group="Classifier" weight=88
  export function newland_run(): void {
    let str = `K42`
    serial.writeLine(str)
    // asyncWrite(str, 42)
  }

  //% blockId=newland_classified block="on Identified"
  //% group="Classifier" weight=87 draggableParameters=reporter
  export function newland_classified(handler: (classId: string) => void) {
    classifierEvt = handler
  }

  /**
   * @param path json to save; eg: class.json
   */
  /*//% blockId=newland_cls_save block="Newland Save Classifier %path"
  //% group="Classifier" weight=86
  export function newland_cls_save(path: string): void {
    let str = `K43 ${path}`
    serial.writeLine(str)
  }*/

  /**
   * @param path json to save; eg: class.json
   */
  /*//% blockId=newland_cls_load block="Newland Load Classifier %path"
  //% group="Classifier" weight=85
  export function newland_cls_load(path: string): void {
    let str = `K44 ${path}`
    serial.writeLine(str)
  }*/

}



