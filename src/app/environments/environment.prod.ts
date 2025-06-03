export const environment = {
    production: true,
    baseURL: process.env['BASE_URL_PROD'],
    stripePublicKey: process.env['STRIPE_PUBLIC_KEY'],
    cryptoServiceKey: process.env['CRYPTO_KEY']
}