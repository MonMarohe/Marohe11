'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const form = byId('newsletter-form');
  const dashboard = byId('newsletter-dashboard');
  if (!form || !dashboard) return;
  const submit = form.querySelector('button[type="submit"]');
  const publicStatus = byId('newsletter-status');
  const adminStatus = byId('newsletter-admin-status');
  const login = byId('newsletter-admin-login');
  const content = byId('newsletter-admin-content');
  const list = byId('newsletter-admin-list');
  const next = byId('newsletter-next');
  let currentCursor = null;
  let nextCursor = null;
  let visible = [];
  let submitting = false;
  let submitted = false;

  async function api(query = '', method = 'GET', payload) {
    const response = await fetch(`/api/newsletter${query}`, {
      method, credentials: 'same-origin', cache: 'no-store',
      headers: payload ? {'Content-Type': 'application/json'} : {},
      body: payload ? JSON.stringify(payload) : undefined,
      signal: AbortSignal.timeout(15000)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'No pudimos conectar con el registro.');
    return data;
  }
  async function checkConnection() {
    try {
      const status = await api('?action=status');
      if (!submitting && !submitted) publicStatus.textContent = status.configured ? '' : 'El registro aún no está conectado. Puedes intentar enviar tu correo de nuevo más tarde.';
    } catch {
      if (!submitting && !submitted) publicStatus.textContent = 'No pudimos comprobar el registro. Puedes intentar enviar tu correo de nuevo más tarde.';
    }
  }
  form.addEventListener('input', () => { if (submitted) { submitted = false; publicStatus.textContent = ''; } });
  addEventListener('focus', () => { void checkConnection(); });
  addEventListener('pageshow', () => { void checkConnection(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void checkConnection(); });
  addEventListener('hashchange', () => { if (['#news', '#blog'].includes(location.hash)) void checkConnection(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    submitting = true;
    submit.disabled = true;
    publicStatus.textContent = 'Guardando tu correo…';
    try {
      await api('', 'POST', {
        email: form.elements.email.value.trim(),
        consent: form.elements.consent.checked,
        company: form.elements.company.value.trim()
      });
      publicStatus.textContent = '¡Listo! Guardamos tu correo. Pronto recibirás la carta de Alpaca ♡';
      submitted = true;
      form.reset();
    } catch (error) {
      publicStatus.textContent = `${error.message} Tu correo no se guardó.`;
    } finally { submitting = false; submit.disabled = false; }
  });
  function showDashboard() {
    location.hash = '#blog';
    dashboard.hidden = false;
    adminStatus.textContent = '';
    setTimeout(() => dashboard.scrollIntoView({behavior: 'smooth', block: 'start'}), 80);
  }
  function render() {
    list.replaceChildren();
    byId('newsletter-count').textContent = visible.length ? `${visible.length} correo${visible.length === 1 ? '' : 's'} en esta página` : 'Todavía no hay correos en esta página.';
    for (const subscriber of visible) {
      const row = document.createElement('div'); row.className = 'newsletter-admin-row';
      const email = document.createElement('span'); email.textContent = subscriber.email;
      const date = document.createElement('time');
      date.dateTime = subscriber.createdAt;
      date.textContent = new Intl.DateTimeFormat('es-PE', {dateStyle: 'medium'}).format(new Date(subscriber.createdAt));
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Borrar';
      remove.addEventListener('click', () => deleteEmail(subscriber.id, subscriber.email));
      row.append(email, date, remove); list.append(row);
    }
    next.hidden = !nextCursor;
  }
  async function load(cursor = null) {
    adminStatus.textContent = 'Cargando correos…';
    try {
      const result = await api(`?action=list${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      visible = result.subscribers || [];
      currentCursor = cursor;
      nextCursor = result.hasMore ? result.cursor : null;
      render();
      adminStatus.textContent = '';
    } catch (error) { adminStatus.textContent = error.message; }
  }
  async function deleteEmail(id, email) {
    if (!confirm(`¿Borrar ${email} del panel? Copia el correo a Substack antes si quieres conservarlo.`)) return;
    try {
      await api(`?action=delete&id=${encodeURIComponent(id)}`, 'DELETE', {});
      visible = visible.filter(item => item.id !== id);
      render();
      adminStatus.textContent = 'Correo borrado del almacenamiento de MAROHE.';
    } catch (error) { adminStatus.textContent = error.message; }
  }
  byId('newsletter-admin-open').addEventListener('click', showDashboard);
  byId('newsletter-dashboard-close').addEventListener('click', () => { dashboard.hidden = true; byId('newsletter-admin-password').value = ''; });
  login.addEventListener('submit', async event => {
    event.preventDefault();
    const button = login.querySelector('button'); button.disabled = true;
    adminStatus.textContent = 'Entrando al panel…';
    try {
      await api('?action=login', 'POST', {password: byId('newsletter-admin-password').value});
      byId('newsletter-admin-password').value = '';
      login.hidden = true; content.hidden = false;
      await load();
    } catch (error) { adminStatus.textContent = error.message; }
    finally { button.disabled = false; }
  });
  byId('newsletter-admin-logout').addEventListener('click', async () => {
    try { await api('?action=logout', 'POST', {}); }
    catch (error) { adminStatus.textContent = error.message; return; }
    visible = []; currentCursor = null; nextCursor = null;
    render(); content.hidden = true; login.hidden = false; dashboard.hidden = true;
  });
  byId('newsletter-refresh').addEventListener('click', () => load(currentCursor));
  next.addEventListener('click', () => { if (nextCursor) void load(nextCursor); });
  byId('newsletter-copy').addEventListener('click', async () => {
    if (!visible.length) { adminStatus.textContent = 'Todavía no hay correos que copiar.'; return; }
    try {
      await navigator.clipboard.writeText(visible.map(item => item.email).join('\n'));
      adminStatus.textContent = `${visible.length} correos copiados. Pégalos en Substack antes de borrarlos.`;
    } catch { adminStatus.textContent = 'No se pudo copiar automáticamente. Selecciona los correos de la lista.'; }
  });
  void checkConnection();
})();
