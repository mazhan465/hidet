import { IpcRenderer } from 'electron';

declare global {
    interface Window {
        electron: {
            ReadContent: (filePath: string) => Promise<string>;
            WriteContent: (filePath: string, content: string) => void;
            Listen: (channel: string, func: (...args: any[]) => void) => void;
            GetFilePath: () => Promise<string>;
            SetFilePath: (filePath: string) => void;
            // 添加其他需要的 Electron API
        };
    }
}