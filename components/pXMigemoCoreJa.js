/* This depends on: 
	pIXMigemoDictionaryJa
	pIXMigemoTextTransformJa
*/
var DEBUG = false;
 
var Prefs = Components 
			.classes['@mozilla.org/preferences;1']
			.getService(Components.interfaces.nsIPrefBranch);
 
function pXMigemoEngineJa() { 
	mydump('create instance pIXMigemoEngine(lang=ja)');
}

pXMigemoEngineJa.prototype = {
	lang : 'ja',

	get contractID() {
		return '@piro.sakura.ne.jp/xmigemo/engine;1?lang='+this.lang;
	},
	get classDescription() {
		return 'This is a Migemo service itself, for Japanese language.';
	},
	get classID() {
		return Components.ID('{792f3b58-cef4-11db-8314-0800200c9a66}');
	},

	get wrappedJSObject() {
		return this;
	},
	 
	SYSTEM_DIC : 1, 
	USER_DIC   : 2,
	ALL_DIC    : 3,
 
	get dictionary() 
	{
		if (!this._dictionary) {
			this._dictionary = Components
				.classes['@piro.sakura.ne.jp/xmigemo/dictionary;1?lang='+this.lang]
				.getService(Components.interfaces.pIXMigemoDictionary)
				.QueryInterface(Components.interfaces.pIXMigemoDictionaryJa);
		}
		return this._dictionary;
	},
	_dictionary : null,
 
	get textTransform() 
	{
		if (!this._textTransform) {
			this._textTransform = Components
					.classes['@piro.sakura.ne.jp/xmigemo/text-transform;1?lang='+this.lang]
					.getService(Components.interfaces.pIXMigemoTextTransform)
					.QueryInterface(Components.interfaces.pIXMigemoTextTransformJa);
		}
		return this._textTransform;
	},
	_textTransform : null,
 
	getRegExpFor : function(aRoman) 
	{
		if (!aRoman) return null;

		aRoman = aRoman.toLowerCase();

		var XMigemoTextService = this.textTransform;
		var XMigemoTextUtils = Components
				.classes['@piro.sakura.ne.jp/xmigemo/text-utility;1']
				.getService(Components.interfaces.pIXMigemoTextUtils);

		mydump('noCache');
		var str = XMigemoTextService.expand(
				XMigemoTextUtils.sanitize(
					XMigemoTextService.convertStr(
						XMigemoTextService.kana2hira(aRoman)
					)
				)
			);
		var hira = str;
		var roman = aRoman;
		if (/[\uff66-\uff9f]/.test(roman)) roman = XMigemoTextService.hira2roman(XMigemoTextService.kana2hira(roman))
		var ignoreHiraKata = Prefs.getBoolPref('xulmigemo.ignoreHiraKata');
		var kana = ignoreHiraKata ? '' :
				XMigemoTextService.expand2(
					XMigemoTextUtils.sanitize2(
						XMigemoTextService.convertStr2(
							roman,
							XMigemoTextService.KANA_KATA
						)
					),
					XMigemoTextService.KANA_KATA
				);
		var hiraAndKana = ignoreHiraKata ?
				XMigemoTextService.expand2(
					XMigemoTextUtils.sanitize2(
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

		var lines = this.gatherEntriesFor(aRoman, this.ALL_DIC, {});

		var pattern = '';
		if (lines.length) {
			var arr = [];
			arr.push(XMigemoTextUtils.sanitize(aRoman).toUpperCase());
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
			searchterm = XMigemoTextUtils.sanitize(searchterm)
				.replace(/\n/g, '|');
			pattern += (pattern ? '|' : '') + searchterm;//.substring(0, searchterm.length-1);

			pattern = pattern.replace(/\n/g, '');

			mydump('pattern(from dic):'+pattern);
		}
		else { // �����Ɉ���������Ȃ������͗l�Ȃ̂Ŏ��O�̕����񂾂�
			pattern = XMigemoTextUtils.sanitize(aRoman) + '|' + zen + '|' + hiraAndKana;
			mydump('pattern:'+pattern);
		}

		return pattern;
	},
 
	splitInput : function(aRoman, aCount) 
	{
		ver terms = (
					(/^[A-Z]{2,}/.test(aRoman)) ?
						aRoman.replace(/([a-z])/g, '\t$1') : // CapsLock����Ă�ꍇ�͏������ŋ�؂�
						aRoman.replace(/([A-Z])/g, '\t$1')
				)
				.replace(/([\uff66-\uff9fa-z])([0-9])/i, '$1\t$2')
				.replace(/([0-9a-z])([\uff66-\uff9f])/i, '$1\t$2')
				.replace(/([0-9\uff66-\uff9f])([a-z])/i, '$1\t$2')
				.replace(new RegExp('([!"#\$%&\'\\(\\)=~\\|\\`\\{\\+\\*\\}<>\\?_\\-\\^\\@\\[\\;\\:\\]\\/\\\\\\.,\uff61\uff64' + this.INPUT_SEPARATOR + ']+)', 'g'), '\t$1\t');

		var separatorRegExp = new RegExp(this.INPUT_SEPARATOR +'+|\t\t+');
		terms = terms
				.replace(separatorRegExp, '\t')
				.replace(/^[\s\t]+|[\s\t]+$/g, '')
				.split('\t');

		aCount.value = terms.length;
		return terms;
	},
	 
	// SKK�����̓��͈ȊO�ŁA���ߋ�؂�Ƃ��ĔF�����镶�� 
	INPUT_SEPARATOR : " ",
  
	gatherEntriesFor : function(aRoman, aTargetDic, aCount) 
	{
		if (!aRoman) {
			aCount.value = 0;
			return [];
		}

		var XMigemoTextService = this.textTransform;
		var XMigemoTextUtils = Components
				.classes['@piro.sakura.ne.jp/xmigemo/text-utility;1']
				.getService(Components.interfaces.pIXMigemoTextUtils);

		var str = XMigemoTextService.expand(
					XMigemoTextUtils.sanitize(
						XMigemoTextService.convertStr(
							XMigemoTextService.kana2hira(aRoman)
						)
					)
				);
		var hira = str;

		var tmp  = '^' + hira + '.+$'; //���{��
		var tmpA = '^' + XMigemoTextUtils.sanitize(aRoman) + '.+$'; //�A���t�@�x�b�g
		var exp  = new RegExp(tmp, 'mg');
		var expA = new RegExp(tmpA, 'mg');

		var firstlet = '';
		firstlet = aRoman.charAt(0);//�ŏ��̕���
		mydump(firstlet+' dic loaded');

		var lines = [];

		const XMigemoDic = this.dictionary;

		var mydicAU = (aTargetDic & this.USER_DIC) ? XMigemoDic.getUserAlphaDic() : null ;
		var mydicA  = (aTargetDic & this.SYSTEM_DIC)   ? XMigemoDic.getAlphaDic() : null ;
		var mydicU  = (aTargetDic & this.USER_DIC) ? XMigemoDic.getUserDicFor(firstlet) : null ;
		var mydic   = (aTargetDic & this.SYSTEM_DIC)   ? XMigemoDic.getDicFor(firstlet) : null ;

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

		aCount.value = lines.length;
		return lines;
	},
 
	observe : function(aSubject, aTopic, aData) 
	{
	},
 
	QueryInterface : function(aIID) 
	{
		if(!aIID.equals(Components.interfaces.pIXMigemoEngine) &&
			!aIID.equals(Components.interfaces.nsISupports))
			throw Components.results.NS_ERROR_NO_INTERFACE;
		return this;
	}
};
 	 
var gModule = { 
	_firstTime: true,

	registerSelf : function (aComponentManager, aFileSpec, aLocation, aType)
	{
		if (this._firstTime) {
			this._firstTime = false;
			throw Components.results.NS_ERROR_FACTORY_REGISTER_AGAIN;
		}
		aComponentManager = aComponentManager.QueryInterface(Components.interfaces.nsIComponentRegistrar);
		for (var key in this._objects) {
			var obj = this._objects[key];
			aComponentManager.registerFactoryLocation(obj.CID, obj.className, obj.contractID, aFileSpec, aLocation, aType);
		}
	},

	getClassObject : function (aComponentManager, aCID, aIID)
	{
		if (!aIID.equals(Components.interfaces.nsIFactory))
			throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

		for (var key in this._objects) {
			if (aCID.equals(this._objects[key].CID))
				return this._objects[key].factory;
		}

		throw Components.results.NS_ERROR_NO_INTERFACE;
	},

	_objects : {
		manager : {
			CID        : pXMigemoEngineJa.prototype.classID,
			contractID : pXMigemoEngineJa.prototype.contractID,
			className  : pXMigemoEngineJa.prototype.classDescription,
			factory    : {
				createInstance : function (aOuter, aIID)
				{
					if (aOuter != null)
						throw Components.results.NS_ERROR_NO_AGGREGATION;
					return (new pXMigemoEngineJa()).QueryInterface(aIID);
				}
			}
		}
	},

	canUnload : function (aComponentManager)
	{
		return true;
	}
};

function NSGetModule(compMgr, fileSpec)
{
	return gModule;
}
 
function mydump(aString) 
{
	if (DEBUG)
		dump((aString.length > 80 ? aString.substring(0, 80) : aString )+'\n');
}
 
