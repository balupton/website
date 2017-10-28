# =================================
# Misc Configuration

# Prepare
version = require('./package.json').version
githubClientId = process.env.BEVRY_GITHUB_CLIENT_ID
githubClientSecret = process.env.BEVRY_GITHUB_CLIENT_SECRET
githubAuthString = "client_id=#{githubClientId}&client_secret=#{githubClientSecret}"
amazonCode = 'balupton07-20'
projects = []
reposGetter = null
links =
	# Referrals
	patreonref:
		text: 'Patreon'
		url: 'https://patreon.com/invite/pbqzz'
		title: 'Use Patreon to earn money from your fanbase'
		color: '#E6461A'
		referral: true
	earthrunners:
		text: 'Earth Runners'
		url: 'http://earthrunners.com?rfsn=763305.e8694'
		title: 'Use Earth Runners as sandals that you can run, hike, and swim in'
		color: '#6dc21d'
		referral: true
	wirex:
		text: 'Wirex'
		url: 'https://app.wirexapp.com/join/gSPGAXe7_EOtVw3hNfaHtA'
		title: 'Use Wirex for your virtual and physical cryptocurrency cards'
		color: '#3fb1ab'
		referral: true
	tradingview:
		text: 'TradingView'
		url: 'http://tradingview.go2cloud.org/aff_c?offer_id=2&aff_id=4529'
		title: 'Use TradingView for all your trading insights'
		color: '#3BB3E4'
		referral: true
	drivewealth:
		text: 'DriveWealth'
		url: 'https://drivewealth.com/refer?r=A74082&name=Benjamin'
		title: 'Use DriveWealth to invest in USA companies, even if you live outside of the USA'
		color: '#FEC108'
		referral: true
	bonsai:
		text: 'Bonsai'
		url: 'https://app.hellobonsai.com/invite/fd7b3daf'
		title: 'Use Bonsai for all your invoicing, time tracking, and freelancing needs'
		color: '#00B289'
		referral: true
	aftership:
		text: 'Aftership'
		url: 'https://www.aftership.com/?ref=B-HGKM6H2PW'
		title: 'Use Aftership to track your deliveries'
		color: '#e77f11'
		referral: true
	downpour:
		text: 'Downpour'
		url: 'https://click.linksynergy.com/fs-bin/click?id=RltaJog6pRs&offerid=316894.4&subid=0&type=4'
		title: 'Use Downpour for your audiobook needs'
		color: '#2c3033'
		referral: true
	hired:
		text: 'Hired'
		url: 'https://hired.com/x/1i4hs'
		title: 'Use Hired to get offers from the best companies around the world'
		color: '#323241'
		referral: true
	ebay:
		text: 'Ebay'
		url: 'https://rover.ebay.com/rover/1/705-53470-19255-0/1?icep_ff3=1&pub=5575197898&toolid=10001&campid=5337916977&customid=&ipn=psmain&icep_vectorid=229515&kwid=902099&mtid=824&kw=lg'
		title: 'Use Ebay to buy and sell online'
		color: '#f3ad29'
		referral: true
	amazon:
		text: 'Amazon'
		url: "https://www.amazon.com/?tag=#{amazonCode}"
		title: 'Use Amazon to buy books'
		color: 'rgb(228, 121, 17)'
		referral: true
	airbnb:
		text: 'AirBnB'
		url: 'https://www.airbnb.com.au/c/benjaminl3638'
		title: 'Use AirBnB to book accomodation when traveling'
		color: '#ff5a5f'
		referral: true
	awaytravel:
		text: 'Away Travel'
		url: 'http://fbuy.me/errs2'
		title: 'Use Away Travel for your luggage'
		color: '#00344B'
		referral: true
	acorns:
		text: 'Acorns'
		url: 'https://app.acornsau.com.au/invite/83UNQY'
		title: 'Use Acorns to open an Australian investment account'
		color: '#54bd45'
		referral: true
	n26:
		text: 'N26 Bank'
		url: 'mailto:b@lupton.cc?subject=Send%20me%20a%20N26%20invite%20please!'
		title: 'Use N26 Bank for European and International banking'
		color: '#26afb8'
		referral: true
	transferwise:
		text: 'TransferWise'
		url: 'https://transferwise.com/u/bff1c1'
		title: 'Use TransferWise to avoid international transfer fees'
		color: '#223049'
		referral: true
	coinbase:
		text: 'Coinbase'
		url: 'https://www.coinbase.com/join/516032d5fc3baa863b000010'
		title: 'Use Coinbase to exchange, send and receive bitcoin'
		color: '#2B71B1'
		referral: true
	circlefinance:
		text: 'Circle Finance'
		url: 'https://www.circle.com/invite/DTIKU0'
		title: 'Use Circle Finance to exchange, send and receive bitcoin'
		color: '#aacc38'
		referral: true
	surfeasy:
		text: 'SurfEasy'
		url: 'https://srfez.com/NF6AYREKBA'
		title: 'Use SurfEasy as your secure anonymous VPN (used by Opera)'
		color: '#46d186'
		referral: true
	windscribe:
		text: 'Windscribe'
		url: 'https://windscribe.com/?affid=rztkyips'
		title: 'Use Windscribe as your secure anonymous VPN'
		color: '#52a5d8'
		referral: true
	namedomains:
		text: 'Name.com'
		url: 'https://www.name.com/referral/1d41c5'
		title: 'Use Name.com to purchase domain names'
		color: '#90c547'
		referral: true
	googleapps:
		text: 'Google Apps'
		url: 'https://goo.gl/vEb9bM'
		title: 'Use Google Apps for Work to setup Google Accounts for your own website'
		color: '#5F7D8C'
		referral: true
	trello:
		text: 'Trello'
		url: 'https://trello.com/balupton/recommend'
		title: 'Use Trello to organise your projects via collaborating via virtual todo notes'
		color: '#026AA7'
		referral: true
	iherb:
		text: 'iHerb'
		url: 'http://www.iherb.com/iherb-brands?rcode=DNF509'
		title: 'Use iHerb to buy supplements'
		color: '#458500'
		referral: true
	koding:
		text: 'Koding'
		url: 'https://koding.com/R/balupton'
		title: 'Use Koding to code in the cloud'
		color: '#656565'
		referral: true
	updown:
		text: 'Updown'
		url: 'https://updown.io/r/hl1b0'
		title: 'Use Updown for website status alerts'
		color: '#5c4'
		referral: true
	vultr:
		text: 'Vultr'
		url: 'http://www.vultr.com/?ref=7196060'
		title: 'Use Vultr to host yout apps on virtual machiens in the cloud'
		color: '#1e88e5'
		referral: true
	digitalocean:
		text: 'Digital Ocean'
		url: 'https://m.do.co/c/3b1047be3444'
		title: 'Use Digital Ocean to host your apps on virtual machines in the cloud'
		color: '#288feb'
		referral: true
	hypersh:
		text: 'Hyper.sh'
		url: 'https://console.hyper.sh/register/invite/Eb9g6Ml6mGtNNdeRKe6ztaAkMR42rdc6'
		title: 'Use Hyper.sh to host docker apps in the cloud'
		color: '#172b46'
		referral: true
	rescuetime:
		text: 'Rescue Time'
		url: 'http://rescuetime.com/ref/242226'
		title: 'Use Rescue Time to track your computer activity to figure out where you time goes'
		color: '#65a86f'
		referral: true
	dropbox:
		text: 'Dropbox'
		url: 'https://db.tt/XFuEv8vB'
		title: 'Use Dropbox to host sync your local files into the cloud'
		color: '#007ee5'
		referral: true
	screenflow:
		text: 'Screenflow'
		url: 'https://store.telestream.net/affiliate.php?ACCOUNT=TELESTRE&AFFILIATE=45446&PATH=http://www.telestream.net/screenflow/'
		title: 'Use Screenflow to do screencasts'
		color: '#009bdf'
		referral: true
	airtasker:
		text: 'Airtasker'
		url: 'http://mail.airtasker.com/wf/click?upn=JalSgYCkT0ZI-2Bw45xk4vmrAhDtJvUSrWoM8aOtgnYf-2FjzVj6Pr4xUEHxebs5pQnF420bjJweZagd9p-2FeHbDWuA-3D-3D_xg4Iuf5a2mwDa1KxKgyCbGVAHupcFAbxI8rKgjLgfgN5LbOhe9IqDQ4AORWS7MaJNK4-2FmWOjfLAvOJ0obbOKpVy7UePSfIBv2WsQJD9fPJ-2FybjZfT0gi6vvQ0cPNheFa-2BKhswj67JD4w46eREx1VZ4mxLcxds-2FTEa6IP8wK0Y4xpDADJzR2vH0aGgJ-2BtKiP-2Fb-2BPS-2B8-2FcR7doTWuo9CAv7ZF-2FHQLbUzR2SZ2ZVSLY95Q-3D'
		title: 'Use Airtasker to delegate physical tasks to minions'
		color: '#007fad'
		referral: true
	fancyhands:
		text: 'Fancy Hands'
		url: 'http://www.fancyhands.com/r/8c2e46df0aa7'
		title: 'Use Fancy Hands to delegate information tasks to minions'
		color: '#db5344'
		referral: true
	zapier:
		text: 'Zapier'
		url: 'http://zpr.io/AhX'
		title: 'Use Zapier to automate your digital workflows'
		color: '#ff4a00'
		referral: true
	amaysim:
		text: 'Amaysim'
		url: 'http://amaysi.ms/balupton'
		title: 'Use Amaysim for your phone plan in Australia'
		color: '#e65014'
		referral: true
	audiojungle:
		text: 'Audio Jungle'
		url: 'http://audiojungle.net/?ref=balupton'
		title: 'Use Audio Jungle to purchase audio for videos'
		color: '#82b440'
		referral: true
	themeforest:
		text: 'Theme Forest'
		url: 'http://themeforest.net/?ref=balupton'
		title: 'Use Theme Forest to purchase themes for websites'
		color: '#7bc4c4'
		referral: true
	circle:
		text: 'Circle'
		url: 'http://mbsy.co/dSfLv'
		title: 'Use Circle to track and limit your internet usage over any device'
		color: '#00b7d9'
		referral: true
	
	# Links
	peac:
		text: 'PEAC'
		url: 'http://www.det.wa.edu.au/redirect/?oid=MultiPartArticle-id-11045758'
		title: 'Primary Extension and Challenge (PEAC) is a part-time program for public school children in Years 5, 6 and 7. Children participate in a range of innovative and challenging programs offered in a variety of ways. Children are withdrawn from regular class to attend PEAC programs.'
	husband:
		text: 'Husband'
		url: 'http://h.lupton.cc'
		title: "Helen Lupton is my amazing wife. Learn about Helen on her blog."
	opencollaboration:
		text: 'Open-Collaboration'
		url: 'https://github.com/bevry/goopen'
		title: "Open-Collaboration is the notion that we can all work together freely and liberally to accomplish amazing things. It's what I dedicate my life too. Learn about Open-Collaboration via the Go Open Campaign."
	freeculture:
		text: 'Free Culture'
		url: 'http://en.wikipedia.org/wiki/Free_culture_movement'
		title: 'Free Culture is the notion that everything should be free, in terms of free as in no money needed, and free as in people can re-use it liberally. Learn about Free Culture on Wikipedia.'
	book:
		text: 'Intentionally Left Blank'
		url: 'https://gumroad.com/l/vKuF'
		title: '''Author of the mostly likely not the best non-best selling book in cultural literature right now.'''
	bookupdates:
		text: 'Book Newsletter'
		url: 'https://confirmsubscription.com/h/r/36CE01ACCFE65688'
		title: 'Subscribe for updates when I publish new books'
	books: 'bookupdates'
	privileged:
		text: 'privileged'
		url: 'https://www.youtube.com/watch?v=cRsYwu8uD4I'
		title: 'Privileged, yes, no?'
	male:
		text: 'male'
		url: 'https://www.youtube.com/watch?v=vp8tToFv-bA&list=PLYVl5EnzwqsRPSBKIn6qMatpxWopxs1eB'
		title: 'Interesting analysis of gender roles and issues'
	ausvsusa:
		text: 'Australia vs America'
		url: 'https://youtu.be/u--1_WrGpZo'
		title: 'Comedic sketch comparing the potential for gangsta rappers from Australia and America'
	simpleliving:
		text: 'Simple Living'
		url: 'https://en.wikipedia.org/wiki/Simple_living'
		title: '''Simple living encompasses a number of different voluntary practices to simplify one's lifestyle. These may include reducing one's possessions, generally referred to as Minimalism, or increasing self-sufficiency, for example.'''
	nomad:
		text: 'Global Nomad'
		url: 'https://en.wikipedia.org/wiki/Global_nomad'
		title: 'Global nomad is a term applied to people who are living a mobile and international lifestyle.'
	v:
		text: 'Vegan'
		url: 'https://github.com/balupton/plant-vs-animal-products/blob/master/README.md#readme'
		title: '''Veganism is the stance that other lives are not ours to own. Vegans commonly associate this with the practice of reducing their harm to all lives, primarily through a strict-vegetarian diet and lifestyle. Learn about what turned me vegan.'''
	vegan:
		text: 'Vegan'
		url: 'http://medium.com/p/c60913a8ca5b'
		title: '''Veganism is the stance that other lives are not ours to own. Vegans commonly associate this with the practice of reducing their harm to all lives, primarily through a strict-vegetarian diet and lifestyle. Learn about what turned me vegan.'''
	vegetarian: 'vegan'
	ahimsa:
		text: 'Ahimsa'
		url: 'https://en.wikipedia.org/wiki/Ahimsa'
		title: 'Ahimsa is referred to as nonviolence, and it applies to all living beings - including all animals - according to many Indian religions.'
	agnostic:
		text: 'Agnostic'
		url: 'http://en.wikipedia.org/wiki/Agnostic'
		title: 'Agnosticism is the understanding that one cannot prove the existance or non-existance of something that is not observable, therefore agnostics do not take a theist or athiest stance. Learn about Agnosticism on Wikipedia.'
	pantheist:
		text: 'Pantheist'
		url: 'http://en.wikipedia.org/wiki/Pantheism'
		title: 'Pantheism is a stance that believes the notion of God is synonymous with the notion of the Universe. Learn about Pantheism on Wikipedia.'
	docpad:
		text: 'DocPad'
		url: 'https://docpad.org'
		title: 'DocPad is a static site generator built with Node.js. Learn about DocPad on its website.'
	hostel:
		text: 'Startup Hostel'
		url: 'https://startuphostel.org'
		title: 'Startup Hostel is a co-work and co-live initiative. Learn about Startup Hostel on its website.'
	hostellist:
		text: 'Setup Hostels around the world'
		url: 'https://startuphostel.org/compare'
		title: 'There are now more than 30 Startup Hostels around the world!'
	historyjs:
		text: 'History.js'
		url: 'https://github.com/browserstate/history.js'
		title: 'History.js lets you create cross-browser stateful web applications. Learn about History.js on its website.'
	taskgroup:
		text: 'TaskGroup'
		url: 'https://github.com/bevry/taskgroup'
		title: 'The true solution to callback hell. Robust, simple, and consistent. Group together synchronous and asynchronous tasks and execute them with support for concurrency, naming, and nesting.'
	bevry:
		text: 'Bevry'
		url: 'https://bevry.me'
		title: 'Bevry is the open-company and community that I founded in 2011, it\'s a great thing. Learn about Bevry on its website.'
	lossleader:
		text: 'Loss-Leader'
		url: 'https://en.wikipedia.org/wiki/Loss_leader'
		title: 'A loss leader is a pricing strategy where a product is sold at a price below its market cost to stimulate other sales of more profitable goods or services.'
	webwrite:
		text: 'Web Write'
		url: 'https://github.com/webwrite'
		title: '''Web Write is an open-source initiative to create a series of admin interfaces that work with any backend. Learn more about Web Write on its website.'''
	kasper:
		text: 'Kasper Tidemann'
		url: 'http://www.kaspertidemann.com'
		title: 'CEO at Tidemann&Co. Lover of life, the universe, and everything in between. I speak web, JavaScript, Go, NoSQL, and more. Dreams burn but in ashes are gold.'
	lightbox:
		text: 'jQuery Lightbox Plugin'
		url: 'https://github.com/balupton/jquery-lightbox'
		title: 'Lightboxes are a way to display an image on the same web page simply and elegantly.'
	services:
		text: 'Services'
		url: 'https://bevry.me/services'
		title: '''View my company's services'''
	opensource:
		text: 'Open-Source'
		url: 'http://en.wikipedia.org/wiki/Open-source_software'
		title: 'Open-Source is the releasing of the original format of something so that others can improve on it freely. Learn about Open-Source on Wikipedia.'
	html:
		text: 'HTML'
		url: 'http://en.wikipedia.org/wiki/HTML'
		title: 'HTML is the langauge that the content of websites are written in. Learn about HTML on Wikipedia.'
	coffeescript:
		text: 'CoffeeScript'
		url: 'http://coffeescript.org'
		title: 'CoffeeScript is a high-level language that compiles to JavaScript. Learn about CoffeeScript on its website.'
	javascript:
		text: 'JavaScript'
		url: 'http://en.wikipedia.org/wiki/JavaScript'
		title: 'JavaScript is the language that makes website interactive. It powers the web. Learn about JavaScript on Wikipedia.'
	ecmascript:
		text: 'ECMAScript'
		url: 'https://en.wikipedia.org/wiki/ECMAScript'
		title: 'ECMAScript is the scripting-language specification behind languages such as JavaScript, JScript and ActionScript that have come into wide use for client-side scripting on the Web.'
	flash:
		text: 'Flash'
		url: 'https://en.wikipedia.org/wiki/Adobe_Flash_Player'
		title: 'Adobe Flash is used for viewing multimedia, executing rich Internet applications, and streaming video and audio.'
	actionscript:
		text: 'ActionScript'
		url: 'https://en.wikipedia.org/wiki/ActionScript'
		title: 'ActionScript is used primarily for the development of websites and software targeting the Adobe Flash Player platform.'
	swift:
		text: 'Swift'
		url: 'https://en.wikipedia.org/wiki/Swift_(programming_language)'
		title: 'Swift is a high-level programming language used to create powerful applications.'
	c:
		text: 'C'
		url: 'https://en.wikipedia.org/wiki/C_%28programming_language%29'
		title: 'C is a low-level programming language used to create powerful applications.'
	csharp:
		text: 'C#'
		url: 'https://en.wikipedia.org/wiki/C_Sharp_(programming_language)'
		title: 'C# is a high-level programming language used to create powerful applications.'
	pascal:
		text: 'Pascal'
		url: 'https://en.wikipedia.org/wiki/Pascal_(programming_language)'
		title: 'Pascal is a historically influential imperative and procedural programming language as a small and efficient language intended to encourage good programming practices using structured programming and data structuring.'
	cobol:
		text: 'COBOL'
		url: 'https://en.wikipedia.org/wiki/COBOL'
		title: 'COBOL is a compiled English-like computer programming language designed for business use.'
	asp:
		text: 'ASP'
		url: 'https://en.wikipedia.org/wiki/Active_Server_Pages'
		title: 'Active Server Pages and ASP.net are server-side script engines used to create dynamically generated web pages.'
	perl:
		text: 'Perl'
		url: 'https://en.wikipedia.org/wiki/Perl'
		title: 'Perl is a family of high-level, general-purpose, interpreted, dynamic programming languages. '
	php:
		text: 'PHP'
		url: 'https://en.wikipedia.org/wiki/PHP'
		title: 'PHP is a server-side scripting language designed for web development but also used as a general-purpose programming language.'
	itunes:
		text: 'iTunes'
		url: 'https://itunes.apple.com'
		title: 'iTunes is a media player, media library, online radio broadcaster, and mobile device management application developed by Apple Inc.'
	dll:
		text: 'DLL'
		url: 'https://en.wikipedia.org/wiki/Dynamic-link_library'
		title: 'Dynamic-Link Library files are used to expose Application Programming Interfaces that different applications can use to expose functionality to each other.'
	nodejs:
		text: 'Node.js'
		url: 'http://nodejs.org/'
		title: 'Node.js is JavaScript on the backend, it lets frontend web developers code web servers and desktop applications. Its really cool. Learn about Node.js on its website.'
	balupton:
		text: 'Benjamin Lupton'
		url: 'https://balupton.com'
		title: 'Visit website'
	author:
		text: 'Benjamin Lupton'
		url: 'https://balupton.com'
		title: 'Visit website'
	contact:
		text: 'Contact'
		url: '/#contact'
		title: 'Contact me'
		cssClass: 'contact-button'
	referrals:
		text: 'Referrals'
		url: '/#referrals'
	trich:
		text: 'Trichotillomania'
		url: 'http://www.trich.org/about/hair-faqs.html'
		title: '''Along with up to 10% of the population by some estimates, I happen to have trichotillomania (obsessive compulsive hair pulling) that for me, occurs in times of emotional despair, once every few years. It's time the mental illness stigma goes away. Learn about Trichotillomania on the TLC Learning Centre.'''
	poly:
		text: 'Polyamorous'
		url: 'https://en.wikipedia.org/wiki/Polyamory'
		title: 'Polyamory is the practice, desire, or acceptance of intimate relationships that are not exclusive with respect to other sexual or intimate relationships, with knowledge and consent of everyone involved.'
	openrel:
		text: 'Open Relationships'
		url: 'https://en.wikipedia.org/wiki/Open_relationship'
		title: 'An open relationship is an interpersonal relationship in which the parties want to be together but agree to a form of a non-monogamous relationship.'
	closedrel:
		text: 'Closed Relationship'
		url: 'https://en.wikipedia.org/wiki/Monogamy'
		title: 'Monogamy is a form of relationship in which an individual has only one partner during his or her lifetime or at any one time.'
	sexpos:
		text: 'Sexual Positivity'
		url: 'https://en.wikipedia.org/wiki/Sex-positive_movement'
		title: 'The sex-positive movement is a social movement which promotes and embraces sexuality with few limits beyond an emphasis on safe sex and the importance of consent. Sex positivity is "an attitude towards human sexuality that regards all consensual sexual activities as fundamentally healthy and pleasurable, and encourages sexual pleasure and experimentation.'
	bachelorpad:
		text: 'Bachelor Pad'
		url: 'https://en.wikipedia.org/wiki/Bachelor_pad'
		title: 'A bachelor pad is a slang term for a house (pad) in which a bachelor or bachelors (single men) live.'
	pua:
		text: 'Pickup Artistry'
		url: 'https://en.wikipedia.org/wiki/Seduction_community'
		title: 'Pickup Artistry focuses around communities of men and women whose goal is to improve their inter-gender social skills, of which seduction is a primary aspect. It is essentially women magazines for men.'
	personaldev:
		text: 'Personal Devleopment'
		url: 'https://en.wikipedia.org/wiki/Personal_development'
		title: 'Personal development covers activities that improve awareness and identity, develop talents and potential, build human capital and facilitate employability, enhance quality of life and contribute to the realization of dreams and aspirations.'
	mindful:
		text: 'Mindfulness'
		url: 'https://en.wikipedia.org/wiki/Mindfulness'
		title: 'The practice of mindfulness involves being aware moment-to-moment, of one’s subjective conscious experience from a first-person perspective.'
	tolle:
		text: 'Eckhart Tolle'
		url: 'https://en.wikipedia.org/wiki/Eckhart_Tolle'
		title: 'Eckhart is a spiritual teacher and author who was born in Germany and educated at the Universities of London and Cambridge.'
	paulo:
		text: 'Paulo Coelho'
		url: 'https://en.wikipedia.org/wiki/Paulo_Coelho'
		title: 'Paulo Coelho is a Brazilian lyricist and novelist. He is the recipient of numerous international awards. The Alchemist, his most famous novel, has been translated into 80 languages.'
	nlp:
		text: 'Neuro-Linguistic Programming'
		url: 'https://en.wikipedia.org/wiki/Neuro-linguistic_programming'
		title: 'Neuro-linguistic programming (NLP) is an approach to communication, personal development, and psychotherapy created by Richard Bandler and John Grinder in California, United States in the 1970s. Its creators claim a connection between the neurological processes ("neuro"), language ("linguistic") and behavioral patterns learned through experience ("programming") and that these can be changed to achieve specific goals in life.'
	hypno:
		text: 'Hypnotherapy'
		url: 'https://en.wikipedia.org/wiki/Hypnotherapy'
		title: 'Hypnotherapy is a form of psychotherapy used to create subconscious change in a patient in the form of new responses, thoughts, attitudes, behaviours or feelings.'
	extremelife:
		text: 'Extreme Lifestyle Experiments'
		url: 'https://www.youtube.com/watch?v=W6cAR2eQHUU'
		title: 'A controlled change in your lifestyle undertaken for a period of time intended to give you new perspective.'
	halo3:
		text: 'Halo 3'
		url: 'https://en.wikipedia.org/wiki/Halo_3'
		title: 'Halo 3 is a 2007 first-person shooter video game developed by Bungie for the Xbox 360 console.'
	roadtrips:
		text: 'Road Trips'
		url: 'https://en.wikipedia.org/wiki/Road_trip'
		title: 'A road trip is a long distance journey on the road. Typically, road trips are long distances traveled by automobile; especially RVs.'
	pool:
		text: 'Pool Billiards'
		url: 'https://en.wikipedia.org/wiki/Pool_(cue_sports)'
		title: 'Pool, also more formally known as pocket billiards (mostly in North America) or pool billiards (mostly in Europe and Australia), is the family of cue sports and games played on a pool table having six receptacles called pockets along the rails, into which balls are deposited as the main goal of play.'
	moneyless:
		text: 'Moneyless Living'
		url: 'http://www.moneylessmanifesto.org'
		title: 'Moneyless living is a life abstaining from direct use of money, instead using excess and natural methods of meeting life\'s demands.'
	lentil:
		text: 'Lentil as Anything'
		url: 'https://en.wikipedia.org/wiki/Lentil_as_Anything'
		title: 'Lentil as Anything is a not-for-profit volunteer based pay-what you want restaraunt. It\'s Sydney location is completely vegan, containing a restaraunt and mocktail bar. It\'s a great place to hang out.'
	paycan:
		text: 'Pay What You Can'
		url: 'https://en.wikipedia.org/wiki/Pay_what_you_can'
		title: 'Pay what you can is a non-profit or revenue driven plan of action which does not rely on upon set costs for its merchandise, but rather requests that clients pay what they feel the item or administration is worth to them.'
	hitch:
		text: 'Hitchhiking'
		url: 'https://en.wikipedia.org/wiki/Hitchhiking'
		title: 'Hitchhiking is a means of transportation that is gained by asking people, usually strangers, for a ride in their automobile or other road vehicle. A ride is usually, but not always, free.'
	walk:
		text: 'Bibbulmum Track'
		url: 'https://www.bibbulmuntrack.org.au'
		title: 'The Bibbulmun Track is one of the world’s great long distance walk trails, stretching 1000km from Kalamunda in the Perth Hills, to Albany on the south coast, winding through the heart of the scenic South West of Western Australia.'
	tafe:
		text: 'Central TAFE'
		url: 'https://central.wa.edu.au/aboutus/'
		title: 'Central TAFE provides technical and vocational trainings in Western Australia.'
	comosec:
		text: 'Como Secondary College'
		url: 'https://en.wikipedia.org/wiki/Como_Secondary_College'
		title: 'Como Secondary College is a public, co-educational state high school in Western Australia.'
	ssst:
		text: 'Specialist Studies in Science &amp; Technology'
		url: 'http://www.como.wa.edu.au/EMITS.62.0.html'
		title: 'The EMITS (formerly SSST) program offers students of above average ability in the mathematics, science and technology fields an exciting and challenging program of learning to build a solid knowledge and skills base for further university studies.'
	hockeyacad:
		text: 'Hockey Academy'
		url: 'http://www.como.wa.edu.au/Hockey-Academy.59.0.html'
		title: 'Students at the Hockey Academy receive a diverse hockey experience with the major focus being given to skill development and game strategy.'
	hockey:
		text: 'Field Hockey'
		url: 'https://en.wikipedia.org/wiki/Field_hockey'
		title: 'Field hockey is played with a ball on natural grass, or on sand-based or water based artificial turfs with a small hard ball.'
	aoe:
		text: 'Age of Empires'
		url: 'https://en.wikipedia.org/wiki/Age_of_Empires_II'
		title: 'Age of Empires II: The Age of Kings is a real-time strategy (RTS) video game developed by Ensemble Studios and published by Microsoft.'
	highschool:
		text: 'High School'
		url: 'https://en.wikipedia.org/wiki/Secondary_education#Australia'
		title: 'Australia utilises High Schools to achieve Secondary Education for teenagers. It is the schooling between Primary Education and University.'
	diplomaweb:
		text: 'Diploma of Website Design & Development'
		url: 'http://www.myskills.gov.au/courses/details?Code=ICT50615'
		title: 'This qualification provides the skills and knowledge for an individual to design, build and manage websites as an independent web developer or as part of a team.'
	cannabis:
		text: 'Cannabis'
		url: 'https://en.wikipedia.org/wiki/Cannabis_(drug)'
		title: 'Cannabis is a psychoactive drug often consumed for its mental and physical effects, such as heightened mood, relaxation, and an increase in appetite.'
	lsd:
		text: 'LSD'
		url: 'https://en.wikipedia.org/wiki/Lysergic_acid_diethylamide'
		title: 'LSD (also called acid) is a psychedelic drug well known for its psychological effects—which can include altered thinking processes, closed-and open-eye visuals, synesthesia, an altered sense of time, and spiritual experiences.'
	mdma:
		text: 'MDMA'
		url: 'https://en.wikipedia.org/wiki/MDMA'
		title: 'MDMA (also called Ecstacy) is a psychoactive drug that is consumed primarily for its euphoric and empathogenic effects.'
	panic:
		text: 'Panic Attack'
		url: 'https://en.wikipedia.org/wiki/Panic_attack'
		title: 'Panic attacks are periods of intense fear or apprehension of sudden onset accompanied by at least four or more bodily or cognitive symptoms (such as heart palpitations, dizziness, shortness of breath, or feelings of unreality) and of variable duration from minutes to hours.'
	anxiety:
		text: 'Generalised Anxiety Panic Disorder'
		url: 'https://en.wikipedia.org/wiki/Generalized_anxiety_disorder'
		title: 'Generalized anxiety disorder (GAD) is an anxiety disorder characterized by excessive, uncontrollable and often irrational worry, that is, apprehensive expectation about events or activities.'
	bucket:
		text: 'Stress Bucket'
		url: 'https://student.unsw.edu.au/sites/all/files/uploads/CAPS/Stress%20Bucket.pdf'
		title: 'Too much stress will cause our stress bucket to overflow. By using our coping skills we can keep our stress levels down.'
	depersonalisation:
		text: 'Depersonalisation Disorder'
		url: 'https://en.wikipedia.org/wiki/Depersonalization_disorder'
		title: '''Depersonalization is described as feeling disconnected or estranged from one's body, thoughts, or emotions. Individuals experiencing depersonalization may report feeling as if they are in a dream or are watching themselves in a movie.'''
	night:
		text: 'Night Terrors'
		url: 'https://en.wikipedia.org/wiki/Night_terror'
		title: 'During night terror bouts, patients are usually described as "bolting upright" with their eyes wide open and a look of fear and panic on their faces. They will often scream.'
	gp:
		text: 'GP'
		url: 'https://en.wikipedia.org/wiki/General_practitioner#Australia'
		title: 'A doctor based in the community who treats patients with minor or chronic illnesses and refers those with serious conditions to a hospital.'
	psych:
		text: 'Clinical Psychiatrist'
		url: 'https://en.wikipedia.org/wiki/Clinical_psychology'
		title: 'Clinical psychology is an integration of the science, theory and clinical knowledge for the purpose of understanding, preventing, and relieving psychologically-based distress or dysfunction and to promote subjective and behavioural well-being and personal development.'
	livemessenger:
		text: 'Windows Live Messenger'
		url: 'https://en.wikipedia.org/wiki/Windows_Live_Messenger'
		title: 'Windows Live Messenger was a popular instant messaging client developed for multiple Microsoft platforms.'
	webct:
		text: 'WebCT'
		url: 'https://en.wikipedia.org/wiki/WebCT'
		title: 'WebCT also called Blackboard Learning System, is an online proprietary virtual learning environment system that is licensed to colleges and other institutions and used in many campuses for e-learning.'
	webctexploit:
		text: 'WebCT Security Advisory'
		url: 'https://gist.github.com/balupton/3cb9a0e066ebb899d2be'
		title: 'My first security advisory: WebCT 4.x Javascript Session Stealer Exploits'
	'blogs/dev?title=webct_session_stealer_exploit': 'webctexploit'
	'documents/webct_exploits.txt': 'webctexploit'
	degree:
		text: 'Bachelor of Computer Science (Information Technology)'
		url: 'http://archive.handbook.curtin.edu.au/february2006/courses/14/143010.html'
		title: 'The Bachelor of Science (Information Technology) course focuses on the overall discipline of information technology which covers the more technological and applied aspects of computing, with less emphasis on theory. Some of these areas range from system programming to software design and engineering, networking - including Internet and the web, artificial intelligence for decision support and graphics. Information technology graduates continue to be in demand as computing is one of the biggest growth areas in the world.'
	curtin:
		text: 'Curtin University'
		url: 'https://en.wikipedia.org/wiki/Curtin_University'
		title: 'Curtin University is an Australian public university based in Bentley, Perth, Western Australia.'
	gentics:
		text: 'Gentics'
		url: 'http://www.gentics.com/genticscms/index.en.html'
		title: 'Gentics Software stands for future-oriented design and trustworthy products backed by a curious and enthusiastic team.'
	acidgreen:
		text: 'Acid Green'
		url: 'http://www.acidgreen.com.au'
		title: 'Founded in 2000, acidgreen is an award winning full service digital agency offering premium web design, web development, ecommerce and internet marketing services.'
	bugherd:
		text: 'BugHerd'
		url: 'http://bugherd.com'
		title: 'BugHerd is the world\'s easist bug tracker, a way to capture client feedback, resolve issues and manage your projects.'
	spa:
		text: 'Client-Side Web Application'
		url: 'https://en.wikipedia.org/wiki/Single-page_application'
		title: 'A single-page application is a web application or web site that fits on a single web page with the goal of providing a more fluent user experience similar to a desktop application.'
	aloha:
		text: 'Aloha Editor'
		url: 'http://www.alohaeditor.org/'
		title: 'Aloha Editor is an open source WYSIWYG editor that can be used in webpages. Aloha Editor aims to be easy to use and fast in editing, and allows advanced inline editing.'
	alohadevcon:
		text: 'Aloha Editor Dev Con'
		url: 'https://www.youtube.com/watch?v=btxLv8MPsJI'
		title: 'Aloha Editor Dev Con was held in Vienna, Austria in 2011 and went for 2 weeks.'
	metarefresh:
		text: 'Meta Refresh'
		url: 'https://metarefresh.in/2013/'
		title: 'Meta Refresh is a conference on the construction of user experience on the web. The 2013 edition is about letting go.'
	bangalore:
		text: 'Bangalore'
		url: 'https://en.wikipedia.org/wiki/Bangalore'
		title: 'Bangalore is the silicon-valley of India. A place with awesome tech, awesome people, and awesome food.'
	whysucks:
		text: 'Why The Next Big Thing Sucks!'
		url: 'https://www.youtube.com/watch?v=nt4Gt6-T8N0'
		title: '''We're coders, not hipsters. We're here to change the world, not be swept up by change.'''
	queryengine:
		text: 'Query-Engine'
		url: 'https://github.com/bevry/query-engine'
		title: 'Live collections are collections that when a model is changed, added or removed, the model is automatically tested against the collection\'s queries, filters, and search string, if the model fails, it is removed from the collection.'
	crossbrowser:
		text: 'Cross-Browser'
		url: 'https://en.wikipedia.org/wiki/Cross-browser'
		title: 'Cross-browser refers to the ability of a website, web application, HTML construct or client-side script to function in environments that provide its required features and to bow out or degrade gracefully when features are absent or lacking.'
	screenshot:
		text: 'Screenshot'
		url: 'https://en.wikipedia.org/wiki/Screenshot'
		title: 'A screenshot, screen capture (or screen-cap), screen dump or screengrab is an image taken by a person to record the visible items displayed on the monitor, television, or other visual output device in use.'
	extension:
		text: 'Browser Extension'
		url: 'https://en.wikipedia.org/wiki/Browser_extension'
		title: 'A browser extension is a computer program that extends the functionality of a web browser in some way.'
	b2evo:
		text: 'b2evolution'
		url: 'http://b2evolution.net'
		title: 'b2evolution is a powerful content and community management system written in PHP and backed by a MySQL database.'
	wordpress:
		text: 'WordPress'
		url: 'https://wordpress.org'
		title: 'b2evolution is a beautiful content and community management system written in PHP and backed by a MySQL database.'
	perth:
		text: 'Perth'
		url: 'https://en.wikipedia.org/wiki/Perth'
		title: 'Perth is my home-town. It is the capital city of Western Australia and the 4th most populous city in Australia, though with a small-town feel.'
	sydney:
		text: 'Sydney'
		url: 'https://en.wikipedia.org/wiki/Sydney'
		title: 'I spent 5 years living in Sydney with my partner. It is a place where money, suits, and smokers live.'
	uluru:
		text: 'Uluru'
		url: 'https://en.wikipedia.org/wiki/Uluru'
		title: 'Uluru (also called Ayres Rock) is the humongous rock in the center of Australia that tourists come to see.'
	nullabor:
		text: 'Nullabor'
		url: 'https://en.wikipedia.org/wiki/Nullarbor_Plain'
		title: 'The Nullabor is a tree-less desert that spans Australia for over 200,000 square kilometres (77,000 sq mi).'
	australia:
		text: 'Australia'
		url: 'https://en.wikipedia.org/wiki/Australia'
		title: 'Australia is a big continent and country in the Southern Hemisphere. It is not upside down, however the toilet does flush the other way.'
	bridge:
		text: 'Sydney Harbour Bridge'
		url: 'https://en.wikipedia.org/wiki/Sydney_Harbour_Bridge'
		title: 'The popular old and big bridge in Australia where the fireworks go off.'
	switzerland:
		text: 'Switzerland'
		url: 'https://en.wikipedia.org/wiki/Switzerland'
		title: 'Switzerland was the home of my first girlfriend. It is a beautiful snowy country that speaks many languages.'
	austria: #change to vienna
		text: 'Austria'
		url: 'https://en.wikipedia.org/wiki/Austria'
		title: 'Austria is a country and home to the city Vienna, it is a beautiful place with tall men.'
	bali:
		text: 'Bali'
		url: 'https://en.wikipedia.org/wiki/Bali'
		title: 'Bali is an island in Indonesia and is a popular tourist destination, especially for Australians.'
	toronto:
		text: 'Toronto'
		url: 'https://en.wikipedia.org/wiki/Toronto'
		title: 'Toronto is a major city on the east-coast of Cananda. It has some of the best vegan food I\'ve ever had!'
	berlin:
		text: 'Berlin'
		url: 'https://en.wikipedia.org/wiki/Berlin'
		title: 'Berlin is a major city in Germany. It is filled with vegan brunch cafes, hipsets, party goers, smokers, and immigrants.'
	myplanet:
		text: 'Myplanet'
		url: 'http://myplanet.dk'
		title: 'Myplanet is the largest digital consultancy in Cananda. They are filled with awesome people and a terrific culture. One of the best places I\'ve ever worked.'
	exhange:
		text: 'Exchange Student'
		url: 'https://en.wikipedia.org/wiki/Student_exchange_program'
		title: '''My family has always had exchange students from many different countries stay with us in our home, usually multiple at a time, of which they would stay 1-12 months to travel and to learn English.'''
	ocean:
		text: 'How We Wrecked The Ocean'
		url: 'http://balupton.tumblr.com/post/76629442596/jeremy-jackson-how-we-wrecked-the-ocean-this'
		title: 'In this bracing talk, coral reef ecologist Jeremy Jackson lays out the shocking state of the ocean today: overfished, overheated, polluted, with indicators that things will get much worse. Astonishing photos and stats make the case.'
	burnout:
		text: 'Burnout'
		url: 'http://burnout.io'
		title: 'Burnout is a state of emotional, mental, and physical exhaustion caused by excessive and prolonged stress.'
	anomie:
		text: 'Anomie'
		url: 'https://en.wikipedia.org/wiki/Anomie'
		title: 'Anomie is a "condition in which society provides little moral guidance to individuals".'
	consent:
		text: 'Australian Age of Consent Laws'
		url: 'https://aifs.gov.au/cfca/publications/age-consent-laws'
		title: '16 is the legal age of consent in Western Australia'
	wwgb:
		text: 'Wrong Way, Go Back! Podcast'
		url: 'https://soundcloud.com/wwgbtv'
		title: 'A podcast for the mistakes we make and the learnings from them'
	vdd:
		text: 'Veronika Decides to Die, Review'
		url: 'https://www.goodreads.com/review/show/1069969061'
		title: 'My review for the book "Veronika Decides to Die", by Paulo Coelho, with my alternative ending proposal.'
	fountainhead:
		text: 'The Fountainhead by Ayan Rand'
		url: 'http://www.imdb.com/title/tt0041386/'
		title: 'This movie is a great stand for individual liberty'
	jbpstudygroup:
		text: 'Jordan B Peterson Study Group'
		url: 'https://docs.google.com/document/d/1H0-rGnidI1sGf3aYYVMvqlAejkb8EpmX2rGwjRcIBnw'
		title: 'I co-host the Jordan B Peterson Study Group that has been running for over a year now. It serves as a respectful battlefield on philosophy and pyschology (needless to say, for people all over the world)'
	quantitativepsychology:
		text: 'Quantitative Pyschology'
		url: 'https://en.wikipedia.org/wiki/Quantitative_psychology'
		title: 'Quantitative psychology interests me as a frontier that if combined carefully with ethics and technology, will have global business and humanitarian potential - one could improve societal and individual outcomes, using technology to gracefully measure wellbeing, promoting success and inhibiting neurosis, or even to screen for early biological and social markers of pyschopathy in children for early treatment, promoting socialisation and inhibiting tragedies'
	philosophy:
		text: 'Philosophy'
		url: 'https://en.wikipedia.org/wiki/Philosophy'
		title: 'Philosophy interests me, as it not just important to be a ship that stays afloat in the ocean, but also to be a ship that has a dependable compass, as otherwise, one can easily become a pirate with misguided intentions'
	trading:
		text: 'Trading'
		url: 'https://github.com/balupton/automated-trading'
		title: 'Trading interests me, as it is an unlimited supply of money, that with some wit and grace, can be tapped into, consenually and anytime, freeing one up for other things, without waiting for clients'

	# Posts
	'2017ssgs':
		text: "2017's Generation of Static Site Generators"
		url: 'https://medium.com/@balupton/2017s-generation-of-static-site-generators-164c3b7b9f97'
		title: 'In 2017 I anticipate we will see a new generation of static site generator (SSG), with importing and rendering decoupled from one another.'

	# Talks
	burnouttalk:
		text: 'Benjamin Lupton on Burnout'
		url: 'https://www.youtube.com/watch?v=Lt_oKuaFgrg'
		title: 'A talk of mine on burnout in web development'
	elegant:
		text: 'Elegantly Produce & Consume Compiled Packages'
		url: 'https://github.com/elegant-talk/elegant'
		title: 'A talk of mine about elegantly producing and consuming compiled packages'
	nodeconfeu16:
		text: 'Node.js Interactive Europe 2016'
		url: 'http://events.linuxfoundation.org/events/node-interactive-europe'
		title: 'The official Node.js Foundation Conference for Europe, held in Amsterdam'

	# Social
	feedly:
		text: 'Feedly'
		url: 'http://www.feedly.com/home#subscription/feed/http://feeds.feedburner.com/balupton.atom'
		title: 'Follow me on Feedly'
		color: '#6cc655'
		social: true
	gratipay:
		text: 'Gratipay'
		url: 'https://www.gratipay.com/balupton'
		title: 'Support me on Gratipay'
		color: '#614c3e'
		social: true
	patreon:
		text: 'Patreon'
		url: 'https://patreon.com/bevry'
		title: 'Support me on Patreon'
		color: '#E6461A'
		social: true
	flattr:
		text: 'Flattr'
		url: 'https://flattr.com/profile/balupton'
		title: 'Support me on Flattr'
		color: '#66b115'
		social: true
	paypal:
		text: 'Paypal'
		url: 'https://paypal.me/balupton'
		title: 'Support me on Paypal'
		color: '#009cde'
		social: true
	wishlist:
		text: 'Wishlist'
		url: "http://amzn.com/w/2F8TXKSNAFG4V?tag=#{amazonCode}"
		title: 'Buy me something on my Amazon Wishlist'
		color: 'rgb(228, 121, 17)'
		social: true
	twitter:
		text: 'Twitter'
		url: 'https://twitter.com/balupton'
		title: 'Follow me on Twitter'
		color: '#248DCD'
		social: true
	t: 'twitter'
	medium:
		text: 'Medium'
		url: 'https://medium.com/@balupton'
		title: 'Read my posts on Medium'
		color: '#333332'
		social: true
	tumblr:
		text: 'Tumblr'
		url: 'http://tumblr.balupton.com'
		title: 'Read my posts on Tumblr'
		color: '#2c4762'
		social: true
	youtube:
		text: 'YouTube'
		url: 'http://www.youtube.com/user/balupton'
		title: 'View my videos on YouTube'
		color: '#df3333'
		social: true
	vimeo:
		text: 'Vimeo'
		url: 'https://vimeo.com/balupton'
		title: 'View my videos on Vimeo'
		color: '#27a6d1'
		social: true
	github:
		text: 'Github'
		url: 'https://github.com/balupton'
		title: 'View my code on GitHub'
		color: 'black'
		social: true
	gh: 'github'
	g: 'github'
	instagram:
		text: 'Instagram'
		url: 'https://www.instagram.com/balupton/'
		title: 'View my photos on Instagram'
		color: 'rgb(148, 125, 98)'
		social: true
	couchsurfing:
		text: 'Couchsurfing'
		url: 'http://couchsurfing.com/people/balupton'
		title: 'View my profile on Couchsurfing'
		color: '#ed6542'
		social: true
	couch: 'couchsurfing'
	couchsurfer: 'couchsurfing'
	runkeeper:
		text: 'Runkeeper'
		url: 'https://runkeeper.com/user/balupton'
		title: 'Encourage me on Runkeeper'
		color: '#31a4d9'
		social: true
	linkedin:
		text: 'LinkedIn'
		url: 'https://www.linkedin.com/in/balupton'
		title: 'View my profile on LinkedIn'
		color: '#0083B3'
		social: true
	resume: 'linkedin'
	cv:
		text: 'Curriculum Vitae.'
		url: 'https://www.linkedin.com/profile/pdf?id=AAEAAADwTV8B0oqoFzDk_1ijrb9zx5Dvsaq1-u8&pdfFileName=BenjaminLupton'
		title: 'Download my CV from LinkedIn'
	keybase:
		text: 'Keybase'
		url: 'https://keybase.io/balupton'
		title: 'View my identity on Keybase'
		color: '#ff6f21'
		social: true
	goodreads:
		text: 'Goodreads'
		url: 'https://goodreads.com/balupton'
		title: 'Discover the books I read on Goodreads'
		color: '#382110'
		social: true
	soundcloud:
		text: 'SoundCloud'
		url: 'https://soundcloud.com/balupton'
		title: 'Listen to the music I like and make on SoundCloud;'
		color: '#f50'
		social: true

	# Sustainability
	sustainability:
		text: 'Sustainability'
		url: 'http://balupton.tumblr.com/post/79542013417/sustainability'
		title: 'Read my thoughts on Sustainability'
	s: 'sustainability'

	# Misc
	calendar:
		text: 'Schedule a Meeting'
		url: 'https://calendly.com/balupton/meet/'
		title: 'Schedule a meeting with me'
	meet: 'calendar'
	teach:
		text: 'Teaching by Donation: Web Development'
		url: 'https://www.eventbrite.com.au/e/teaching-by-donation-web-development-tickets-20723428332'
		title: 'Attend one of my teaching events'
	source:
		text: 'Website Source Code'
		url: 'https://github.com/balupton/website'
		title: 'View the source code of this website'
	donate:
		text: 'Donate'
		url: 'https://bevry.me/donate'
		title: 'Donate to my company and open-community'
	contracts:
		text: 'Contracts I Provide'
		url: 'https://drive.google.com/drive/folders/0B6MqiLy7C3PhZ196SHVSQ2MxU00'
		title: "The contract templates I've used with success for my consulting engagements"
	contract: 'contracts'

	# Recommendations
	'porn-generation':
		text: 'Porn Generation: How Social Liberalism Is Corrupting Our Future: Ben Shapiro'
		url: '/amazon/0895260166'
	'wright-relationships':
		text: 'Some Thoughts About Relationships: Colin Wright, Joshua Fields'
		url: '/amazon/B00XCSPJ5S'

# Cycle through links
socialLinks = []
referralLinks = []
simpleRedirects = {}
for own key,value of links
	# Fix aliases
	if typeof value is 'string'
		value = links[key] = links[value]
		unless value
			throw new Error("Could not find link alias #{value} for #{key}")
	else
		value.code = key

		# Sub Classes
		socialLinks.push(value)  if value.social
		referralLinks.push(value)  if value.referral

	# Add simple redirect
	simpleRedirects['/'+key] = value.url


# -------------------------------------
# Helpers

getRankInUsers = (users=[]) ->
	rank = null

	for user,index in users
		if user.login is 'balupton'
			rank = String(index+1)
			break

	return rank

suffixNumber = (rank) ->
	rank = String(rank)

	if rank
		if rank >= 1000
			rank = rank.substring(0,rank.length-3)+','+rank.substr(-3)
		else if rank >= 10 and rank < 20
			rank += 'th'
		else switch rank.substr(-1)
			when '1'
				rank += 'st'
			when '2'
				rank += 'nd'
			when '3'
				rank += 'rd'
			else
				rank += 'th'

	return rank

floorToNearest = (value,floorToNearest) ->
	result = Math.floor(value/floorToNearest)*floorToNearest


# =================================
# DocPad Configuration

module.exports =

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:
		# Site Data
		site:
			version: version
			url: "https://balupton.com"
			title: "Benjamin Lupton"
			author: "Benjamin Lupton"
			email: "b@lupton.cc"
			description: """
				Website of Benjamin Lupton. Founder of Bevry, DocPad and History.js. Web developer for 10 years. Now a trader. Studies psychology and philosophy.
				"""
			keywords: """
				balupton, benjamin lupton, lupton, coffeescript, node.js, javascript, history.js, html, docpad, nowpad, jquery, css3, ruby, git, nosql, cson, html5 history api, ajax, html, web development, web design, nlp, git, neuro-linguistic programming, programming, hacking, hackathon, aloha editor, contenteditable, hallo, jekyll, entp, inventor, web 2.0
				"""

			text:
				heading: "Benjamin Lupton"
				subheading: '''
					<t render="html.coffee">
						text """
							<span>#{@link 'opencollaboration'} Entrepreneur. #{@link 'wwgb', 'Podcaster'}. #{@link 'book', 'Author'}. #{@link 'vegan'}.</span>
							<!-- <span>#{@link 'husband'}. Stepdad. #{@link 'agnostic'}. #{@link 'pantheist'}. #{@link 'trich', 'Not Alone'}.</span> -->
							<span>Founded #{@link 'bevry'}, #{@link 'docpad'}, #{@link 'historyjs'} &amp; #{@link 'hostel'}.</span>
							<span>Co-host of the #{@link 'jbpstudygroup'}.</span>
							<span>Accomplished in #{@link 'javascript'}, #{@link 'nodejs'}, #{@link 'html'} and #{@link 'opensource'}.</span>
							<span>Enthusiast of #{@link 'quantitativepsychology'}, #{@link 'philosophy'} and #{@link 'trading'}.</span>
							<span>Available for consulting, training and speaking. #{@link 'contact'}. #{@link 'referrals'}.</span>
							"""
					</t>
					'''
				about: '''
					<t render="html.coffee">
						text """
							This website was created with #{@link 'bevry'}’s #{@link 'docpad'} and is #{@link 'source', 'open-source'}
							"""
					</t>
					'''
				copyright: '''
					<t render="html.md">
						Unless stated otherwise; all works are Copyright © 2011+ [Benjamin Lupton](http://balupton.com) and licensed [permissively](http://en.wikipedia.org/wiki/Permissive_free_software_licence) under the [MIT License](http://creativecommons.org/licenses/MIT/) for code and the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/) for everything else (including content, media and design), enjoy!
					</t>
					'''

			services:
				disqus: 'balupton'

			# Links
			social: socialLinks  # b/c
			socialLinks: socialLinks
			referralLinks: referralLinks

			styles: []  # embedded in layout

			scripts: """
				//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.slim.min.js
				/scripts/script.js?v=#{version}
				""".trim().split('\n')

			feeds: [
					href: 'http://feeds.feedburner.com/balupton.atom'
					title: 'Blog Posts'
				,
					href: 'https://medium.com/feed/@balupton'
					title: 'Medium Posts'
			]

			links: links

		# Link Helper
		link: (code, text, title) ->
			link = @site.links[code.toLowerCase()]
			throw new Error("The link #{code} was not found!")  unless link

			title or= link.title
			text or= link.text

			attributes = []
			attributes.push('style="color: ' + link.color + ' !important"')  if link.color
			attributes.push('class="' + link.cssClass + '"')  if link.cssClass
			attributes.push('title="' + title + '"')  if title
			attributes.push('href="' + link.url + '"')  if link.url
			attrs = attributes.join(' ')

			return "<a #{attrs}>#{text}</a>"

		# Meta Helpers
		getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title
		getPreparedAuthor: -> @document.author or @site.author
		getPreparedEmail: -> @document.email or @site.email
		getPreparedDescription: -> @document.description or @site.description
		getPreparedKeywords: -> @site.keywords.concat(@document.keywords or []).join(', ')

		# Ranking Helpers
		suffixNumber: suffixNumber
		floorToNearest: floorToNearest
		getAustraliaJavaScriptRank: ->
			feed = @feedr.feeds['github-australia-javascript']?.users ? null
			return getRankInUsers(feed) or 2
		getAustraliaRank: ->
			feed = @feedr.feeds['github-australia']?.users ? null
			return getRankInUsers(feed) or 4
		getGithubFollowers: (z=50) ->
			followers = @feedr.feeds['github-profile']?.followers ? null
			return followers or 709
		getStackoverflowReputation: (z=1000) ->
			reputation = @feedr.feeds['stackoverflow-profile']?.items?[0]?.reputation ? null
			return reputation or 20321

		# Project Helpers
		getProjects: ->
			return projects

		# Project Counts
		getGithubCounts: ->
			@githubCounts or= (=>
				projects = @getProjects()
				forks = stars = 0
				total = projects.length

				topUsers = @feedr.feeds['github-top'] ? null
				me = 'balupton'
				rank = 14
				rankAustralia = 0
				contributions = 4554

				for topUser, index in topUsers
					if (topUser.location or '').indexOf('Australia') isnt -1
						++rankAustralia
					if topUser.login is me
						rank = index+1
						contributions = topUser.contributions
						break

				for project in projects
					forks += project.forks
					stars += project.watchers

				rankAustralia or= 1
				total or= 239
				forks or= 2517
				stars or= 15522

				return {forks, stars, projects:total, rank, rankAustralia, contributions}
			)()


	# =================================
	# Collections

	collections:
		pages: ->
			@getCollection('documents').findAllLive({menuOrder:$exists:true},[menuOrder:1])

		posts: ->
			@getCollection('documents').findAllLive({relativeOutDirPath:'blog'},[date:-1])


	# =================================
	# Events

	events:

		# Fetch Projects
		generateBefore: (opts,next) ->
			# Prepare
			docpad = @docpad

			# Log
			docpad.log('info', 'Fetching your latest projects for display within the website')

			# Prepare repos getter
			reposGetter ?= require('getrepos').create(
				log: docpad.log
				github_client_id: githubClientId
				github_client_secret: githubClientSecret
			)

			# Fetch repos
			reposGetter.fetchReposFromUsers ['balupton','bevry','docpad','webwrite','browserstate','chainyjs','chainy-plugins','chainy-bundles','interconnectapp','js2coffee'], (err,repos=[]) ->
				# Check
				return next(err)  if err

				# Apply
				projects = repos.sort((a,b) -> b.watchers - a.watchers)
				docpad.log('info', "Fetched your latest projects for display within the website, all #{repos.length} of them")

				# Complete
				return next()

			# Return
			return true

	# =================================
	# Plugin Configuration

	plugins:
		feedr:
			timeout: 60*1000
			feeds:
				'stackoverflow-profile':
					url: 'https://api.stackexchange.com/2.2/users/130638?order=desc&sort=reputation&site=stackoverflow'
					parse: 'json'

				'github-australia-javascript':
					url: "https://api.github.com/legacy/user/search/location:Australia%20language:JavaScript?#{githubAuthString}"
					parse: 'json'
				'github-australia':
					# https://github.com/search?q=location%3AAustralia&type=Users&s=followers
					url: "https://api.github.com/legacy/user/search/location:Australia?#{githubAuthString}"
					parse: 'json'
				'github-gists':
					url: "https://api.github.com/users/balupton/gists?per_page=100&#{githubAuthString}"
					parse: 'json'
				'github-top':
					url: 'https://gist.github.com/paulmillr/4524946/raw/github-users-stats.json'
					parse: 'json'
				'github-profile':
					url: "https://api.github.com/users/balupton?#{githubAuthString}"
					parse: 'json'

				'github':
					url: "https://github.com/balupton.atom"
					parse: 'xml'
				'medium':
					url: "https://medium.com/feed/ephemeral-living"
					parse: 'xml'

		cleanurls:
			simpleRedirects: simpleRedirects

			advancedRedirects: [
				# Old URLs
				[/^https?:\/\/(?:www\.balupton\.com|(?:www\.)?lupton\.cc|balupton\.herokuapp\.com|balupton\.github\.io\/website)(.*)$/, 'https://balupton.com$1']

				# Demos
				[/^\/sandbox(?:\/([^\/]+).*)?$/, 'https://balupton.github.io/$1/demo/']

				# Projects
				[/^\/(?:projects?\/|(?:g|gh|github)\/?)(.+)$/, 'https://github.com/balupton/$1']

				# Amazon
				[/^\/amazon\/(.+)/, "https://read.amazon.com/kp/embed?asin=$1&tag=#{amazonCode}"]
			]
