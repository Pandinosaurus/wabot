// Modules to install separately
const LexicaArt  = require('lexicaart');
const ConvertBase64 = require('../lib/convertBase64');
const translate = require('@vitalets/google-translate-api');

const defaultConfig = {
    idChat: '',
    apiKey: '',
    search: '',
    usePython3: true,
    language: 'en',
    debug: false,
    messageError: '*Ooops, an error occurred while trying to make image, try again later*',
}
/**
 * Plugin that allows you to send different memes from subreddits in English and Spanish
 * @function aiimage
 * @memberof Plugins
 * @param {string} idChat - Chat id to send the new image to
 * @param {string} apiKey - API key to make image from dreamstudio
 * @param {string} search - Text to make image
 * @param {string} language - Language
 * @param {string} messageError - Message to send in case of error
 */
module.exports = {
	/**
    * Id - Name of the plugin to use
    * @property {string}  id - Name of the plugin to use
    */
    id: 'aiimage',
    plugin(_args) {
        const _this = this;
        const args = this.mergeOpts(defaultConfig, _args);
        if (args.idChat !== '' && args.search !== '') {
            args.language = args.language.toLowerCase();
            const lexicaart = new LexicaArt();

            translate(args.search.toLowerCase(), { 'to': args.language })
            .then(translation => {
                lexicaart.search(translation.text)
                .then(async (images) => {
                    let image = images[Math.floor(Math.random()*images.length)];
                    const convert64 = new ConvertBase64();
                    const image64 = await convert64.convert(image.images[Math.floor(Math.random()*image.images.length)].url)
                    _this.sendImage({
                        "idChat": args.idChat, 
                        "caption": image.prompt,
                        "file": image64
                    });
                })
                .catch(err => {
                    if (args.debug) console.error(err);
                    _this.sendMessage({
                        "idChat": args.idChat, 
                        "message": args.messageError
                    });
                });
            })
			.catch(err => {
                if (args.debug) console.error(err);
				_this.sendMessage({
                    "idChat": args.idChat, 
                    "message": args.messageError
                });
			});
        }
    }
};
