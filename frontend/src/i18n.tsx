import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'en' | 'ar'

const STORAGE_KEY = 'smarthelp.lang'

const en = {
  'sidebar.workspace': 'Workspace',
  'nav.assistant': 'Assistant',
  'nav.tickets': 'Tickets',
  'nav.knowledgeBase': 'Knowledge Base',
  'nav.users': 'Users',
  'sidebar.logout': 'Log out',
  'role.User': 'User',
  'role.Technician': 'Technician',
  'role.Admin': 'Admin',

  'app.subtitle': 'Offline IT Help Desk assistant',
  'app.switchToArabic': 'العربية',
  'app.switchToEnglish': 'English',

  'auth.heroTitle': 'Offline IT support that actually understands the problem.',
  'auth.feature1Title': 'Understands Arabic and English',
  'auth.feature1Desc': 'Describe a problem in either language, or mix both freely.',
  'auth.feature2Title': 'Grounded in approved knowledge',
  'auth.feature2Desc': 'Every suggestion traces back to a reviewed knowledge base article.',
  'auth.feature3Title': 'Human-in-the-loop',
  'auth.feature3Desc': 'Low-confidence cases escalate to a technician instead of guessing.',
  'auth.footer': 'A student sprint project — runs entirely on your local network.',

  'common.email': 'Email',
  'common.password': 'Password',
  'common.fullName': 'Full name',
  'common.showPassword': 'Show password',
  'common.hidePassword': 'Hide password',
  'common.loading': 'Loading…',

  'login.welcomeBack': 'Welcome back',
  'login.subtitle': 'Sign in to continue to SmartHelp AI.',
  'login.signIn': 'Sign in',
  'login.signingIn': 'Signing in…',
  'login.orDemo': 'or try a demo account',
  'login.noAccount': 'No account?',
  'login.register': 'Register',
  'login.failed': 'Login failed',

  'register.title': 'Create an account',
  'register.subtitle': 'New accounts are always plain "User" accounts.',
  'register.submit': 'Register',
  'register.submitting': 'Creating account…',
  'register.haveAccount': 'Already have an account?',
  'register.signIn': 'Sign in',
  'register.failed': 'Registration failed',

  'assistant.title': 'Assistant',
  'assistant.subtitle':
    'Describe a problem to get a suggested solution from the approved knowledge base.',
  'assistant.ticketCreated': 'Ticket {code} created',
  'assistant.status': 'Status: {status}',
  'assistant.aiUnavailable': 'Could not reach the AI service',
  'assistant.ticketFailed': 'Failed to create ticket',

  'problemForm.title': 'Describe your problem',
  'problemForm.label': 'Arabic or English — mix freely',
  'problemForm.submit': 'Ask SmartHelp AI',
  'problemForm.analyzing': 'Analyzing…',

  'analysis.title': 'AI analysis',
  'analysis.predictedCategory': 'Predicted category:',
  'analysis.confidence': '{pct}% confidence',
  'analysis.needsReview': 'needs review',
  'analysis.lowConfidenceTitle': 'Low confidence match',
  'analysis.lowConfidenceDesc':
    'The closest approved article may not apply — review the suggestions below before trusting them, or escalate directly.',
  'analysis.noArticles': 'No knowledge base articles found.',
  'analysis.closestArticles': 'Closest approved articles',
  'analysis.match': '{pct}% match',
  'analysis.escalateIf': 'Escalate if: {note}',
  'analysis.escalateButton': 'None of these worked — escalate to Help Desk',
  'analysis.creatingTicket': 'Creating ticket…',

  'kb.title': 'Knowledge Base',
  'kb.subtitle': 'Approved articles the assistant retrieves solutions from.',
  'kb.searchPlaceholder': 'Search by problem, category, or KB id…',
  'kb.noMatches': 'No matching articles.',

  'tickets.queueTitle': 'Ticket queue',
  'tickets.queueDesc': 'Every incident reported through the assistant, across all users.',
  'tickets.assignedTitle': 'Assigned to you',
  'tickets.assignedDesc': 'Tickets an admin has routed to you to resolve.',
  'tickets.myTitle': 'My tickets',
  'tickets.myDesc': 'Incidents you have reported through the assistant.',
  'tickets.allTable': 'All tickets',
  'tickets.yourTable': 'Your tickets',
  'tickets.loadFailed': 'Could not load tickets',

  'ticketsTable.recent': 'Recent tickets',
  'ticketsTable.code': 'Code',
  'ticketsTable.category': 'Category',
  'ticketsTable.status': 'Status',
  'ticketsTable.problem': 'Problem',
  'ticketsTable.noTickets': 'No tickets yet.',

  'status.New': 'New',
  'status.InProgress': 'In progress',
  'status.Escalated': 'Escalated',
  'status.Resolved': 'Resolved',
  'status.Closed': 'Closed',

  'category.Software': 'Software',
  'category.Hardware': 'Hardware',
  'category.Network': 'Network',
  'category.Account': 'Account',

  'priority.Low': 'Low',
  'priority.Medium': 'Medium',
  'priority.High': 'High',
  'priority.Critical': 'Critical',

  'ticketDetail.problem': 'Problem',
  'ticketDetail.updateStatus': 'Update status',
  'ticketDetail.update': 'Update',
  'ticketDetail.notePlaceholder': 'Optional note about this change',
  'ticketDetail.reassign': 'Reassign',
  'ticketDetail.chooseTechnician': 'Choose a technician',
  'ticketDetail.history': 'History',
  'ticketDetail.noHistory': 'No status changes yet.',
  'ticketDetail.comments': 'Comments',
  'ticketDetail.noComments': 'No comments yet.',
  'ticketDetail.internal': 'internal',
  'ticketDetail.addComment': 'Add a comment',
  'ticketDetail.internalNote': 'Internal note (not shown to the reporter)',
  'ticketDetail.postComment': 'Post comment',
  'ticketDetail.deleteTicket': 'Delete ticket',
  'ticketDetail.deleteConfirm': 'Delete this ticket permanently? This cannot be undone.',
  'ticketDetail.deleted': 'Ticket deleted',
  'ticketDetail.deleteFailed': 'Failed to delete ticket',
  'ticketDetail.reassigned': 'Ticket reassigned',
  'ticketDetail.reassignFailed': 'Failed to reassign ticket',
  'ticketDetail.statusUpdated': 'Status updated to {status}',
  'ticketDetail.statusFailed': 'Failed to update status',
  'ticketDetail.commentFailed': 'Failed to add comment',
  'ticketDetail.loadFailed': 'Could not load ticket',

  'users.title': 'Users',
  'users.subtitle':
    'Manage accounts and roles. Self-registration always creates a plain "User" account — Technician and Admin accounts are created here.',
  'users.newUser': 'New user',
  'users.createTitle': 'Create user',
  'users.role': 'Role',
  'users.create': 'Create',
  'users.creating': 'Creating…',
  'users.allUsers': 'All users',
  'users.name': 'Name',
  'users.department': 'Department',
  'users.status': 'Status',
  'users.active': 'Active',
  'users.disabled': 'Disabled',
  'users.created': 'User created',
  'users.createFailed': 'Failed to create user',
} as const

const ar: Record<keyof typeof en, string> = {
  'sidebar.workspace': 'مساحة العمل',
  'nav.assistant': 'المساعد',
  'nav.tickets': 'التذاكر',
  'nav.knowledgeBase': 'قاعدة المعرفة',
  'nav.users': 'المستخدمون',
  'sidebar.logout': 'تسجيل الخروج',
  'role.User': 'مستخدم',
  'role.Technician': 'فني',
  'role.Admin': 'مسؤول',

  'app.subtitle': 'مساعد الدعم الفني دون اتصال بالإنترنت',
  'app.switchToArabic': 'العربية',
  'app.switchToEnglish': 'English',

  'auth.heroTitle': 'دعم فني دون اتصال بالإنترنت يفهم مشكلتك فعليًا.',
  'auth.feature1Title': 'يفهم العربية والإنجليزية',
  'auth.feature1Desc': 'صف مشكلتك بأي من اللغتين، أو امزج بينهما بحرية.',
  'auth.feature2Title': 'مبني على معرفة معتمدة',
  'auth.feature2Desc': 'كل اقتراح يستند إلى مقالة معتمدة في قاعدة المعرفة.',
  'auth.feature3Title': 'إشراف بشري',
  'auth.feature3Desc': 'الحالات ذات الثقة المنخفضة تُصعَّد إلى فني بدلاً من التخمين.',
  'auth.footer': 'مشروع طلابي (سبرنت) — يعمل بالكامل على شبكتك المحلية.',

  'common.email': 'البريد الإلكتروني',
  'common.password': 'كلمة المرور',
  'common.fullName': 'الاسم الكامل',
  'common.showPassword': 'إظهار كلمة المرور',
  'common.hidePassword': 'إخفاء كلمة المرور',
  'common.loading': 'جارٍ التحميل…',

  'login.welcomeBack': 'مرحبًا بعودتك',
  'login.subtitle': 'سجّل الدخول للمتابعة إلى SmartHelp AI.',
  'login.signIn': 'تسجيل الدخول',
  'login.signingIn': 'جارٍ تسجيل الدخول…',
  'login.orDemo': 'أو جرّب حسابًا تجريبيًا',
  'login.noAccount': 'ليس لديك حساب؟',
  'login.register': 'إنشاء حساب',
  'login.failed': 'فشل تسجيل الدخول',

  'register.title': 'إنشاء حساب',
  'register.subtitle': 'الحسابات الجديدة تكون دائمًا حسابات "مستخدم" عادية.',
  'register.submit': 'إنشاء الحساب',
  'register.submitting': 'جارٍ إنشاء الحساب…',
  'register.haveAccount': 'لديك حساب بالفعل؟',
  'register.signIn': 'تسجيل الدخول',
  'register.failed': 'فشل إنشاء الحساب',

  'assistant.title': 'المساعد',
  'assistant.subtitle': 'صف مشكلتك للحصول على حل مقترح من قاعدة المعرفة المعتمدة.',
  'assistant.ticketCreated': 'تم إنشاء التذكرة {code}',
  'assistant.status': 'الحالة: {status}',
  'assistant.aiUnavailable': 'تعذّر الوصول إلى خدمة الذكاء الاصطناعي',
  'assistant.ticketFailed': 'فشل إنشاء التذكرة',

  'problemForm.title': 'صف مشكلتك',
  'problemForm.label': 'العربية أو الإنجليزية — امزج بحرية',
  'problemForm.submit': 'اسأل SmartHelp AI',
  'problemForm.analyzing': 'جارٍ التحليل…',

  'analysis.title': 'تحليل الذكاء الاصطناعي',
  'analysis.predictedCategory': 'الفئة المتوقعة:',
  'analysis.confidence': '{pct}% ثقة',
  'analysis.needsReview': 'يحتاج مراجعة',
  'analysis.lowConfidenceTitle': 'تطابق منخفض الثقة',
  'analysis.lowConfidenceDesc':
    'قد لا تنطبق أقرب مقالة معتمدة — راجع الاقتراحات أدناه قبل الوثوق بها، أو صعّد المشكلة مباشرة.',
  'analysis.noArticles': 'لم يتم العثور على مقالات في قاعدة المعرفة.',
  'analysis.closestArticles': 'أقرب المقالات المعتمدة',
  'analysis.match': '{pct}% تطابق',
  'analysis.escalateIf': 'صعّد إذا: {note}',
  'analysis.escalateButton': 'لم تنجح أي من هذه الحلول — صعّد إلى الدعم الفني',
  'analysis.creatingTicket': 'جارٍ إنشاء التذكرة…',

  'kb.title': 'قاعدة المعرفة',
  'kb.subtitle': 'المقالات المعتمدة التي يسترجع منها المساعد الحلول.',
  'kb.searchPlaceholder': 'ابحث بالمشكلة أو الفئة أو رقم المقالة…',
  'kb.noMatches': 'لا توجد مقالات مطابقة.',

  'tickets.queueTitle': 'قائمة التذاكر',
  'tickets.queueDesc': 'كل حادثة أُبلغ عنها عبر المساعد، لجميع المستخدمين.',
  'tickets.assignedTitle': 'المسندة إليك',
  'tickets.assignedDesc': 'التذاكر التي أسندها المسؤول إليك لحلها.',
  'tickets.myTitle': 'تذاكري',
  'tickets.myDesc': 'الحوادث التي أبلغت عنها عبر المساعد.',
  'tickets.allTable': 'كل التذاكر',
  'tickets.yourTable': 'تذاكرك',
  'tickets.loadFailed': 'تعذّر تحميل التذاكر',

  'ticketsTable.recent': 'أحدث التذاكر',
  'ticketsTable.code': 'الرمز',
  'ticketsTable.category': 'الفئة',
  'ticketsTable.status': 'الحالة',
  'ticketsTable.problem': 'المشكلة',
  'ticketsTable.noTickets': 'لا توجد تذاكر بعد.',

  'status.New': 'جديدة',
  'status.InProgress': 'قيد التنفيذ',
  'status.Escalated': 'مُصعّدة',
  'status.Resolved': 'محلولة',
  'status.Closed': 'مغلقة',

  'category.Software': 'برمجيات',
  'category.Hardware': 'عتاد',
  'category.Network': 'شبكة',
  'category.Account': 'حساب',

  'priority.Low': 'منخفضة',
  'priority.Medium': 'متوسطة',
  'priority.High': 'عالية',
  'priority.Critical': 'حرجة',

  'ticketDetail.problem': 'المشكلة',
  'ticketDetail.updateStatus': 'تحديث الحالة',
  'ticketDetail.update': 'تحديث',
  'ticketDetail.notePlaceholder': 'ملاحظة اختيارية حول هذا التغيير',
  'ticketDetail.reassign': 'إعادة الإسناد',
  'ticketDetail.chooseTechnician': 'اختر فنيًا',
  'ticketDetail.history': 'السجل',
  'ticketDetail.noHistory': 'لا توجد تغييرات في الحالة بعد.',
  'ticketDetail.comments': 'التعليقات',
  'ticketDetail.noComments': 'لا توجد تعليقات بعد.',
  'ticketDetail.internal': 'داخلي',
  'ticketDetail.addComment': 'أضف تعليقًا',
  'ticketDetail.internalNote': 'ملاحظة داخلية (لا تظهر للمُبلّغ)',
  'ticketDetail.postComment': 'نشر التعليق',
  'ticketDetail.deleteTicket': 'حذف التذكرة',
  'ticketDetail.deleteConfirm': 'هل تريد حذف هذه التذكرة نهائيًا؟ لا يمكن التراجع عن ذلك.',
  'ticketDetail.deleted': 'تم حذف التذكرة',
  'ticketDetail.deleteFailed': 'فشل حذف التذكرة',
  'ticketDetail.reassigned': 'تمت إعادة إسناد التذكرة',
  'ticketDetail.reassignFailed': 'فشل في إعادة إسناد التذكرة',
  'ticketDetail.statusUpdated': 'تم تحديث الحالة إلى {status}',
  'ticketDetail.statusFailed': 'فشل تحديث الحالة',
  'ticketDetail.commentFailed': 'فشل إضافة التعليق',
  'ticketDetail.loadFailed': 'تعذّر تحميل التذكرة',

  'users.title': 'المستخدمون',
  'users.subtitle':
    'إدارة الحسابات والأدوار. التسجيل الذاتي ينشئ دائمًا حساب "مستخدم" عادي — تُنشأ حسابات الفني والمسؤول من هنا.',
  'users.newUser': 'مستخدم جديد',
  'users.createTitle': 'إنشاء مستخدم',
  'users.role': 'الدور',
  'users.create': 'إنشاء',
  'users.creating': 'جارٍ الإنشاء…',
  'users.allUsers': 'كل المستخدمين',
  'users.name': 'الاسم',
  'users.department': 'القسم',
  'users.status': 'الحالة',
  'users.active': 'نشط',
  'users.disabled': 'معطّل',
  'users.created': 'تم إنشاء المستخدم',
  'users.createFailed': 'فشل إنشاء المستخدم',
}

const dictionaries = { en, ar } as const

export type TranslationKey = keyof typeof en

const STRING_INTERPOLATION_PATTERN = /\{(\w+)\}/g

interface LanguageContextValue {
  language: Language
  toggleLanguage: () => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

function readStoredLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  function toggleLanguage() {
    setLanguage((current) => (current === 'en' ? 'ar' : 'en'))
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>) {
    const template = dictionaries[language][key] ?? dictionaries.en[key] ?? key
    if (!vars) return template
    return template.replace(STRING_INTERPOLATION_PATTERN, (match, name) =>
      name in vars ? String(vars[name]) : match,
    )
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
