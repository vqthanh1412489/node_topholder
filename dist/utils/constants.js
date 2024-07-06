"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERCENT_TRACKING_ALLET_CHECK = exports.PERCENT_COLD_WALLET_CHECK = exports.PERCENT_HOT_WALLET_CHECK = exports.COLUMN_BEGIN_DATA = exports.googleSheetSpreadsheetId = exports.googleSheetCredentials = exports.myTokens = void 0;
const enums_1 = require("./enums");
const my_token_m_1 = require("../models/my_token_m");
const address_by_chain_m_1 = require("../models/address_by_chain_m");
exports.myTokens = [
    // new MyTokenM({
    //     name: 'AMP',
    //     chains: [
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Ethereum,
    //             address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
    //         }),
    //     ],
    //     minBalance: 1000000,
    // }),
    new my_token_m_1.MyTokenM({
        name: 'USDT',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Avalanche,
                address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Tron,
                address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            }),
        ],
        minBalance: 50000000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'USDC',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.ArbitrumOne,
                address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Avalanche,
                address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Base,
                address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Polygon,
                address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Optimism,
                address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Tron,
                address: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8',
            }),
        ],
        minBalance: 10000000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'FDUSD',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xc5f0f7b66764f6ec8c8dff7ba683102295e16409',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.BSC,
                address: '0xc5f0f7b66764f6ec8c8dff7ba683102295e16409',
            }),
        ],
        minBalance: 10000000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'APE',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Polygon,
                address: '0xb7b31a6bc18e48888545ce79e83e06003be70930',
            }),
        ],
        minBalance: 30000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'HOOK',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.BSC,
                address: '0xa260e12d2b924cb899ae80bb58123ac3fee1e2f0',
            }),
        ],
        minBalance: 20000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'C98',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xae12c5930881c53715b369cec7606b70d8eb229f',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.BSC,
                address: '0xaec945e04baf28b135fa7c640f624f8d90f1c3a6',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Polygon,
                address: '0x77f56cf9365955486b12c4816992388ee8606f0e',
            }),
        ],
        minBalance: 100000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'RPL',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Polygon,
                address: '0x7205705771547cf79201111b4bd8aaf29467b9ec',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.ArbitrumOne,
                address: '0xb766039cc6db368759c1e56b79affe831d0cc507',
            }),
        ],
        minBalance: 5000,
    }),
    new my_token_m_1.MyTokenM({
        name: 'MEME',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74',
            }),
        ],
        minBalance: 500000,
    }),
    // new MyTokenM({
    //     name: 'PDA',
    //     chains: [
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Ethereum,
    //             address: '0x0d3cbed3f69ee050668adf3d9ea57241cba33a2b',
    //         }),
    //     ],
    //     minBalance: 5000,
    // }),
    // new MyTokenM({
    //     name: 'MAVIA',
    //     chains: [
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Ethereum,
    //             address: '0x24fcfc492c1393274b6bcd568ac9e225bec93584',
    //         }),
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Base,
    //             address: '0x24fcfc492c1393274b6bcd568ac9e225bec93584',
    //         }),
    //     ],
    //     minBalance: 1000,
    // }),
    new my_token_m_1.MyTokenM({
        name: 'CRV',
        chains: [
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Ethereum,
                address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.ArbitrumOne,
                address: '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Polygon,
                address: '0x172370d5cd63279efa6d502dab29171933a610af',
            }),
            new address_by_chain_m_1.AddressByChainM({
                eNetwork: enums_1.ENetwork.Optimism,
                address: '0x0994206dfe8de6ec6920ff4d779b0d950605fb53',
            }),
        ],
        minBalance: 50000,
    }),
    // new MyTokenM({
    //     name: '0x0',
    //     chains: [
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Ethereum,
    //             address: '0x5a3e6A77ba2f983eC0d371ea3B475F8Bc0811AD5',
    //         }),
    //     ],
    //     minBalance: 10000,
    // }),
    // new MyTokenM({
    //     name: 'ARB',
    //     chains: [
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Ethereum,
    //             address: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1',
    //         }),
    //         new AddressByChainM({
    //             eNetwork: ENetwork.ArbitrumOne,
    //             address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    //         }),
    //     ],
    //     minBalance: 100000,
    // }),
    // new MyTokenM({
    //     name: 'WLD',
    //     chains: [
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Ethereum,
    //             address: '0x163f8c2467924be0ae7b5347228cabf260318753',
    //         }),
    //         new AddressByChainM({
    //             eNetwork: ENetwork.Optimism,
    //             address: '0xdc6ff44d5d932cbd77b52e5612ba0529dc6226f1',
    //         }),
    //     ],
    //     minBalance: 5000,
    // }),
];
exports.googleSheetCredentials = {
    type: "service_account",
    project_id: "flutterarkham",
    private_key_id: "219694212833b565063839cfa276ca5ae86fc21b",
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeMEA2zRLx5WMa\np1XbK8IfNB3iemfXpCrdYyEVTPa1xn/X52jFrI9DFa8jo/PO5epWReqNVLXx7jP5\n2ULw0YnWiGZQtvb0X+ZFpFI91pxQke5ugAmx6sY/eV1QjoRYD0Lje0FgOIU9s0Rt\nggIvg/FwcnrSNcU3wjsLXRy5cwDS7E8vULiX/BGkP6wfq3WtWIiLSNzRTlqsb5w9\niu6NjOxfePJ+WjyE82i3JxQhSD9l8IVrdfmEY8oD7HS/iT+q1hqkxJhn/QL+Vm+F\nuEDVnpz9EEbWv7snyLjuchDn9mclafcaZB0MOTVhsjUZGTBcG/xevq3Tf7Qf48yU\n7vPhFtwDAgMBAAECggEAQl9ochX1vv1KaeKQSZfAqasKZv6JF5fQTHfNZ8yVL4wM\nFCEKevZ+Xd15UPD32XXqryxCz+4dMVeLA2g/iB/DP/qXQ4Khd8PNMKdTwpKLn9q7\nOi4K41XovLVFjAlgSjqNDDmpIqBUd6ECMxh7pkgsQ8wk8JKTH2Qltgzpgn5YeCb5\nWflsX3ZYCXNTmoA/iFLd0mFGP9gfFq3UPNKwV66mr8eRvd3vemoUtGFoBRPw62B5\ndfAefuXoSYUFUcmqrYH6hKOAzrD8ulRrP2/Bw1bj9G1sYzAxzviK9f+JiT1r82BH\npaDI0tcCmEq4JcuG7f1Vfq2W+VWAzmGo5bN5XwmAUQKBgQDabORpHJap43eAI8Ze\nycrAhe6x4N7tOhYR/K6FgsXlKIDZP6uzsVQJ3IWA4WlCW5R7PX+oZnzMBL0wG7YL\npE+vp1dq6JUzUmNGS5i/mDNa79TYReXX8JfPGhVgFC8BQWSzQuwUbHpOtXSbwL3l\nQIHPnpxbst1lijiL5hDRELgLPQKBgQC5Zp8etY6PIqItmwAM2P4q4QiuytbGoHY5\nZrl4HtcOYRWKYeTyZWroq+noioRiw+1ukn4yvSbFjDcnrdVIxnyDGLQyooYcUOiD\nvOp73gZnDhgtcpbGAmH+wLuBeHWz+T6kEXu8Gej3xaTgonJf91j5V4T4aPKmIoC2\nt+BJLx34PwKBgQDBsutjo2ygwA2LXy5dhMn+rUceC3LmISrNTK1fzLa+H4sUHXig\n49LI4/yobD0yEZC9Ma5xomFtc45qiUiJTm80MEw/jH4zgw5ymjudPNXeAO1Z1bKc\nKsoVaOYny/5bOKiap/A/tGtKPXRpYyWDlg8IFXpHf3kCwO6gcafcHt13aQKBgDrc\nqPIwBEXPYhwGlPp/PhrQ/Ve5UH0ZXs+UnJfVesO28QbRU8Xdixa51fadW7Cbsdsk\nKWrkgNXBUZWIbCnB0rAwfK2Cyf9ddKS2qt+Ouwum/ugW9GWDRieCe0V8wCnWnRur\n7VPoCf34QwOKr7NmLVpkffP8JeW3GJRqRowVqHczAoGAYY95svja/QTPJGJwXKG6\nj3t5K2wocjGfuEgsjet1oVea2/LjaMoB9R8ehcbFMi81EZXMLQRe/Lwm9mMif99t\nfI2dukwVsY+J9xreYHury5hVdObVZozexg5LSUjjvf5R0WSKQCtiaFwMxW64UTDB\nmZ0j93rUaxfMN0CgSDlN1vU=\n-----END PRIVATE KEY-----\n`,
    client_email: "flutterarkham1@flutterarkham.iam.gserviceaccount.com",
    client_id: "112057164321141817305",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/flutterarkham1%40flutterarkham.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};
exports.googleSheetSpreadsheetId = '1MLn8hD0CY-s13brglra_KBOOiuDIfuL2CvQ6m4wM78I'; // DATA
// export const googleSheetSpreadsheetId = '1cp-LsXx02w8mWiGGJhnH-ETzsyqppmjw_3T5kto2cGE'; // DATA copy
exports.COLUMN_BEGIN_DATA = 5;
exports.PERCENT_HOT_WALLET_CHECK = 15;
exports.PERCENT_COLD_WALLET_CHECK = 15;
exports.PERCENT_TRACKING_ALLET_CHECK = 15;
//# sourceMappingURL=constants.js.map