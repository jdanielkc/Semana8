// let's increase the browser window size when running headlessly
// this will produce higher resolution images and videos
// https://on.cypress.io/browser-launch-api
module.exports = (on, config) => {
    const width = 1920;
    const height = 1080;

    console.log('setting the browser window size to %d x %d', width, height);

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
            launchOptions.args.push(`--window-size=${width},${height}`);
            launchOptions.args.push('--force-device-scale-factor=1');
        }

        if (browser.name === 'electron' && browser.isHeadless) {
            launchOptions.preferences.width = width;
            launchOptions.preferences.height = height;
        }

        if (browser.name === 'firefox' && browser.isHeadless) {
            launchOptions.args.push(`--width=${width}`);
            launchOptions.args.push(`--height=${height}`);
        }

        return launchOptions;
    });
};