// InfoManager System — interacciones de la interfaz (EV03)
// Menú lateral en móvil (hamburguesa) y menú desplegable de usuario.

document.addEventListener('DOMContentLoaded', function () {
  // ---- Menú lateral responsivo (móvil) ----
  var toggleBtn = document.querySelector('.im-menu-toggle');
  var sidebar = document.querySelector('.im-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    // Cierra el menú al seleccionar una opción (mejora de usabilidad en móvil)
    sidebar.querySelectorAll('.nav-item').forEach(function (link) {
      link.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    });
  }

  // ---- Menú desplegable de usuario ----
  var userChip = document.querySelector('.user-chip');
  var userDropdown = document.querySelector('.user-dropdown');
  if (userChip && userDropdown) {
    userChip.addEventListener('click', function (e) {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });
    document.addEventListener('click', function () {
      userDropdown.classList.remove('show');
    });
  }

  // ---- Campana de notificaciones (retroalimentación simple al usuario) ----
  var notif = document.querySelector('.im-notif');
  if (notif) {
    notif.addEventListener('click', function () {
      var dot = notif.querySelector('.dot');
      if (dot) dot.style.display = 'none';
    });
  }

  // ---- Modo oscuro: alterna tema y lo recuerda entre páginas (localStorage) ----
  var themeToggle = document.querySelector('.theme-toggle');
  var htmlEl = document.documentElement;
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('im-theme'); } catch (e) { /* almacenamiento no disponible */ }
  if (savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = htmlEl.getAttribute('data-theme') === 'dark';
      if (isDark) {
        htmlEl.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
      } else {
        htmlEl.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
      }
      try { localStorage.setItem('im-theme', isDark ? 'light' : 'dark'); } catch (e) { /* almacenamiento no disponible */ }
    });
  }
});

/* =====================================================================
   Utilidades compartidas: alertas (toast), búsqueda en tablas y
   validación básica de formularios. Se usan desde cada página.
   ===================================================================== */

// Muestra una notificación flotante temporal en la esquina superior derecha.
function imShowToast(mensaje, tipo) {
  var stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  var toast = document.createElement('div');
  toast.className = 'im-toast' + (tipo === 'danger' ? ' danger' : '');
  toast.innerHTML = '<i class="bi ' + (tipo === 'danger' ? 'bi-exclamation-circle' : 'bi-check-circle') + '"></i><span>' + mensaje + '</span>';
  stack.appendChild(toast);
  requestAnimationFrame(function () { toast.classList.add('show'); });
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 250);
  }, 3200);
}

// Filtra en vivo las filas de una tabla según el texto escrito en un campo de búsqueda.
// tableSelector: tabla cuyas filas de <tbody> se van a filtrar.
// inputSelector: campo de texto de búsqueda.
// emptyStateSelector: elemento a mostrar cuando ningún resultado coincide (opcional).
function imEnableTableSearch(inputSelector, tableSelector, emptyStateSelector) {
  var input = document.querySelector(inputSelector);
  var table = document.querySelector(tableSelector);
  if (!input || !table) return;
  var emptyState = emptyStateSelector ? document.querySelector(emptyStateSelector) : null;

  input.addEventListener('input', function () {
    var query = input.value.trim().toLowerCase();
    var rows = table.querySelectorAll('tbody tr');
    var visibles = 0;
    rows.forEach(function (row) {
      var texto = row.textContent.toLowerCase();
      var coincide = texto.indexOf(query) !== -1;
      row.style.display = coincide ? '' : 'none';
      if (coincide) visibles++;
    });
    if (emptyState) emptyState.classList.toggle('show', visibles === 0);
  });
}

// Valida un campo individual: requerido y, opcionalmente, formato de correo.
function imValidateField(input) {
  var errorEl = input.parentElement.querySelector('.field-error') ||
    (input.closest('.mb-3, .mb-2, .col-md-6, .col-12') || input.parentElement).querySelector('.field-error');
  var valido = true;
  var mensaje = '';

  if (input.hasAttribute('required') && !input.value.trim()) {
    valido = false; mensaje = 'Este campo es obligatorio.';
  } else if (input.type === 'email' && input.value.trim()) {
    var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patron.test(input.value.trim())) { valido = false; mensaje = 'Ingresa un correo electrónico válido.'; }
  }

  input.classList.toggle('is-invalid', !valido);
  input.classList.toggle('is-valid', valido && input.value.trim() !== '');
  if (errorEl) {
    errorEl.textContent = mensaje;
    errorEl.classList.toggle('show', !valido);
  }
  return valido;
}

// Valida todos los campos requeridos/email dentro de un formulario. Devuelve true si todo es válido.
function imValidateForm(formSelector) {
  var form = document.querySelector(formSelector);
  if (!form) return true;
  var campos = form.querySelectorAll('input[required], input[type=email]');
  var formValido = true;
  campos.forEach(function (campo) {
    if (!imValidateField(campo)) formValido = false;
  });
  return formValido;
}
