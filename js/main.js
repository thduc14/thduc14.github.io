/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const duLieuThanhVien = {
    Huy: { ten: 'Lai Mộc Huy', vaiTro: 'Nhóm trưởng · Fullstack Developer', manh: 'Khả năng lãnh đạo tốt, chia task rõ ràng. Code cứng cả mảng Frontend lẫn Backend.', yeu: 'Đôi khi quá ôm đồm công việc, thức khuya nhiều — cần chú ý sức khỏe.' },
    Dung: { ten: 'Huỳnh Đức Dũng', vaiTro: 'Thành viên · Backend Developer', manh: 'Tư duy logic tốt, xử lý cơ sở dữ liệu và viết API cực kỳ mượt mà, ít bug.', yeu: 'Hơi trầm tính trong các buổi họp nhóm, ít chú ý đến thiết kế giao diện (UI).' },
    Duyen: { ten: 'Sơn Nguyễn Kỳ Duyên', vaiTro: 'Thành viên · Business Analyst & UI/UX', manh: 'Mắt thẩm mỹ tuyệt vời. Quản lý tài liệu dự án, vẽ mockup và làm slide cực kỳ đẹp.', yeu: 'Chưa có nhiều kinh nghiệm lập trình sâu về hệ thống máy chủ (Backend).' },
    Duc: { ten: 'Nguyễn Thành Đức', vaiTro: 'Thành viên · Frontend & Tester', manh: 'Nhạy bén trong việc tìm lỗi (Bug hunter). CSS cứng, chuyên trị các hiệu ứng giao diện.', yeu: 'Hay bị trễ deadline lặt vặt, cần cải thiện khả năng quản lý thời gian cá nhân.' },
    Duc2: { ten: 'Nguyễn Minh Đức', vaiTro: 'Thành viên · Frontend Developer', manh: 'Chăm chỉ, cẩn thận. Phối hợp tốt với team, luôn hoàn thành đúng hạn.', yeu: 'Cần nâng cao kinh nghiệm với các công nghệ backend và DevOps.' }
};

/* ═══════════════════════════════════════════
   ROUTING & SPA LOGIC
═══════════════════════════════════════════ */
const routes = {
    'trang-chu': 'html/home.html',
    'gioi-thieu': 'html/about.html',
    'do-an': 'html/project.html',
    'tien-do': 'html/progress.html',
    'hop-dong': 'html/agreement.html'
};

let tabHienTai = 'trang-chu';
let dacapNhatGithubPDF = { 1: false, 2: false, 3: false }; // Đánh dấu tuần nào đã fetch data

async function chuyenTrang(idTrang) {
    if (!routes[idTrang]) return;
    tabHienTai = idTrang;

    const mainElement = document.getElementById('main-content');
    
    // Nếu chưa load header/footer, load chúng trước
    if (!document.getElementById('navbar')) {
        await kiemTraVaLoadLayout();
    }

    try {
        // Fetch content HTML của trang tương ứng
        const response = await fetch(routes[idTrang]);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();
        
        mainElement.innerHTML = `<section id="${idTrang}" class="page active" style="animation: none;">${html}</section>`;
        
        // Trigger animation lại
        const page = document.getElementById(idTrang);
        page.offsetHeight; // reflow
        page.style.animation = '';

        // Cập nhật trạng thái Nav UI
        updateNavUI(idTrang);
        updateNavbar();
        closeMobileMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Không còn sử dụng document load chung, xoá loadGitHubPDFs() ở đây vì mình sẽ fetch PDF khi openModal


    } catch (error) {
        console.error('Lỗi khi tải trang:', error);
        mainElement.innerHTML = `<section class="page active"><div class="docs-empty"><p>Lỗi không thể tải nội dung (Hãy chắc chắn bạn đang chạy qua Web Server như Live Server).</p></div></section>`;
    }
}

async function kiemTraVaLoadLayout() {
    try {
        const headerRes = await fetch('html/components/header.html');
        const footerRes = await fetch('html/components/footer.html');
        
        const headerHtml = await headerRes.text();
        const footerHtml = await footerRes.text();

        document.getElementById('header-container').innerHTML = headerHtml;
        document.getElementById('footer-container').innerHTML = footerHtml;
    } catch (error) {
        console.error('Lỗi load header/footer', error);
    }
}

function updateNavUI(idTrang) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    const tabActive = document.querySelector(`.nav-tab[data-tab="${idTrang}"]`);
    if (tabActive) tabActive.classList.add('active');
}

function updateNavbar() {
    // Không còn dùng navbar transparent
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.remove('transparent');
}

/* ═══════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════ */
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
}

function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    if(navLinks) navLinks.classList.remove('open');
    if(hamburger) hamburger.classList.remove('open');
}

document.addEventListener('click', function (e) {
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.contains(e.target)) closeMobileMenu();
});

/* ═══════════════════════════════════════════
   POPUP THÀNH VIÊN
═══════════════════════════════════════════ */
function moPopupThanhVien(id) {
    const data = duLieuThanhVien[id];
    if (!data) return;

    // Tìm popup trong DOM, nếu không có phải load từ file html modal
    let popup = document.getElementById('popup-thanh-vien');
    if (!popup) {
        console.warn('Popup element not found. Please make sure modal fragments are loaded or integrated.');
        return;
    }

    document.getElementById('popup-ten').textContent = data.ten;
    document.getElementById('popup-vaitro').textContent = data.vaiTro;
    document.getElementById('popup-manh').textContent = data.manh;
    document.getElementById('popup-yeu').textContent = data.yeu;

    popup.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function dongPopupThanhVien() {
    const popup = document.getElementById('popup-thanh-vien');
    if(popup) popup.classList.add('hidden');
    document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   MODAL TIẾN ĐỘ
═══════════════════════════════════════════ */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Xác định tuần từ modalId (ví dụ: modal-1 -> tuần 1)
    const weekMatch = modalId.match(/modal-(\d+)/);
    if (weekMatch && weekMatch[1]) {
        const week = weekMatch[1];
        if (!dacapNhatGithubPDF[week]) {
            loadGitHubPDFs(week);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.overlay:not(.hidden)').forEach(overlay => {
            overlay.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }
});

/* ═══════════════════════════════════════════
   GITHUB API - TẢI TÀI LIỆU (PDF) THEO TUẦN
═══════════════════════════════════════════ */
// ĐỔI THÔNG TIN REPO CỦA BẠN TẠI ĐÂY:
const GITHUB_OWNER = 'thduc14'; // Thay bằng username của bạn
const GITHUB_REPO = 'thduc14.github.io'; // Thay bằng tên repo của bạn
const BRANCH_NAME = 'main';

async function loadGitHubPDFs(week) {
    const modalDocsEl = document.getElementById(`modal-docs-${week}`);
    if (!modalDocsEl) return;
    
    // Tạo vùng HTML chờ loading nếu đang load
    modalDocsEl.innerHTML = `
        <div class="docs-loading">
            <div class="spinner-small" style="width: 24px; height: 24px; border: 3px solid var(--gray-200); border-top-color: var(--pink); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px;"></div>
            <p style="font-size: 13px; color: var(--gray-400); text-align: center;">Đang tải tài liệu từ GitHub...</p>
        </div>
    `;

    try {
        const folderPath = `input/week${week}`;
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${folderPath}?ref=${BRANCH_NAME}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`Thư mục ${folderPath} chưa có.`);
            }
            dacapNhatGithubPDF[week] = true;
            modalDocsEl.innerHTML = `<div class="docs-empty" style="text-align: center; padding: 20px;"><p style="font-size: 13px; color: var(--gray-400);">Chưa có tài liệu nào trong thư mục <b>input/week${week}</b></p></div>`;
            return;
        }

        const data = await response.json();
        const pdfFiles = Array.isArray(data) ? data.filter(file => file.name.toLowerCase().endsWith('.pdf')) : [];

        if (pdfFiles.length === 0) {
            modalDocsEl.innerHTML = `<div class="docs-empty" style="text-align: center; padding: 20px;"><p style="font-size: 13px; color: var(--gray-400);">Chưa có tài liệu nào trong thư mục <b>input/week${week}</b></p></div>`;
        } else {
            const html = pdfFiles.map(file => {
                const rawUrl = file.download_url || `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH_NAME}/${file.path}`;
                
                let sizeText = '';
                if (file.size) {
                    const kb = file.size / 1024;
                    if (kb > 1024) sizeText = (kb / 1024).toFixed(1) + ' MB';
                    else sizeText = kb.toFixed(0) + ' KB';
                }

                return `
                <a href="${rawUrl}" target="_blank" class="pdf-card">
                    <div class="pdf-icon">PDF</div>
                    <div class="pdf-info">
                        <strong class="pdf-name">${file.name}</strong>
                        <span class="pdf-size">${sizeText}</span>
                    </div>
                    <svg class="pdf-download" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                </a>`;
            }).join('');
            
            modalDocsEl.innerHTML = `<div class="pdf-grid">${html}</div>`;
        }

        dacapNhatGithubPDF[week] = true;

    } catch (error) {
        console.error('Lỗi khi fetch từ GitHub:', error);
        modalDocsEl.innerHTML = `<div class="docs-empty" style="text-align: center; padding: 20px;"><p style="font-size: 13px; color: #ef4444;">Lỗi kết nối GitHub</p></div>`;
    }
}



/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
    // Trích xuất hash từ URL nếu có (ví dụ: index.html#tien-do)
    let hash = window.location.hash.replace('#', '');
    if (routes[hash]) {
        chuyenTrang(hash);
    } else {
        chuyenTrang('trang-chu');
    }
});
