import { IpcRenderer } from 'electron';

declare global {
    interface Window {
        electron: {
            ReadContent: (filePath: string) => Promise<string>;
            WriteContent: (filePath:string, content: string) => void;
            // 添加其他需要的 Electron API
        };
    }
}