import { TwoLevelTranslations } from './types'

export const tr: TwoLevelTranslations = {
  companiesPage: {
    title: 'Şirketler',
    totalCountSuffix: 'toplam',
    createCompanyButton: 'Şirket Oluştur',
    noCompaniesFound: 'Şirket bulunamadı.',
    errorTitle: 'Şirketler Yüklenirken Hata Oluştu',
    errorDescription: 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.',
    noFiltersFound: 'Hiç filtre bulunamadı.',
    noFiltersFoundDescription:
      'Henüz bir filtre oluşturulmamış. Lütfen özelliklerinize göre filtreler oluşturun.',
    createFilterButton: 'Filtre Oluştur',
    openFiltersButton: 'Filtreleri Aç',
    filterDescription:
      'Şirketlerinizi gruplamak için kullanacağınız özel filtreleri ve etiketleri yönetin.',
  },
  companiesTable: {
    headerName: 'İsim',
    headerIndustry: 'Sektör',
    headerWebsite: 'Web Sitesi',
    headerCreatedAt: 'Oluşturulma Tarihi',
    actionsLabel: 'İşlemler',
    actionEdit: 'Düzenle',
    actionDelete: 'Sil',
    actionToggleMenu: 'Menüyü aç/kapat',
    noResultsMessage: 'Sonuç bulunamadı.',
  },
  companyForm: {
    nameLabel: 'Şirket İsmi',
    namePlaceholder: 'Örn: Acme A.Ş.',
    websiteLabel: 'Web Sitesi',
    websitePlaceholder: 'https://ornek.com',
    industryLabel: 'Sektör',
    industryPlaceholder: 'Örn: Teknoloji, Finans',
    descriptionLabel: 'Açıklama',
    descriptionPlaceholder: 'Şirket hakkında kısa bir açıklama...',
    submitButton: 'Kaydet',
    submittingButton: 'Kaydediliyor...',
    validation_nameRequired: 'Şirket ismi zorunludur.',
    validation_urlInvalid: 'Lütfen geçerli bir URL girin.',
  },
  createCompanyDialog: {
    title: 'Yeni Şirket Oluştur',
    description:
      'Yeni bir şirket kaydı oluşturmak için aşağıdaki formu doldurun.',
    triggerButton: 'Şirket Oluştur',
    successToast: 'Şirket başarıyla oluşturuldu!',
    errorToast: 'Şirket oluşturulurken bir hata oluştu.',
  },
  editCompanyDialog: {
    title: 'Şirket Bilgilerini Düzenle',
    description:
      'Şirket bilgilerini güncellemek için değişikliklerinizi yapın ve kaydedin.',
    triggerButton: 'Düzenle',
    successToast: 'Şirket başarıyla güncellendi!',
    errorToast: 'Şirket güncellenirken bir hata oluştu.',
  },
  deleteCompanyAlert: {
    title: 'Emin misiniz?',
    description:
      'Bu işlem geri alınamaz. Bu şirket kaydını kalıcı olarak silinecektir.',
    cancelButton: 'İptal',
    confirmButton: 'Evet, Sil',
    triggerButton: 'Sil',
    successToast: 'Şirket başarıyla silindi!',
    errorToast: 'Şirket silinirken bir hata oluştu.',
  },
  companyDetailPage: {
    backToCompanies: 'Tüm Şirketlere Geri Dön',
    companyDetailsTitle: 'Şirket Bilgileri',
    notesTitle: 'Notlar',
    addNoteButton: 'Not Ekle',
    loadingText: 'Şirket bilgileri yükleniyor...',
    notFoundTitle: 'Şirket Bulunamadı',
    notFoundDescription:
      'Aradığınız şirket mevcut değil veya silinmiş olabilir.',
  },
  addNoteDialog: {
    title: 'Yeni Not Ekle',
    description: 'Bu şirket için yeni bir not oluşturun.',
    typeLabel: 'Not Tipi',
    typePlaceholder: 'Bir tip seçin...',
    contentLabel: 'Not İçeriği',
    contentPlaceholder: 'Notunuzu buraya yazın...',
    successToast: 'Not başarıyla eklendi!',
    errorToast: 'Not eklenirken bir hata oluştu.',
  },
  noteCard: {
    authorLabel: 'Yazar',
    typeLabel: 'Not Tipi',
    lastUpdatedLabel: 'Son Güncelleme',
    editButton: 'Düzenle',
    deleteButton: 'Sil',
    deleteConfirmTitle: 'Notu Silmek İstediğinizden Emin misiniz?',
    deleteConfirmDescription: 'Bu işlem geri alınamaz.',
  },
  loginPage: {
    title: 'Giriş Yap',
    description: 'Devam etmek için hesabınıza giriş yapın.',
    emailLabel: 'E-posta',
    emailPlaceholder: 'ornek@mail.com',
    passwordLabel: 'Şifre',
    submitButton: 'Giriş Yap',
    submittingButton: 'Giriş Yapılıyor...',
    errorToastTitle: 'Giriş Başarısız',
    errorToastDescription: 'Lütfen e-posta ve şifrenizi kontrol edin.',
    successToastTitle: 'Başarılı!',
    successToastDescription: 'Uygulamaya yönlendiriliyorsunuz...',
  },
  sessionExpiredDialog: {
    title: 'Oturum Süresi Doldu',
    description:
      'Güvenliğiniz için oturumunuzun süresi doldu. Devam etmek için lütfen tekrar giriş yapın.',
    loginButton: 'Giriş Yap',
  },
  authNotifications: {
    sessionExpiredTitle: 'Oturum Süreniz Doldu',
    sessionExpiredDescription: 'Lütfen devam etmek için tekrar giriş yapın.',
    loggedOutTitle: 'Başarıyla Çıkış Yapıldı',
    loggedOutDescription: 'Tekrar görüşmek üzere!',
    loginRedirectTitle: 'Oturum süreniz doldu',
    loginRedirectDescription:
      'Güvenliğiniz için oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.',
  },
  pagination: {
    previous: 'Önceki',
    next: 'Sonraki',
    goToFirstPage: 'İlk Sayfaya Git',
    goToLastPage: 'Son Sayfaya Git',
    goToPage: 'Sayfa',
  },
  attributeStudio: {
    pageTitle: 'Filtre Yöneticisi',
    pageDescription:
      'Şirketlerinizi gruplamak için kullanacağınız özel filtreleri ve etiketleri yönetin.',
    typesColumnTitle: 'Özellik Tipleri',
    valuesColumnTitle: 'Değerler',
    addNewTypePlaceholder: 'Yeni tip adı (örn: Bölge)',
    addNewValuePlaceholder: 'Yeni değer adı (örn: Ege)',
    addTypeButton: 'Yeni Tip Ekle',
    addValueButton: 'Yeni Değer Ekle',
    noTypesFound: 'Henüz bir özellik tipi oluşturulmamış.',
    noValuesFound: 'Bu tip için henüz bir değer eklenmemiş.',
    selectTypePrompt: 'Değerlerini görmek için bir tip seçin.',
    deleteTypeConfirmTitle: 'Özellik Tipini Sil?',
    deleteTypeConfirmDescription:
      'Bu işlem geri alınamaz. Bu tipe bağlı tüm değerler de silinecektir.',
  },
  sidebar: {
    description:
      'Şirketlerinizi ve müşterilerinizi yönetmek için ana navigasyon menüsü',
  },

  exceptionMessages: {
    EMAIL_ALREADY_EXISTS_EXCEPTION: 'Bu e-posta adresi zaten kayıtlı.',
    USER_NOT_FOUND_EXCEPTION: 'Kullanıcı bulunamadı.',
    INVALID_CREDENTIALS_EXCEPTION: 'Girdiğiniz bilgiler geçersiz.',
    COMPANY_NOT_FOUND_EXCEPTION: 'Belirtilen şirket bulunamadı.',
    MISSING_TOKEN_CLAIM_EXCEPTION:
      'Kimlik doğrulama belirteci gerekli bilgileri içermiyor.',
    COMPANY_NOTE_NOT_FOUND_EXCEPTION: 'İstenen şirket notu bulunamadı.',
    ACCESS_DENIED_EXCEPTION: 'Bu işlemi gerçekleştirmek için yetkiniz yok.',
    ATTRIBUTE_TYPE_NOT_FOUND_EXCEPTION: 'Belirtilen özellik tipi bulunamadı.',
    ATTRIBUTE_TYPE_HAS_VALUES_EXCEPTION:
      'Bu özellik tipi ilişkili değerlere sahip olduğu için silinemez.',
    ATTRIBUTE_TYPE_ALREADY_EXISTS_EXCEPTION:
      'Bu isimde bir özellik tipi zaten mevcut.',
  },
  editNoteDialog: {
    title: 'Notu Düzenle',
    successToast: 'Not başarıyla güncellendi.',
    submitButton: 'Güncelle',
  },
  noteCardDialog: {
    title: 'Notu Silmek İstediğinizden Emin misiniz?',
    description: 'Bu işlem geri alınamaz.',
    cancelButton: 'İptal',
    confirmButton: 'Evet, Sil',
    successToast: 'Not başarıyla silindi.',
  },
  header: {
    openNavigation: 'Navigasyonu Aç',
    settings: 'Ayarlar',
    signOut: 'Çıkış Yap',
    signingOut: 'Çıkış Yapılıyor...',
  },
}

export type Translations = typeof tr
