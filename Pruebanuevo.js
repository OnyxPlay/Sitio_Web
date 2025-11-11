// Prueba.js - Funcionalidad para múltiples páginas

document.addEventListener('DOMContentLoaded', function() {
    // Elementos comunes a todas las páginas
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Funcionalidad específica para página principal
    const presentationWindow = document.getElementById('presentation-window');
    const enterButton = document.getElementById('enter-btn');
    const mainPage = document.getElementById('main-page');
    
    // Navegación móvil (común a todas las páginas)
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo aplicar si es un enlace interno en la misma página
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Funcionalidad específica para página principal
    if (presentationWindow && enterButton) {
        enterButton.addEventListener('click', function() {
            presentationWindow.style.opacity = '0';
            presentationWindow.style.transition = 'opacity 0.8s ease';
            
            setTimeout(function() {
                presentationWindow.classList.add('hidden');
                if (mainPage) {
                    mainPage.classList.remove('hidden');
                    
                    mainPage.style.opacity = '0';
                    mainPage.style.transform = 'translateY(20px)';
                    mainPage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    
                    setTimeout(function() {
                        mainPage.style.opacity = '1';
                        mainPage.style.transform = 'translateY(0)';
                    }, 100);
                }
            }, 800);
        });
    }
    
    // Funcionalidad para FAQ (si existe en la página)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isActive = answer.classList.contains('active');
            
            // Cerrar todas las respuestas
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('active');
            });
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
            });
            
            // Abrir la respuesta clickeada si no estaba activa
            if (!isActive) {
                answer.classList.add('active');
                this.classList.add('active');
            }
        });
    });
    
    // Animaciones al hacer scroll (común a todas las páginas)
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.team-member, .mv-card, .pricing-card, .value-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Inicializar animaciones
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Contador animado para estadísticas (solo en páginas que lo tengan)
    const stats = document.querySelectorAll('.stat h3');
    if (stats.length > 0) {
        let counted = false;
        
        const startCounters = function() {
            if (counted) return;
            
            stats.forEach(stat => {
                const text = stat.textContent;
                let target;
                
                if (text.includes('/')) {
                    target = parseFloat(text);
                } else {
                    target = parseInt(text.replace('+', ''));
                }
                
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                        counted = true;
                    }
                    
                    if (text.includes('/')) {
                        stat.textContent = current.toFixed(1) + '/5';
                    } else {
                        stat.textContent = Math.floor(current) + '+';
                    }
                }, 30);
            });
        };
        
        const downloadSection = document.querySelector('.download');
        if (downloadSection) {
            const downloadObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounters();
                    }
                });
            }, { threshold: 0.5 });
            
            downloadObserver.observe(downloadSection);
        }
    }
    
    // Efecto hover para botones de precios
    document.querySelectorAll('.pricing-btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.parentElement.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.parentElement.classList.contains('popular')) {
                this.parentElement.style.transform = 'scale(1)';
            }
        });
        
        // Simular selección de plan
        button.addEventListener('click', function() {
            const plan = this.parentElement.querySelector('h3').textContent;
            alert(`¡Has seleccionado el plan ${plan}! Serás redirigido al proceso de pago.`);
        });
    });
});
// Funcionalidad específica para página de descargas
function initDownloadPage() {
    // Simular descargas
    const downloadButtons = document.querySelectorAll('.download-btn-platform');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            
            // Mostrar modal de descarga simulada
            showDownloadModal(platform);
        });
    });
    
    // Sistema de notificación
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function() {
            const emailInput = document.querySelector('.notify-input');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                showNotification('¡Perfecto! Te notificaremos cuando la versión móvil esté disponible.', 'success');
                emailInput.value = '';
            } else {
                showNotification('Por favor, ingresa un email válido.', 'error');
            }
        });
    }
    
    // Contador animado para estadísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        animateStats();
    }
}

function showDownloadModal(platform) {
    const platformNames = {
        'windows': 'Windows',
        'mac': 'macOS'
    };
    
    // Crear modal de descarga
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Descarga Iniciada</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="download-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">Preparando descarga...</div>
                </div>
                <div class="download-info">
                    <p>Tu descarga de <strong>WordShooter para ${platformNames[platform]}</strong> comenzará automáticamente.</p>
                    <p><strong>Nombre del archivo:</strong> WordShooter_${platform}_v2.1.0.exe</p>
                    <p><strong>Tamaño:</strong> ${platform === 'windows' ? '150 MB' : '180 MB'}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn secondary" id="cancel-download">Cancelar</button>
                <button class="btn primary" id="manual-download">Descarga Manual</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Simular progreso de descarga
    simulateDownload();
    
    // Event listeners del modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-download').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#manual-download').addEventListener('click', () => {
        // En un caso real, aquí iría el enlace de descarga real
        window.location.href = `https://download.onyxplay.com/WordShooter_${platform}_v2.1.0.exe`;
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function simulateDownload() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            progressText.textContent = '¡Descarga completada!';
            
            // Simular que el archivo se ha descargado
            setTimeout(() => {
                const modal = document.querySelector('.download-modal');
                if (modal) {
                    document.body.removeChild(modal);
                }
                showNotification('WordShooter se ha descargado correctamente.', 'success');
            }, 1000);
        }
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Descargando... ${Math.round(progress)}%`;
    }, 200);
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const targets = [50000, 4.8, 94, 2000];
    
    stats.forEach((stat, index) => {
        const target = targets[index];
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (stat.textContent.includes('/')) {
                stat.textContent = current.toFixed(1) + '/5';
            } else if (stat.textContent.includes('%')) {
                stat.textContent = Math.round(current) + '%';
            } else {
                stat.textContent = Math.round(current).toLocaleString() + '+';
            }
        }, 30);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Inicializar página de descargas si estamos en ella
if (window.location.pathname.includes('descarga.html')) {
    document.addEventListener('DOMContentLoaded', initDownloadPage);
}

// Estilos para el modal y notificaciones (agregar al CSS)
const modalStyles = `
.download-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: var(--secondary-black);
    border-radius: 15px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    border: 2px solid var(--primary-purple);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h3 {
    color: var(--primary-gold);
    margin: 0;
}

.close-modal {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-gray);
}

.close-modal:hover {
    color: var(--text-light);
}

.download-progress {
    margin-bottom: 20px;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: rgba(106, 13, 173, 0.3);
    border-radius: 5px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-purple) 0%, var(--primary-gold) 100%);
    width: 0%;
    transition: width 0.3s ease;
}

.progress-text {
    text-align: center;
    margin-top: 10px;
    color: var(--text-gray);
    font-size: 0.9rem;
}

.download-info {
    margin-bottom: 20px;
}

.download-info p {
    margin: 5px 0;
    color: var(--text-gray);
}

.modal-footer {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 10px;
    color: white;
    z-index: 1001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    background: var(--primary-purple);
    border-left: 4px solid var(--primary-gold);
}

.notification.error {
    background: #dc3545;
    border-left: 4px solid #ff6b7a;
}
`;

// Inyectar estilos del modal
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);