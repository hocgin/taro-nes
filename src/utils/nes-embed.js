import jsnes from "jsnes";
import Taro from "@tarojs/taro";
import ab2str from "arraybuffer-to-string";
import Utils from "@/utils/utils";

let scale = 1;
let rafId = null;
let fpsInterval = null;

let canvas_ctx, canvas = null, canvas_id, image;
let SCREEN_WIDTH = 256;
let SCREEN_HEIGHT = 240;
let FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;
let framebuffer_u8, framebuffer_u32;

const AUDIO_BUFFERING = 512;
const SAMPLE_COUNT = 4 * 1024;
let SAMPLE_MASK = SAMPLE_COUNT - 1;
let audio_samples_L = new Float32Array(SAMPLE_COUNT);
let audio_samples_R = new Float32Array(SAMPLE_COUNT);
let audio_write_cursor = 0, audio_read_cursor = 0;

let nes = new jsnes.NES({
  onFrame: function (framebuffer_24) {
    for (let i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
  },
  onAudioSample: function (l, r) {
    audio_samples_L[audio_write_cursor] = l;
    audio_samples_R[audio_write_cursor] = r;
    audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
  },
});

export function recycle() {
  // 资源回收
  if (rafId !== null && canvas !== null) {
    console.debug('回收上次资源 - 开始');
    canvas.cancelAnimationFrame(rafId);
    console.debug('回收上次资源 - 结束');
  }
  if (fpsInterval) {
    clearInterval(fpsInterval);
  }

  // 创建资源
  // console.debug('初始化新游戏机 - 开始');
  // console.debug('初始化新游戏机 - 完成');
}

function onAnimationFrame() {
  rafId = canvas.requestAnimationFrame(onAnimationFrame);
  image.data.set(framebuffer_u8);
  canvas_ctx.putImageData(image, 0, 0);
  nes.frame();
}

function audio_remain() {
  return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event) {
  let dst = event.outputBuffer;
  let len = dst.length;

  // Attempt to avoid buffer underruns.
  if (audio_remain() < AUDIO_BUFFERING) nes.frame();

  let dst_l = dst.getChannelData(0);
  let dst_r = dst.getChannelData(1);
  for (let i = 0; i < len; i++) {
    let src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
    dst_l[i] = audio_samples_L[src_idx];
    dst_r[i] = audio_samples_R[src_idx];
  }

  audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

/**
 * 重置画布
 * @param _canvas_id
 * @param _scale
 * @param _width
 * @param _height
 * @returns {Promise<unknown>}
 */
export function refreshCanvas(_canvas_id, _scale, _width, _height) {
  canvas_id = _canvas_id;
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery()
      .select('#' + canvas_id)
      .fields({
        node: true,
        size: true,
      }).exec((res) => {
      let canvas_res = res[0];

      let width = _width;
      let height = _height;
      scale = _scale;
      canvas = canvas_res.node;

      canvas_ctx = canvas.getContext('2d');
      canvas.width = width * _scale;
      canvas.height = height * _scale;

      image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      resolve();
    });
  });

}

// 初始化游戏机
function nes_init(canvas_res) {
  recycle();
  let width = canvas_res[0].width;
  let height = canvas_res[0].height;

  return new Promise((resolve, reject) => {
    console.debug('初始化屏幕 - 开始');
    refreshCanvas(canvas_id, scale, width, height).then(() => {
      console.debug('初始化屏幕 - 完成');
      // 画黑幕
      canvas_ctx.fillStyle = '#000';
      canvas_ctx.fillRect(0, 0, width, height);
      canvas_ctx.fillStyle = '#fff';

      // 画LOGO
      canvas_ctx.textAlign = 'center';
      canvas_ctx.textBaseline = 'middle';
      let tips = "游戏加载中..";
      console.log(width, height);
      canvas_ctx.fillText(tips, width / 2, height / 2);

      let buffer = new ArrayBuffer(image.data.length);
      framebuffer_u8 = new Uint8ClampedArray(buffer);
      framebuffer_u32 = new Uint32Array(buffer);

      console.debug('初始化音频 - 开始');
      // Setup audio.
      // let audio_ctx = Taro.createInnerAudioContext();
      // let script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
      // script_processor.onaudioprocess = audio_callback;
      // script_processor.connect(audio_ctx.destination);
      console.debug('音频初始化 - 完成');
      resolve();
    });
  });
}

function nes_boot(rom_data) {
  console.debug('启动游戏机 - 开始');
  nes.loadROM(rom_data);
  rafId = canvas.requestAnimationFrame(onAnimationFrame);
  console.debug('启动游戏机 - 完成');
}

// ======================================================================
export function loadData(_canvas_id, _scale) {
  scale = _scale;
  canvas_id = _canvas_id;
  clearInterval(fpsInterval);
  return new Promise((resolve, reject) => {
    Taro.createSelectorQuery()
      .select('#' + canvas_id)
      .fields({node: true, size: true,})
      .exec((res) => nes_init(res).then(resolve).catch(reject));
    fpsInterval = setInterval(() => {
      console.debug(`FPS: ${nes?.getFPS()}`);
    }, 1000);
  });
}

export function loadUrl(_canvas_id, _scale, rom_data_url) {
  console.debug('从网络加载ROM - 开始');
  loadData(_canvas_id, _scale).then(() => {
    Taro.request({
      url: rom_data_url, method: 'GET', responseType: 'arrayBuffer',
      header: {
        'content-type': 'application/text'
      }
    }).then(({data}) => {
      // nes_boot(Utils.ab2str(data))
    }).catch(r => console.warn('下载rom错误', r));
  });
}

export function buttonDown(player, buttonKey) {
  nes.buttonDown(player, buttonKey);
}

export function buttonUp(player, buttonKey) {
  nes.buttonUp(player, buttonKey);
}

export function loadGameProgress(data) {
  nes.fromJSON(data);
}

export function saveGameProgress() {
  return nes.toJSON();
}

export function reloadROM() {
  nes.reloadROM();
}
