interface Ioption {
  url: URL | string;
  onopen?: (e: Event) => void;
  onmessage?: (e: Event) => void;
  onclose?: (e: Event) => void;
  onerror?: (e: Event) => void;
  audio?: string;
}

class SocketClient {
  ws: WebSocket;
  constructor(public option: Ioption) {
    this.option = Object.assign(
      {
        audio: require("../assets/media/alarm.mp3"),
        onopen: () => {},
        onmessage: () => {},
        onclose: () => {},
        onerror: () => {},
      },
      option
    );
  }
  init() {
      this.client()
  }
  //连接
  client(callback?: () => void) {
    if ("WebSocket" in window) {
      this.ws = new WebSocket(this.option.url); //创建WebSocket连接
      this.ws.onopen = (e) => {
        console.log("WebSocket连接成功");
        this.option.onopen(e);
        callback && callback();
      };
      this.ws.onmessage = (e) => {
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据

        this.option.onmessage && this.option.onmessage(e);
      };
      this.ws.onclose = (e) => {
        //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
        console.log("对话连接已关闭");
        this.option.onclose && this.option.onclose(e);
      };
      this.ws.onerror = (e) => {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log("出错了", e);
        this.option.onerror && this.option.onerror(e);
      };
    } else {
      console.log("您的浏览器不支持WebSocket");
    }
  }
  //关闭
  close() {
    if (this.ws.readyState === 1 && this.ws.url === this.option.url) {
      this.ws.close();
    }
  }
  //发送数据
  send(data: string | Blob | ArrayBufferLike | ArrayBufferView) {
    switch (this.ws.readyState) {
      case 0:
        console.log("连接尚未建立，发送数据失败");
        break;
      case 1:
        this.ws.send(data);
        break;
      case 2:
        console.log("连接正在进行关闭，发送数据失败");
        break;
      case 3:
        console.log("连接已关闭，发送数据失败");
        this.reconnect(() => {
          this.ws.send(data);
        });
        break;
    }
  }
  //重新连接
  reconnect(callback: () => void) {
    console.log("正在尝试重新连接");
    setTimeout(() => {
      this.client(callback);
    }, 1000);
  }
  //告警
  alarm() {
    let audio: HTMLAudioElement = new Audio();
    let dom = document.querySelector("#alertAudio");
    if (dom) {
      document.body.removeChild(dom);
    }
    audio.src = this.option.audio;
    audio.id = "alertAudio";
    document.body.appendChild(audio);
    audio.addEventListener("loadeddata", function () {
      console.log("音频加载成功");
      audio.play();
    });
  }
}
