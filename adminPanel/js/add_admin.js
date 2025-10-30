import { sidebarReady } from "./loaders/sidebarLoader.js";
await sidebarReady;
/**
 * تشفير كلمة المرور باستخدام خوارزمية SHA-256
 * @param {string} password - كلمة المرور الأصلية
 * @returns {string} - كلمة المرور المشفرة
 */
function encryptPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// 2. دوال التحقق من الصحة

export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return re.test(password);
}

export function validateName(name) {
    const re = /^[\p{L}\s]{3,}$/u;
    return re.test(name);
}

// 3. دوال إدارة الأدمن في localStorage


/**
 * جلب جميع الأدمن من localStorage
 * @returns {Array} - مصفوفة تحتوي جميع الأدمن
 */
function getAdmins() {
    return JSON.parse(localStorage.getItem('bookstoreAdmins')) || [];
}

/**
 * حفظ قائمة الأدمن في localStorage
 * @param {Array} admins - مصفوفة الأدمن للحفظ
 */
function saveAdmins(admins) {
    localStorage.setItem('bookstoreAdmins', JSON.stringify(admins));
}

/**
 * إضافة أدمن جديد مع التحقق من عدم التكرار
 * @param {Object} adminData - بيانات الأدمن الجديد
 * @returns {Object} - نتيجة العملية {success, message, admin?}
 */

function addAdmin(adminData) {
    const admins = getAdmins();

    // التحقق من صحة البيانات
    if (!validateName(adminData.fullName)) {
        return { success: false, message: "الاسم يجب أن يحتوي على 3 أحرف على الأقل وبدون رموز." };
    }

    if (!validateEmail(adminData.email)) {
        return { success: false, message: "البريد الإلكتروني غير صالح" };
    }

    if (!validatePassword(adminData.password)) {
        return { success: false, message: "كلمة المرور ضعيفة! يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص." };
    }

    // التحقق من عدم تكرار اسم المستخدم أو البريد الإلكتروني
    const usernameExists = admins.some(admin => admin.fullName === adminData.fullName);
    const emailExists = admins.some(admin => admin.email === adminData.email);

    if (usernameExists) {
        return { success: false, message: "اسم المستخدم موجود بالفعل!" };
    }

    if (emailExists) {
        return { success: false, message: "البريد الإلكتروني موجود بالفعل!" };
    }

    // إنشاء ID جديد (أعلى ID موجود + 1)
    const newId = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;

    const newAdmin = {
        id: newId,
        ...adminData,
        password: encryptPassword(adminData.password), // تشفير كلمة المرور قبل الحفظ
        createdAt: new Date().toISOString(),
        role: "admin" // تحديد دور الأدمن
    };

    admins.push(newAdmin);
    saveAdmins(admins);

    return {
        success: true,
        message: "تم إضافة الأدمن بنجاح!",
        admin: newAdmin
    };
}


// 4. دوال واجهة المستخدم

/**
 * عرض رسالة تنبيه للمستخدم
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الرسالة (success/error)
 */
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';

    // تحديد لون الرسالة حسب النوع
    if (type === 'success') {
        alertDiv.className = 'alert alert-success';
    } else {
        alertDiv.className = 'alert alert-danger';
    }

    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

// 5. الأحداث الرئيسية


// التعامل مع إرسال الفورم
document.getElementById('adminForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // جمع بيانات الفورم
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // إنشاء كائن الأدمن
    const adminData = {
        fullName,
        email,
        password
    };

    // محاولة إضافة الأدمن
    const result = addAdmin(adminData);

    if (result.success) {
        showAlert(result.message, 'success');
        // إعادة تعيين الفورم بعد النجاح
        this.reset();
    } else {
        showAlert(result.message, 'error');
    }
});
