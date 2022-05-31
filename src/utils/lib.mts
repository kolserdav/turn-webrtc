export const log = (type: 'info' | 'warn' | 'error', text: string, data?: any) => {
  const time = new Date();
  console.log('[' + time.toLocaleTimeString() + '] ' + text);
};
