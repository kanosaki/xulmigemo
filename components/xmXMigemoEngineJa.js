/* This depends on: 
	xmIXMigemoDictionaryJa
	xmIXMigemoTextTransformJa
*/
var DEBUG = false;
var TEST = false;
var Cc = Components.classes;
var Ci = Components.interfaces;
 
Components.utils.import('resource://gre/modules/XPCOMUtils.jsm'); 

var Prefs = Cc['@mozilla.org/preferences;1']
			.getService(Ci.nsIPrefBranch);
 
function xmXMigemoEngineJa() { 
	mydump('create instance xmIXMigemoEngine(lang=ja)');
}

xmXMigemoEngineJa.prototype = {
	lang : 'ja',

	classDescription : 'XUL/Migemo Japanese Engine',
	contractID : '@piro.sakura.ne.jp/xmigemo/engine;1?lang=ja',
	classID : Components.ID('{792f3b58-cef4-11db-8314-0800200c9a66}'),

	QueryInterface : XPCOMUtils.generateQI([
		Ci.xmIXMigemoEngine,
		Ci.pIXMigemoEngine
	]),

	get wrappedJSObject() {
		return this;
	},
	
	SYSTEM_DIC : 1, 
	USER_DIC   : 2,
	ALL_DIC    : 3,
 
	get dictionary() 
	{
		if (!this._dictionary) {
			if (TEST && xmXMigemoDictionaryJa) {
				this._dictionary = new xmXMigemoDictionaryJa();
			}
			else {
				this._dictionary = Cc['@piro.sakura.ne.jp/xmigemo/dictionary;1?lang='+this.lang]
					.getService(Ci.xmIXMigemoDictionary)
					.QueryInterface(Ci.xmIXMigemoDictionaryJa);
			}
		}
		return this._dictionary;
	},
	_dictionary : null,
 
	get textUtils() 
	{
		if (!this._textUtils) {
			if (TEST && xmXMigemoTextUtils) {
				this._textUtils = new xmXMigemoTextUtils();
			}
			else {
				this._textUtils = Cc['@piro.sakura.ne.jp/xmigemo/text-utility;1']
						.getService(Ci.xmIXMigemoTextUtils);
			}
		}
		return this._textUtils;
	},
	_textUtils : null,
 
	get textTransform() 
	{
		if (!this._textTransform) {
			if (TEST && xmXMigemoTextTransformJa) {
				this._textTransform = new xmXMigemoTextTransformJa();
			}
			else {
				this._textTransform = Cc['@piro.sakura.ne.jp/xmigemo/text-transform;1?lang='+this.lang]
					.getService(Ci.xmIXMigemoTextTransform)
					.QueryInterface(Ci.xmIXMigemoTextTransformJa);
			}
		}
		return this._textTransform;
	},
	_textTransform : null,
 
	getRegExpFor : function(aInput, aTargetDic) 
	{
		if (!aInput) return null;

		aInput = aInput.toLowerCase();

		var transform = this.textTransform;

		mydump('noCache');

		var hira = transform.expand(
				this.textUtils.sanitizeForTransformOutput(
					transform.roman2kana(
						transform.kata2hira(
							this.textUtils.sanitizeForTransformInput(aInput)
						)
					)
				)
			);

		var roman = aInput;
		if (/[\uff66-\uff9f]/.test(roman)) roman = transform.hira2roman(transform.kata2hira(roman))
		var ignoreHiraKata = Prefs.getBoolPref('xulmigemo.ignoreHiraKata');
		var kana = ignoreHiraKata ? '' :
				transform.expand2(
					this.textUtils.sanitizeForTransformOutput(
						transform.roman2kana2(
							this.textUtils.sanitizeForTransformInput(roman),
							transform.KANA_KATA
						)
					),
					transform.KANA_KATA
				);
		var hiraAndKana = ignoreHiraKata ?
				transform.expand2(
					this.textUtils.sanitizeForTransformOutput(
						transform.roman2kana2(
							this.textUtils.sanitizeForTransformInput(roman),
							transform.KANA_ALL
						)
					),
					transform.KANA_ALL
				) :
				hira + '|' + kana ;
		mydump('hiraAndKana: '+encodeURIComponent(hiraAndKana));

		var zen = transform.roman2zen(aInput); // aInput ?
		mydump('zen: '+encodeURIComponent(zen));

		var lines = this.gatherEntriesFor(aInput, aTargetDic);

		var original = this.textUtils.sanitize(aInput);
		if (Prefs.getBoolPref('xulmigemo.ignoreLatinModifiers'))
			original = transform.addLatinModifiers(original);

		var pattern = '';
		if (lines.length) {
			var arr = [];
			if (!/[\[\(]/.test(zen)) arr.push(zen);
			if (!/[\[\(]/.test(hiraAndKana)) {
				arr.push(hira);
				arr.push(kana);
			}
			var searchterm = arr.concat(lines).join('\n').replace(/(\t|\n\n)+/g, '\n');

			if (/[\[\(]/.test(zen)) pattern += (pattern ? '|' : '') + zen;
			if (/[\[\(]/.test(hiraAndKana)) pattern += (pattern ? '|' : '') + hiraAndKana;

			// �ꕶ�������̍��ڂ����́A�����o���ĕ����N���X�ɂ܂Ƃ߂�
			var ichimoji = searchterm
							.replace(/^..+$\n?/mg, '')
							.split('\n')
							.sort()
							.join('')
							.replace(/(.)\1+/g, '$1');
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
			searchterm = this.textUtils.sanitize(searchterm)
				.replace(/\n/g, '|');
			pattern += (pattern ? '|' : '') + searchterm;//.substring(0, searchterm.length-1);

			pattern += (pattern ? '|' : '') + original;
			pattern = pattern.replace(/\n/g, '');

			mydump('pattern(from dic):'+encodeURIComponent(pattern));
		}
		else { // �����Ɉ���������Ȃ������͗l�Ȃ̂Ŏ��O�̕����񂾂�
			pattern = original;
			if (original != zen) pattern += '|' + zen;
			if (original != hiraAndKana) pattern += '|' + hiraAndKana;
			mydump('pattern:'+encodeURIComponent(pattern));
		}

		return pattern.replace(/\n|^\||\|$/g, '')
				.replace(/([^\\]|^)\|\|+/g, '$1|')
				.replace(/([^\\]|^)\(\|/g, '$1(')
				.replace(/([^\\]|^)\|\)/g, '$1)');
	},
 
	splitInput : function(aInput) 
	{
		var terms = (
					(/^[A-Z]{2,}/.test(aInput)) ?
						aInput.replace(/([a-z])/g, '\t$1') : // CapsLock����Ă�ꍇ�͏������ŋ�؂�
						aInput.replace(/([A-Z])/g, '\t$1')
				)
				.replace(/([\uff66-\uff9fa-z])([0-9])/i, '$1\t$2')
				.replace(/([0-9a-z])([\uff66-\uff9f])/i, '$1\t$2')
				.replace(/([0-9\uff66-\uff9f])([a-z])/i, '$1\t$2')
				.replace(new RegExp('([!"#\$%&\'\\(\\)=~\\|\\`\\{\\+\\*\\}<>\\?_\\-\\^\\@\\[\\;\\:\\]\\/\\\\\\.,\uff61\uff64]+)', 'g'), '\t$1\t');

		terms = terms
				.replace(/ +|\t\t+/g, '\t')
				.replace(/^[\s\t]+|[\s\t]+$/g, '')
				.split('\t');

		return terms;
	},
 
	gatherEntriesFor : function(aInput, aTargetDic) 
	{
		if (!aInput) {
			return [];
		}
		aTargetDic = aTargetDic || this.ALL_DIC;

		var transform = this.textTransform;

		var hira = transform.expand(
					this.textUtils.sanitize(
						transform.roman2kana(
							transform.kata2hira(aInput)
						)
					)
				);

		var str = this.textUtils.sanitize(aInput);
		if (Prefs.getBoolPref('xulmigemo.ignoreLatinModifiers'))
			str = transform.addLatinModifiers(str);

		var tmp  = '^' + hira + '.+$'; //���{��
		var tmpA = '^(' + str + ').+$'; //�A���t�@�x�b�g
		var exp  = new RegExp(tmp, 'mg');
		var expA = new RegExp(tmpA, 'mg');

		var firstlet = '';
		firstlet = aInput.charAt(0);//�ŏ��̕���
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

		return lines;
	}
 
}; 
  
if (XPCOMUtils.generateNSGetFactory) 
	var NSGetFactory = XPCOMUtils.generateNSGetFactory([xmXMigemoEngineJa]);
else
	var NSGetModule = XPCOMUtils.generateNSGetModule([xmXMigemoEngineJa]);
 
function mydump(aString) 
{
	if (DEBUG)
		dump((aString.length > 1024 ? aString.substring(0, 1024) : aString )+'\n');
}
 
