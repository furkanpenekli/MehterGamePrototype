# Düşman planı - Prototip 3

Prototip 3 (`mehter-seferi-v3.html`) için düşman planı. 2026-09-26 tarihinde yazıldı. Henüz
oyuna eklenmedi.

## Kullanıcının kararları

- **Ordular yerine canavarlar.** Canavarların saldırı tipleri tek tek özelleştirilebilir. Bazıları
  büyüktür ve farklı şekillerde saldırır.
- **Bölümler birbirini tekrar etmez.** Her bölümün kendine ait düşman tipleri vardır.
- **Üç büyük serdar vardır: Tepegöz, Şahmeran ve Ejderha.** Her biri bir konaktan hemen önce
  çıkar.
- **Konaktan sonra tema değişir.** İki konak arasındaki bölümün ufak düşmanları o bölümün
  serdarına ve temasına uyar: onun sürüsü, uşakları ya da yarattıklarıdır.

## Tasarım kuralları

Bunlar Claude'un önerisidir, kullanıcı henüz onaylamadı.

- **Her canavar belli bir çalgıyı ister.** Bot testinde yalnızca VUR'a basan bot da kazanıyordu.
  Canavarlar dört çalgının hepsini zorlamalı.
- **Her bölümde beş canavar vardır:** sürü, uçan, orta, arka hat ve büyük. Yuvalar her bölümde
  aynıdır, davranışlar farklıdır.
- **Her bölümde dört çalgının her biri en az bir canavara karşı işe yarar.** Dört askerin her
  birinin de güçlü olduğu en az bir canavar vardır, böylece sancak seçimi her bölümde önemli
  kalır.
- **Zorluk bölüm bölüm artar:**
  - 1. bölüm: basit şekiller (tek hedef, daire, çizgi).
  - 2. bölüm: durum etkileri eklenir (zehir, yakalama).
  - 3. bölüm: alan hasarı ile savurma birleşir.
- Askerler (Azap, Yeniçeri, Kemankeş, Deli) aynı kalır. Kemankeş'in güçlü olduğu düşmanlar
  uçan canavarlardır.

## Saldırı şekilleri

Canavarlar bu parçalardan kurulur. Her saldırı yere kırmızı bir uyarıyla önceden gösterilir.

| Şekil | Uyarı | Karşılığı |
|---|---|---|
| Tek hedef | Hedefin etrafında halka kapanır (bugünkü gibi) | DİREN ya da önce öldür |
| Daire alan | Yerde bir daire dolar | DİREN (aura içindeyse) ya da dışarı yürü |
| Koni süpürme | Önünde bir yelpaze | DİREN (Perfect sersemletir) |
| Çizgi hücum | Bir şerit | Azap karşılar ya da yoldan çekil |
| Yakala-sürükle | Asker kırmızı yanar | TOPLAN askeri kurtarır |
| Büyü yükleme | Mor halka dolar | ATIL yüklemeyi keser |
| Durum etkisi (zehir) | Asker yeşil yanar | TOPLAN iyileştirir |

## 1. bölüm · Tepegöz Yurdu

Karlı yayla, mağaralar, ağıllar. Tepegöz'ün sürüsü ve ona hizmet edenler.

| Canavar | Yuva | Saldırı | Çalgı | Güçlü asker |
|---|---|---|---|---|
| **Kara Koç** | küçük sürü | Koşup toslar ve vurduğu askeri auradan dışarı savurur. | VUR, TOPLAN | Azap |
| **Yarasa** | küçük uçan | Mağaradan sürüyle çıkar ve dalar. Yakın dövüşçüler onu yalnızca dalışta vurabilir. | DİREN | Kemankeş |
| **Karakoncolos** | orta | Sıçrayıp auranın içine düşer, indiği yerde daire alan hasarı verir. | DİREN | - |
| **Sapancı** | orta, arka hat | Tepegöz'ün uşağı. Uzaktan taş atar (daire). | ATIL | Deli |
| **Kaya İyesi** | büyük | Önden gelen hasarın yalnızca %25'ini alır. Yumruğu yere iner (daire). Perfect DİREN ile bloklanırsa çatlar ve 2 sn tam hasar alır. | DİREN, sonra VUR | Yeniçeri |

**Serdar - Tepegöz** (Dede Korkut'tan):

- Uzaktan kaya fırlatır (daire alan).
- Yere tepinince dışa açılan bir şok halkası çıkar.
- Kara Koç sürüsünü salar.
- Yalnızca gözü açıkken tam hasar alır.

## 2. bölüm · Şahmeran Diyarı

Bataklık ve yeraltı. Yeni olan durum etkileri: zehir ve yakalama.

| Canavar | Yuva | Saldırı | Çalgı | Güçlü asker |
|---|---|---|---|---|
| **Yılan** | küçük sürü | Isırığı zehirler ve can yavaşça akar. | VUR, TOPLAN (iyileşme) | - |
| **Kanatlı Yılan** | küçük uçan | Zehir tükürerek çizgi halinde geçer. | DİREN | Kemankeş |
| **Dev Akrep** | orta, zırhlı | Kıskaçla bir askeri yakalayıp auradan dışarı sürükler. | TOPLAN, ATIL | Yeniçeri |
| **Yılan Kâhini** | orta, arka hat | Büyü yükler. Büyü biterse yere yeni bir yılan yuvası açar. | ATIL | Deli |
| **Evren** | büyük | Toprağa dalar, ordunun altından çıkar (yerde çatlayan daire), sonra düz bir çizgide sürünür. | Lider kaçar + TOPLAN | Azap |

**Serdar - Şahmeran:**

- Yılan çağırır. Çağırmayı ATIL keser.
- Önüne zehir konisi saçar.
- Aşamalar arasında toprağa gömülür.

## 3. bölüm · Ejderha Dağı

Yanık diyar, volkan. Önceki iki bölümün şekilleri bir arada gelir ve alan hasarı savurmayla
birleşir.

| Canavar | Yuva | Saldırı | Çalgı | Güçlü asker |
|---|---|---|---|---|
| **Kül Hortlağı** | küçük sürü | Ejderhanın yaktığı ölüler. Ölünce patlar ve çevresine küçük daire hasarı verir. | VUR (uzaktan olursa iyi) | - |
| **Kor Kuşu** | küçük uçan | Geçtiği çizgiye alev bırakır. | DİREN | Kemankeş |
| **Ejder Yavrusu** | orta | Kısa bir alev konisi saçar. | DİREN (Perfect sersemletir) | Azap |
| **Od Cadısı** | orta, arka hat | Uzun yükleme yapar, sonra büyük bir alana ateş yağdırır. | ATIL | Deli |
| **Od Devi** | büyük | Önündeki koniyi süpürür, içindeki askerleri savurur ve auradan çıkarır. | DİREN, sonra TOPLAN | Yeniçeri |

**Serdar - Ejderha:**

- Alev konisi saçar.
- Havalanıp çizgi halinde dalar.
- Kükreyince bütün ordu auradan savrulur ve TOPLAN gerekir.

## Kontrol

Her bölümde her çalgının ve her askerin karşılığı var mı:

| Bölüm | VUR | DİREN | ATIL | TOPLAN | Azap | Yeniçeri | Kemankeş | Deli |
|---|---|---|---|---|---|---|---|---|
| Tepegöz Yurdu | Kara Koç, Kaya İyesi | Yarasa, Karakoncolos, Kaya İyesi | Sapancı | Kara Koç | Kara Koç | Kaya İyesi | Yarasa | Sapancı |
| Şahmeran Diyarı | Yılan | Kanatlı Yılan | Yılan Kâhini, Dev Akrep | Yılan, Dev Akrep, Evren | Evren | Dev Akrep | Kanatlı Yılan | Yılan Kâhini |
| Ejderha Dağı | Kül Hortlağı | Kor Kuşu, Ejder Yavrusu, Od Devi | Od Cadısı | Od Devi | Ejder Yavrusu | Od Devi | Kor Kuşu | Od Cadısı |

## Açık sorular

- **Bölüm sırası:** Tepegöz → Şahmeran → Ejderha mı?
- **Karakol, hisar ve kale kapısı temaya uysun mu?** Öneri:
  - 1. bölüm: ağıl ve mağara
  - 2. bölüm: yılan yuvası ve yeraltı tapınağı
  - 3. bölüm: kor ocağı ve ejder yuvası
- **Zayıf eşleşmeler:** Asker hangi canavardan çift hasar alır? Canavar listesi onaylanınca
  `UnitStats.xlsx`'e yazılır.
- **Canlar, hasarlar ve hızlar:** Sayılar belirlenmedi.
- **Dalgalara dağıtım:** Canavarların her bölümün beş dalgasına dağıtılması bir sonraki adım.
  Her dalga bir öncekinden farklı olmalı.
