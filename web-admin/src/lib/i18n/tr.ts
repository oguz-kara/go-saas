import { TwoLevelTranslations } from './types'

export const tr: TwoLevelTranslations = {
  companiesPage: {
    title: 'Şirketler',
    totalCountSuffix: 'toplam',
    createCompanyButton: 'Şirket Oluştur',
    noCompaniesFound: 'Şirket bulunamadı.',
    errorTitle: 'Şirketler Yüklenirken Hata Oluştu',
    errorDescription: 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.',
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
    successToast: 'Not başarıyla eklendi!',
    errorToast: 'Not eklenirken bir hata oluştu.',
  },
  noteCard: {
    authorLabel: 'Yazar',
    typeLabel: 'Tür',
    lastUpdatedLabel: 'Son Güncelleme',
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
}

export type Translations = typeof tr
