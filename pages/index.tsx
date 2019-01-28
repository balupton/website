import React from 'react'
import Layout from '../layouts/page'
import Link from '../components/link'
import Text from '../components/text'
import Hidden from '../components/hidden'

export default function IndexPage() {
	return (
		<Layout code="home" title={false}>
			<section className="work">
				<h2>I radically explore the known and the unknown.</h2>

				<h3>I help make the web awesome.</h3>

				<p>
					Before I die, I wish to see everyone enabled to do what they love,
					share their love with the entire world, and live well. This is a big
					calling, and I&apos;m chipping away at it steadily.
				</p>

				<p>
					This has worked well for me so far; for several years I was the most
					active <Link code="opensource" /> developer in Australia and one of
					the most prolific in the world; my technical projects have been used
					in some of the world&apos;s biggest web-sites/apps (Basecamp, Spotify,
					Ustream) and by some of the world&apos;s biggest companies (Microsoft,
					Adobe, GitHub, Atlassian), touching their millions of users; my
					non-technical projects have also seen adoption over the years.
				</p>

				<p>
					The key skill set I&apos;ve used to accomplish this is my natural
					ability to quickly understand complex systems and simplify them in
					disruptive ways, a burning need to do good in the world, and an
					instinctive tenacity for always finding a way even in the most
					difficult of situations.
				</p>

				<p>
					Happy to cultivate friendships and business opportunities.{' '}
					<Link code="resume">View my resume.</Link>{' '}
					<Link code="contact">Get in contact.</Link>
				</p>

				<h3>I&apos;m human too.</h3>

				<p>
					I&apos;m absorbed in the art of{' '}
					<Link code="simpleliving">simple</Link> and{' '}
					<Link code="nomad">nomadic</Link> living, with a{' '}
					<Link code="vegan">vegan</Link> life-style and{' '}
					<Link code="ahimsa">ahimsa</Link> values.{' '}
					<Link code="vegan" title="Really, check it out.">
						The data cannot recommend this lifestyle more highly.
					</Link>
				</p>

				<p>
					Through difficult and often traumatic times in my life, I&apos;ve had
					the recurring personal afflictions of skin picking,{' '}
					<Link code="trich">hair pulling</Link>, and panic attacks. Since
					opening up about these aspects first to friends and then publicly in
					2015 (at age 26), the overwhelming burden of shame I carried
					dissipated, which allowed me to move my attention from hating myself
					<Hidden>(due to the bad parts)</Hidden> and hiding symptoms, to
					accepting myself
					<Hidden>(including the bad parts)</Hidden> and fixing causes, with the
					surprising help of friends and other strugglers, down the road to an
					ever more resilient life. If you ever want to talk about it,{' '}
					<Link code="contact">feel free.</Link>
				</p>

				<p>
					You may cast me as a <Link code="privileged" /> heterosexual white{' '}
					<Link code="male" /> born into a{' '}
					<Link code="ausvsusa">middle class society.</Link> However (1) the
					practice of prejudice continues when people judge from these inherited
					properties instead of from character, (2) generalising is innate and
					correlations between identity and character exist, however the degree
					that someone&apos;s identity has influenced their character fluctuates
					from person to person (so while identity influences character,
					remember to access your judgements properly), and (3) due to the
					endeavours of my ancestors and society I&apos;ve been afforded more
					free time (but no less agency) to spend continuing the tradition of
					increasing people&apos;s potential for self-actualisation (the
					head-start is thanks to my identity, the choices of how to spend my
					time is a matter of character).
				</p>

				<p>
					I&apos;m a big believer in ephemeral living. I&apos;ve recently
					discovered that{' '}
					<Link code="fountainhead">I&apos; m my own person</Link>. Coming up
					with great questions and answering them - staying true to myself by
					discovering myself - enabling joy and reducing oppression through
					education - are all passages deeply rooted in my soul.
				</p>

				<h3>I&apos;ve done many things.</h3>

				<p>
					In 1998 (age 8/9), I developed my first website for a{' '}
					<Link code="perth" /> city council project as part of an accelerated
					learning <Link code="peac" /> course, the project went on to win a
					state award. A few years later I started developing in{' '}
					<Link code="csharp" /> to interact with the <Link code="itunes" />{' '}
					<Link code="dll">DLLs</Link> for the purpose of organising my music
					collection, I also started programming in <Link code="ecmascript" />{' '}
					in the form of <Link code="flash" /> <Link code="actionscript" /> for
					the purpose of creating a kickass full-fledged media player for my
					self, I also worked with <Link code="html" /> and{' '}
					<Link code="javascript" /> on the side for fun and pleasure. Around
					this time, I was diagnosed with <Link code="trich" /> and until
					University, I would often be found with large bald spots throughout my
					scalp. I saw many psychologists through my childhood, all of which
					were useless.
				</p>

				<Hidden>
					<p>
						In 1999 (age 9/10), I encountered pornography for the first time in
						the form a spam email attachment. On the night of new year 1999/2000
						I downloaded my first illegal MP3 of a song I already owned on CD,
						it was Goo Goo Dolls - Iris. I enjoyed a lot of story-based RPGs
						like Chrono Trigger, Robotrek, Final Fantasy, and The Sims. I read a
						lot of Goosebumps and Fear Street.
					</p>
				</Hidden>

				<p>
					In 2002 (age 12/13), I started <Link code="tafe" /> night school
					earning my Certificates 1 to 4 in different programming concepts and
					languages, working with <Link code="c" />, <Link code="csharp" />,{' '}
					<Link code="pascal" />, <Link code="cobol" />, <Link code="perl" />,{' '}
					<Link code="php" />, <Link code="asp" /> and other languages. During
					the day I was at <Link code="comosec" /> in the accelerated learning{' '}
					<Link code="ssst">SSST</Link> program (a year ahead in Science, Maths,
					and Technology subjects) as well as in the <Link code="hockeyacad" />{' '}
					(doing 25 hours a week of <Link code="hockey" />, I was fit). It
					placed me in an interesting position of being a frat-boy and a nerd,
					the teachers worked with myself and another boy to use our influence
					to squash the bullying of our peers, it worked well. For fun, I{' '}
					<Link code="bladelyf">rollerbladed</Link>, played <Link code="aoe" />{' '}
					endlessly, did sleep overs, and hacked the school’s Windows network
					for fun with friends, earning us the position of “intern advisors” for
					the school’s security and network systems.
				</p>

				<p>
					In 2005 (age 15/16), thanks to my night school studies of the previous
					years, I was able to drop out of <Link code="highschool" />, went to{' '}
					<Link code="tafe" /> and earned my <Link code="diplomaweb" />, which
					allowed me to start University only a year later. At this time, I
					worked casually in a factory stacking fences from a conveyer belt and
					developed my first long term relationship
					<Hidden>
						and lived with a girl 5 years my senior (legal to{' '}
						<Link code="ausconsent" />)
					</Hidden>
					, it was a wonderful maturing time, and brought a long-term end to my{' '}
					<Link code="trich" />. Around this time I also started experimenting
					with <Link code="cannabis">cannabis</Link> and alcohol socially.
					Interestingly, in this year I also got into a bit of trouble for
					hacking Microsoft’s <Link code="livemessenger" /> premium content
					services (winks and dynamic profile pictures) as I had no money or
					debit card to buy them… I used my <Link code="flash" /> and{' '}
					<Link code="javascript" /> skills to bypass the Flash checkout process
					of the Blue Mountain premium content service, then scraping their
					predictable premium content path structures, then developing a{' '}
					<Link code="csharp" /> installer for the content by reverse
					engineering portions of the Messenger <Link code="dll" /> install
					process. At the same time I gained prestige at <Link code="tafe" /> by
					discovering an exploit in their <Link code="webct" /> system and
					working with staff to rectify the situation, which I later published
					as{' '}
					<Link code="webctexploit">my first white-hat security advisory</Link>a
					few years after. Later, I also discovered that the same exploit worked
					on my university&apos;s system, however with the university’s strict
					“hacking and your expelled” policy in place, I was too afraid of being
					expelled for sharing the exploit with them, so I never mentioned it…
					leaving their systems insecure and open to actually malicious people,
					good work policy! 🙃
				</p>

				<p>
					In 2006 (age 16/17), I commenced my <Link code="degree" /> at{' '}
					<Link code="curtin" />, while freelancing with <Link code="php" /> and{' '}
					<Link code="javascript" /> development on the side. Around this time
					was also my foray into <Link code="opensource" /> development with my
					plugins, freelancing, blogging, and core contributions to the{' '}
					<Link code="b2evo" /> blogging system (a powerful alternative to{' '}
					<Link code="wordpress" />
					). I also visited <Link code="switzerland" /> for a month to visit my
					partner, started an <Link code="openrel">open-relationship</Link> upon
					my return to <Link code="Perth" />, which resulted in a first heart
					break 6 months later, and also partied very hard throughout the year.
				</p>

				<p>
					In 2007 (age 17/18), I moved out of home with 2 other university
					friends into a house right next to the university, it was an amazing
					time, and an amazing <Link code="bachelorpad" /> of alchohol,{' '}
					<Link code="pool">pool billiards</Link> tables, bars, and mattresses
					and friends everywhere all the time, it was a non-stop study and work
					infused party, and we loved it. It was also the time I published the{' '}
					<Link code="lightbox" />, which went on to become one of the most
					popular jQuery plugins of the time. Throughout these
					university/freelancing years I was stepped into the worlds of{' '}
					<Link code="pua" />, <Link code="personaldev" />, <Link code="nlp" />,{' '}
					<Link code="hypno" />, <Link code="openrel" />, <Link code="sexpos" />
					, <Link code="halo3" />, <Link code="roadtrips" />,{' '}
					<Link code="opensource" />, <Link code="simpleliving" />, and other{' '}
					<Link code="extremelife" />… it was all packed full of confidence and
					experimenting, and it was wicked fun.
				</p>

				<p>
					In 2008 (age 18/19), after an intense week of exams, daily alcohol,
					daily marijuana, first-time <Link code="lsd" />, and first-time{' '}
					<Link code="mdma" />, I ended up in a moment of pure terror believing
					my lung had collapsed, ended up unconscious, woke up in hospital via
					ambulance, and diagnosed with a <Link code="panic">panic attack</Link>
					… my <Link code="bucket" /> had finally overflowed and it was
					terrifying… I left that night with <Link code="depersonalisation" />,
					and over 6 months began hallucinating, hearing voices, and having{' '}
					<Link code="night">night terrors</Link>, afraid to sleep. Having one
					terrifying night terror that left me questioning my safety, I had my
					family take me to the <Link code="gp" /> to get help and eventually
					see a <Link code="psych" /> who helped me through it, with a further
					diagnosis of <Link code="anxiety" />. After 6 months of further
					recovery, I got through it to normality once again, and another 6
					months later until I was able to have caffeine again.
				</p>

				<p>
					In 2009 (age 19/20), I started feeling a lot of guilt for my fantastic
					life while others were in poverty. In January 2010, I went to{' '}
					<Link code="bali" /> for the first time with my father and an{' '}
					<Link code="exhange" />, we had a fantastic time, but I was also
					harrowed by the poverty I encountered… It would go on to increase my
					investment to do good by the world.
				</p>

				<p>
					In 2010 (age 20/21), my foray into kinder food choices began. I had
					watched <Link code="ocean">this talk</Link> and immediately stopped
					consuming fish. A while later, for some reason or the other, I stopped
					using dairy for milk. I also developed a new relationship, and my
					first <Link code="closedrel">closed-relationship</Link>, to a
					wonderful woman
					<Hidden> 8 years my senior </Hidden> who helped me mature in life and
					work very much so.
				</p>

				<p>
					In 2011 (age 21/22), I was invited to speak in <Link code="austria" />{' '}
					by <Link code="gentics" /> for their <Link code="aloha" />{' '}
					<Link code="alohadevcon">Dev Con</Link> of which I was a lead
					developer, it was a fantastic insight to get to meet other great{' '}
					<Link code="javascript" /> developers at the time, especially for a
					small-town syndrome Australian! Upon returning, I moved to{' '}
					<Link code="sydney" /> from <Link code="perth" /> for better work
					opportunities and to be with my partner, who was fighting for custody
					of her children. I worked with miscellaneous startups earning street
					cred and an increasing hourly rate, due to my years of{' '}
					<Link code="opensource" /> experience and commitment to quality. I
					went from the $10/hour newcomer to the goto JavaScript expert within
					the year. Eventually, I obtained a full-time $60/hour contract with
					Sydney company <Link code="acidgreen" /> developing long-term
					JavaScript solutions for their medical and government clients.
					<Hidden>
						I also got married to my wonderful partner in a small ceremony
						overlooking the <Link code="bridge" />.
					</Hidden>
				</p>

				<p>
					In 2012 (age 22/23), I left the amazing <Link code="acidgreen" /> who
					where running out of work for me, to consult for the Melbourne startup{' '}
					<Link code="bugherd" />, earning my highest hourly rate so far. I
					developed their first <Link code="spa" /> solution along with other
					innovations like <Link code="queryengine">Live Collections</Link> and
					a <Link code="crossbrowser" /> <Link code="screenshot" />{' '}
					<Link code="extension">Extension</Link>. Once that ended, I burnt
					through my savings going all in with attempting to transform{' '}
					<Link code="bevry">Bevry&apos;s</Link>{' '}
					<Link code="lossleader">loss-leader</Link> <Link code="docpad" /> into
					a profitable income stream. At one point I ran out of money, and a
					person called <Link code="kasper" /> out of nowhere, a{' '}
					<Link code="historyjs" /> user, bailed me out with some cash and sound
					advice for finding new clients, which I did, thanks to him.
				</p>

				<p>
					In 2013 (age 23/24), I was invited to <Link code="metarefresh" /> in{' '}
					<Link code="bangalore" /> to speak to 400 people about{' '}
					<Link code="whysucks">finding your way despite competition</Link>. I
					then flew to <Link code="bali" /> with my partner to setup the first
					full-time <Link code="hostel" />. I didn&apos;t enjoy the setting up
					procedure much, however fortunately enough other people did. There are
					now more than <Link code="hostellist">30 hostels</Link> for startup
					folk around the world. In June I also received salvation for my gamble
					in <Link code="docpad" /> with a full-time income to work on it from{' '}
					<Link code="toronto" /> company <Link code="myplanet" /> (and got to
					visit them twice!). I also visited <Link code="berlin" /> to train
					students in <Link code="javascript" />. This year also marked my
					introduction to <Link code="mindful" /> via{' '}
					<Link code="tolle">Eckhart Tolle&apos;s</Link> works, and started
					reading <Link code="paulo" />.
				</p>

				<p>
					In 2014 (age 24/25), the funding ended and I burned out from 10 years
					of professional programming and of life in general, after a while I
					embraced <Link code="moneyless" /> and became a volunteer at a{' '}
					<Link code="paycan">donation-based</Link>{' '}
					<Link code="lentil">vegan soup kitchen in Sydney</Link>. It was
					perhaps the most rewarding work I&apos;ve ever done in my life. I
					actually got to smile, laugh, and interact with people, solving a real
					need - joyous food and great company - without discrimination (even
					financial). I also was unable to find enough paying work that allowed
					me to continue my <Link code="opensource" /> endeavours and lived
					homeless in the streets of <Link code="sydney" /> for a few months.
				</p>

				<p>
					In 2015 (age 25/26), I <Link code="hitch">hitchhiked</Link> 10,000KM
					throughout <Link code="australia" />, notably between{' '}
					<Link code="perth" />, <Link code="uluru" />, Brisbane,{' '}
					<Link code="sydney" />, Melbourne, <Link code="nullabor" />, and back
					to Perth. It was an adventure of a life-time. At some point, I desire
					to commence foot on the <Link code="walk" />, a 1,000KM walk from
					Perth to Albany in Western Australia — I plan on doing this alone to
					discover what doors it opens and closes for me. I also wrote{' '}
					<Link code="book">my first book</Link>.
				</p>

				<p>
					In 2016 (age 26/27), I completed the last unit of my degree after a 6
					year hiatus, becoming a <Link code="degree" /> graduate enabling
					global employment. I also gave the talk <Link code="elegant" /> at{' '}
					<Link code="nodeconfeu16" /> and worked through some private matters.
					I also started (co-)hosting the <Link code="jbpcommunity" />,
					including a <Link code="jbpyoutube">weekly podcast</Link>.
				</p>

				<p>
					In 2017 (age 27/28), I resumed then paused my lucrative freelancing,
					and completed the switch to{' '}
					<Link code="trading">
						automated/algorithmic stock and cryptocurrency trading
					</Link>
					. Now I can grow and make money outside of the tech world&apos;s
					autocratic political delusions, and use the profits to create several
					businesses of varying scale. I also moved from Australia to Asia and
					will be motorbiking around for my own sanity.
				</p>

				<p>
					In 2018 (age 28/29), I anticipate developments in data science,
					machine learning, and artificial intelligence will intersect with
					trading markets, to the extent of economic terrorism. I intend to see
					how much profits my aptitudes will get me before it is too late.
				</p>

				<p>
					In 2019 (age 30/31), I wish to start focusing on having a family for
					the years ahead.
				</p>

				<h3>Reach out.</h3>

				<p>
					Happy to cultivate friendships and business opportunities.{' '}
					<Link code="resume">View my resume.</Link>{' '}
					<Link code="contact">Get in contact.</Link>
				</p>

				<p>
					You can support me by{' '}
					<Link code="donate">
						donating to me via my open-company and community
					</Link>
					,<Link code="referrals">using my referral links</Link>, or{' '}
					<Link code="contact">having a chat with me</Link>.
				</p>

				<p>
					<Link code="twitter">
						You should follow me on Twitter to keep up to date.
					</Link>
				</p>
			</section>

			<section className="resources">
				<h2>Resources</h2>

				<h3>I write, some of my favourites are:</h3>

				<ul>
					<li>
						<Link href="https://medium.com/ephemeral-living/surviving-free-culture-f99b39ceb059">
							Surviving Free Culture
						</Link>
					</li>
					<li>
						<Link href="https://medium.com/i-m-h-o/a-different-way-to-see-google-303df2011df0">
							A different way to see Google
						</Link>
					</li>
					<li>
						<Link href="http://medium.com/p/c60913a8ca5b">
							What vegans and non-vegans alike don’t get about veganism, and why
							dialogue between two sides often results in unnecessary
							confrontation
						</Link>
					</li>

					<li>
						<Link code="blog">More.</Link>
					</li>
				</ul>

				<h3>I talk, some of my favourites are:</h3>

				<ul>
					<li>
						<Link href="https://www.youtube.com/watch?v=hdXUc46gx8s">
							Crime &amp; Punishment - Fyodor Dostoyevsky @ Jordan B Peterson
							Community 2018
						</Link>
					</li>
					<li>
						<Link href="https://www.youtube.com/watch?v=IAB8_UlcNWI">
							Elegantly Produce and Consume Compiled Packages @ Node Interactive
							Europe 2016
						</Link>
					</li>
					<li>
						<Link href="https://www.youtube.com/watch?v=nt4Gt6-T8N0">
							Why the next big thing sucks @ Meta Refresh India 2013
						</Link>
					</li>
					<li>
						<Link code="talks">More.</Link>
					</li>
				</ul>

				<h3>I teach, some of my favourites are:</h3>

				<ul>
					<li>
						Organiser and Trainer @ <Link code="nodeschool" /> Berlin 2014
					</li>
					<li>
						JavaScript Expert @ <Link code="dsr" />
						Germany 2013 &amp; 2014
					</li>
					<li>
						DocPad &amp; WebRTC Trainer @ <Link code="myplanet" /> Canada 2013
						&amp; 2014
					</li>

					<li>
						<Link code="trainings">More.</Link>
					</li>
				</ul>

				<h3>I code, some of my favourites are:</h3>

				<ul>
					<li>
						<Link code="docpad">
							DocPad: A static-site generator with dynamic abilities.
						</Link>
					</li>
					<li>
						<Link code="historyjs">
							History.js: Cross-browser stateful web applications.
						</Link>
					</li>
					<li>
						<Link code="taskgroup">
							TaskGroup: Intuitive JavaScript flow control that actually makes
							sense.
						</Link>
					</li>

					<li>
						<Link href="/projects">More.</Link>
					</li>
				</ul>

				<h3>I read, some of my favourites are:</h3>

				<ul>
					<li>
						<Link code="atlas-shrugged">Atlas Shrugged by Ayn Rand</Link>
					</li>
					<li>
						<Link code="steppenwolf">Steppenwolf by Hermann Hesse</Link>
					</li>
					<li>
						<Link code="walden">Walden by Henry David Thoreau</Link>
					</li>

					<li>
						<Link code="goodreads">More.</Link>
					</li>
				</ul>
			</section>

			<section className="awards">
				<h2>Awards</h2>

				<section className="awards-top">
					<h3>
						<Link code="stackoverflow-resume">
							<strong>
								Top 10% for JavaScript, Node.js, jQuery, HTML5 and Ajax
							</strong>{' '}
							via StackOverflow
						</Link>
					</h3>
					<p>
						With{' '}
						<Link code="stackoverflow">
							<Text code="stackoverflow-reputation" /> reputation
						</Link>{' '}
						on <Link href="http://stackoverflow.com/faq">StackOverflow</Link>{' '}
						I’ve been able to help approximately 3 million web developers with
						my shared knowledge and expertise.
					</p>
				</section>

				<section className="awards-active">
					<h3>
						<br />
						<Link href="/projects">
							<em>
								<strong>
									Created <Text code="github-projects" /> open-source projects
								</strong>
							</em>{' '}
							via GitHub
						</Link>
					</h3>
					<p>
						Working with open-source every day, I&apos;m serious about
						open-collaboration. I&apos;ve made over{' '}
						<Link code="github">
							<Text code="github-contributions" /> contributions to the
							open-source scene in the past year
						</Link>{' '}
						and had my work{' '}
						<Link href="/projects">
							starred by over <Text code="github-stars" /> fellow developers.
						</Link>
					</p>
				</section>

				<section className="awards-watched">
					<h3>
						<Link href="https://github.com/search?l=JavaScript&amp;q=location%3AAustralia&amp;s=followers&amp;type=Users">
							<em>
								<strong>
									The <Text code="github-watch-rank-australia-javascript" />{' '}
									most watched JavaScript developer
								</strong>{' '}
								in Australia
							</em>{' '}
							via GitHub
						</Link>
						<br />
						<Link href="https://github.com/search?q=location%3AAustralia&amp;s=followers&amp;type=Users">
							<em>
								<strong>
									The <Text code="github-watch-rank-australia" /> most watched
									developer
								</strong>{' '}
								in Australia
							</em>{' '}
							via GitHub
						</Link>
					</h3>
					<p>
						By following someone on <Link code="github" />, you are indicating
						that you love their work enough to be notified of every single piece
						of code they publish, big or small. Having{' '}
						<Link code="github">
							<Text code="github-followers" /> followers
						</Link>
						is a fantastic testimonial of my professional taste and impact on
						the web development community.
					</p>
				</section>

				<section className="awards-speaker">
					<h3>
						<Link code="speakerrate">
							<em>
								<strong>International speaker and trainer</strong>
							</em>
						</Link>
					</h3>
					<p>
						The opportunity of{' '}
						<Link code="speakerrate">
							speaking and training people around the world
						</Link>
						is one that I&apos;m so humbled to have. I can think of nothing
						better than{' '}
						<Link code="youtube">
							inspiring, empowering, and connecting with amazing individuals all
							across the globe.
						</Link>
					</p>
				</section>

				<Hidden>
					<section className="awards-satisfaction">
						<h3>
							<Link href="http://www.x-linkedin.com/profile/view?id=15748447#profile-recommendations">
								<em>
									<strong>100% client satisfaction</strong> for the past two
									years
								</em>{' '}
								via <Link code="linkedin" />
							</Link>
						</h3>
						<p>
							Being able to provide a level of excellence which{' '}
							<Link href="http://www.x-linkedin.com/profile/view?id=15748447#profile-recommendations">
								converts potential leads into raving fans
							</Link>
							, won’t always be easy, but it is something I’m comitted to
							ensuring every single time.
						</p>
					</section>
				</Hidden>

				<section className="awards-docpad">
					<h3>
						<Link code="docpad">
							<strong>Created DocPad</strong>
						</Link>
						<br />
						<Link href="https://libraries.io/npm/docpad">
							<em>
								One of the most popular CoffeeScript projects in the world
							</em>{' '}
							via GitHub
						</Link>
					</h3>
					<p>
						<Link code="docpad">DocPad</Link> rethought web development and was
						the first big static site generator for Node.js gaining over 2000
						stars, hundreds of daily users, 200 plugins, and 100 contributors.
					</p>
				</section>

				<section className="awards-historyjs">
					<h3>
						<Link code="historyjs">
							<strong>Created History.js</strong>
						</Link>
						<br />
						<Link href="http://github-rank.com/star?language=JavaScript">
							<em>One of the most popular JavaScript projects in the world</em>{' '}
							via GitHub
						</Link>
					</h3>
					<p>
						<Link code="historyjs">History.js</Link> became one of the most game
						changing and popular utilities for web developers. Freelancers all
						the way to enterprise used it to lead the way into stateful web
						applications. It was huge.
					</p>
				</section>
			</section>
		</Layout>
	)
}
