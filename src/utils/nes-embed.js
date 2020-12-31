import jsnes from "jsnes";
import Taro from "@tarojs/taro";
import ab2str from "arraybuffer-to-string";

let scale = 1,
  rafId = null;

let canvas_ctx, canvas, canvas_id, image;
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

let nes;

function createNes() {
  // 资源回收
  if (rafId !== null) {
    canvas.cancelAnimationFrame(rafId);
  }

  // 创建资源
  nes = new jsnes.NES({
    onFrame: function (framebuffer_24) {
      for (let i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
    },
    onAudioSample: function (l, r) {
      audio_samples_L[audio_write_cursor] = l;
      audio_samples_R[audio_write_cursor] = r;
      audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
    },
  });
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

function nes_init(_callback, canvas_res) {
  createNes();

  let width = canvas_res[0].width;
  let height = canvas_res[0].height;

  canvas = canvas_res[0].node;
  canvas_ctx = canvas.getContext('2d');

  canvas.width = width * scale;
  canvas.height = height * scale;

  image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  canvas_ctx.fillStyle = "black";
  canvas_ctx.fillRect(0, 0, width, height);

  let buffer = new ArrayBuffer(image.data.length);
  framebuffer_u8 = new Uint8ClampedArray(buffer);
  framebuffer_u32 = new Uint32Array(buffer);

  // Setup audio.
  // let audio_ctx = Taro.createInnerAudioContext();
  // let script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
  // script_processor.onaudioprocess = audio_callback;
  // script_processor.connect(audio_ctx.destination);
  _callback();
}

function nes_boot(rom_data) {
  nes.loadROM(rom_data);
  rafId = canvas.requestAnimationFrame(onAnimationFrame);
}

// ======================================================================
export function loadData(_canvas_id, _scale, rom_data) {
  scale = _scale;
  canvas_id = _canvas_id;
  Taro.createSelectorQuery()
    .select('#' + canvas_id)
    .fields({
      node: true,
      size: true,
    }).exec(nes_init.bind(this, () => {
    nes_boot(rom_data);
  }));
}

export function loadUrl(_canvas_id, _scale, rom_data_url) {
  Taro.request({
    url: rom_data_url, method: 'GET', responseType: 'arrayBuffer',
    header: {
      'content-type': 'application/text'
    }
  }).then(({data}) => {
    let newData = ab2str(data, 'binary');
    loadData(_canvas_id, _scale, newData);
  }).catch(r => console.warn('下载rom错误', r));
}

export function buttonDown(player, buttonKey) {
  nes.buttonDown(player, buttonKey);
}

export function buttonUp(player, buttonKey) {
  nes.buttonUp(player, buttonKey);
}

function keyboard(callback, event) {
  var player = 1;
  switch (event.keyCode) {
    case 38: // UP
      callback(player, jsnes.Controller.BUTTON_UP);
      break;
    case 40: // Down
      callback(player, jsnes.Controller.BUTTON_DOWN);
      break;
    case 37: // Left
      callback(player, jsnes.Controller.BUTTON_LEFT);
      break;
    case 39: // Right
      callback(player, jsnes.Controller.BUTTON_RIGHT);
      break;
    case 65: // 'a' - qwerty, dvorak
    case 81: // 'q' - azerty
      callback(player, jsnes.Controller.BUTTON_A);
      break;
    case 83: // 's' - qwerty, azerty
    case 79: // 'o' - dvorak
      callback(player, jsnes.Controller.BUTTON_B);
      break;
    case 9: // Tab
      callback(player, jsnes.Controller.BUTTON_SELECT);
      break;
    case 13: // Return
      callback(player, jsnes.Controller.BUTTON_START);
      break;
    default:
      break;
  }
}
