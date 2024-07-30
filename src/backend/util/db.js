"use strict";
import { JSONFileSyncPreset } from "lowdb/node";
import path from "path";
import fs from "fs-extra";
import { remote, app } from "electron";

export default {
  data() {
    return {
      db_util: null,
      file_json: "",
    };
  },
  async init() {
    // if (process.env.NODE_ENV !== 'development') {
    //     global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
    // }

    // if (process.env.DEBUG_ENV === 'debug') {
    //     global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
    // }

    let APP = process.type === "renderer" ? remote.app : app;
    let STORE_PATH = APP.getPath("userData");
    // let STORE_PATH = "/Users/sanjin/work/h5/vue/thief-book/static"

    if (process.type !== "renderer") {
      if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH);
      }
    }

    this.file_json = path.join(STORE_PATH, "/hidet_data.json");
    this.db_util = JSONFileSyncPreset(this.file_json, { cfg: [] });
  },
  get(key) {
    this.db_util.read();
    const { cfg } = this.db_util.data;
    const line = cfg.find((p) => p.key === key);
    if (line) {
      return line.val;
    }
    return undefined;
  },
  set(key, value) {
    this.db_util.update(({ cfg }) => {
      let objToUpdate = cfg.find((obj) => obj.key === key);

      if (objToUpdate) {
        // 如果找到了对应的对象，则更新其 val 属性
        objToUpdate.val = value;
      } else {
        // 如果没有找到对应的对象，则新增一个对象到数组中
        cfg.push({ key: key, val: value });
      }
    });
    this.db_util.write();
  },
};
