import * as pathUtil from 'path'
import { DirectoryTags, Site, LinkAliasMap, RawLinkMap } from '../types/app'

export const cachePath = pathUtil.join(__dirname, '..', '.app')
export const linksPath = pathUtil.join(__dirname, '..', '.app', 'links.json')
export const pagesPath = pathUtil.join(__dirname, '..', 'pages')
export const pagesGlob = '**/*.mdx'

const amazonCode = 'balupton07-20'

export const text: { [key: string]: () => any } = {
	'stackoverflow-reputation': () => 0,
	'github-projects': () => 0,
	'github-contributions': () => 0,
	'github-stars': () => 0,
	'github-watch-rank-australia-javascript': () => 0,
	'github-watch-rank-australia': () => 0,
	'github-followers': () => 0
}

export const directoryTags: DirectoryTags = {
	notes: ['note'],
	blog: ['post']
}

export const site: Site = {
	url: 'https://balupton.com',
	title: 'Benjamin Lupton',
	author: 'Benjamin Lupton',
	heading: 'Benjamin Lupton',
	email: 'b@lupton.cc',
	description:
		'Website of Benjamin Lupton. Founder of Bevry, DocPad and History.js. Web developer for 10 years. Now a trader. Studies psychology and philosophy.',
	tags: 'balupton, benjamin lupton, lupton, coffeescript, node.js, javascript, history.js, html, docpad, nowpad, jquery, css3, ruby, git, nosql, cson, html5 history api, ajax, html, web development, web design, nlp, git, neuro-linguistic programming, programming, hacking, hackathon, aloha editor, contenteditable, hallo, jekyll, entp, inventor, web 2.0'.split(
		/\s*,\s*/
	),
	menu: ['home', 'projects', 'blog']
}

export const links: RawLinkMap = {
	// Feeds
	feedburner: {
		url: 'http://feeds.feedburner.com/balupton.atom',
		text: 'Blog Posts',
		tags: ['feed']
	},
	feedmedium: {
		url: 'https://medium.com/feed/@balupton',
		text: 'Medium Posts',
		tags: ['feed']
	},

	// Menu
	home: {
		url: '/',
		title: 'View Homepage',
		pageTitle: "Benjamin Lupton's Website",
		text: 'home'
	},
	projects: {
		url: '/projects',
		title: 'View Projects',
		pageTitle: "Benjamin Lupton's Projects",
		text: 'projects'
	},
	blog: {
		url: '/blog',
		title: 'View Articles',
		pageTitle: "Benjamin Lupton's Blog",
		text: 'blog'
	},

	// Referrals
	milanote: {
		text: 'Milanote',
		url: 'https://www.milanote.com/refer/rczFuD0XCFHIws2Wir',
		title: 'Use Milanote to organise your thoughts',
		color: '#f4511c',
		tags: ['referral']
	},
	gunnar: {
		text: 'Gunnar Glasses',
		url: 'http://www.gopjn.com/t/RkFMSURHR0FFTEhLS0ZBTURNTUs',
		title:
			'Use Gunnar Glasses to work on the computer all day without eyestrain',
		color: '#d03238',
		tags: ['referral']
	},
	setapp: {
		text: 'Setapp',
		url: 'https://go.setapp.com/invite/uolmpyip',
		title:
			'Use Setapp to gain access to dozens of high quality mac apps for a low monthly price',
		color: '#00024f',
		tags: ['referral']
	},
	airtable: {
		text: 'Airtable',
		url: 'https://airtable.com/invite/r/pBIrCHfX',
		title: 'Use Airtable to create powerful data rich spreadsheets',
		color: '#2d7ff9',
		tags: ['referral']
	},
	safetywing: {
		text: 'SafetyWing',
		url: ' https://www.safetywing.com/?referenceID=24733581',
		title: 'Use SafetyWing for worldwide travel insurance',
		color: '#58c5c7',
		tags: ['referral']
	},
	minds: {
		text: 'Minds',
		url: 'https://www.minds.com/balupton?referrer=balupton',
		title: 'Use Minds as an uncensored Facebook',
		color: '#607d8b',
		tags: ['referral']
	},
	allplants: {
		text: 'allplants',
		url: 'http://i.refs.cc/QeyDyNyx?u=1530661477060',
		title: 'Use allplants to get vegan meals delivered to your door',
		color: '#000',
		tags: ['referral']
	},
	quadlock: {
		text: 'Quad Lock',
		url: 'http://quadlock.refr.cc/23DDGN7',
		title: 'Use Quad Lock cases to protect your phone and mount it to anything',
		color: '#0070bc',
		tags: ['referral']
	},
	purse: {
		text: 'Purse',
		url: 'https://purse.io/?_r=nPY6sE',
		title:
			'Use Purse to purchase from Amazon with cryptocurrency at a 15% discount',
		color: '#3b4a54',
		tags: ['referral']
	},
	honey: {
		text: 'Honey',
		url: 'https://joinhoney.com/ref/c1ra4wf',
		title:
			'Use Honey to automatically apply discount coupons when you shop online',
		color: '#ff7e27',
		tags: ['referral']
	},
	bookingdotcom: {
		text: 'Booking.com',
		url: 'https://www.booking.com/s/27_8/b0lupt17',
		title: 'Use Booking.com to book accomodation when traveling',
		color: '#07c',
		tags: ['referral']
	},
	transferwiseborderless: {
		text: 'TransferWise Borderless',
		url:
			'https://transferwise.evyy.net/c/1328573/26105/985?u=https%3A%2F%2Ftransferwise.com%2Fborderless%2F',
		title:
			'Use TransferWise Borderless to have multicurrency bank accounts all around the world',
		color: '#223049',
		tags: ['referral']
	},
	signals: {
		text: 'Signals',
		url: 'https://signals.network/join/122653',
		title: 'Use Signals to share trading strategies',
		color: 'rgb(184, 117, 225)',
		tags: ['referral']
	},
	gatsby: {
		text: 'Gatsby',
		url: 'https://www.trygatsby.com/?refcode=20cee659527b',
		title: 'Use Gatsby to trade options',
		color: '#F76366',
		tags: ['referral']
	},
	stake: {
		text: 'Stake',
		url: 'https://stake.com.au?refer=benjaminl259',
		title: 'Use Stake to invest in USA companies (Australia only)',
		color: '#181818',
		tags: ['referral']
	},
	coinstats: {
		text: 'Coinstats',
		url: 'https://coinstats.app.link/M4yHl2vwjO',
		title: 'Use coinstats to track your cryptocurrency portfolio',
		color: '#F56945',
		tags: ['referral']
	},
	coinjar: {
		text: 'CoinJar',
		url: 'https://www.coinjar.com/_ref/@balupton',
		title:
			'Use CoinJar to exchange, send and receive cryptocurrency in Australia',
		color: '#1F4F7F',
		tags: ['referral']
	},
	strongcoin: {
		text: 'StrongCoin',
		url: 'https://strongcoin.com/?ref=1BtRZY7kfJchkzKxs19MyYiQ3ampuQpHEQ',
		title: 'Use StrongCoin as your cryptocurrency wallet',
		color: '#313840',
		tags: ['referral']
	},
	changelly: {
		text: 'Changelly',
		url: 'https://changelly.com/?ref_id=51f081f500f5',
		title: 'Use Changelly to convert your cryptocurrencies',
		color: '#10d078',
		tags: ['referral']
	},
	changenow: {
		text: 'ChangeNOW',
		url: 'https://changenow.io?link_id=4861c40d846b4f',
		title: 'Use ChangeNOW to convert your cryptocurrencies',
		color: '#3bee81',
		tags: ['referral']
	},
	coinex: {
		text: 'CoinEx',
		url: 'https://www.coinex.com/account/signup?refer_code=eb7ra',
		title: 'Use CoinEx to convert your cryptocurrencies',
		color: '#52cbca',
		tags: ['referral']
	},
	bestrate: {
		text: 'BestRate',
		url:
			'https://bestrate.org/ico-payment-tools?ref=e112faab88bb14fe4e8e92edcdab3ffa',
		title: 'Use BestRate to convert your cryptocurrencies',
		color: '#f9cc33',
		tags: ['referral']
	},
	heleum: {
		text: 'Heleum',
		url: 'https://app.heleum.com/r/cbdc906a6e',
		title: 'Use Heleum to autoinvest in cryptocurrencies',
		color: '#333333',
		tags: ['referral']
	},
	voyager: {
		text: 'Voyager',
		url:
			'https://www.investvoyager.com/?campaignId=nAHw2Rl4_mpooRv_Hs8wNxMBxAU&referralCode=DAKh4E5&code=GETBTC25',
		title: 'Use Voyager to trade cryptocurrency',
		color: '##3831ab',
		tags: ['referral']
	},
	bitmex: {
		text: 'BitMEX',
		url: 'https://www.bitmex.com/register/1Gn7Rt',
		title: 'Use BitMEX to trade cryptocurrency',
		color: '#575b5c',
		tags: ['referral']
	},
	exmo: {
		text: 'Exmo',
		url: 'https://exmo.com/?ref=561025',
		title: 'Use Exmo to trade cryptocurrency',
		color: '#347ffb',
		tags: ['referral']
	},
	coinfalcon: {
		text: 'Coinfalcon',
		url: 'https://coinfalcon.com/?ref=CFJSAHMWFPYV',
		title: 'Use Coinfalcon to trade cryptocurrency',
		color: '#1ab6ff',
		tags: ['referral']
	},
	cobinhood: {
		text: 'Cobinhood',
		url:
			'https://cobinhood.com?referrerId=b7c14dfb-20cb-4bb0-9398-8e5a89d01755',
		title: 'Use Cobinhood to trade cryptocurrency',
		color: '#13be99',
		tags: ['referral']
	},
	workfrom: {
		text: 'Workfrom',
		url: 'http://wkfr.co/r/awesome-34501',
		title: 'Use Workfrom to find places you can work from with your laptop',
		color: '#484848',
		tags: ['referral']
	},
	digitalocean: {
		text: 'DigitalOcean',
		url: 'https://m.do.co/c/713bd82265f6',
		title: 'Use DigitalOcean to host your apps in the cloud',
		color: '#0069ff',
		tags: ['referral']
	},
	onedrive: {
		text: 'OneDrive',
		url: 'https://onedrive.live.com?invref=40826b4caaef6e4e&invscr=90',
		title: 'Use OneDrive tosync your local files with the cloud',
		color: '#0078d7',
		tags: ['referral']
	},
	earn: {
		text: 'Earn.com',
		url: 'https://earn.com/balupton/referral/?a=jj1ifwhour6qsw1d',
		title:
			'Use Earn.com to setup a paid email inbox, where people pay to email you',
		color: '#d6a156',
		tags: ['referral']
	},
	brave: {
		text: 'Brave',
		url: 'https://brave.com/bal467',
		title:
			'Use Brave Browser as a secure and privacy focused replacement for Google Chrome',
		color: '#ff401e',
		tags: ['referral']
	},
	collideref: {
		text: 'Collide',
		url: 'https://www.collide.com/creator/onboard/signup?os=referral-r4276',
		title: 'Use Collide to earn money from your fanbase',
		color: '#292929',
		tags: ['referral']
	},
	patreonref: {
		text: 'Patreon',
		url: 'https://patreon.com/invite/pbqzz',
		title: 'Use Patreon to earn money from your fanbase',
		color: '#E6461A',
		tags: ['referral']
	},
	bitchute: {
		text: 'BitChute',
		url: 'https://www.bitchute.com/accounts/referral/balupton/',
		title: 'Use BitChute as a decentralised YouTube alternative',
		color: '#ef4136',
		tags: ['referral']
	},
	earthrunners: {
		text: 'Earth Runners',
		url: 'http://earthrunners.com?rfsn=763305.e8694',
		title: 'Use Earth Runners as sandals that you can run, hike, and swim in',
		color: '#6dc21d',
		tags: ['referral']
	},
	backblaze: {
		text: 'Backblaze',
		url: 'https://secure.backblaze.com/r/01vlym',
		title:
			'Use Backblaze for unlimited and automated cloud backups of your computer and drives',
		color: '#990000',
		tags: ['referral']
	},
	bonsai: {
		text: 'Bonsai',
		url: 'https://app.hellobonsai.com/invite/fd7b3daf',
		title:
			'Use Bonsai for all your invoicing, time tracking, and freelancing needs',
		color: '#00B289',
		tags: ['referral']
	},
	aftership: {
		text: 'Aftership',
		url: 'https://www.aftership.com/?ref=B-HGKM6H2PW',
		title: 'Use Aftership to track your deliveries',
		color: '#e77f11',
		tags: ['referral']
	},
	downpour: {
		text: 'Downpour',
		url:
			'https://click.linksynergy.com/fs-bin/click?id=RltaJog6pRs&offerid=316894.4&subid=0&type=4',
		title: 'Use Downpour for your audiobook needs',
		color: '#2c3033',
		tags: ['referral']
	},
	freedom: {
		text: 'Freedom',
		url: 'https://freedom.refersion.com/c/a7ed49',
		title: 'Use Freedom to block distractions on your computer and phone',
		color: '#6ec05d',
		tags: ['referral']
	},
	hired: {
		text: 'Hired',
		url: 'https://hired.com/x/1i4hs',
		title: 'Use Hired to get offers from the best companies around the world',
		color: '#323241',
		tags: ['referral']
	},
	ebay: {
		text: 'Ebay',
		url:
			'https://rover.ebay.com/rover/1/705-53470-19255-0/1?icep_ff3=1&pub=5575197898&toolid=10001&campid=5337916977&customid=&ipn=psmain&icep_vectorid=229515&kwid=902099&mtid=824&kw=lg',
		title: 'Use Ebay to buy and sell online',
		color: '#f3ad29',
		tags: ['referral']
	},
	amazon: {
		text: 'Amazon',
		url: `https://www.amazon.com/?tag=${amazonCode}`,
		title: 'Use Amazon to buy books',
		color: '#e47911',
		tags: ['referral']
	},
	airbnb: {
		text: 'AirBnB',
		url: 'https://www.airbnb.com.au/c/benjaminl3638',
		title: 'Use AirBnB to book accomodation when traveling',
		color: '#ff5a5f',
		tags: ['referral']
	},
	awaytravel: {
		text: 'Away Travel',
		url: 'http://fbuy.me/errs2',
		title: 'Use Away Travel for your luggage',
		color: '#00344B',
		tags: ['referral']
	},
	raiz: {
		text: 'Raiz',
		url: 'https://app.raizinvest.com.au/invite/83UNQY',
		title: 'Use Raiz to open an Australian investment account',
		color: '#221b34',
		tags: ['referral']
	},
	n26: {
		text: 'N26 Bank',
		url: 'https://n26.com/r/benjamil6310',
		title: 'Use N26 Bank for European and International banking',
		color: '#26afb8',
		tags: ['referral']
	},
	transferwise: {
		text: 'TransferWise',
		url: 'https://transferwise.evyy.net/c/1328573/26105/985',
		title:
			'Use TransferWise to send money around the world as quickly and cheaply as possible',
		color: '#223049',
		tags: ['referral']
	},
	tradingview: {
		text: 'TradingView',
		url: 'http://tradingview.go2cloud.org/aff_c?offer_id=2&aff_id=4529',
		title: 'Use TradingView for all your trading insights',
		color: '#3BB3E4',
		tags: ['referral']
	},
	drivewealth: {
		text: 'DriveWealth',
		url: 'https://drivewealth.com/refer?r=A74082&name=Benjamin',
		title: 'Use DriveWealth to invest in USA companies (USA only)',
		color: '#FEC108',
		tags: ['referral']
	},
	wirex: {
		text: 'Wirex',
		url: 'https://app.wirexapp.com/join/gSPGAXe7_EOtVw3hNfaHtA',
		title: 'Use Wirex for your virtual and physical cryptocurrency cards',
		color: '#3fb1ab',
		tags: ['referral']
	},
	coinbase: {
		text: 'Coinbase',
		url: 'https://www.coinbase.com/join/516032d5fc3baa863b000010',
		title: 'Use Coinbase to exchange, send and receive cryptocurrency',
		color: '#2B71B1',
		tags: ['referral']
	},
	benco: {
		text: 'Ben.co',
		url: 'https://ben.onelink.me/kTE6/9181c018',
		title: 'Use Ben as your cryptocurrency wallet',
		color: '#1f6473',
		tags: ['referral']
	},
	circle: {
		text: 'Circle Finance',
		url: 'https://www.circle.com/invite/DTIKU0',
		title: 'Use Circle to exchange, send and receive cryptocurrency',
		color: '#aacc38',
		tags: ['referral']
	},
	coinseed: {
		text: 'Coinseed',
		url: 'https://coinseed.app.link/lnFvVQzVzN',
		title: 'Use Coinseed to diversify your cryptocurrency investments',
		color: '#2a9d31',
		tags: ['referral']
	},
	luno: {
		text: 'Luno',
		url: 'https://www.luno.com/invite/CM6NT',
		title: 'Use Luno to exchange, send and receive cryptocurrency',
		color: '#0091ff',
		tags: ['referral']
	},
	bitwala: {
		text: 'Bitwala',
		url: 'https://preregister.bitwala.com/r/H1ZIwz2x3G',
		title: 'Use Bitwala to trade cryptocurrency',
		color: '#5a85d7',
		tags: ['referral']
	},
	cex: {
		text: 'Luno',
		url: 'https://cex.io/r/0/up107824702/0/',
		title: 'Use CEX to trade cryptocurrency',
		color: '#00bdca',
		tags: ['referral']
	},
	xs2: {
		text: 'XS2',
		url: 'https://xs2.exchange/r/208',
		title: 'Use XS2 to trade cryptocurrency',
		color: '#3097d1',
		tags: ['referral']
	},
	liquid: {
		text: 'Liquid',
		url: 'https://accounts.liquid.com/sign-up?affiliate=v6Qki8rH43648',
		title: 'Use Liquid to trade cryptocurrency',
		color: '#2a9ff8',
		tags: ['referral']
	},
	surfeasy: {
		text: 'SurfEasy',
		url: 'https://srfez.com/NF6AYREKBA',
		title: 'Use SurfEasy as your secure anonymous VPN (used by Opera)',
		color: '#46d186',
		tags: ['referral']
	},
	windscribe: {
		text: 'Windscribe',
		url: 'https://windscribe.com/?affid=rztkyips',
		title: 'Use Windscribe as your secure anonymous VPN',
		color: '#52a5d8',
		tags: ['referral']
	},
	namedomains: {
		text: 'Name.com',
		url: 'https://www.name.com/referral/1d41c5',
		title: 'Use Name.com to purchase domain names',
		color: '#90c547',
		tags: ['referral']
	},
	googleapps: {
		text: 'Google Apps',
		url: 'https://goo.gl/vEb9bM',
		title:
			'Use Google Apps for Work to setup Google Accounts for your own website',
		color: '#5F7D8C',
		tags: ['referral']
	},
	trello: {
		text: 'Trello',
		url: 'https://trello.com/balupton/recommend',
		title:
			'Use Trello to organise your projects via collaborating via virtual todo notes',
		color: '#026AA7',
		tags: ['referral']
	},
	iherb: {
		text: 'iHerb',
		url: 'http://www.iherb.com/iherb-brands?rcode=DNF509&pcode=10NEWAU',
		title: 'Use iHerb to buy supplements',
		color: '#458500',
		tags: ['referral']
	},
	koding: {
		text: 'Koding',
		url: 'https://koding.com/R/balupton',
		title: 'Use Koding to code in the cloud',
		color: '#656565',
		tags: ['referral']
	},
	updown: {
		text: 'Updown',
		url: 'https://updown.io/r/hl1b0',
		title: 'Use Updown for website status alerts',
		color: '#5c4',
		tags: ['referral']
	},
	vultr: {
		text: 'Vultr',
		url: 'http://www.vultr.com/?ref=7196060',
		title: 'Use Vultr to host your apps on virtual machines in the cloud',
		color: '#1e88e5',
		tags: ['referral']
	},
	hypersh: {
		text: 'Hyper.sh',
		url:
			'https://console.hyper.sh/register/invite/Eb9g6Ml6mGtNNdeRKe6ztaAkMR42rdc6',
		title: 'Use Hyper.sh to host docker apps in the cloud',
		color: '#172b46',
		tags: ['referral']
	},
	rescuetime: {
		text: 'Rescue Time',
		url: 'http://rescuetime.com/ref/242226',
		title:
			'Use Rescue Time to track your computer activity to figure out where you time goes',
		color: '#65a86f',
		tags: ['referral']
	},
	dropbox: {
		text: 'Dropbox',
		url: 'https://db.tt/XFuEv8vB',
		title: 'Use Dropbox to sync your local files with the cloud',
		color: '#007ee5',
		tags: ['referral']
	},
	screenflow: {
		text: 'Screenflow',
		url:
			'https://store.telestream.net/affiliate.php?ACCOUNT=TELESTRE&AFFILIATE=45446&PATH=http://www.telestream.net/screenflow/',
		title: 'Use Screenflow to do screencasts',
		color: '#009bdf',
		tags: ['referral']
	},
	airtasker: {
		text: 'Airtasker',
		url:
			'http://mail.airtasker.com/wf/click?upn=JalSgYCkT0ZI-2Bw45xk4vmrAhDtJvUSrWoM8aOtgnYf-2FjzVj6Pr4xUEHxebs5pQnF420bjJweZagd9p-2FeHbDWuA-3D-3D_xg4Iuf5a2mwDa1KxKgyCbGVAHupcFAbxI8rKgjLgfgN5LbOhe9IqDQ4AORWS7MaJNK4-2FmWOjfLAvOJ0obbOKpVy7UePSfIBv2WsQJD9fPJ-2FybjZfT0gi6vvQ0cPNheFa-2BKhswj67JD4w46eREx1VZ4mxLcxds-2FTEa6IP8wK0Y4xpDADJzR2vH0aGgJ-2BtKiP-2Fb-2BPS-2B8-2FcR7doTWuo9CAv7ZF-2FHQLbUzR2SZ2ZVSLY95Q-3D',
		title: 'Use Airtasker to delegate physical tasks to minions',
		color: '#007fad',
		tags: ['referral']
	},
	fancyhands: {
		text: 'Fancy Hands',
		url: 'http://www.fancyhands.com/r/8c2e46df0aa7',
		title: 'Use Fancy Hands to delegate information tasks to minions',
		color: '#db5344',
		tags: ['referral']
	},
	zapier: {
		text: 'Zapier',
		url: 'http://zpr.io/AhX',
		title: 'Use Zapier to automate your digital workflows',
		color: '#ff4a00',
		tags: ['referral']
	},
	ovo: {
		text: 'OVO',
		url: 'http://fanclub.ovo.com.au/mQe3Ahx',
		title: 'Use OVO for your phone plan in Australia (Telstra Network)',
		color: '#6b37ff',
		tags: ['referral']
	},
	belong: {
		text: 'Belong',
		url: 'https://www.belong.com.au/iaf?promo=IAF6Y56XY',
		title:
			'Use Belong for your phone and broadband plans in Australia (Telstra Network)',
		color: '#41b6e6',
		tags: ['referral']
	},
	amaysim: {
		text: 'Amaysim',
		url: 'http://amaysi.ms/balupton',
		title: 'Use Amaysim for your phone plan in Australia (Optus Network)',
		color: '#e65014',
		tags: ['referral']
	},
	yoodo: {
		text: 'Yoodo',
		url:
			'https://app.yoodo.com.my/assets/index.html#friendInvitation?code=xiifp3656 ',
		title: 'Use Yoodo for your phone plan in Malaysia',
		color: '#e73c50',
		tags: ['referral']
	},
	flexiroam: {
		text: 'Flexiroam',
		url: 'http://roam.my/VKMG4TS8',
		title: 'Use Flexiroam for your global roaming needs',
		color: '#EB1D25',
		tags: ['referral']
	},
	audiojungle: {
		text: 'Audio Jungle',
		url: 'http://audiojungle.net/?ref=balupton',
		title: 'Use Audio Jungle to purchase audio for videos',
		color: '#82b440',
		tags: ['referral']
	},
	themeforest: {
		text: 'Theme Forest',
		url: 'http://themeforest.net/?ref=balupton',
		title: 'Use Theme Forest to purchase themes for websites',
		color: '#7bc4c4',
		tags: ['referral']
	},
	circlemedia: {
		text: 'Circle Media',
		url: 'http://mbsy.co/dSfLv',
		title: 'Use Circle to track and limit your internet usage over any device',
		color: '#00b7d9',
		tags: ['referral']
	},
	// Links
	peac: {
		text: 'PEAC',
		url: 'http://www.det.wa.edu.au/redirect/?oid=MultiPartArticle-id-11045758',
		title:
			'Primary Extension and Challenge (PEAC) is a part-time program for public school children in Years 5, 6 and 7. Children participate in a range of innovative and challenging programs offered in a variety of ways. Children are withdrawn from regular class to attend PEAC programs.'
	},
	husband: {
		text: 'Husband',
		url: 'http://h.lupton.cc',
		title: 'Helen Lupton is my amazing wife. Learn about Helen on her blog.'
	},
	opencollaboration: {
		text: 'Open-Collaboration',
		url: 'https://github.com/bevry/goopen',
		title:
			"Open-Collaboration is the notion that we can all work together freely and liberally to accomplish amazing things. It's what I dedicate my life too. Learn about Open-Collaboration via the Go Open Campaign."
	},
	freeculture: {
		text: 'Free Culture',
		url: 'http://en.wikipedia.org/wiki/Free_culture_movement',
		title:
			'Free Culture is the notion that everything should be free, in terms of free as in no money needed, and free as in people can re-use it liberally. Learn about Free Culture on Wikipedia.'
	},
	book: {
		text: 'Intentionally Left Blank',
		url: 'https://gumroad.com/l/vKuF',
		title:
			'Author of the mostly likely not the best non-best selling book in cultural literature right now.'
	},
	bookupdates: {
		text: 'Book Newsletter',
		url: 'https://confirmsubscription.com/h/r/36CE01ACCFE65688',
		title: 'Subscribe for updates when I publish new books'
	},
	privileged: {
		text: 'privileged',
		url: 'https://www.youtube.com/watch?v=cRsYwu8uD4I',
		title: 'Privileged, yes, no?'
	},
	male: {
		text: 'male',
		url:
			'https://www.youtube.com/watch?v=vp8tToFv-bA&list=PLYVl5EnzwqsRPSBKIn6qMatpxWopxs1eB',
		title: 'Interesting analysis of gender roles and issues'
	},
	ausvsusa: {
		text: 'Australia vs America',
		url: 'https://youtu.be/u--1_WrGpZo',
		title:
			'Comedic sketch comparing the potential for gangsta rappers from Australia and America'
	},
	simpleliving: {
		text: 'Simple Living',
		url: 'https://en.wikipedia.org/wiki/Simple_living',
		title:
			"Simple living encompasses a number of different voluntary practices to simplify one's lifestyle. These may include reducing one's possessions, generally referred to as Minimalism, or increasing self-sufficiency, for example."
	},
	nomad: {
		text: 'Global Nomad',
		url: 'https://en.wikipedia.org/wiki/Global_nomad',
		title:
			'Global nomad is a term applied to people who are living a mobile and international lifestyle.'
	},
	v: {
		text: 'Vegan',
		url:
			'https://github.com/balupton/plant-vs-animal-products/blob/master/README.md#readme',
		title:
			'Veganism is the stance that other lives are not ours to own. Vegans commonly associate this with the practice of reducing their harm to all lives, primarily through a strict-vegetarian diet and lifestyle. Learn about what turned me vegan.'
	},
	vegan: {
		text: 'Vegan',
		url: 'http://medium.com/p/c60913a8ca5b',
		title:
			'Veganism is the stance that other lives are not ours to own. Vegans commonly associate this with the practice of reducing their harm to all lives, primarily through a strict-vegetarian diet and lifestyle. Learn about what turned me vegan.'
	},
	ahimsa: {
		text: 'Ahimsa',
		url: 'https://en.wikipedia.org/wiki/Ahimsa',
		title:
			'Ahimsa is referred to as nonviolence, and it applies to all living beings - including all animals - according to many Indian religions.'
	},
	agnostic: {
		text: 'Agnostic',
		url: 'http://en.wikipedia.org/wiki/Agnostic',
		title:
			'Agnosticism is the understanding that one cannot prove the existance or non-existance of something that is not observable, therefore agnostics do not take a theist or athiest stance. Learn about Agnosticism on Wikipedia.'
	},
	pantheist: {
		text: 'Pantheist',
		url: 'http://en.wikipedia.org/wiki/Pantheism',
		title:
			'Pantheism is a stance that believes the notion of God is synonymous with the notion of the Universe. Learn about Pantheism on Wikipedia.'
	},
	docpad: {
		text: 'DocPad',
		url: 'https://docpad.org',
		title:
			'DocPad is a static site generator built with Node.js. Learn about DocPad on its website.'
	},
	'docpad-ranking': {
		text: 'Most Popular CoffeeScript Projects',
		url:
			'https://github.com/search?l=CoffeeScript&o=desc&q=coffeescript&s=stars&type=Repositories',
		title: 'Browse  the most popular CoffeeScript projects on GitHub'
	},
	quora: {
		text: 'Quora',
		url: 'https://www.quora.com/profile/Benjamin-Lupton',
		title: "Quora is the world's largest Q&A website"
	},
	hostel: {
		text: 'Startup Hostel',
		url: 'https://startuphostel.org',
		title:
			'Startup Hostel is a co-work and co-live initiative. Learn about Startup Hostel on its website.'
	},
	hostellist: {
		text: 'Setup Hostels around the world',
		url: 'https://startuphostel.org/compare',
		title: 'There are now more than 30 Startup Hostels around the world!'
	},
	historyjs: {
		text: 'History.js',
		url: 'https://github.com/browserstate/history.js',
		title:
			'History.js lets you create cross-browser stateful web applications. Learn about History.js on its website.'
	},
	taskgroup: {
		text: 'TaskGroup',
		url: 'https://github.com/bevry/taskgroup',
		title:
			'The true solution to callback hell. Robust, simple, and consistent. Group together synchronous and asynchronous tasks and execute them with support for concurrency, naming, and nesting.'
	},
	bevry: {
		text: 'Bevry',
		url: 'https://bevry.me',
		title:
			"Bevry is the open-company and community that I founded in 2011, it's a great thing. Learn about Bevry on its website."
	},
	lossleader: {
		text: 'Loss-Leader',
		url: 'https://en.wikipedia.org/wiki/Loss_leader',
		title:
			'A loss leader is a pricing strategy where a product is sold at a price below its market cost to stimulate other sales of more profitable goods or services.'
	},
	webwrite: {
		text: 'Web Write',
		url: 'https://github.com/webwrite',
		title:
			'Web Write is an open-source initiative to create a series of admin interfaces that work with any backend. Learn more about Web Write on its website.'
	},
	kasper: {
		text: 'Kasper Tidemann',
		url: 'http://www.kaspertidemann.com',
		title:
			'CEO at Tidemann&Co. Lover of life, the universe, and everything in between. I speak web, JavaScript, Go, NoSQL, and more. Dreams burn but in ashes are gold.'
	},
	lightbox: {
		text: 'jQuery Lightbox Plugin',
		url: 'https://github.com/balupton/jquery-lightbox',
		title:
			'Lightboxes are a way to display an image on the same web page simply and elegantly.'
	},
	services: {
		text: 'Services',
		url: 'https://bevry.me/services',
		title: "View my company's services"
	},
	opensource: {
		text: 'Open-Source',
		url: 'http://en.wikipedia.org/wiki/Open-source_software',
		title:
			'Open-Source is the releasing of the original format of something so that others can improve on it freely. Learn about Open-Source on Wikipedia.'
	},
	stackoverflow: {
		text: 'Stackoverflow',
		url: 'https://stackoverflow.com/users/130638/balupton?tab=profile',
		title: 'View my profile on Stackoverflow'
	},
	'stackoverflow-resume': {
		text: 'Stackoverflow Careers',
		url: 'https://careers.stackoverflow.com/balupton',
		title: 'View my profile on Stackoverflow Careers'
	},
	html: {
		text: 'HTML',
		url: 'http://en.wikipedia.org/wiki/HTML',
		title:
			'HTML is the langauge that the content of websites are written in. Learn about HTML on Wikipedia.'
	},
	coffeescript: {
		text: 'CoffeeScript',
		url: 'http://coffeescript.org',
		title:
			'CoffeeScript is a high-level language that compiles to JavaScript. Learn about CoffeeScript on its website.'
	},
	javascript: {
		text: 'JavaScript',
		url: 'http://en.wikipedia.org/wiki/JavaScript',
		title:
			'JavaScript is the language that makes website interactive. It powers the web. Learn about JavaScript on Wikipedia.'
	},
	zeit: {
		text: 'ZEIT',
		url: 'https://zeit.co',
		title:
			'ZEIT is cloud hosting company blending the barriers between static and dynamic websites.'
	},
	nextjs: {
		text: 'Next.js',
		url: 'https://nextjs.org',
		title:
			"Zeit's Next.js is a React.js Framework that blends the barriers between static and dynamic websites."
	},
	ecmascript: {
		text: 'ECMAScript',
		url: 'https://en.wikipedia.org/wiki/ECMAScript',
		title:
			'ECMAScript is the scripting-language specification behind languages such as JavaScript, JScript and ActionScript that have come into wide use for client-side scripting on the Web.'
	},
	flash: {
		text: 'Flash',
		url: 'https://en.wikipedia.org/wiki/Adobe_Flash_Player',
		title:
			'Adobe Flash is used for viewing multimedia, executing rich Internet applications, and streaming video and audio.'
	},
	actionscript: {
		text: 'ActionScript',
		url: 'https://en.wikipedia.org/wiki/ActionScript',
		title:
			'ActionScript is used primarily for the development of websites and software targeting the Adobe Flash Player platform.'
	},
	swift: {
		text: 'Swift',
		url: 'https://en.wikipedia.org/wiki/Swift_(programming_language)',
		title:
			'Swift is a high-level programming language used to create powerful applications.'
	},
	c: {
		text: 'C',
		url: 'https://en.wikipedia.org/wiki/C_%28programming_language%29',
		title:
			'C is a low-level programming language used to create powerful applications.'
	},
	csharp: {
		text: 'C#',
		url: 'https://en.wikipedia.org/wiki/C_Sharp_(programming_language)',
		title:
			'C# is a high-level programming language used to create powerful applications.'
	},
	pascal: {
		text: 'Pascal',
		url: 'https://en.wikipedia.org/wiki/Pascal_(programming_language)',
		title:
			'Pascal is a historically influential imperative and procedural programming language as a small and efficient language intended to encourage good programming practices using structured programming and data structuring.'
	},
	cobol: {
		text: 'COBOL',
		url: 'https://en.wikipedia.org/wiki/COBOL',
		title:
			'COBOL is a compiled English-like computer programming language designed for business use.'
	},
	asp: {
		text: 'ASP',
		url: 'https://en.wikipedia.org/wiki/Active_Server_Pages',
		title:
			'Active Server Pages and ASP.net are server-side script engines used to create dynamically generated web pages.'
	},
	perl: {
		text: 'Perl',
		url: 'https://en.wikipedia.org/wiki/Perl',
		title:
			'Perl is a family of high-level, general-purpose, interpreted, dynamic programming languages. '
	},
	php: {
		text: 'PHP',
		url: 'https://en.wikipedia.org/wiki/PHP',
		title:
			'PHP is a server-side scripting language designed for web development but also used as a general-purpose programming language.'
	},
	itunes: {
		text: 'iTunes',
		url: 'https://itunes.apple.com',
		title:
			'iTunes is a media player, media library, online radio broadcaster, and mobile device management application developed by Apple Inc.'
	},
	dll: {
		text: 'DLL',
		url: 'https://en.wikipedia.org/wiki/Dynamic-link_library',
		title:
			'Dynamic-Link Library files are used to expose Application Programming Interfaces that different applications can use to expose functionality to each other.'
	},
	nodejs: {
		text: 'Node.js',
		url: 'http://nodejs.org/',
		title:
			'Node.js is JavaScript on the backend, it lets frontend web developers code web servers and desktop applications. Its really cool. Learn about Node.js on its website.'
	},
	balupton: {
		text: 'Benjamin Lupton',
		url: 'https://balupton.com',
		title: 'Visit website'
	},
	me: {
		text: 'Benjamin Lupton',
		url: 'https://balupton.com',
		title: 'Visit website'
	},
	contact: {
		text: 'Contact',
		url: '/#contact',
		title: 'Contact me',
		className: 'contact-button'
	},
	referrals: {
		text: 'Referrals',
		url: '/#referrals'
	},
	'permissive-license': {
		text: 'Permissive Software License',
		url: 'http://en.wikipedia.org/wiki/Permissive_free_software_licence'
	},
	'mit-license': {
		text: 'MIT License',
		url: 'http://spdx.org/licenses/MIT.html'
	},
	'cca-license': {
		text: 'Creative Commons Attribution 4.0 Unported License',
		url: 'http://spdx.org/licenses/CC-BY-4.0.html'
	},
	trich: {
		text: 'Trichotillomania',
		url: 'http://www.trich.org/about/hair-faqs.html',
		title:
			"Along with up to 10% of the population by some estimates, I happen to have trichotillomania (obsessive compulsive hair pulling) that for me, occurs in times of emotional despair, once every few years. It's time the mental illness stigma goes away. Learn about Trichotillomania on the TLC Learning Centre."
	},
	poly: {
		text: 'Polyamorous',
		url: 'https://en.wikipedia.org/wiki/Polyamory',
		title:
			'Polyamory is the practice, desire, or acceptance of intimate relationships that are not exclusive with respect to other sexual or intimate relationships, with knowledge and consent of everyone involved.'
	},
	openrel: {
		text: 'Open Relationships',
		url: 'https://en.wikipedia.org/wiki/Open_relationship',
		title:
			'An open relationship is an interpersonal relationship in which the parties want to be together but agree to a form of a non-monogamous relationship.'
	},
	closedrel: {
		text: 'Closed Relationship',
		url: 'https://en.wikipedia.org/wiki/Monogamy',
		title:
			'Monogamy is a form of relationship in which an individual has only one partner during his or her lifetime or at any one time.'
	},
	sexpos: {
		text: 'Sexual Positivity',
		url: 'https://en.wikipedia.org/wiki/Sex-positive_movement',
		title:
			'The sex-positive movement is a social movement which promotes and embraces sexuality with few limits beyond an emphasis on safe sex and the importance of consent. Sex positivity is "an attitude towards human sexuality that regards all consensual sexual activities as fundamentally healthy and pleasurable, and encourages sexual pleasure and experimentation.'
	},
	bachelorpad: {
		text: 'Bachelor Pad',
		url: 'https://en.wikipedia.org/wiki/Bachelor_pad',
		title:
			'A bachelor pad is a slang term for a house (pad) in which a bachelor or bachelors (single men) live.'
	},
	pua: {
		text: 'Pickup Artistry',
		url: 'https://en.wikipedia.org/wiki/Seduction_community',
		title:
			'Pickup Artistry focuses around communities of men and women whose goal is to improve their inter-gender social skills, of which seduction is a primary aspect. It is essentially women magazines for men.'
	},
	personaldev: {
		text: 'Personal Devleopment',
		url: 'https://en.wikipedia.org/wiki/Personal_development',
		title:
			'Personal development covers activities that improve awareness and identity, develop talents and potential, build human capital and facilitate employability, enhance quality of life and contribute to the realization of dreams and aspirations.'
	},
	mindful: {
		text: 'Mindfulness',
		url: 'https://en.wikipedia.org/wiki/Mindfulness',
		title:
			'The practice of mindfulness involves being aware moment-to-moment, of one’s subjective conscious experience from a first-person perspective.'
	},
	tolle: {
		text: 'Eckhart Tolle',
		url: 'https://en.wikipedia.org/wiki/Eckhart_Tolle',
		title:
			'Eckhart is a spiritual teacher and author who was born in Germany and educated at the Universities of London and Cambridge.'
	},
	paulo: {
		text: 'Paulo Coelho',
		url: 'https://en.wikipedia.org/wiki/Paulo_Coelho',
		title:
			'Paulo Coelho is a Brazilian lyricist and novelist. He is the recipient of numerous international awards. The Alchemist, his most famous novel, has been translated into 80 languages.'
	},
	nlp: {
		text: 'Neuro-Linguistic Programming',
		url: 'https://en.wikipedia.org/wiki/Neuro-linguistic_programming',
		title:
			'Neuro-linguistic programming (NLP) is an approach to communication, personal development, and psychotherapy created by Richard Bandler and John Grinder in California, United States in the 1970s. Its creators claim a connection between the neurological processes ("neuro"), language ("linguistic") and behavioral patterns learned through experience ("programming") and that these can be changed to achieve specific goals in life.'
	},
	hypno: {
		text: 'Hypnotherapy',
		url: 'https://en.wikipedia.org/wiki/Hypnotherapy',
		title:
			'Hypnotherapy is a form of psychotherapy used to create subconscious change in a patient in the form of new responses, thoughts, attitudes, behaviours or feelings.'
	},
	extremelife: {
		text: 'Extreme Lifestyle Experiments',
		url: 'https://www.youtube.com/watch?v=W6cAR2eQHUU',
		title:
			'A controlled change in your lifestyle undertaken for a period of time intended to give you new perspective.'
	},
	halo3: {
		text: 'Halo 3',
		url: 'https://en.wikipedia.org/wiki/Halo_3',
		title:
			'Halo 3 is a 2007 first-person shooter video game developed by Bungie for the Xbox 360 console.'
	},
	roadtrips: {
		text: 'Road Trips',
		url: 'https://en.wikipedia.org/wiki/Road_trip',
		title:
			'A road trip is a long distance journey on the road. Typically, road trips are long distances traveled by automobile; especially RVs.'
	},
	pool: {
		text: 'Pool Billiards',
		url: 'https://en.wikipedia.org/wiki/Pool_(cue_sports)',
		title:
			'Pool, also more formally known as pocket billiards (mostly in North America) or pool billiards (mostly in Europe and Australia), is the family of cue sports and games played on a pool table having six receptacles called pockets along the rails, into which balls are deposited as the main goal of play.'
	},
	moneyless: {
		text: 'Moneyless Living',
		url: 'http://www.moneylessmanifesto.org',
		title:
			"Moneyless living is a life abstaining from direct use of money, instead using excess and natural methods of meeting life's demands."
	},
	lentil: {
		text: 'Lentil as Anything',
		url: 'https://en.wikipedia.org/wiki/Lentil_as_Anything',
		title:
			"Lentil as Anything is a not-for-profit volunteer based pay-what you want restaraunt. It's Sydney location is completely vegan, containing a restaraunt and mocktail bar. It's a great place to hang out."
	},
	paycan: {
		text: 'Pay What You Can',
		url: 'https://en.wikipedia.org/wiki/Pay_what_you_can',
		title:
			'Pay what you can is a non-profit or revenue driven plan of action which does not rely on upon set costs for its merchandise, but rather requests that clients pay what they feel the item or administration is worth to them.'
	},
	hitch: {
		text: 'Hitchhiking',
		url: 'https://en.wikipedia.org/wiki/Hitchhiking',
		title:
			'Hitchhiking is a means of transportation that is gained by asking people, usually strangers, for a ride in their automobile or other road vehicle. A ride is usually, but not always, free.'
	},
	walk: {
		text: 'Bibbulmum Track',
		url: 'https://www.bibbulmuntrack.org.au',
		title:
			'The Bibbulmun Track is one of the world’s great long distance walk trails, stretching 1000km from Kalamunda in the Perth Hills, to Albany on the south coast, winding through the heart of the scenic South West of Western Australia.'
	},
	bladelyf: {
		text: 'Bladelyf by Frenchy and the Talent',
		url: 'https://www.youtube.com/watch?v=GduphPDJvJQ',
		title: 'Music video about Rollerblading in Australia'
	},
	tafe: {
		text: 'Central TAFE',
		url: 'https://central.wa.edu.au/aboutus/',
		title:
			'Central TAFE provides technical and vocational trainings in Western Australia.'
	},
	comosec: {
		text: 'Como Secondary College',
		url: 'https://en.wikipedia.org/wiki/Como_Secondary_College',
		title:
			'Como Secondary College is a public, co-educational state high school in Western Australia.'
	},
	ssst: {
		text: 'Specialist Studies in Science &amp; Technology',
		url: 'http://www.como.wa.edu.au/EMITS.62.0.html',
		title:
			'The EMITS (formerly SSST) program offers students of above average ability in the mathematics, science and technology fields an exciting and challenging program of learning to build a solid knowledge and skills base for further university studies.'
	},
	hockeyacad: {
		text: 'Hockey Academy',
		url: 'http://www.como.wa.edu.au/Hockey-Academy.59.0.html',
		title:
			'Students at the Hockey Academy receive a diverse hockey experience with the major focus being given to skill development and game strategy.'
	},
	hockey: {
		text: 'Field Hockey',
		url: 'https://en.wikipedia.org/wiki/Field_hockey',
		title:
			'Field hockey is played with a ball on natural grass, or on sand-based or water based artificial turfs with a small hard ball.'
	},
	aoe: {
		text: 'Age of Empires',
		url: 'https://en.wikipedia.org/wiki/Age_of_Empires_II',
		title:
			'Age of Empires II: The Age of Kings is a real-time strategy (RTS) video game developed by Ensemble Studios and published by Microsoft.'
	},
	highschool: {
		text: 'High School',
		url: 'https://en.wikipedia.org/wiki/Secondary_education#Australia',
		title:
			'Australia utilises High Schools to achieve Secondary Education for teenagers. It is the schooling between Primary Education and University.'
	},
	diplomaweb: {
		text: 'Diploma of Website Design & Development',
		url: 'http://www.myskills.gov.au/courses/details?Code=ICT50615',
		title:
			'This qualification provides the skills and knowledge for an individual to design, build and manage websites as an independent web developer or as part of a team.'
	},
	cannabis: {
		text: 'Cannabis',
		url: 'https://en.wikipedia.org/wiki/Cannabis_(drug)',
		title:
			'Cannabis is a psychoactive drug often consumed for its mental and physical effects, such as heightened mood, relaxation, and an increase in appetite.'
	},
	lsd: {
		text: 'LSD',
		url: 'https://en.wikipedia.org/wiki/Lysergic_acid_diethylamide',
		title:
			'LSD (also called acid) is a psychedelic drug well known for its psychological effects—which can include altered thinking processes, closed-and open-eye visuals, synesthesia, an altered sense of time, and spiritual experiences.'
	},
	mdma: {
		text: 'MDMA',
		url: 'https://en.wikipedia.org/wiki/MDMA',
		title:
			'MDMA (also called Ecstacy) is a psychoactive drug that is consumed primarily for its euphoric and empathogenic effects.'
	},
	panic: {
		text: 'Panic Attack',
		url: 'https://en.wikipedia.org/wiki/Panic_attack',
		title:
			'Panic attacks are periods of intense fear or apprehension of sudden onset accompanied by at least four or more bodily or cognitive symptoms (such as heart palpitations, dizziness, shortness of breath, or feelings of unreality) and of variable duration from minutes to hours.'
	},
	anxiety: {
		text: 'Generalised Anxiety Panic Disorder',
		url: 'https://en.wikipedia.org/wiki/Generalized_anxiety_disorder',
		title:
			'Generalized anxiety disorder (GAD) is an anxiety disorder characterized by excessive, uncontrollable and often irrational worry, that is, apprehensive expectation about events or activities.'
	},
	bucket: {
		text: 'Stress Bucket',
		url:
			'https://student.unsw.edu.au/sites/all/files/uploads/CAPS/Stress%20Bucket.pdf',
		title:
			'Too much stress will cause our stress bucket to overflow. By using our coping skills we can keep our stress levels down.'
	},
	depersonalisation: {
		text: 'Depersonalisation Disorder',
		url: 'https://en.wikipedia.org/wiki/Depersonalization_disorder',
		title:
			"Depersonalization is described as feeling disconnected or estranged from one's body, thoughts, or emotions. Individuals experiencing depersonalization may report feeling as if they are in a dream or are watching themselves in a movie."
	},
	night: {
		text: 'Night Terrors',
		url: 'https://en.wikipedia.org/wiki/Night_terror',
		title:
			'During night terror bouts, patients are usually described as "bolting upright" with their eyes wide open and a look of fear and panic on their faces. They will often scream.'
	},
	gp: {
		text: 'GP',
		url: 'https://en.wikipedia.org/wiki/General_practitioner#Australia',
		title:
			'A doctor based in the community who treats patients with minor or chronic illnesses and refers those with serious conditions to a hospital.'
	},
	psych: {
		text: 'Clinical Psychiatrist',
		url: 'https://en.wikipedia.org/wiki/Clinical_psychology',
		title:
			'Clinical psychology is an integration of the science, theory and clinical knowledge for the purpose of understanding, preventing, and relieving psychologically-based distress or dysfunction and to promote subjective and behavioural well-being and personal development.'
	},
	livemessenger: {
		text: 'Windows Live Messenger',
		url: 'https://en.wikipedia.org/wiki/Windows_Live_Messenger',
		title:
			'Windows Live Messenger was a popular instant messaging client developed for multiple Microsoft platforms.'
	},
	webct: {
		text: 'WebCT',
		url: 'https://en.wikipedia.org/wiki/WebCT',
		title:
			'WebCT also called Blackboard Learning System, is an online proprietary virtual learning environment system that is licensed to colleges and other institutions and used in many campuses for e-learning.'
	},
	webctexploit: {
		text: 'WebCT Security Advisory',
		url: 'https://gist.github.com/balupton/3cb9a0e066ebb899d2be',
		title:
			'My first security advisory: WebCT 4.x Javascript Session Stealer Exploits'
	},
	dsr: {
		text: 'Data-Science Retreat',
		url: 'http://datascienceretreat.com',
		title:
			'Data-Science Retreat is a training company for teaching data-science from the best in the field.'
	},
	nodeschool: {
		text: 'NodeSchool',
		url: 'http://nodeschool.io',
		title:
			'NodeSchool is a decentralised training initiative for teaching Node.js.'
	},
	bcsit: {
		text: 'Bachelor of Computer Science (Information Technology)',
		url:
			'http://archive.handbook.curtin.edu.au/february2006/courses/14/143010.html',
		title:
			'The Bachelor of Science (Information Technology) course focuses on the overall discipline of information technology which covers the more technological and applied aspects of computing, with less emphasis on theory. Some of these areas range from system programming to software design and engineering, networking - including Internet and the web, artificial intelligence for decision support and graphics. Information technology graduates continue to be in demand as computing is one of the biggest growth areas in the world.'
	},
	curtin: {
		text: 'Curtin University',
		url: 'https://en.wikipedia.org/wiki/Curtin_University',
		title:
			'Curtin University is an Australian public university based in Bentley, Perth, Western Australia.'
	},
	unimelb: {
		text: 'University of Melbourne',
		url: 'https://en.wikipedia.org/wiki/University_of_Melbourne',
		title:
			'The University of Melbourne is a public research university located in Melbourne, Australia.'
	},
	gdaph: {
		text: 'Graduate Diploma in Arts (Philosophy)',
		url: 'https://handbook.unimelb.edu.au/components/gd-arts-spec-24'
	},
	gentics: {
		text: 'Gentics',
		url: 'http://www.gentics.com/genticscms/index.en.html',
		title:
			'Gentics Software stands for future-oriented design and trustworthy products backed by a curious and enthusiastic team.'
	},
	acidgreen: {
		text: 'Acid Green',
		url: 'http://www.acidgreen.com.au',
		title:
			'Founded in 2000, acidgreen is an award winning full service digital agency offering premium web design, web development, ecommerce and internet marketing services.'
	},
	bugherd: {
		text: 'BugHerd',
		url: 'http://bugherd.com',
		title:
			"BugHerd is the world's easist bug tracker, a way to capture client feedback, resolve issues and manage your projects."
	},
	spa: {
		text: 'Client-Side Web Application',
		url: 'https://en.wikipedia.org/wiki/Single-page_application',
		title:
			'A single-page application is a web application or web site that fits on a single web page with the goal of providing a more fluent user experience similar to a desktop application.'
	},
	aloha: {
		text: 'Aloha Editor',
		url: 'http://www.alohaeditor.org/',
		title:
			'Aloha Editor is an open source WYSIWYG editor that can be used in webpages. Aloha Editor aims to be easy to use and fast in editing, and allows advanced inline editing.'
	},
	alohadevcon: {
		text: 'Aloha Editor Dev Con',
		url: 'https://www.youtube.com/watch?v=btxLv8MPsJI',
		title:
			'Aloha Editor Dev Con was held in Vienna, Austria in 2011 and went for 2 weeks.'
	},
	metarefresh: {
		text: 'Meta Refresh',
		url: 'https://metarefresh.in/2013/',
		title:
			'Meta Refresh is a conference on the construction of user experience on the web. The 2013 edition is about letting go.'
	},
	bangalore: {
		text: 'Bangalore',
		url: 'https://en.wikipedia.org/wiki/Bangalore',
		title:
			'Bangalore is the silicon-valley of India. A place with awesome tech, awesome people, and awesome food.'
	},
	whysucks: {
		text: 'Why The Next Big Thing Sucks!',
		url: 'https://www.youtube.com/watch?v=nt4Gt6-T8N0',
		title:
			"We're coders, not hipsters. We're here to change the world, not be swept up by change."
	},
	queryengine: {
		text: 'Query-Engine',
		url: 'https://github.com/bevry/query-engine',
		title:
			"Live collections are collections that when a model is changed, added or removed, the model is automatically tested against the collection's queries, filters, and search string, if the model fails, it is removed from the collection."
	},
	crossbrowser: {
		text: 'Cross-Browser',
		url: 'https://en.wikipedia.org/wiki/Cross-browser',
		title:
			'Cross-browser refers to the ability of a website, web application, HTML construct or client-side script to function in environments that provide its required features and to bow out or degrade gracefully when features are absent or lacking.'
	},
	screenshot: {
		text: 'Screenshot',
		url: 'https://en.wikipedia.org/wiki/Screenshot',
		title:
			'A screenshot, screen capture (or screen-cap), screen dump or screengrab is an image taken by a person to record the visible items displayed on the monitor, television, or other visual output device in use.'
	},
	extension: {
		text: 'Browser Extension',
		url: 'https://en.wikipedia.org/wiki/Browser_extension',
		title:
			'A browser extension is a computer program that extends the functionality of a web browser in some way.'
	},
	b2evo: {
		text: 'b2evolution',
		url: 'http://b2evolution.net',
		title:
			'b2evolution is a powerful content and community management system written in PHP and backed by a MySQL database.'
	},
	wordpress: {
		text: 'WordPress',
		url: 'https://wordpress.org',
		title:
			'b2evolution is a beautiful content and community management system written in PHP and backed by a MySQL database.'
	},
	perth: {
		text: 'Perth',
		url: 'https://en.wikipedia.org/wiki/Perth',
		title:
			'Perth is my home-town. It is the capital city of Western Australia and the 4th most populous city in Australia, though with a small-town feel.'
	},
	sydney: {
		text: 'Sydney',
		url: 'https://en.wikipedia.org/wiki/Sydney',
		title:
			'I spent 5 years living in Sydney with my partner. It is a place where money, suits, and smokers live.'
	},
	uluru: {
		text: 'Uluru',
		url: 'https://en.wikipedia.org/wiki/Uluru',
		title:
			'Uluru (also called Ayres Rock) is the humongous rock in the center of Australia that tourists come to see.'
	},
	nullabor: {
		text: 'Nullabor',
		url: 'https://en.wikipedia.org/wiki/Nullarbor_Plain',
		title:
			'The Nullabor is a tree-less desert that spans Australia for over 200,000 square kilometres (77,000 sq mi).'
	},
	australia: {
		text: 'Australia',
		url: 'https://en.wikipedia.org/wiki/Australia',
		title:
			'Australia is a big continent and country in the Southern Hemisphere. It is not upside down, however the toilet does flush the other way.'
	},
	bridge: {
		text: 'Sydney Harbour Bridge',
		url: 'https://en.wikipedia.org/wiki/Sydney_Harbour_Bridge',
		title:
			'The popular old and big bridge in Australia where the fireworks go off.'
	},
	switzerland: {
		text: 'Switzerland',
		url: 'https://en.wikipedia.org/wiki/Switzerland',
		title:
			'Switzerland was the home of my first girlfriend. It is a beautiful snowy country that speaks many languages.'
	},
	austria: {
		text: 'Austria',
		url: 'https://en.wikipedia.org/wiki/Austria',
		title:
			'Austria is a country and home to the city Vienna, it is a beautiful place with tall men.'
	},
	bali: {
		text: 'Bali',
		url: 'https://en.wikipedia.org/wiki/Bali',
		title:
			'Bali is an island in Indonesia and is a popular tourist destination, especially for Australians.'
	},
	toronto: {
		text: 'Toronto',
		url: 'https://en.wikipedia.org/wiki/Toronto',
		title:
			"Toronto is a major city on the east-coast of Cananda. It has some of the best vegan food I've ever had!"
	},
	berlin: {
		text: 'Berlin',
		url: 'https://en.wikipedia.org/wiki/Berlin',
		title:
			'Berlin is a major city in Germany. It is filled with vegan brunch cafes, hipsets, party goers, smokers, and immigrants.'
	},
	myplanet: {
		text: 'Myplanet',
		url: 'http://myplanet.io',
		title:
			"Myplanet is the largest digital consultancy in Cananda. They are filled with awesome people and a terrific culture. One of the best places I've ever worked."
	},
	exhange: {
		text: 'Exchange Student',
		url: 'https://en.wikipedia.org/wiki/Student_exchange_program',
		title:
			'My family has always had exchange students from many different countries stay with us in our home, usually multiple at a time, of which they would stay 1-12 months to travel and to learn English.'
	},
	ocean: {
		text: 'How We Wrecked The Ocean',
		url:
			'http://balupton.tumblr.com/post/76629442596/jeremy-jackson-how-we-wrecked-the-ocean-this',
		title:
			'In this bracing talk, coral reef ecologist Jeremy Jackson lays out the shocking state of the ocean today: overfished, overheated, polluted, with indicators that things will get much worse. Astonishing photos and stats make the case.'
	},
	email: {
		text: 'Email me',
		url: 'mailto:b@lupton.cc',
		title: 'Send me an email'
	},
	burnout: {
		text: 'Burnout',
		url: 'http://burnout.io',
		title:
			'Burnout is a state of emotional, mental, and physical exhaustion caused by excessive and prolonged stress.'
	},
	anomie: {
		text: 'Anomie',
		url: 'https://en.wikipedia.org/wiki/Anomie',
		title:
			'Anomie is a "condition in which society provides little moral guidance to individuals".'
	},
	ausconsent: {
		text: 'Australian Age of Consent Laws',
		url: 'https://aifs.gov.au/cfca/publications/age-consent-laws',
		title: '16 is the legal age of consent in Western Australia'
	},
	wwgb: {
		text: 'Wrong Way, Go Back! Podcast',
		url: 'https://soundcloud.com/wwgbtv',
		title: 'A podcast for the mistakes we make and the learnings from them'
	},
	vdd: {
		text: 'Veronika Decides to Die, Review',
		url: 'https://www.goodreads.com/review/show/1069969061',
		title:
			'My review for the book "Veronika Decides to Die", by Paulo Coelho, with my alternative ending proposal.'
	},
	fountainhead: {
		text: 'The Fountainhead by Ayan Rand',
		url: 'http://www.imdb.com/title/tt0041386/',
		title: 'This movie is a great stand for individual liberty'
	},
	webeng: {
		text: 'Web Engineering',
		url: 'https://en.wikipedia.org/wiki/Web_engineering',
		title:
			'Web engineering focuses on the methodologies, techniques, and tools that are the foundation of Web application development and which support their design, development, evolution, and evaluation.'
	},
	jbpcommunity: {
		text: 'Jordan B Peterson Community',
		url: 'https://jordanbpeterson.community',
		title:
			'I manage the Jordan B Peterson community hub and several of its initiatives; Study Group, Lecture Notes, Podcast, etc'
	},
	jbpstudygroup: {
		text: 'Jordan B Peterson Study Group',
		url: 'https://jordanbpeterson.community/study-group/',
		title:
			'I co-host the Jordan B Peterson Study Group that has been running for over a year now. It serves as a respectful battlefield on philosophy and psychology (needless to say, for people all over the world)'
	},
	jbpyoutube: {
		text: 'Jordan B Peterson Community on YouTube',
		url: 'https://jordanbpeterson.community/youtube/',
		title:
			'I co-host the Jordan B Peterson Community channel on YouTube, we do weekly summary sessions of the discussions that happened earlier in the week'
	},
	quantitativepsychology: {
		text: 'Quantitative Psychology',
		url: 'https://en.wikipedia.org/wiki/Quantitative_psychology',
		title:
			'Quantitative psychology interests me as a frontier that if combined carefully with ethics and technology, will have global business and humanitarian potential - one could improve societal and individual outcomes, using technology to gracefully measure wellbeing, promoting success and inhibiting neurosis, or even to screen for early biological and social markers of psychopathy in children for early treatment, promoting socialisation and inhibiting tragedies'
	},
	philosophy: {
		text: 'Philosophy',
		url: 'https://en.wikipedia.org/wiki/Philosophy',
		title:
			'Philosophy interests me, as it not just important to be a ship that stays afloat in the ocean, but also to be a ship that has a dependable compass, as otherwise, one can easily become a pirate with misguided intentions'
	},
	trading: {
		text: 'Trading',
		url: 'https://github.com/balupton/automated-trading',
		title:
			'Trading interests me, as it is an unlimited supply of money, that with some wit and grace, can be tapped into, consenually and anytime, freeing one up for other things, without waiting for clients'
	},
	ipvmen: {
		text: 'Intimate Partner Violence against Men',
		url:
			'https://www.researchgate.net/publication/51571741_Symptoms_of_Posttraumatic_Stress_Disorder_in_Men_Who_Sustain_Intimate_Partner_Violence_A_Study_of_Helpseeking_and_Community_Samples',
		title:
			'25-50% of intimate partner violence victims are men, and men are more likely to develop PTSD from such encounters'
	},
	// Posts
	'2017ssgs': {
		text: "2017's Generation of Static Site Generators",
		url:
			'https://medium.com/@balupton/2017s-generation-of-static-site-generators-164c3b7b9f97',
		title:
			'In 2017 I anticipate we will see a new generation of static site generator (SSG), with importing and rendering decoupled from one another.'
	},
	// Talks
	burnouttalk: {
		text: 'Benjamin Lupton on Burnout',
		url: 'https://www.youtube.com/watch?v=Lt_oKuaFgrg',
		title: 'A talk of mine on burnout in web development'
	},
	elegant: {
		text: 'Elegantly Produce & Consume Compiled Packages',
		url: 'https://github.com/elegant-talk/elegant',
		title:
			'A talk of mine about elegantly producing and consuming compiled packages'
	},
	nodeconfeu16: {
		text: 'Node.js Interactive Europe 2016',
		url: 'http://events.linuxfoundation.org/events/node-interactive-europe',
		title:
			'The official Node.js Foundation Conference for Europe, held in Amsterdam'
	},
	// Social
	feedly: {
		text: 'Feedly',
		url:
			'http://www.feedly.com/home#subscription/feed/http://feeds.feedburner.com/balupton.atom',
		title: 'Follow me on Feedly',
		color: '#6cc655',
		tags: ['social']
	},
	twitter: {
		text: 'Twitter',
		url: 'https://twitter.com/balupton',
		title: 'Follow me on Twitter',
		color: '#248DCD',
		tags: ['social']
	},
	medium: {
		text: 'Medium',
		url: 'https://medium.com/@balupton',
		title: 'Read my posts on Medium',
		color: '#333332',
		tags: ['social']
	},
	youtube: {
		text: 'YouTube',
		url: 'http://www.youtube.com/user/balupton',
		title: 'View my videos on YouTube',
		color: '#df3333',
		tags: ['social']
	},
	github: {
		text: 'GitHub',
		url: 'https://github.com/balupton',
		title: 'View my code on GitHub',
		color: 'black',
		tags: ['social']
	},
	gists: {
		text: 'GitHub Gists',
		url: 'http://gist.github.com/balupton',
		title: 'View my gists on GitHub',
		color: 'black'
	},
	instagram: {
		text: 'Instagram',
		url: 'https://www.instagram.com/balupton/',
		title: 'View my photos on Instagram',
		color: 'rgb(148, 125, 98)',
		tags: ['social']
	},
	linkedin: {
		text: 'LinkedIn',
		url: 'https://www.linkedin.com/in/balupton',
		title: 'View my profile on LinkedIn',
		color: '#0083B3',
		tags: ['social']
	},
	goodreads: {
		text: 'Goodreads',
		url: 'https://goodreads.com/balupton',
		title: 'Discover the books I read on Goodreads',
		color: '#382110',
		tags: ['social']
	},
	keybase: {
		text: 'Keybase',
		url: 'https://keybase.io/balupton',
		title: 'View my identity on Keybase',
		color: '#ff6f21',
		tags: ['social']
	},
	alternativeto: {
		text: 'AlternativeTo',
		url: 'http://alternativeto.net/user/balupton/',
		title: 'Discover the Apps and Services I use on AlternativeTo.net',
		color: '#5581A6',
		tags: ['social']
	},
	soundcloud: {
		text: 'SoundCloud',
		url: 'https://soundcloud.com/balupton',
		title: 'Listen to the music I like and make on SoundCloud;',
		color: '#f50',
		tags: ['social']
	},
	couchsurfing: {
		text: 'Couchsurfing',
		url: 'http://couchsurfing.com/people/balupton',
		title: 'View my profile on Couchsurfing',
		color: '#ed6542',
		tags: ['social']
	},
	tumblr: {
		text: 'Tumblr',
		url: 'http://tumblr.balupton.com',
		title: 'Read my posts on Tumblr',
		color: '#2c4762',
		tags: ['social']
	},
	runkeeper: {
		text: 'Runkeeper',
		url: 'https://runkeeper.com/user/balupton',
		title: 'Encourage me on Runkeeper',
		color: '#31a4d9',
		tags: ['social']
	},
	vimeo: {
		text: 'Vimeo',
		url: 'https://vimeo.com/balupton',
		title: 'View my videos on Vimeo',
		color: '#27a6d1',
		tags: ['social']
	},
	angellist: {
		text: 'Angel List',
		url: 'http://angel.co/balupton',
		title: 'View my profile on Angel List',
		color: '#333',
		tags: ['social']
	},
	snapchat: {
		text: 'Snapchat',
		url: 'https://www.snapchat.com/add/balupton',
		title: "See what I'm up to via SnapChat",
		color: 'gold',
		tags: ['social']
	},
	// Donate
	collide: {
		text: 'Collide',
		url: 'https://www.collide.com/creator/balupton',
		title: 'Support me on Collide',
		color: '#292929',
		tags: ['social', 'donate']
	},
	bitpatron: {
		text: 'BitPatron',
		url: 'https://vrlps.co/py79b8w/cp',
		title: 'Support me on BitPatron',
		color: '#ff4828',
		tags: ['social', 'donate']
	},
	bitbacker: {
		text: 'BitBacker',
		url: 'https://bitbacker.io/user/balupton/',
		title: 'Support me on BitBacker',
		color: '#258ac1',
		tags: ['social', 'donate']
	},
	flattr: {
		text: 'Flattr',
		url: 'https://flattr.com/profile/balupton',
		title: 'Support me on Flattr',
		color: '#66b115',
		tags: ['social', 'donate']
	},
	liberapay: {
		text: 'Liberapay',
		url: 'https://liberapay.com/balupton',
		title: 'Support me on Liberapay',
		color: '#f6c915',
		tags: ['social', 'donate']
	},
	opencollective: {
		text: 'Open Collective',
		url: 'https://opencollective.com/balupton',
		title: 'View my profile on Open Collective',
		color: 'rgb(51, 133, 255)',
		tags: ['social', 'donate']
	},
	patreon: {
		text: 'Patreon',
		url: 'https://patreon.com/balupton',
		title: 'Support me on Patreon',
		color: '#E6461A',
		tags: ['social', 'donate']
	},
	buymeacoffee: {
		text: 'Buy Me A Coffee',
		url: 'https://www.buymeacoffee.com/balupton',
		title: 'Support me on Buy Me A Coffee',
		color: '#FF813F',
		tags: ['social', 'donate']
	},
	thanksapp: {
		text: 'GiveThanks',
		url: 'https://givethanks.app/u/balupton',
		title: 'Support me on GiveThanks',
		color: '#3c3c3c',
		tags: ['social', 'donate']
	},
	paypal: {
		text: 'Paypal',
		url: 'https://paypal.me/balupton',
		title: 'Support me on Paypal',
		color: '#009cde',
		tags: ['social', 'donate']
	},
	wishlist: {
		text: 'Wishlist',
		url: `http://amzn.com/w/2F8TXKSNAFG4V?tag=${amazonCode}`,
		title: 'Buy me something on my Amazon Wishlist',
		color: 'rgb(228, 121, 17)',
		tags: ['social', 'donate']
	},
	// Sustainability
	sustainability: {
		text: 'Sustainability',
		url: 'http://balupton.tumblr.com/post/79542013417/sustainability',
		title: 'Read my thoughts on Sustainability'
	},
	// Misc
	calendar: {
		text: 'Schedule a Meeting',
		url: 'https://calendly.com/balupton/meet/',
		title: 'Schedule a meeting with me'
	},
	teach: {
		text: 'Teaching by Donation: Web Development',
		url:
			'https://www.eventbrite.com.au/e/teaching-by-donation-web-development-tickets-20723428332',
		title: 'Attend one of my teaching events'
	},
	source: {
		text: 'Website Source Code',
		url: 'https://github.com/balupton/website',
		title: 'View the source code of this website'
	},
	donate: {
		text: 'Donate',
		url: 'https://bevry.me/donate',
		title: 'Donate to my company and open-community'
	},
	contracts: {
		text: 'Contracts I Provide',
		url: 'https://drive.google.com/drive/folders/0B6MqiLy7C3PhZ196SHVSQ2MxU00',
		title:
			"The contract templates I've used with success for my consulting engagements"
	},
	cv: {
		text: 'Curriculum Vitae.',
		url: 'https://www.linkedin.com/dms/C5604AQGsURw218VRYw/profile-profilePdf/',
		title: 'Download my CV from LinkedIn'
	},
	'atlas-shrugged': {
		text: 'Atlas Shrugged',
		title: 'Ayn Rand — Atlas Shrugged',
		url: '/amazon/0451191145',
		tags: ['recommendation', 'book']
	},
	steppenwolf: {
		text: 'Steppenwolf',
		title: 'Hermann Hesse — Steppenwolf',
		url: '/amazon/0875867839',
		tags: ['recommendation', 'book']
	},
	walden: {
		text: 'Walden',
		title: 'Henry David Thoreau — Walden',
		url: '/amazon/1494812509',
		tags: ['recommendation', 'book']
	},
	speakerrate: {
		text: 'SpeakerRate',
		title: "View the trainings I've given on SpeakerRate",
		url: 'http://speakerrate.com/speakers/11963-benjamin-lupton'
	},
	talks: {
		text: 'Talks',
		title: "View the talks I've given via YouTube",
		url:
			'https://www.youtube.com/playlist?list=PLYVl5EnzwqsQs0tBLO6ug6WbqAbrpVbNf'
	},
	'porn-generation': {
		text: 'Porn Generation',
		title:
			'Ben Shapiro — Porn Generation: How Social Liberalism Is Corrupting Our Future',
		url: '/amazon/0895260166',
		tags: ['recommendation', 'book']
	},
	'wright-relationships': {
		text: 'Some Thoughts About Relationships',
		title: 'Colin Wright, Joshua Fields — Some Thoughts About Relationships',
		url: '/amazon/B00XCSPJ5S',
		tags: ['recommendation', 'book']
	}
}

export const linkAliases: LinkAliasMap = {
	degree: 'bcsit',
	gratipay: 'liberapay',
	gittip: 'liberapay',
	circleinternet: 'circlemedia',
	quoinex: 'liquid',
	circlepay: 'circle',
	circlefinance: 'circle',
	acorns: 'raiz',
	trainings: 'speakerrate',
	vegetarian: 'vegan',
	jbpsg: 'jbpstudygroup',
	jbpvids: 'jbpyoutube',
	podcast: 'jbpyoutube',
	podcaster: 'jbpyoutube',
	trader: 'trading',
	'blogs/dev?title=webct_session_stealer_exploit': 'webctexploit',
	'documents/webct_exploits.txt': 'webctexploit',
	author: 'book',
	books: 'bookupdates',
	contract: 'contracts',
	gh: 'github',
	g: 'github',
	t: 'twitter',
	couch: 'couchsurfing',
	couchsurfer: 'couchsurfing',
	resume: 'linkedin',
	meet: 'calendar',
	s: 'sustainability'
}

export default links
