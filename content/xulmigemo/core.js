/* 
	This depends on:
		service.js
		dic.js
*/
 
var XMigemoCore = { 
	
	// SKK�����̓��͈ȊO�ŁA���ߋ�؂�Ƃ��ĔF�����镶�� 
	INPUT_SEPARATOR : " ",
 
	createCacheTimeOverride : -1,
 
/* Create Regular Expressions */ 
	
	getRegExp : function(aRoman, aEnableAutoSplit) 
	{
		var myExp = [];

		var autoSplit = (aEnableAutoSplit === void(0)) ? XMigemoService.getPref('xulmigemo.splitTermsAutomatically') : aEnableAutoSplit ;

		// ���͂�؂��āA���߂Ƃ��Čʂɐ��K�\���𐶐�����
		var romanTerm;
		var romanTerms = (
					(/^[A-Z]{2,}/.test(aRoman)) ?
						aRoman.replace(/([a-z])/g, '\t$1') : // CapsLock����Ă�ꍇ�͏������ŋ�؂�
						aRoman.replace(/([A-Z])/g, '\t$1')
				)
				.replace(/([\uff66-\uff9fa-z])([0-9])/i, '$1\t$2')
				.replace(/([0-9a-z])([\uff66-\uff9f])/i, '$1\t$2')
				.replace(/([0-9\uff66-\uff9f])([a-z])/i, '$1\t$2')
				.replace(new RegExp('([!"#\$%&\'\\(\\)=~\\|\\`\\{\\+\\*\\}<>\\?_\\-\\^\\@\\[\\;\\:\\]\\/\\\\\\.,\uff61\uff64' + this.INPUT_SEPARATOR + ']+)', 'g'), '\t$1\t')
				.split('\t');
		var separatorRegExp = new RegExp('^(' + this.INPUT_SEPARATOR +'+)$');
		mydump('ROMAN: '+romanTerms.join('/').toLowerCase()+'\n');

		var pattern, romanTermPart, nextPart;
		for (var i = 0, maxi = romanTerms.length; i < maxi; i++)
		{
			romanTerm = romanTerms[i].toLowerCase();

			if (separatorRegExp.test(romanTerm)) {
				myExp.push('(' + RegExp.$1 + ')*');
				continue;
			}

			pattern = this.getRegExpPart(romanTerm);
			if (!pattern) continue;
			myExp.push(pattern);


			if (!autoSplit) continue;

			romanTermPart = romanTerm;
			while (romanTermPart.length > 1)
			{
				romanTermPart = romanTermPart.substring(0, romanTermPart.length-1);
				pattern = this.getRegExpPart(romanTermPart, true);
				if (!this.simplePartOnlyPattern.test(pattern.replace(/\\\|/g, ''))) {
					myExp[myExp.length-1] = [
						myExp[myExp.length-1],
						'|(',
						pattern,
						')(',
						this.getRegExp(romanTerm.substring(romanTermPart.length, romanTerm.length)),
						')'
					].join('').replace(/\n/g, '');
					break;
				}
			}
		}

		myExp = (myExp.length == 1) ? myExp[0] :
				(myExp.length) ? ['(', myExp.join(')('), ')'].join('').replace(/\n/g, '') :
				'' ;

		return myExp;
	},
 
	simplePartOnlyPattern : /^([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)$/i, 
 
	getRegExpPart : function(aRoman) 
	{
		aRoman = aRoman.toLowerCase();

		var cacheText = XMigemoCache.getCacheFor(aRoman);
		if (cacheText) {
			mydump('cache:'+cacheText);
			return cacheText;
		}

		mydump('noCache');
		var str = XMigemoTextService.expand(
				XMigemoTextService.sanitize(
					XMigemoTextService.convertStr(
						XMigemoTextService.kana2hira(aRoman)
					)
				)
			);
		var hira = str;
		var roman = aRoman;
		if (/[\uff66-\uff9f]/.test(roman)) roman = XMigemoTextService.hira2roman(XMigemoTextService.kana2hira(roman))
		var ignoreHiraKata = XMigemoService.getPref('xulmigemo.ignoreHiraKata');
		var kana = ignoreHiraKata ? '' :
				XMigemoTextService.expand2(
					XMigemoTextService.sanitize2(
						XMigemoTextService.convertStr2(
							roman,
							XMigemoTextService.KANA_KATA
						)
					),
					XMigemoTextService.KANA_KATA
				);
		var hiraAndKana = ignoreHiraKata ?
				XMigemoTextService.expand2(
					XMigemoTextService.sanitize2(
						XMigemoTextService.convertStr2(
							roman,
							XMigemoTextService.KANA_ALL
						)
					),
					XMigemoTextService.KANA_ALL
				) :
				str + '|' + kana ;
		var zen = XMigemoTextService.roman2zen(aRoman); // aRoman ?
		mydump('hira:'+hira);

		var date1 = new Date();

		var lines = this.gatherEntriesFor(aRoman);

		var pattern = '';
		if (lines.length) {
			var arr = [];
			arr.push(XMigemoTextService.sanitize(aRoman).toUpperCase());
			if (zen.indexOf('[') < 0) arr.push(zen);
			if (hiraAndKana.indexOf('[') < 0) {
				arr.push(hira);
				arr.push(kana);
			}
			searchterm = arr.concat(lines).join('\n').replace(/(\t|\n\n)+/g, '\n');

			if (zen.indexOf('[') > -1) pattern += (pattern ? '|' : '') + zen;
			if (hiraAndKana.indexOf('[') > -1) pattern += (pattern ? '|' : '') + hiraAndKana;

			// �ꕶ�������̍��ڂ����́A�����o���ĕ����N���X�ɂ܂Ƃ߂�
			var ichimoji = searchterm.replace(/^..+$\n?/mg, '').split('\n').sort().join('');
			if (ichimoji) {
				pattern += (pattern ? '|' : '') + '[' + ichimoji + ']';
			}

			// foo, foobar, fooee... �Ƃ��������ɁA����������Ŏn�܂镡���̌�₪����ꍇ�́A
			// �ł��Z�����i���̗�Ȃ�foo�j�����ɂ���
			searchterm = searchterm
				.split('\n')
				.sort()
				.join('\n')
				.replace(/^(.+)$(\n\1.*$)+/img, '$1')
				.replace(/^.$\n?/mg, ''); // �ꕶ�������̍��ڂ͗p�ς݂Ȃ̂ō폜
			searchterm = XMigemoTextService.sanitize(searchterm)
				.replace(/\n/g, '|');
			pattern += (pattern ? '|' : '') + searchterm.substring(0, searchterm.length-1);

			pattern = pattern.replace(/\n/g, '');

			mydump('pattern(from dic):'+pattern);
		}
		else { // �����Ɉ���������Ȃ������͗l�Ȃ̂Ŏ��O�̕����񂾂�
			pattern = XMigemoTextService.sanitize(aRoman) + '|' + zen + '|' + hiraAndKana;
			mydump('pattern:'+pattern);
		}


		var date2 = new Date();
		if (date2.getTime() - date1.getTime() > (this.createCacheTimeOverride > -1 ? this.createCacheTimeOverride : XMigemoService.getPref('xulmigemo.cache.update.time'))) {
			// �x��������L���b�V�����܂�
			XMigemoCache.save(aRoman, pattern);
			XMigemoCache.setMemCache(aRoman, pattern);
			mydump('CacheWasSaved');
		}
		else{
			XMigemoCache.setMemCache(aRoman, pattern);//�������L���b�V��
			mydump('memCacheWasSaved');
		}
		mydump(date2.getTime() - date1.getTime());

		return pattern;
	},
  
	gatherEntriesFor : function(aRoman, aTargetDic) 
	{
		var str = XMigemoTextService.expand(
					XMigemoTextService.sanitize(
						XMigemoTextService.convertStr(
							XMigemoTextService.kana2hira(aRoman)
						)
					)
				);
		var hira = str;

		var tmp  = '^' + hira + '.+$'; //���{��
		var tmpA = '^' + XMigemoTextService.sanitize(aRoman) + '.+$'; //�A���t�@�x�b�g
		var exp  = new RegExp(tmp, 'mg');
		var expA = new RegExp(tmpA, 'mg');

		var firstlet = '';
		firstlet = aRoman.charAt(0);//�ŏ��̕���
		mydump(firstlet+' dic loaded');

		var lines = [];

		aTargetDic = (aTargetDic || '').toLowerCase();

		var mydicAU = (aTargetDic != 'system') ? XMigemoDic.getUserAlphaDic() : null ;
		var mydicA  = (aTargetDic != 'user')   ? XMigemoDic.getAlphaDic() : null ;
		var mydicU  = (aTargetDic != 'system') ? XMigemoDic.getUserDic(firstlet) : null ;
		var mydic   = (aTargetDic != 'user')   ? XMigemoDic.getDic(firstlet) : null ;

		if (mydicAU) {
			var lineAU = mydicAU.match(expA);
			mydump('searchEnDic (user)');
			if (lineAU) {
				lines = lines.concat(lineAU);
				mydump(' found '+lineAU.length+' terms');
			}
		}
		if (mydicA) {
			var lineA = mydicA.match(expA);//�A���t�@�x�b�g�̎���������
			mydump('searchEnDic');
			if (lineA) {
				lines = lines.concat(lineA);
				mydump(' found '+lineA.length+' terms');
			}
		}
		if (mydicU) {
			var lineU = mydicU.match(exp);
			mydump('searchJpnDic (user)');
			if (lineU) {
				lines = lines.concat(lineU);
				mydump(' found '+lineU.length+' terms');
			}
		}
		if (mydic) {
			var line = mydic.match(exp);//���{��̎���������
			mydump('searchJpnDic');
			if (line) {
				lines = lines.concat(line);
				mydump(' found '+line.length+' terms');
			}
		}

		return lines;
	},
 
/* Find */ 
	
	get mFind() 
	{
		if (!this._mFind)
			this._mFind = Components.classes['@mozilla.org/embedcomp/rangefind;1'].createInstance(Components.interfaces.nsIFind);
		return this._mFind;
	},
	_mFind : null,
 
	regExpFind : function(aRegExp, aFindRange, aStartPoint, aEndPoint, aFindBackwards) 
	{
		//patText��getRegExp()�œ���ꂽ���K�\���I�u�W�F�N�g
		var doc = Components.lookupMethod(aFindRange.startContainer, 'ownerDocument').call(aFindRange.startContainer);
		var term;
		var regExp;
		var txt = XMigemoTextService.range2Text(aFindRange);
		if (aFindBackwards) {
			txt = txt.split('').reverse().join('');
			regExp = XMigemoTextService.reverseRegExp(aRegExp);
		}
		else {
			regExp = aRegExp;
		}

		if (findBackwards) {
			if (txt.match(regExp)) {
				term = RegExp.lastMatch.split('').reverse().join('');
			}
		}
		else {
			if (txt.match(regExp)) {
				term = RegExp.lastMatch;
			}
		}

		this.mFind.findBackwards = aFindBackwards;
		var docShell = this.getDocShellForFrame(Components.lookupMethod(doc, 'defaultView').call(doc));
		var foundRange = this.mFind.Find(term, aFindRange, aStartPoint, aEndPoint);
		return foundRange;
	},
 
	regExpFindArr : function(aRegExp, aFindRange, aStartPoint, aEndPoint) 
	{
		//patText��getRegExp()�œ���ꂽ���K�\���I�u�W�F�N�g
		var doc = Components.lookupMethod(aFindRange.startContainer, 'ownerDocument').call(aFindRange.startContainer);
		var arrTerms;
		var arrResults = [];
		var rightContext;
		var regExp;
		var txt = XMigemoTextService.range2Text(aFindRange);
		regExp = aRegExp;
		arrTerms = txt.match(new RegExp(regExp.source, 'img'));
		this.mFind.findBackwards = false;
		var docShell = this.getDocShellForFrame(Components.lookupMethod(doc, 'defaultView').call(doc));
		var foundRange;
		for (var i = 0, maxi = arrTerms.length; i < maxi; i++)
		{
			foundRange = this.mFind.Find(arrTerms[i], aFindRange, aStartPoint, aEndPoint);
			arrResults.push(foundRange);
			findRange.setStart(foundRange.endContainer, foundRange.endOffset);
			startPoint.selectNodeContents(doc.body);
			startPoint.setStart(foundRange.endContainer, foundRange.endOffset);
			startPoint.collapse(true);
		}
		return arrResults;
	},
 
	getDocShellForFrame : function(aFrame) 
	{
		var viewWrapper = new XPCNativeWrapper(aFrame, 'QueryInterface()');
		return viewWrapper
				.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
				.getInterface(Components.interfaces.nsIWebNavigation)
				.QueryInterface(Components.interfaces.nsIDocShell);
	},
  
/* Update Cache */ 
	
	updateCacheTimers : [], 
 
	updateCacheFor : function(aRomanPatterns) 
	{
		var patterns = aRomanPatterns.split('\n');
		var key      = patterns.join('/');
		if (this.updateCacheTimers[key]) {
			window.clearInterval(this.updateCacheTimers[key]);
		}
		this.updateCacheTimers[key] = window.setInterval(
			this.updateCacheCallback,
			100,
			this,
			patterns,
			key
		);
	},
 
	updateCacheCallback : function(aThis, aPatterns, aKey) 
	{
		if (!aPatterns.length) {
			if (aThis.updateCacheTimers[aKey]) {
				window.clearInterval(aThis.updateCacheTimers[aKey]);
				delete aThis.updateCacheTimers[aKey];
			}
			return;
		}
		if (aPatterns[0])
			aThis.getRegExpPart(aPatterns[0]);
		aPatterns.splice(0, 1);
	},
  
	observe : function(aSubject, aTopic, aData) 
	{
		switch (aTopic)
		{
			case 'XMigemo:cacheCleared':
				this.updateCacheFor(aData);
				return;
		}
	},
 
	init : function() 
	{
		XMigemoService.ObserverService.addObserver(this, 'XMigemo:cacheCleared', false);
	},
 
	destroy : function() 
	{
		XMigemoService.ObserverService.removeObserver(this, 'XMigemo:cacheCleared');
	},
 
}; 
 
window.addEventListener('load', function() { 
	XMigemoCore.init();
}, false);
window.addEventListener('unload', function() {
	XMigemoCore.destroy();
}, false);
  
var xulMigemoCore = XMigemoCore; 
 
