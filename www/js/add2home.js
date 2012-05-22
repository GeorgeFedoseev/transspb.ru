/*!
 * Add to Homescreen v2.0.1 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var addToHome = (function (w) {
	var nav = w.navigator,
		isIDevice = 'platform' in nav && (/iphone|ipod|ipad/gi).test(nav.platform),
		isIPad,
		isRetina,
		isSafari,
		isStandalone,
		OSVersion,
		startX = 0,
		startY = 0,
		lastVisit = 0,
		isExpired,
		isSessionActive,
		isReturningVisitor,
		balloon,
		overrideChecks,

		positionInterval,
		closeTimeout,

		options = {
			autostart: true,			// Automatically open the balloon
			returningVisitor: false,	// Show the balloon to returning visitors only (setting this to true is HIGHLY RECCOMENDED)
			animationIn: 'drop',		// drop || bubble || fade
			animationOut: 'fade',		// drop || bubble || fade
			startDelay: 15000,			// 2 seconds from page load before the balloon appears
			lifespan: 15000,			// 15 seconds before it is automatically destroyed
			bottomOffset: 14,			// Distance of the balloon from bottom
			expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
			message: '',				// Customize your message or force a language ('' = automatic)
			touchIcon: false,			// Display the touch icon
			arrow: true,				// Display the balloon arrow
			hookOnLoad: true,			// Should we hook to onload event? (really advanced usage)
			iterations: 100				// Internal/debug use
		},

		intl = {
			ca_es: 'Per instalВ·lar aquesta aplicaciГі al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
			cs_cz: 'Pro instalaci aplikace na VГЎЕЎ %device, stisknД›te %icon a v nabГ­dce <strong>PЕ™idat na plochu</strong>.',
			da_dk: 'TilfГёj denne side til din %device: tryk pГҐ %icon og derefter <strong>FГёj til hjemmeskГ¦rm</strong>.',
			de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
			el_gr: 'О•ОіОєО±П„О±ПѓП„О®ПѓОµП„Оµ О±П…П„О®ОЅ П„О·ОЅ О•П†О±ПЃОјОїОіО® ПѓП„О®ОЅ ПѓП…ПѓОєОµП…О® ПѓО±П‚ %device: %icon ОјОµП„О¬ ПЂО±П„О¬П„Оµ <strong>О ПЃОїПѓОёО®ОєО· ПѓОµ О‘П†ОµП„О·ПЃОЇО±</strong>.',
			en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
			es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>AГ±adir a pantalla de inicio</strong>.',
			fi_fi: 'Asenna tГ¤mГ¤ web-sovellus laitteeseesi %device: paina %icon ja sen jГ¤lkeen valitse <strong>LisГ¤Г¤ Koti-valikkoon</strong>.',
			fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter Г  l\'Г©cran d\'accueil</strong>.',
			he_il: '<span dir="rtl">Ч”ЧЄЧ§Чџ ЧђЧ¤ЧњЧ™Ч§Ч¦Ч™Ч” Ч–Ч• ЧўЧњ Ч”-%device Ч©ЧњЧљ: Ч”Ч§Ч© %icon Ч•ЧђЧ– <strong>Ч”Ч•ЧЎЧЈ ЧњЧћЧЎЧљ Ч”Ч‘Ч™ЧЄ</strong>.</span>',
			hu_hu: 'TelepГ­tse ezt a web-alkalmazГЎst az Г–n %device-jГЎra: nyomjon a %icon-ra majd a <strong>FЕ‘kГ©pernyЕ‘hГ¶z adГЎs</strong> gombra.',
			it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
			ja_jp: 'гЃ“гЃ®г‚¦г‚§гѓ–г‚ўгѓ—гѓЄг‚’гЃ‚гЃЄгЃџгЃ®%deviceгЃ«г‚¤гѓіг‚№гѓ€гѓјгѓ«гЃ™г‚‹гЃ«гЃЇ%iconг‚’г‚їгѓѓгѓ—гЃ—гЃ¦<strong>гѓ›гѓјгѓ з”»йќўгЃ«иїЅеЉ </strong>г‚’йЃёг‚“гЃ§гЃЏгЃ гЃ•гЃ„гЂ‚',
			ko_kr: '%deviceм—ђ м›№м•±мќ„ м„¤м№н•л ¤л©ґ %iconмќ„ н„°м№ н›„ "н™€н™”л©ґм—ђ м¶”к°Ђ"лҐј м„ нѓќн•м„ёмљ”',
			nb_no: 'Installer denne appen pГҐ din %device: trykk pГҐ %icon og deretter <strong>Legg til pГҐ Hjem-skjerm</strong>',
			nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Zet in beginscherm</strong>.',
			pl_pl: 'Aby zainstalowaД‡ tД™ aplikacje na %device: naciЕ›nij %icon a nastД™pnie <strong>Dodaj jako ikonД™</strong>.',
			pt_br: 'Instale este web app em seu %device: aperte %icon e selecione <strong>Adicionar Г  Tela Inicio</strong>.',
			pt_pt: 'Para instalar esta aplicaГ§ГЈo no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrГЈ principal</strong>.',
			ru_ru: 'Установите эту карту на своем %device: нажмите %icon, потом <strong>Добавить в "Домой"</strong>.',
			sv_se: 'LГ¤gg till denna webbapplikation pГҐ din %device: tryck pГҐ %icon och dГ¤refter <strong>LГ¤gg till pГҐ hemskГ¤rmen</strong>.',
			th_th: 'аё•аёґаё”аё•аё±а№‰аё‡а№Ђаё§а№‡аёља№Ѓаё­аёћаёЇ аё™аёµа№‰аёљаё™ %device аё‚аё­аё‡аё„аёёаё“: а№Ѓаё•аё° %icon а№ЃаёҐаё° <strong>а№Ђаёћаёґа№€аёЎаё—аёµа№€аё«аё™а№‰аёІаё€аё­а№‚аё®аёЎ</strong>',
			tr_tr: '%device iГ§in bu uygulamayД± kurduktan sonra %icon simgesine dokunarak <strong>Ana Ekrana Ekle</strong>yin.',
			zh_cn: 'ж‚ЁеЏЇд»Ґе°†ж­¤еє”з”ЁзЁ‹ејЏе®‰иЈ…е€°ж‚Ёзљ„ %device дёЉгЂ‚иЇ·жЊ‰ %icon з„¶еђЋз‚№йЂ‰<strong>ж·»еЉ и‡ідё»е±Џе№•</strong>гЂ‚',
			zh_tw: 'ж‚ЁеЏЇд»Ґе°‡ж­¤ж‡‰з”ЁзЁ‹ејЏе®‰иЈќе€°ж‚Ёзљ„ %device дёЉгЂ‚и«‹жЊ‰ %icon з„¶еѕЊй»ћйЃё<strong>еЉ е…Ґдё»з•«йќўићўе№•</strong>гЂ‚'
		};

	function init () {
		// Preliminary check, prevents all further checks to be performed on iDevices only
		if ( !isIDevice ) return;

		var now = Date.now(),
			i;

		// Merge local with global options
		if (w.addToHomeConfig) {
			for ( i in w.addToHomeConfig ) {
				options[i] = w.addToHomeConfig[i];
			}
		}
		if ( !options.autostart ) options.hookOnLoad = false;

		isIPad = (/ipad/gi).test(nav.platform);
		isRetina = w.devicePixelRatio && w.devicePixelRatio > 1;
		isSafari = nav.appVersion.match(/Safari/gi);
		isStandalone = nav.standalone;
		
		OSVersion = nav.appVersion.match(/OS (\d+_\d+)/i);
		OSVersion = OSVersion[1] ? +OSVersion[1].replace('_', '.') : 0;
		
		lastVisit = +w.localStorage.getItem('addToHome');

		isSessionActive = w.sessionStorage.getItem('addToHomeSession');
		isReturningVisitor = options.returningVisitor ? lastVisit && lastVisit + 28*24*60*60*1000 > now : true;

		if ( !lastVisit ) lastVisit = now;

		// If it is expired we need to reissue a new balloon
		isExpired = isReturningVisitor && lastVisit <= now;

		if ( options.hookOnLoad ) w.addEventListener('load', loaded, false);
		else if ( !options.hookOnLoad && options.autostart ) loaded();
	}

	function loaded () {
		w.removeEventListener('load', loaded, false);

		if ( !isReturningVisitor ) w.localStorage.setItem('addToHome', Date.now());
		else if ( options.expire && isExpired ) w.localStorage.setItem('addToHome', Date.now() + options.expire * 60000);

		if ( !overrideChecks && ( !isSafari || !isExpired || isSessionActive || isStandalone || !isReturningVisitor ) ) return;

		var icons = options.touchIcon ? document.querySelectorAll('head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]') : [],
			sizes,
			touchIcon = '',
			closeButton,
			platform = nav.platform.split(' ')[0],
			language = nav.language.replace('-', '_'),
			i, l;

		balloon = document.createElement('div');
		balloon.id = 'addToHomeScreen';
		balloon.style.cssText += 'left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:' + (OSVersion < 5 ? 'absolute' : 'fixed');

		// Localize message
		if ( options.message in intl ) {		// You may force a language despite the user's locale
			language = options.message;
			options.message = '';
		}
		if ( options.message === '' ) {			// We look for a suitable language (defaulted to en_us)
			options.message = language in intl ? intl[language] : intl['en_us'];
		}

		// Search for the apple-touch-icon
		if ( icons.length ) {
			for ( i = 0, l = icons.length; i < l; i++ ) {
				sizes = icons[i].getAttribute('sizes');

				if ( sizes ) {
					if ( isRetina && sizes == '114x114' ) {
						touchIcon = icons[i].href;
						break;
					}
				} else {
					touchIcon = icons[i].href;
				}
			}

			touchIcon = '<span style="background-image:url(' + touchIcon + ')" class="addToHomeTouchIcon"></span>';
		}

		balloon.className = (isIPad ? 'addToHomeIpad' : 'addToHomeIphone') + (touchIcon ? ' addToHomeWide' : '');
		balloon.innerHTML = touchIcon +
			options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') +
			(options.arrow ? '<span class="addToHomeArrow"></span>' : '') +
			'<span class="addToHomeClose">\u00D7</span>';

		document.body.appendChild(balloon);

		// Add the close action
		closeButton = balloon.querySelector('.addToHomeClose');
		if ( closeButton ) closeButton.addEventListener('click', clicked, false);

		setTimeout(show, options.startDelay);
	}

	function show () {
		var duration,
			iPadXShift = 160;

		// Set the initial position
		if ( isIPad ) {
			if ( OSVersion < 5 ) {
				startY = w.scrollY;
				startX = w.scrollX;
				iPadXShift = 208;
			}

			balloon.style.top = startY + options.bottomOffset + 'px';
			balloon.style.left = startX + iPadXShift - Math.round(balloon.offsetWidth / 2) + 'px';

			switch ( options.animationIn ) {
				case 'drop':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(w.scrollY + options.bottomOffset + balloon.offsetHeight) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.opacity = '0';
					balloon.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		} else {
			startY = w.innerHeight + w.scrollY;

			if ( OSVersion < 5 ) {
				startX = Math.round((w.innerWidth - balloon.offsetWidth) / 2) + w.scrollX;
				balloon.style.left = startX + 'px';
				balloon.style.top = startY - balloon.offsetHeight - options.bottomOffset + 'px';
			} else {
				balloon.style.left = '50%';
				balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) + 'px';
				balloon.style.bottom = options.bottomOffset + 'px';
			}

			switch (options.animationIn) {
				case 'drop':
					duration = '1s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + (balloon.offsetHeight + options.bottomOffset + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		}

		balloon.offsetHeight;	// repaint trick
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.opacity = '1';
		balloon.style.webkitTransform = 'translate3d(0,0,0)';
		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);

		closeTimeout = setTimeout(close, options.lifespan);
	}

	function manualShow (override) {
		if ( !isIDevice || balloon ) return;

		overrideChecks = override;
		loaded();
	}

	function close () {
		clearInterval( positionInterval );
		clearTimeout( closeTimeout );
		closeTimeout = null;

		var posY = 0,
			posX = 0,
			opacity = '1',
			duration = '0',
			closeButton = balloon.querySelector('.addToHomeClose');

		if ( closeButton ) closeButton.removeEventListener('click', close, false);

		if ( OSVersion < 5 ) {
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY;
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth)/2) - startX;
		}

		balloon.style.webkitTransitionProperty = '-webkit-transform,opacity';

		switch ( options.animationOut ) {
			case 'drop':
				if ( isIPad ) {
					duration = '0.4s';
					opacity = '0';
					posY = posY + 50;
				} else {
					duration = '0.6s';
					posY = posY + balloon.offsetHeight + options.bottomOffset + 50;
				}
				break;
			case 'bubble':
				if ( isIPad ) {
					duration = '0.8s';
					posY = posY - balloon.offsetHeight - options.bottomOffset - 50;
				} else {
					duration = '0.4s';
					opacity = '0';
					posY = posY - 50;
				}
				break;
			default:
				duration = '0.8s';
				opacity = '0';
		}

		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);
		balloon.style.opacity = opacity;
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}


	function clicked () {
		w.sessionStorage.setItem('addToHomeSession', '1');
		isSessionActive = true;
		close();
	}

	function transitionEnd () {
		balloon.removeEventListener('webkitTransitionEnd', transitionEnd, false);

		balloon.style.webkitTransitionProperty = '-webkit-transform';
		balloon.style.webkitTransitionDuration = '0.2s';

		// We reached the end!
		if ( !closeTimeout ) {
			balloon.parentNode.removeChild(balloon);
			balloon = null;
			return;
		}

		// On iOS 4 we start checking the element position
		if ( OSVersion < 5 && closeTimeout ) positionInterval = setInterval(setPosition, options.iterations);
	}

	function setPosition () {
		var matrix = new WebKitCSSMatrix(w.getComputedStyle(balloon, null).webkitTransform),
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY,
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;

		// Screen didn't move
		if ( posY == matrix.m42 && posX == matrix.m41 ) return;

		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}

	// Clear local and session storages (this is useful primarily in development)
	function reset () {
		w.localStorage.removeItem('addToHome');
		w.sessionStorage.removeItem('addToHomeSession');
	}

	// Bootstrap!
	init();

	return {
		show: manualShow,
		close: close,
		reset: reset
	};
})(this);