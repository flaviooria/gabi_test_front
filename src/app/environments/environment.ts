export const environment = {
    production: false,
    baseURL: process.env['BASE_URL_LOCAL'],
    stripePublicKey: process.env['STRIPE_PUBLIC_KEY'],
    cryptoServiceKey: process.env['CRYPTO_KEY']
}