# ADVANCED ATTRIBUTE ROADMAP

# Kapsamlı Yol Haritası: Dinamik ve Polimorfik Özellik Motoru

Bu yol haritası, projenizin sadece bugünkü ihtiyaçlarını değil, gelecekte bir **Emlak**, **B2B** veya **Pazar Yeri** uygulamasına dönüşebilecek esnekliğini de göz önünde bulundurarak hazırlandı.

## Faz 0: Hazırlık ve Altyapı

Bu faz, kodlamaya başlamadan önceki temel hazırlıkları içerir.

- **0.1. Veritabanı Kararı:** `PostgreSQL` kullanacağımızı teyit ediyoruz. Bu, FTS (Full-Text Search), JSONB ve gelecekteki ölçeklenebilirlik ihtiyaçlarımız için en doğru seçimdir.
- **0.2. `enum`'ları Tanımlama:** Projenin temel taşları olan `enum`'ları merkezi bir yerde (örn: `src/common/enums/` veya doğrudan `schema.prisma` içinde) tanımla.
    - `AttributableType`: Özelliklerin atanabileceği varlıkları listeler (`COMPANY`, `PRODUCT` vb.).
    - `AttributeTypeKind`: Bir özelliğin frontend'deki davranışını tanımlar (`TEXT`, `SELECT`, `MULTI_SELECT`, `HIERARCHICAL`, `DATE`, `NUMBER`, `BOOLEAN`).

## Faz 1: Veritabanı Mimarisi - Sağlam Temel (Prisma)

Bu fazın tek amacı, veritabanı şemasını eksiksiz ve doğru bir şekilde kurmaktır.

- **1.1. `schema.prisma`'yı Yapılandırma:**
    - **`AttributeGroup` Modeli:** Tenant'ların form sekmelerini/filtre gruplarını ("Adres Bilgileri", "Satış Detayları") oluşturacağı model. Alanlar: `id`, `name`, `channelToken` (ilişki), `isSystemDefined` (silinemez sistem grupları için).
    - **`AttributeType` Modeli:** Tenant'ların özellik tiplerini ("Sektör", "İlçe") oluşturacağı model. Alanlar: `id`, `name`, `kind` (`AttributeTypeKind` enum'ı), `config` (`Json?` - validasyon kuralları ve ayarlar için), `isSystemDefined`, `channelToken`, `groupId` (`AttributeGroup`'a ilişki).
    - **`AttributeValue` Modeli:** Değerleri ("Yazılım", "Bornova") ve hiyerarşiyi tutacak model. Alanlar: `id`, `value`, `meta` (`Json?` - renk kodu, ikon gibi ek veriler için), `attributeTypeId`, `channelToken`, ve `parentId` (kendi kendine hiyerarşik ilişki için).
    - **`AttributeTypeToEntityType` Modeli:** Hangi `AttributeType`'ın hangi `AttributableType` (`COMPANY` vb.) üzerinde kullanılabileceğini belirleyen ilişki tablosu. Alanlar: `attributeTypeId`, `entityType`. `@@id([attributeTypeId, entityType])` ile birincil anahtar oluştur.
    - **`AttributeAssignment` Modeli:** Hangi `AttributeValue`'nun, hangi spesifik varlık kaydına atandığını tutan polimorfik ilişki tablosu. Alanlar: `attributeValueId`, `attributableId` (String), `attributableType` (`AttributableType` enum'ı), `channelToken`, `assignedById` (opsiyonel).
- **1.2. Varlık Modellerini Güncelle:**
    - `Company`, `Product` gibi varlık modellerindeki eski, direkt `attributes` ilişkilerini kaldır.
    - Bunların yerine, her varlık modeline `attributeAssignments AttributeAssignment[]` ilişkisini ekle.
- **1.3. Migration'ı Oluştur ve Çalıştır:**
    - `npx prisma migrate dev --name init_advanced_attribute_system` komutu ile veritabanını bu yeni ve nihai şemaya göre oluştur.

## Faz 2: Backend Çekirdeği - Yönetim API'leri (NestJS)

Bu fazda, tenant'ların kendi özel sistemlerini yönetebilmeleri için gerekli olan tüm CRUD API'lerini oluşturacağız.

- **2.1. `AttributeGroup` Yönetimi:**
    - `AttributeGroupService` ve `AttributeGroupResolver` oluştur.
    - Tenant'ların kendi filtre gruplarını (`name`) oluşturması, listelemesi, güncellemesi ve silmesi için gerekli tüm metodları ve GraphQL mutation/query'lerini implemente et. Tüm işlemler `channelToken` ile scopelanmalı.
- **2.2. `AttributeType` Yönetimi:**
    - `AttributeTypeService` ve `AttributeTypeResolver` oluştur.
    - Tenant'ların kendi özellik tiplerini (`name`, `kind`, `config` vb.) oluşturması, listelemesi, güncellemesi ve silmesi için metodları implemente et.
    - `create` ve `update` işlemlerinde, bu tipin hangi `AttributeGroup`'a ve hangi `EntityType`'lara ait olacağının da (`AttributeTypeToEntityType` üzerinden) yönetilmesini sağla.
- **2.3. `AttributeValue` Yönetimi:**
    - `AttributeValueService` ve `AttributeValueResolver` oluştur.
    - Tenant'ların, bir `AttributeType` altına yeni değerler ("Yazılım", "İzmir" vb.) eklemesi, listelemesi (hiyerarşik olarak ve arama yaparak), güncellemesi ve silmesi için metodları implemente et. Tüm işlemler `channelToken` ve `attributeTypeId` ile scopelanmalı.

## Faz 3: Backend Entegrasyonu - Şirketlerle İlişkilendirme (NestJS)

Mevcut `Company` modülünü, bu yeni dinamik sistemle konuşacak şekilde refactor edeceğiz.

- **3.1. `CompanyService`'i Refactor Et:**
    - **`createCompany` / `updateCompany`:** Bu metodların imzasını, bir `attributes: [{ valueId: string }]` gibi bir dizi alacak şekilde güncelle. Bu dizi, `AttributeAssignment` tablosuna yeni kayıtlar oluşturmak/güncellemek için kullanılacak.
    - **`getCompanies`:** Bu metodun `filters` argümanını, `filters: [{ attributeTypeId: string, valueIds: [string] }]` gibi dinamik bir yapıya dönüştür. Prisma sorgusunu, bu dinamik filtrelere göre `AND` ve `some` koşullarıyla `attributeAssignments` tablosu üzerinden `JOIN` yapacak şekilde yeniden yaz.
    - **`getCompanyById`:** Bu metodun, `include` seçeneği ile bir şirketin tüm `attributeAssignments` verisini ve ilişkili `attributeValue` ve `attributeType` detaylarını getirmesini sağla.

## Faz 4: Frontend - "Özellik Stüdyosu" (Admin Arayüzü)

Tenant adminlerinin bu güçlü sistemi yöneteceği arayüzü inşa ediyoruz.

- **4.1. Sayfa ve Ana Yapıyı Oluştur:** `/settings/attributes` adresinde, Faz 1'deki Master-Detail layout'unu temel alan `AttributeStudio` client komponentini oluştur.
- **4.2. Sol Sütun (Tipler):** `AttributeTypeList` komponentini implemente et.
    - Tenant'a ait `AttributeGroup` ve `AttributeType`'ları hiyerarşik bir ağaç (tree) veya akordiyon yapısında listelesin.
    - "Yeni Grup Ekle" ve "Yeni Tip Ekle" fonksiyonlarını "inline" (yerinde) olarak sunsun.
    - Bir tipe tıklandığında, o tipin hangi varlıklarda (`COMPANY`, `PRODUCT` vb.) kullanılacağını gösteren checkbox'ların olduğu bir düzenleme arayüzü sunsun.
- **4.3. Sağ Sütun (Değerler):** `AttributeValueList` komponentini implemente et.
    - Soldan bir `AttributeType` seçildiğinde, sağda o tipe ait değerleri göstersin.
    - "Adres" gibi hiyerarşik tipler için, değerleri bir ağaç yapısında göstersin ve düzenlemeye olanak tanısın.
    - Diğer tipler için, `TagInput` benzeri bir arayüzle değerlerin eklenip silinmesini sağlasın.

## Faz 5: Frontend - Özellikleri Kullanıcı Arayüzüne Entegre Etme

Son fazda, oluşturduğumuz bu sistemi son kullanıcının hizmetine sunuyoruz.

- **5.1. Dinamik Şirket Formu:**
    - `CompanyForm` komponentini tamamen dinamik hale getir. Form, backend'den o tenant için tanımlanmış `AttributeGroup`'ları çekip bunları `Tabs` (sekmeler) olarak render etsin.
    - Her sekme içinde, o gruba ait `AttributeType`'ları çekip, `kind` ve `dataType`'ına göre doğru input komponentini (`Select`, `MultiSelect`, `DatePicker`, `Checkbox`, `Input type=number` vb.) render etsin.
    - Adres gibi hiyerarşik özellikler için "Cascading Selects" (kademeli seçim kutuları) UX'ini implemente et.
- **5.2. Dinamik Filtre Paneli:**
    - `CompanyListPage`'deki `CompanyFilterSidebar`'ı implemente et.
    - Bu sidebar, backend'den tenant'a ait `AttributeType`'ları ve onların `AttributeValue`'larını çeksin.
    - Her bir `AttributeType` için bir filtre bölümü (örn: akordiyon) oluştursun ve içindeki değerleri checkbox olarak listelesin.
    - Kullanıcı bir checkbox'ı işaretlediğinde, sayfa URL'i güncellensin ve şirket listesi Server Component tarafından yeniden çekilerek filtrelensin.

## Faz 6: Sonrası - Test ve Optimizasyon

- **6.1. Testleri Yazma:** Ertelediğimiz tüm unit ve integration testlerini bu yeni, sağlam mimari için yaz.
- **6.2. Elasticsearch Geçişi:** Arama performansı kritik hale geldiğinde, bu yol haritasının en başında konuştuğumuz `ISearchProvider` strateji deseni sayesinde, `PrismaSearchProvider`'ı `ElasticsearchSearchProvider` ile değiştirmek son derece kolay olacaktır. `CompanyService`, `AttributeService` gibi servisleriniz bu geçişten etkilenmeyecektir.