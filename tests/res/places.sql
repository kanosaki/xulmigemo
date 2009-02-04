DROP TABLE IF EXISTS "moz_anno_attributes";
CREATE TABLE moz_anno_attributes (  id INTEGER PRIMARY KEY, name VARCHAR(32) UNIQUE NOT NULL);
INSERT INTO "moz_anno_attributes" VALUES(1,'Places/SmartBookmark');
INSERT INTO "moz_anno_attributes" VALUES(2,'bookmarkProperties/description');
INSERT INTO "moz_anno_attributes" VALUES(3,'placesInternal/READ_ONLY');
INSERT INTO "moz_anno_attributes" VALUES(4,'livemark/feedURI');
INSERT INTO "moz_anno_attributes" VALUES(5,'livemark/siteURI');
INSERT INTO "moz_anno_attributes" VALUES(7,'livemark/loadfailed');
INSERT INTO "moz_anno_attributes" VALUES(8,'livemark/expiration');
INSERT INTO "moz_anno_attributes" VALUES(9,'PlacesOrganizer/OrganizerQuery');
INSERT INTO "moz_anno_attributes" VALUES(10,'places/excludeFromBackup');
INSERT INTO "moz_anno_attributes" VALUES(11,'PlacesOrganizer/OrganizerFolder');
DROP TABLE IF EXISTS "moz_annos";
CREATE TABLE moz_annos (  id INTEGER PRIMARY KEY, place_id INTEGER NOT NULL, anno_attribute_id INTEGER, mime_type VARCHAR(32) DEFAULT NULL, content LONGVARCHAR, flags INTEGER DEFAULT 0, expiration INTEGER DEFAULT 0, type INTEGER DEFAULT 0, dateAdded INTEGER DEFAULT 0, lastModified INTEGER DEFAULT 0);
DROP TABLE IF EXISTS "moz_bookmarks";
CREATE TABLE moz_bookmarks (  id INTEGER PRIMARY KEY, type INTEGER, fk INTEGER DEFAULT NULL, parent INTEGER, position INTEGER, title LONGVARCHAR, keyword_id INTEGER, folder_type TEXT, dateAdded INTEGER, lastModified INTEGER);
INSERT INTO "moz_bookmarks" VALUES(1,2,NULL,0,0,'',NULL,'',1233763009703125,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(2,2,NULL,1,0,'Bookmarks Menu',NULL,'',1233763009718750,1233764148750000);
INSERT INTO "moz_bookmarks" VALUES(3,2,NULL,1,1,'Bookmarks Toolbar',NULL,'',1233763009718750,1233763010000000);
INSERT INTO "moz_bookmarks" VALUES(4,2,NULL,1,2,'Tags',NULL,'',1233763009718750,1233763395125000);
INSERT INTO "moz_bookmarks" VALUES(5,2,NULL,1,3,'Unsorted Bookmarks',NULL,'',1233763009718750,1233764487000000);
INSERT INTO "moz_bookmarks" VALUES(6,1,1,3,0,'Most Visited',NULL,NULL,1233763009921875,1233763009921875);
INSERT INTO "moz_bookmarks" VALUES(7,1,2,2,0,'Recently Bookmarked',NULL,NULL,1233763009921875,1233763009921875);
INSERT INTO "moz_bookmarks" VALUES(8,1,3,2,1,'Recent Tags',NULL,NULL,1233763009921875,1233763009921875);
INSERT INTO "moz_bookmarks" VALUES(10,1,4,2,13,'キーワードを含むブックマーク',1,NULL,1233763009984375,1233763278406250);
INSERT INTO "moz_bookmarks" VALUES(11,1,17,3,1,'タグ付けされたブックマーク',NULL,NULL,1233763010000000,1233763356734375);
INSERT INTO "moz_bookmarks" VALUES(12,2,NULL,3,2,'Latest Headlines',NULL,'',1233763010000000,1233763037218750);
INSERT INTO "moz_bookmarks" VALUES(19,2,NULL,1,4,'',NULL,'',1233763225140625,1233763225171875);
INSERT INTO "moz_bookmarks" VALUES(20,1,11,19,0,'History',NULL,NULL,1233763225140625,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(21,1,12,19,1,'Tags',NULL,NULL,1233763225140625,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(22,2,NULL,19,2,'All Bookmarks',NULL,'',1233763225140625,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(23,1,13,22,0,NULL,NULL,NULL,1233763225140625,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(24,1,14,22,1,NULL,NULL,NULL,1233763225140625,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(25,1,15,22,2,NULL,NULL,NULL,1233763225140625,1233763225140625);
INSERT INTO "moz_bookmarks" VALUES(26,2,NULL,4,0,'タグ',NULL,'',1233763395125000,1233764536656250);
INSERT INTO "moz_bookmarks" VALUES(27,1,17,26,0,NULL,NULL,NULL,1233763395125000,NULL);
INSERT INTO "moz_bookmarks" VALUES(28,2,NULL,4,1,'ブックマーク',NULL,'',1233763395125000,1233764523500000);
INSERT INTO "moz_bookmarks" VALUES(29,1,17,28,0,NULL,NULL,NULL,1233763395125000,NULL);
INSERT INTO "moz_bookmarks" VALUES(30,2,NULL,4,2,'場所',NULL,'',1233763395125000,1233764498484375);
INSERT INTO "moz_bookmarks" VALUES(31,1,17,30,0,NULL,NULL,NULL,1233763395125000,NULL);
INSERT INTO "moz_bookmarks" VALUES(34,1,19,26,1,NULL,NULL,NULL,1233763841468750,NULL);
INSERT INTO "moz_bookmarks" VALUES(35,1,19,30,1,NULL,NULL,NULL,1233763842421875,NULL);
INSERT INTO "moz_bookmarks" VALUES(36,1,22,2,2,'ブックマークレット',0,NULL,1233763900312500,1233763916171875);
INSERT INTO "moz_bookmarks" VALUES(37,1,24,2,12,'ブックマーク1',NULL,NULL,1233764040062500,1233764057015625);
INSERT INTO "moz_bookmarks" VALUES(38,1,25,2,11,'ブックマーク2',NULL,NULL,1233764060375000,1233764067093750);
INSERT INTO "moz_bookmarks" VALUES(39,1,26,2,10,'ブックマーク3',NULL,NULL,1233764071734375,1233764079843750);
INSERT INTO "moz_bookmarks" VALUES(40,1,27,2,9,'ブックマーク4',NULL,NULL,1233764082390625,1233764087562500);
INSERT INTO "moz_bookmarks" VALUES(41,1,28,2,8,'ブックマーク5',NULL,NULL,1233764090062500,1233764095171875);
INSERT INTO "moz_bookmarks" VALUES(42,1,31,2,7,'ブックマーク6',NULL,NULL,1233764097734375,1233764133093750);
INSERT INTO "moz_bookmarks" VALUES(43,1,29,2,6,'ブックマーク7',NULL,NULL,1233764107625000,1233764114125000);
INSERT INTO "moz_bookmarks" VALUES(44,1,30,2,5,'ブックマーク8',NULL,NULL,1233764115859375,1233764121656250);
INSERT INTO "moz_bookmarks" VALUES(45,1,32,2,4,'ブックマーク9',NULL,NULL,1233764141640625,1233764146234375);
INSERT INTO "moz_bookmarks" VALUES(46,1,33,2,3,'ブックマーク10',NULL,NULL,1233764148750000,1233764154359375);
INSERT INTO "moz_bookmarks" VALUES(57,1,38,5,7,'訪問済み5',NULL,NULL,1233764478859375,NULL);
INSERT INTO "moz_bookmarks" VALUES(58,1,38,30,2,NULL,NULL,NULL,1233764478937500,NULL);
INSERT INTO "moz_bookmarks" VALUES(59,1,37,5,8,'訪問済み4',NULL,NULL,1233764480531250,NULL);
INSERT INTO "moz_bookmarks" VALUES(60,1,37,30,3,NULL,NULL,NULL,1233764482078125,NULL);
INSERT INTO "moz_bookmarks" VALUES(61,1,36,5,9,'訪問済み3',NULL,NULL,1233764484031250,NULL);
INSERT INTO "moz_bookmarks" VALUES(62,1,36,30,4,NULL,NULL,NULL,1233764484109375,NULL);
INSERT INTO "moz_bookmarks" VALUES(63,1,35,5,10,'訪問済み2',NULL,NULL,1233764485687500,NULL);
INSERT INTO "moz_bookmarks" VALUES(64,1,35,30,5,NULL,NULL,NULL,1233764485765625,NULL);
INSERT INTO "moz_bookmarks" VALUES(65,1,34,5,11,'訪問済み1',NULL,NULL,1233764487000000,NULL);
INSERT INTO "moz_bookmarks" VALUES(66,1,34,30,6,NULL,NULL,NULL,1233764487093750,NULL);
INSERT INTO "moz_bookmarks" VALUES(67,1,24,28,1,NULL,NULL,NULL,1233764512875000,NULL);
INSERT INTO "moz_bookmarks" VALUES(68,1,24,26,2,NULL,NULL,NULL,1233764513968750,NULL);
INSERT INTO "moz_bookmarks" VALUES(69,1,25,28,2,NULL,NULL,NULL,1233764515625000,NULL);
INSERT INTO "moz_bookmarks" VALUES(70,1,26,28,3,NULL,NULL,NULL,1233764517359375,NULL);
INSERT INTO "moz_bookmarks" VALUES(71,1,26,26,3,NULL,NULL,NULL,1233764517750000,NULL);
INSERT INTO "moz_bookmarks" VALUES(72,1,27,26,4,NULL,NULL,NULL,1233764519875000,NULL);
INSERT INTO "moz_bookmarks" VALUES(73,1,28,28,4,NULL,NULL,NULL,1233764523500000,NULL);
INSERT INTO "moz_bookmarks" VALUES(74,1,28,26,5,NULL,NULL,NULL,1233764523921875,NULL);
INSERT INTO "moz_bookmarks" VALUES(75,1,38,26,6,NULL,NULL,NULL,1233764531937500,NULL);
INSERT INTO "moz_bookmarks" VALUES(76,1,36,26,7,NULL,NULL,NULL,1233764534984375,NULL);
INSERT INTO "moz_bookmarks" VALUES(77,1,34,26,8,NULL,NULL,NULL,1233764536656250,NULL);
DROP TABLE IF EXISTS "moz_bookmarks_roots";
CREATE TABLE moz_bookmarks_roots (  root_name VARCHAR(16) UNIQUE, folder_id INTEGER);
INSERT INTO "moz_bookmarks_roots" VALUES('places',1);
INSERT INTO "moz_bookmarks_roots" VALUES('menu',2);
INSERT INTO "moz_bookmarks_roots" VALUES('toolbar',3);
INSERT INTO "moz_bookmarks_roots" VALUES('tags',4);
INSERT INTO "moz_bookmarks_roots" VALUES('unfiled',5);
DROP TABLE IF EXISTS "moz_favicons";
CREATE TABLE moz_favicons (  id INTEGER PRIMARY KEY, url LONGVARCHAR UNIQUE, data BLOB, mime_type VARCHAR(32), expiration LONG);
INSERT INTO "moz_favicons" VALUES(1,'http://www.mozilla.org/2005/made-up-favicon/0-1233763009984375',X'89504E470D0A1A0A0000000D49484452000000100000001008060000001FF3FF610000031949444154388D75935D4C536718C7DF78C18517C69065C6102F8CF1D61B2FBCF47A264BE6C58942A26EC27033DBA08AC60AC63752306BF9700959830C905940DB1D6250AB6869544AED17FD90DA93AEED5A6C695A387D4B393DB49B9EFE77011BA2DB2FF9DF3DFFDFF35CBC2F211FD048E976954653D3A4D31D68EAD41D6AEAD41DFAB64377A0E172C7AECF1BE9F60FE7DF836E6BEEE8DD7DA5DF50376C11520FFD99B72F6212AC9155DC75A4DF76DF7B1D3FA3FDF508A7A2D584D06D1F95559A9E9A2E939D7F116595B9C5123CA935B8DEC8B0C58BB046243C160A1875659496819991DACB1DBBB648BE6CA63B7B27E6A67C8B25CC67CA0866CB98CF94E14B97E04ACA98891561094B78102C80F7335CBCE530D79EA79F104208E1385AA5FEF9FE178E0509AF326508CB6584737F622AC4600EE6301910319B90618D4830870A9808E471DBB98C7AAD89E3385A45EA55B4FA97E968C2BB584230BB5E8EE5FFC25381E11F844C09D6E8A660DCC370D5144C1E6DA19F92B3ADDD7BCC01F19D27B586F94C1953AF199E080C53A1AD82E97001E65001FC86A0CF92528E5D68DF471ADA747B9F47253893327CE912CCC11CFE0F77A208DECF30EA6618B06551F743FB7ED2D0A2DBFB5458812D5E8433B986C9800845A94051948FE28C1761F43218DC390CD896D605DFB46A6A78EF92628D4A988915319B90615F2882F72DFFBBD99B94E14EC8988D4918F7308C3845FC644929C7CF6AF6104E45ABF58F7FCF3D120AB084254C472458A312EEBA9750A900950AE04AC89808E471678EE1B62B8721BB88763EC4B87A5A4D388E569DEB3575F2018607C1159843858DACC29D90E18C4BB0FF21E1CEDCFAE9C32F45DCB46571466BD2711CAD2284107252A5A9E934FAC2BC9F810FE431B191DFFC0C462FC3987BB33C30BB8C368367E1D885F67D5B9EF257EA9EC3D7C69CC1117BB632EE6118F3308CBA7330B872187188187A2942FF3C8D5683235EA7D61EE1E8C6F6F72575E7BB0E367719FBBBEE47F2FA676965D82162D02EA2CFB2A8FC382914BFEB361A6BD5DAC3FF51DEE4B3EFE98E13976E70F557FADABEA637F58D9AC1FED357F5D74FAA7B4EADFFC4ADFC0D749F9496FF3423CB0000000049454E44AE426082','image/png',0);
INSERT INTO "moz_favicons" VALUES(2,'http://www.mozilla.org/images/mozilla-16.png',X'89504E470D0A1A0A0000000D49484452000000100000001008060000001FF3FF610000000467414D410000AFC837058AE90000001974455874536F6674776172650041646F626520496D616765526561647971C9653C000001D64944415478DA62FCFFFF3F0325002080989039EFDFBF67EFECECFCADACACFCDF9591F1BF8989C97F20FFD7EAD5ABB7DFBB774F169B010001C4007201089F3973C6CDD8D8F8BF0B03C3FF3340BC0A88EF02711A10BB40F1AA55AB76C1D4C330400081899933673E061AF63F14AA11449703F17F63080DE22B2929FD170489A1190010400CD030F80F3300C8F8BF1BE40A638861E5601719FF0F0D0D051B0276D9DDBB0A3003000208ACB9A3A3E31703D4769001EF181036C30C7A07C5BBA1DE8279072080A0A60842FC6E0C316026D42064C35641C30626BE0AEA2D800082B9E0F74C340DEF90F8C6602F0A82BD011307073030D001028811E40250B431DCBBC7D001340DE86C06572006BA88A11C1A5315407C16CA362E2F6778BF670F83CBD9B30C7B807C800002BB00E89FED201B3AA0A69F81DADC01C5B080ED80FABFBCBCFC3F8312909D96F61F208018DEBD7BC70E8E05414420FE4772A6A0A0E07F255080029D0FD238131823C6C0B002453DC8F50001048F0550A8BA406D7987E41263A88D208BD0D300080304109C0152E482643BC8A099C69090C6A519840102089E1780C978F77BA0DB5643F9A0C05C7D162CCE00F4C64F5C99092080304C0479A5031A95A0800505142EDB411820801829CDCE000106000C2794C7C06BC92C0000000049454E44AE426082','image/png',1233764009454382);
INSERT INTO "moz_favicons" VALUES(4,'http://piro.sakura.ne.jp/common/favicon.png',X'89504E470D0A1A0A0000000D4948445200000010000000100403000000EDDDE25200000018504C54450000005A4E8FFDFDFD7E73B047397C6B5FA1392B6ED7D3E4562B46C20000000174524E530040E6D8660000007649444154789C3DCC310E83300C05D04FA0991BA4EC240675A509EA5C840F10A9E20444BEFF116A1898FE93BFBE01C04AFD6AF49184154DB069610798A73DC6F504A48ECE17182B1C2E48E540AF1FCC87B71067A0254E6F2A80A4487ECA191D3BBF933EEE569D0C0AE821D30D5DA12998AFEAB1E733FE42B111530405E61C0000000049454E44AE426082','image/png',1233767661591904);
INSERT INTO "moz_favicons" VALUES(5,'http://piro.sakura.ne.jp/moezilla/favicon.png',X'89504E470D0A1A0A0000000D4948445200000010000000100403000000EDDDE25200000021504C5445222E48B47135D3143DE07400FF486FF9A410E29F61FFD800FFCC9EFFE6C9FFFFFF7AFB5F7A0000000B74524E53FFFFFFFFFFFFFFFFFFFF004A4F01F2000000097048597300002E2300002E230178A53F760000009B49444154789C0190006FFF04A1798BD2DEE570000400F9B220220089770400221E00DEFCDE6704022202FE22FEC0000402200002000240C204B20000200000020204E00020FE020022E204FE002EF000FE004004001EFEE3FF1C0200046EB685304BF4BE400407E00150802F20FE04006B6511014ED2C00400D49000FB0020DE0400FBF01095EAFE7004FDC0F3630FE20E0504937700BC00D20337B19932BE9E640EDB0000000049454E44AE426082','image/png',1233766466543636);
INSERT INTO "moz_favicons" VALUES(6,'http://piro.sakura.ne.jp/moezilla/favicon.ico',X'89504E470D0A1A0A0000000D49484452000000100000001008060000001FF3FF61000000F249444154388D8593B10D83301045FF082E3241064847999E35980021791E683C024B20D1A5A1B428D8C1D54F01E79C8D09964E5836FFF9DFF90C0018BB8A635711C708CE900BC8050CCE3038436F11F74F4300DEEE0211EBD0A0132C17971C04672807E900005C9D9CAF9520A79CEF4243BC0591DBBE83491DC6AE627086F076DF906F9EFF3F4804E805CEFDA59B92DB081008E7BE082BB90CCE64B7B04D7CBEEA08E1DCFFE60A7202082402B6298A13A0EA0B81250DC5BAFD018ED0C05C9C00B81C96953802EAB6588F248558A402441CE834A40113B1B7E0E7F1E63A342968EEB90E4D39F7AB67BA0E0D75E886D3FF7D013BF35DAE185FEAA80000000049454E44AE426082','image/png',1233765403493853);
INSERT INTO "moz_favicons" VALUES(7,'http://inu.imagines.jp/common/img/icon.png',X'89504E470D0A1A0A0000000D4948445200000010000000100403000000EDDDE2520000000373424954080808DBE14FE000000018504C5445000000FFFFFFCC3399CC66CCCC0099CC33CCFF99CCFF66CC63157792000000097048597300000B1200000B1201D2DD7EFC00000016744558744372656174696F6E2054696D650030382F31302F3033895BD10D0000002074455874536F667477617265004D6163726F6D656469612046697265776F726B73204D58BB912A240000006749444154789C4DCE310E83300C85E13F24C09A572E10A4762F95BA473D41380317E0FE137696E2C5D6F764D9F0AF78E8DD8763D7E27DFA043D9A4341BC0CBECE43239E2843612A41A04A5C250295B959922D8AC5C1844D06C9364356077C29F55BE3F3576F3F5C70AB07CCE2498A820000000049454E44AE426082','image/png',1233766939477754);
DROP TABLE IF EXISTS "moz_historyvisits";
CREATE TABLE moz_historyvisits (  id INTEGER PRIMARY KEY, from_visit INTEGER, place_id INTEGER, visit_date INTEGER, visit_type INTEGER, session INTEGER);
INSERT INTO "moz_historyvisits" VALUES(1,0,18,1233763646984374,1,1);
INSERT INTO "moz_historyvisits" VALUES(2,1,19,1233763646984375,1,1);
INSERT INTO "moz_historyvisits" VALUES(3,2,20,1233763656328125,1,1);
INSERT INTO "moz_historyvisits" VALUES(4,0,20,1233763859375000,2,2);
INSERT INTO "moz_historyvisits" VALUES(5,0,17,1233764038359375,3,3);
INSERT INTO "moz_historyvisits" VALUES(6,0,24,1233764127453125,3,4);
INSERT INTO "moz_historyvisits" VALUES(7,0,34,1233764167484375,2,5);
INSERT INTO "moz_historyvisits" VALUES(8,7,35,1233764172359375,1,5);
INSERT INTO "moz_historyvisits" VALUES(9,8,36,1233764179093750,1,5);
INSERT INTO "moz_historyvisits" VALUES(10,9,37,1233764185812500,1,5);
INSERT INTO "moz_historyvisits" VALUES(11,10,38,1233764192750000,1,5);
INSERT INTO "moz_historyvisits" VALUES(12,11,39,1233764192750000,1,5);
INSERT INTO "moz_historyvisits" VALUES(13,12,40,1233764198656250,1,5);
INSERT INTO "moz_historyvisits" VALUES(14,13,41,1233764198656250,1,5);
INSERT INTO "moz_historyvisits" VALUES(15,14,42,1233764205109375,1,5);
INSERT INTO "moz_historyvisits" VALUES(16,15,43,1233764205109375,1,5);
INSERT INTO "moz_historyvisits" VALUES(17,0,44,1233764566140625,2,6);
INSERT INTO "moz_historyvisits" VALUES(18,0,45,1233764569953125,2,7);
INSERT INTO "moz_historyvisits" VALUES(19,0,46,1233764573546875,2,8);
INSERT INTO "moz_historyvisits" VALUES(20,0,47,1233764579546875,2,9);
INSERT INTO "moz_historyvisits" VALUES(21,0,48,1233764579546875,2,10);
INSERT INTO "moz_historyvisits" VALUES(22,0,49,1233764585687500,2,11);
INSERT INTO "moz_historyvisits" VALUES(23,0,50,1233764585687500,2,12);
INSERT INTO "moz_historyvisits" VALUES(24,0,51,1233764588812500,2,13);
INSERT INTO "moz_historyvisits" VALUES(25,0,52,1233764592375000,2,14);
INSERT INTO "moz_historyvisits" VALUES(26,0,53,1233764596750000,2,15);
INSERT INTO "moz_historyvisits" VALUES(27,0,44,1233764787093750,2,16);
INSERT INTO "moz_historyvisits" VALUES(28,0,53,1233764793250000,2,17);
INSERT INTO "moz_historyvisits" VALUES(29,0,45,1233764802984375,2,18);
INSERT INTO "moz_historyvisits" VALUES(30,0,20,1233764824390625,2,19);
INSERT INTO "moz_historyvisits" VALUES(31,0,53,1233764831890625,2,20);
DROP TABLE IF EXISTS "moz_inputhistory";
CREATE TABLE moz_inputhistory (  place_id INTEGER NOT NULL, input LONGVARCHAR NOT NULL, use_count INTEGER, PRIMARY KEY (place_id, input));
INSERT INTO "moz_inputhistory" VALUES(44,'typed',0.7290000000000001);
INSERT INTO "moz_inputhistory" VALUES(45,'example typed',0.7290000000000001);
INSERT INTO "moz_inputhistory" VALUES(20,'typed',1.1594672100000003);
INSERT INTO "moz_inputhistory" VALUES(53,'typed',1.3851);
DROP TABLE IF EXISTS "moz_items_annos";
CREATE TABLE moz_items_annos (  id INTEGER PRIMARY KEY, item_id INTEGER NOT NULL, anno_attribute_id INTEGER, mime_type VARCHAR(32) DEFAULT NULL, content LONGVARCHAR, flags INTEGER DEFAULT 0, expiration INTEGER DEFAULT 0, type INTEGER DEFAULT 0, dateAdded INTEGER DEFAULT 0, lastModified INTEGER DEFAULT 0);
INSERT INTO "moz_items_annos" VALUES(1,6,1,NULL,'MostVisited',0,4,3,1233763009921875,0);
INSERT INTO "moz_items_annos" VALUES(2,7,1,NULL,'RecentlyBookmarked',0,4,3,1233763009921875,0);
INSERT INTO "moz_items_annos" VALUES(3,8,1,NULL,'RecentTags',0,4,3,1233763009921875,0);
INSERT INTO "moz_items_annos" VALUES(4,3,2,NULL,'Add bookmarks to this folder to see them displayed on the Bookmarks Toolbar',0,4,3,1233763010000000,0);
INSERT INTO "moz_items_annos" VALUES(5,12,3,NULL,'1',0,4,1,1233763010000000,0);
INSERT INTO "moz_items_annos" VALUES(6,12,4,NULL,'http://fxfeeds.mozilla.com/en-US/firefox/headlines.xml',0,4,3,1233763010000000,0);
INSERT INTO "moz_items_annos" VALUES(7,12,5,NULL,'http://fxfeeds.mozilla.com/en-US/firefox/livebookmarks/',0,4,3,1233763010000000,0);
INSERT INTO "moz_items_annos" VALUES(8,12,7,NULL,'1',0,4,1,1233763037187500,0);
INSERT INTO "moz_items_annos" VALUES(9,12,8,NULL,'1233766637218.0',0,4,2,1233763037203125,0);
INSERT INTO "moz_items_annos" VALUES(10,19,3,NULL,'1',0,4,1,1233763225140625,1233763225140625);
INSERT INTO "moz_items_annos" VALUES(11,20,9,NULL,'History',0,4,3,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(12,20,10,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(13,21,9,NULL,'Tags',0,4,3,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(14,21,10,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(15,22,9,NULL,'AllBookmarks',0,4,3,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(16,22,10,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(17,22,3,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(18,23,9,NULL,'BookmarksToolbar',0,4,3,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(19,23,10,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(20,24,9,NULL,'BookmarksMenu',0,4,3,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(21,24,10,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(22,25,9,NULL,'UnfiledBookmarks',0,4,3,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(23,25,10,NULL,'1',0,4,1,1233763225140625,0);
INSERT INTO "moz_items_annos" VALUES(24,19,11,NULL,'5',0,4,1,1233763225156250,0);
INSERT INTO "moz_items_annos" VALUES(25,19,10,NULL,'1',0,4,1,1233763225171875,0);
DROP TABLE IF EXISTS "moz_keywords";
CREATE TABLE moz_keywords (  id INTEGER PRIMARY KEY AUTOINCREMENT, keyword TEXT UNIQUE);
INSERT INTO "moz_keywords" VALUES(1,'key');
DROP TABLE IF EXISTS "moz_places";
CREATE TABLE moz_places (   id INTEGER PRIMARY KEY, url LONGVARCHAR, title LONGVARCHAR, rev_host LONGVARCHAR, visit_count INTEGER DEFAULT 0, hidden INTEGER DEFAULT 0 NOT NULL, typed INTEGER DEFAULT 0 NOT NULL, favicon_id INTEGER, frecency INTEGER DEFAULT -1 NOT NULL);
INSERT INTO "moz_places" VALUES(1,'place:queryType=0&sort=8&maxResults=10','queryType=0&sort=8&maxResults=10',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(2,'place:folder=BOOKMARKS_MENU&folder=UNFILED_BOOKMARKS&folder=TOOLBAR&queryType=1&sort=12&excludeItemIfParentHasAnnotation=livemark%2FfeedURI&maxResults=10&excludeQueries=1','folder=BOOKMARKS_MENU&folder=UNFILED_BOOKMARKS&folder=TOOLBAR&queryType=1&sort=12&excludeItemIfParentHasAnnotation=livemark%2FfeedURI&maxResults=10&excludeQueries=1',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(3,'place:type=6&sort=14&maxResults=10','type=6&sort=14&maxResults=10',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(4,'http://www.example.com/%s','キーワードを含むページ','moc.elpmaxe.www.',0,0,0,1,140);
INSERT INTO "moz_places" VALUES(11,'place:sort=4&','sort=4&',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(12,'place:type=6&sort=1','type=6&sort=1',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(13,'place:folder=TOOLBAR','folder=TOOLBAR',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(14,'place:folder=BOOKMARKS_MENU','folder=BOOKMARKS_MENU',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(15,'place:folder=UNFILED_BOOKMARKS','folder=UNFILED_BOOKMARKS',NULL,0,1,0,NULL,0);
INSERT INTO "moz_places" VALUES(17,'http://www.example.com/tagged','タグ付けされたブックマーク','moc.elpmaxe.www.',1,0,0,NULL,150);
INSERT INTO "moz_places" VALUES(18,'http://www.example.com/visited','訪問したことがあるだけのページ','moc.elpmaxe.www.',1,0,0,2,100);
INSERT INTO "moz_places" VALUES(19,'http://www.example.com/tagged_visited','タグ付けされた訪問済みページ','moc.elpmaxe.www.',1,0,0,2,175);
INSERT INTO "moz_places" VALUES(20,'http://www.example.com/really_typed1','ロケーションバーから実際に訪問したページ1','moc.elpmaxe.www.',3,0,1,2,4100);
INSERT INTO "moz_places" VALUES(22,'javascript:alert(''OK'')','alert(''OK'')',NULL,0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(24,'http://www.example.com/bookmark1','bookmark1','moc.elpmaxe.www.',1,0,0,NULL,150);
INSERT INTO "moz_places" VALUES(25,'http://www.example.com/bookmark2','bookmark2','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(26,'http://www.example.com/bookmark3','bookmark3','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(27,'http://www.example.com/bookmark4','bookmark4','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(28,'http://www.example.com/bookmark5','bookmark5','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(29,'http://www.example.com/bookmark7','bookmark7','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(30,'http://www.example.com/bookmark8','bookmark8','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(31,'http://www.example.com/bookmark6','bookmark6','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(32,'http://www.example.com/bookmark9','bookmark9','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(33,'http://www.example.com/bookmark10','bookmark10','moc.elpmaxe.www.',0,0,0,NULL,140);
INSERT INTO "moz_places" VALUES(34,'http://www.example.com/visited1','訪問済み1','moc.elpmaxe.www.',1,0,1,4,2075);
INSERT INTO "moz_places" VALUES(35,'http://www.example.com/visited2','訪問済み2','moc.elpmaxe.www.',1,0,0,4,175);
INSERT INTO "moz_places" VALUES(36,'http://www.example.com/visited3','訪問済み3','moc.elpmaxe.www.',1,0,0,4,175);
INSERT INTO "moz_places" VALUES(37,'http://www.example.com/visited4','訪問済み4','moc.elpmaxe.www.',1,0,0,6,175);
INSERT INTO "moz_places" VALUES(38,'http://www.example.com/visited5','訪問済み5','moc.elpmaxe.www.',1,0,0,5,175);
INSERT INTO "moz_places" VALUES(39,'http://www.example.com/visited6','訪問済み6','moc.elpmaxe.www.',1,0,0,5,100);
INSERT INTO "moz_places" VALUES(40,'http://www.example.com/visited7','訪問済み7','moc.elpmaxe.www.',1,0,0,7,100);
INSERT INTO "moz_places" VALUES(41,'http://www.example.com/visited8','訪問済み8','moc.elpmaxe.www.',1,0,0,7,100);
INSERT INTO "moz_places" VALUES(42,'http://www.example.com/visited9','訪問済み9','moc.elpmaxe.www.',1,0,0,7,100);
INSERT INTO "moz_places" VALUES(43,'http://www.example.com/visited10','訪問済み10','moc.elpmaxe.www.',1,0,0,7,100);
INSERT INTO "moz_places" VALUES(44,'http://www.example.com/really_typed2','ロケーションバーから実際に訪問したページ2','moc.elpmaxe.www.',2,0,1,NULL,4000);
INSERT INTO "moz_places" VALUES(45,'http://www.example.com/typed2','ロケーションバーから訪問したページ2','moc.elpmaxe.www.',2,0,1,NULL,4000);
INSERT INTO "moz_places" VALUES(46,'http://www.example.com/typed3','ロケーションバーから訪問したページ3','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(47,'http://www.example.com/typed4','ロケーションバーから訪問したページ4','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(48,'http://www.example.com/typed5','ロケーションバーから訪問したページ5','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(49,'http://www.example.com/typed6','ロケーションバーから訪問したページ6','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(50,'http://www.example.com/typed7','ロケーションバーから訪問したページ7','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(51,'http://www.example.com/typed8','ロケーションバーから訪問したページ8','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(52,'http://www.example.com/typed9','ロケーションバーから訪問したページ9','moc.elpmaxe.www.',1,0,1,NULL,2000);
INSERT INTO "moz_places" VALUES(53,'http://www.example.com/really_typed3','ロケーションバーから実際に訪問したページ3','moc.elpmaxe.www.',3,0,1,NULL,6000);
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE sqlite_sequence(name,seq);
INSERT INTO "sqlite_sequence" VALUES('moz_keywords',1);
